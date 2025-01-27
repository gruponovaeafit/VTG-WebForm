// pages/api/forms/unform.ts
import { NextApiRequest, NextApiResponse } from "next";
import sql, { config as SqlConfig, ConnectionPool } from "mssql";
import { useEffect } from "react";
import router from "next/router";
import cookieManagement from "../cookieManagement";


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
      const { programs } = req.body as {
        programs: string;
      };

      const email = cookieManagement.verifyJwtFromCookies(req, res);
      const groupId = 6; 
      
      const charla_info = programs === "Si" ? 1 : 0;

      await pool.request()
        .input("id_grupo", sql.Int, groupId)
        .input("correo", sql.VarChar, email )
        .input("charla_info", sql.Int, charla_info )
        .query(`
          INSERT INTO oe (correo, charla_info, id_grupo) 
          VALUES (@correo, @charla_info, @id_grupo)
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
