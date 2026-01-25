import { NextApiRequest, NextApiResponse } from "next";
import { dbQuery } from "./db";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { decryptRequestBody } from "@/lib/decrypt";

function requiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function isEafitEmail(email: string) {
  return /@eafit\.edu\.co$/i.test(email.trim());
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== "POST") {
    return res.status(405).json({
      notification: {
        type: "error",
        message: "Método no permitido.",
      },
    });
  }

  // Desencriptar el body si viene encriptado
  const decryptResult = decryptRequestBody(req);
  if (!decryptResult.success) {
    return res.status(400).json({
      notification: {
        type: "error",
        message: decryptResult.error || "Error al procesar los datos.",
      },
    });
  }
  
  const { token, email } = req.body as { token?: string; email?: string };

  if (!token) {
    console.error("Token de reCAPTCHA faltante");
    return res.status(400).json({
      notification: {
        type: "error",
        message: "Falta el token de reCAPTCHA.",
      },
    });
  }

  const secretKey = process.env.SERVER_KEY_CAPTCHA;
  if (!secretKey) {
    console.error("Clave secreta del captcha no configurada");
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Clave secreta del captcha no configurada.",
      },
    });
  }

  try {
    // 1. Verificar reCAPTCHA
    const verifyResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${token}`,
    });
    const captchaData = await verifyResponse.json();

    if (!captchaData.success) {
      console.error("Fallo en la validación de reCAPTCHA", captchaData);
      return res.status(400).json({
        notification: {
          type: "error",
          message: "Falló la validación de reCAPTCHA.",
        },
      });
    }

    // 2. Validar correo
    if (!email || typeof email !== "string" || !isEafitEmail(email)) {
      return res.status(400).json({
        notification: { type: "error", message: "El correo debe ser del dominio @eafit.edu.co." },
      });
    }

    const emailLower = email.toLowerCase().trim();


    // 3) Verificar si el usuario ya existe 
    const existingUser = await dbQuery<{
      correo: string;
      nombre: string | null;
      pregrado: string | null;
    }>(
      `SELECT correo, nombre, pregrado
       FROM persona
       WHERE correo = $1
       LIMIT 1`,
      [emailLower]
    );

    // 4. Generar JWT
    const jwtToken = jwt.sign({ email: emailLower }, process.env.JWT_SECRET_KEY as string, {
      expiresIn: "12m",
    });

    // Setear la cookie
    res.setHeader(
      "Set-Cookie",
      serialize("jwtToken", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 720,
        path: "/",
        sameSite: "strict",
      })
    );

    // 5. Si el usuario existe
    if (existingUser.rows.length > 0) {
      const user = existingUser.rows[0];
      console.log("Usuario encontrado:", user);

      return res.status(200).json({
        notification: {
          type: "info",
          message: "Ya estás registrado. Bienvenido de nuevo.",
        },
        redirectUrl: user.nombre && user.pregrado ? "/groupslist" : user.nombre ? "/academic" : "/home",
      });
    }

    // 6. Insertar nuevo usuario
    await dbQuery(
      `INSERT INTO persona (correo)
       VALUES ($1)
       ON CONFLICT (correo) DO NOTHING`,
      [emailLower]
    );

    return res.status(200).json({
      notification: {
        type: "success",
        message: "Información guardada con éxito.",
      },
      redirectUrl: "/home",
    });
  } catch (err) {
    console.error("Error en el servidor:", err);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error interno del servidor.",
      },
    });
  }
}