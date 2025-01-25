// pages/api/forms/unform.ts
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
    pool = await sql.connect(config);

    if (req.method === "POST") {
      const { email } = req.body as {
        email: string;
      };
      const { name } = req.body as {
        name: string;
      };
      const { secondName } = req.body as {
        secondName: string;
      };
  
      const fullName = `${name} ${secondName}`;
      

      // 3) Convertimos el correo a mayúsculas
      const emailUpper = email.toLowerCase();

      await pool.request()
        .input("correo", sql.VarChar, emailUpper)
        .input("nombre", sql.VarChar, fullName )
        .query(`
          INSERT INTO persona (correo, nombre) 
          VALUES (@correo, @nombre)
        `);

      return res.status(200).json({ message: "Datos insertados con éxito" });
    } 

    // GET Metod 
    else if (req.method === "GET") {
      // Consulta para obtener todos los registros
      const result = await pool.request().query("SELECT * FROM persona");
      return res.status(200).json(result.recordset);
    } else {
      return res.status(405).json({ message: "Método no permitido" });
    }
  } 

  // Server Fail 
  catch (err) {
    console.error("Error en la conexión SQL:", err);
    return res.status(500).json({ error: "Error de servidor", details: err });
  } finally {
    // Cierra la conexión SQL
    if (pool) {
      pool.close();
    }
  }
}

