import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import sql, { config as SqlConfig } from "mssql";

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
  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Método no permitido" });
    return;
  }

  let pool = null;

  try {
    const body = req.body;

    const cookies = req.headers.cookie;

    if (!cookies) {
      res.status(401).json({ success: false, message: "No se encontraron cookies" });
      return;
    }

    const parsedCookies = cookie.parse(cookies);
    const jwtToken = parsedCookies.jwtToken;

    if (!jwtToken) {
      res.status(401).json({ success: false, message: "No se encontró el token en las cookies" });
      return;
    }

    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY as string);

    const email = (decoded as { email: string }).email;
    const { name, secondName } = body;

    if (!name || !secondName) {
      res.status(400).json({
        success: false,
        message: "El nombre y el apellido son obligatorios",
      });
      return;
    }

    // Unir el nombre y apellido en un solo campo
    const nombre = `${name} ${secondName}`;

    // Conexión a la base de datos
    pool = await sql.connect(config);

    // Actualizar el registro en la tabla "persona"
    await pool.request()
      .input("correo", sql.VarChar, email)
      .input("nombre", sql.VarChar, nombre)
      .query(`
        UPDATE persona
        SET nombre = @nombre
        WHERE correo = @correo
      `);

    console.log("Registro actualizado para el correo:", email);

    res.status(200).json({
      success: true,
      message: "Registro actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({
      success: false,
      message: "Error al procesar la solicitud",
    });
  } finally {
    if (pool) {
      pool.close();
    }
  }
}
