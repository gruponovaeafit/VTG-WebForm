import { NextApiRequest, NextApiResponse } from "next";
import sql, { config as SqlConfig, ConnectionPool } from "mssql";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const config: SqlConfig = {
  user: process.env.DB_USER as string,
  password: process.env.DB_PASS as string,
  database: process.env.DB_NAME as string,
  server: process.env.DB_SERVER as string,
  port: parseInt(process.env.DB_PORT ?? "1433", 10),
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let pool: ConnectionPool | null = null;

  if (req.method !== "POST") {
    return res.status(405).json({
      notification: {
        type: "error",
        message: "Método no permitido.",
      },
    });
  }

  const { token, email } = req.body;

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
    if (!email || !email.endsWith("@eafit.edu.co")) {
      console.error("Correo inválido o faltante:", { email });
      return res.status(400).json({
        notification: {
          type: "error",
          message: "El correo debe ser del dominio @eafit.edu.co.",
        },
      });
    }

    // 3. Conexión a BD
    pool = await sql.connect(config);
    const emailLower = email.toLowerCase();

    // 4. Verificar si el usuario ya existe
    const existingUser = await pool
      .request()
      .input("correo", sql.VarChar, emailLower)
      .query("SELECT TOP 1 correo, nombre, pregrado FROM persona WHERE correo = @correo");

    // Generar JWT
    const jwtToken = jwt.sign({ email: emailLower }, process.env.JWT_SECRET_KEY as string, {
      expiresIn: "15m",
    });

    // Setear la cookie
    res.setHeader(
      "Set-Cookie",
      serialize("jwtToken", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600,
        path: "/",
        sameSite: "strict",
      })
    );

    // 5. Si el usuario existe
    if (existingUser.recordset.length > 0) {
      const user = existingUser.recordset[0];
      console.log("Usuario encontrado:", user);

      return res.status(200).json({
        notification: {
          type: "info",
          message: "Ya estás registrado. Bienvenido de nuevo.",
        },
        redirectUrl: user.nombre && user.pregrado ? "/assessmentassistance" : user.nombre ? "/academic" : "/home",
      });
    }

    // 6. Insertar nuevo usuario
    await pool.request().input("correo", sql.VarChar, emailLower).query(`
      INSERT INTO persona (correo)
      VALUES (@correo)
    `);

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
  } finally {
    if (pool) {
      pool.close();
    }
  }
}
