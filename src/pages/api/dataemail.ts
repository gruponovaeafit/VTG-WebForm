
import { NextApiRequest, NextApiResponse } from "next";
import sql, { config as SqlConfig, ConnectionPool } from "mssql";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

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
    return res.status(405).json({ success: false, message: "Método no permitido" });
  }

  const { token, email } = req.body;

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
      console.error("Fallo en la validación de reCAPTCHA", data);
      return res.status(400).json({
        success: false,
        message: "Falló la validación de reCAPTCHA",
        errorCodes: data["error-codes"],
      });
    }

    if (!email || !email.endsWith("@eafit.edu.co")) {
      console.error("Correo inválido o faltante:", { email });
      return res.status(400).json({ success: false, message: "El correo debe ser del dominio @eafit.edu.co" });
    }
   /*
    pool = await sql.connect(config);
    */
    // Convertimos el correo a minúsculas
    const emailLower = email.toLowerCase();

    //Creamos el token JWT con el correo
    const jwtToken = jwt.sign({ 
      email: emailLower }, 
      process.env.JWT_SECRET_KEY as string, 
      { expiresIn: '1h' });

     // Configuraciones de la cookie
    res.setHeader("Set-Cookie", cookie.serialize("jwtToken", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      maxAge: 3600, 
      path: "/", //Accesible desde cualquier ruta
      sameSite: "strict", // No se envía en peticiones de terceros
    }));

    // Insertamos en la BD usando los valores transformados
    /*
    await pool.request()
      .input("correo", sql.VarChar, emailLower)
      .query(`
        INSERT INTO persona (correo) 
        VALUES (@correo)
      `);
      

      // esto se puede eliminar dado el caso 
      (await cookies()).set("token", emailLower, {
        httpOnly: true,
        maxAge: 24 * 60 * 60,
        sameSite: true
      });
      
  */
        
    return res.status(200).json({ success: true, message: "Formulario enviado y datos insertados correctamente" } );

  } catch (err) {
    console.error("Error en el servidor:", err);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  } finally {
   // if (pool) {
    //  pool.close();
   // }
  }
}
