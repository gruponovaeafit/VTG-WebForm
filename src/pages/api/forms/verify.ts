import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método no permitido" });
  }

  const { token, name, secondName, email } = req.body;

  if (!token) {
    console.error("Token de reCAPTCHA faltante");
    return res.status(400).json({ success: false, message: "Falta el token de reCAPTCHA" });
  }

  const secretKey = process.env.SERVER_KEY_CAPTCHA;
  if (!secretKey) {
    console.error("Clave secreta no configurada");
    return res.status(500).json({ success: false, message: "Clave secreta no configurada" });
  }

  try {
    // Verificar el token con la API de reCAPTCHA
    const verifyResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await verifyResponse.json();

    if (!data.success) {
      console.error("Fallo en la validación de reCAPTCHA", data);2
      return res.status(400).json({
        success: false,
        message: "Falló la validación de reCAPTCHA",
        errorCodes: data["error-codes"],
      });
    }

    // Validar los campos del formulario
    if (!name || !secondName || !email) {
      console.error("Datos faltantes en el formulario:", { name, secondName, email });
      return res.status(400).json({ success: false, message: "Faltan datos obligatorios" });
    }

    console.log("Formulario recibido correctamente:", { name, secondName, email });

    // Respuesta exitosa
    return res.status(200).json({ success: true, message: "Formulario enviado correctamente" });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
}
