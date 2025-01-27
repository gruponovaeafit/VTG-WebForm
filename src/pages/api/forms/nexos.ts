// pages/api/forms/unform.ts
import { NextApiRequest, NextApiResponse } from "next";
import sql, { config as SqlConfig, ConnectionPool } from "mssql";
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
      const { departments } = req.body as {
        departments: string[];
      };
      const { assistance } = req.body as {
        assistance: string;
      };
      const { excuse } = req.body as {
        excuse: string;
      };

       const email = cookieManagement.verifyJwtFromCookies(req, res);
       const groupId = 4; 
  
        
       const assistanceValue = assistance === "Si" ? 1 : 0;

       console.log(departments);
       



      await pool.request()
        .input("id_grupo", sql.Int, groupId)
        .input("correo", sql.VarChar, email)
        .input("departamento", sql.VarChar, departments)
        .input("charla_informativa", sql.Int, assistanceValue)
        .input("justificacion", sql.VarChar, excuse)
        .query(`
          INSERT INTO nexos (id_grupo, correo, departamento, charla_informativa, justificacion)
          VALUES (@id_grupo, @correo, @departamento, @charla_informativa, @justificacion);
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
