// pages/api/forms/unform.ts
import { NextApiRequest, NextApiResponse } from "next";
import sql, { config as SqlConfig, ConnectionPool } from "mssql";
import jwt from "jsonwebtoken";
import cookie from "cookie";


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

  // Inicio codigo de obtencion de email
    
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
    

    // Fin codigo de obtencion de email  


  let pool: ConnectionPool | null = null;
  const group_id = 9;

  let { committie, secondaryPrograms } = req.body;
  
  try {
    pool = await sql.connect(config);

    if (req.method === "POST") {
     
  
      await pool.request()
        
          .input("group_id", sql.Int,  group_id)
          .input("email", sql.VarChar, email)
          .input("commite", sql.VarChar, committie)
          .input("talk", sql.VarChar, secondaryPrograms)
          .query(`
            INSERT INTO spie (id_grupo, correo, departamentos, charla_info)
            VALUES (@group_id, @email, @commite, @talk)
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

