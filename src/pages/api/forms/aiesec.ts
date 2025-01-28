// pages/api/forms/aiesec.ts
import { NextApiRequest, NextApiResponse } from "next";
import sql, { config as SqlConfig, ConnectionPool } from "mssql";
import {verifyJwtFromCookies} from "../cookieManagement";

// Configuración de conexión a la base de datos
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
    

  const email = verifyJwtFromCookies(req, res);

  let pool: ConnectionPool | null = null;

  const group_id = 13;

  try {
    // Conexión a la base de datos
    pool = await sql.connect(config);

    if (req.method === "POST") {
      

      // Inserción en la base de datos
      await pool.request()
        .input("group_id", sql.Int,  group_id)
        .input("email", sql.VarChar, email)
        .query(`
          INSERT INTO aiesec (id_grupo, correo)
          VALUES (@group_id, @email)
        `);

      return res.status(200).json({ message: "Datos insertados con éxito" });
    } 

    // Método GET para obtener registros
    else if (req.method === "GET") {
      const result = await pool.request().query("SELECT * FROM aiesecForm");
      return res.status(200).json(result.recordset);
    } else {
      return res.status(405).json({ message: "Método no permitido" });
    }
  } catch (err) {
    console.error("Error en la conexión SQL:", err);
    return res.status(500).json({ error: "Error de servidor", details: err });
  } finally {
    // Cerrar la conexión SQL
    if (pool) {
      pool.close();
    }
  }
}
