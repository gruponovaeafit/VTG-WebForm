import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Método no permitido" });
    return;
  }

  try {
    const body = req.body;

    // Registrar los datos en la consola (solo para pruebas)
    console.log("Datos recibidos del formulario:", body);

    // Responder con un mensaje de éxito
    res.status(200).json({ success: true, message: "Formulario recibido exitosamente" });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ success: false, message: "Error al procesar la solicitud" });
  }
}
