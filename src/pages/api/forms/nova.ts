// pages/api/forms/unform.ts
import { NextApiRequest, NextApiResponse } from "next";
import {connect, Int, VarChar, config as SqlConfig, ConnectionPool } from "mssql";
import {verifyJwtFromCookies} from "../cookieManagement";


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
    pool = await connect(config);

    if (req.method === "POST") {
      const { talk } = req.body as {
        talk: string;
      };
      const { IdNovato } = req.body as {
        IdNovato: string;
      };
      const groupId = 5; // Obtener el ID del grupo seleccionado
      const email = verifyJwtFromCookies(req, res);



      await pool.request()
        .input("correo", VarChar, email)
        .input("asesor", VarChar, IdNovato)
        .input("charla", VarChar, talk)
        .input("id_grupo", Int, groupId)
        .query(`
          INSERT INTO nova (asesor, charla, id_grupo, correo)
          VALUES (@asesor, @charla, @id_grupo, @correo);
          
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
