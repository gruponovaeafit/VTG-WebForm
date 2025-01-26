// pages/api/forms/aiesec.ts
import { NextApiRequest, NextApiResponse } from "next";
import sql, { config as SqlConfig, ConnectionPool } from "mssql";

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
  let pool: ConnectionPool | null = null;

  try {
    // Conexión a la base de datos
    pool = await sql.connect(config);

    if (req.method === "POST") {
      // Desestructuramos los datos enviados por el formulario
      const { talkSelection } = req.body as { talkSelection: string };

      // Validación básica
      if (!talkSelection) {
        return res.status(400).json({ error: "Todos los campos son requeridos." });
      }

      // Inserción en la base de datos
      await pool.request()
        .input("talkSelection", sql.VarChar, talkSelection)
        .query(`
          INSERT INTO aiesecForm (talkSelection)
          VALUES (@talkSelection)
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
