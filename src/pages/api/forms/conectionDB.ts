// pages/api/dbtest.ts
import { NextApiRequest, NextApiResponse } from "next";
import sql, { config as SqlConfig, ConnectionPool } from "mssql";

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
    // Conexión al pool de SQL
    pool = await sql.connect(config);

    if (req.method === "POST") {
      // 1) Desestructuramos los campos que vienen del body
      const { name, secondName, email } = req.body as {
        name: string;
        secondName: string;
        email: string;
      };

      // 2) Unimos name y secondName en un solo campo "fullName"
      const fullName = `${name} ${secondName}`;

      // 3) Convertimos el correo a mayúsculas
      const emailUpper = email.toUpperCase();

      // 4) Insertamos en la BD usando los valores transformados
      await pool.request()
        .input("nombre", sql.VarChar, fullName)
        .input("correo", sql.VarChar, emailUpper)
        .query(`
          INSERT INTO persona (nombre, correo) 
          VALUES (@nombre, @correo)
        `);

      return res.status(200).json({ message: "Datos insertados con éxito" });
    } else if (req.method === "GET") {
      // Consulta para obtener todos los registros
      const result = await pool.request().query("SELECT * FROM persona");
      return res.status(200).json(result.recordset);
    } else {
      return res.status(405).json({ message: "Método no permitido" });
    }
  } catch (err) {
    console.error("Error en la conexión SQL:", err);
    return res.status(500).json({ error: "Error de servidor", details: err });
  } finally {
    // Cierra la conexión SQL
    if (pool) {
      pool.close();
    }
  }
}
