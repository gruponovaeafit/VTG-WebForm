import type { NextApiRequest, NextApiResponse } from "next";
import sql, { config as SqlConfig } from "mssql";
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
  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Método no permitido" });
    return;
  }

 

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

  let pool: sql.ConnectionPool | null = null;    
  try {
    
    const body = req.body;
   
  
    let { programs, semester, secondPrograms } = body;
   
    if (!secondPrograms) {
      secondPrograms = 'No aplica';
     }

    if (semester == '10+'){
      semester = 11;
    } 

    if (!semester || !programs) {
      
      console.log(semester, programs, secondPrograms);
      console.log("Campos faltantes");
      res.status(400).json({
        success: false,
        message: "El semestre, el programa y el segundo programa son obligatorios",
      });
      return;
    }

    // Conexión a la base de datos
     pool = await sql.connect(config);

  
    // Insertar el registro en la tabla "PERSONA"

    await pool.request()
    
    .input("programs", sql.VarChar, programs)
    .input("secondaryPrograms", sql.VarChar, secondPrograms)
    .input("semester", sql.Int, semester)
    .input("correo", sql.VarChar, email)
    .query(`
        UPDATE persona
        SET semestre = @semester, pregrado = @programs, pregrado_2 = @secondaryPrograms
        WHERE correo = @correo; 
      `);

    console.log("Datos académicos almacenados");

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
