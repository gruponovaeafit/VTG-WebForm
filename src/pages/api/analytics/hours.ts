import { NextApiRequest, NextApiResponse } from "next";
import sql from "mssql";
import { dbConfig } from "../forms/db"; // Ajusta la ruta si es necesario

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  let pool: sql.ConnectionPool | null = null;

  try {
    pool = await sql.connect(dbConfig);

    // 🔍 Consulta para contar usuarios agrupados por hora (entre 8:00 AM y 7:00 PM)
    const result = await pool.request().query(`
      SELECT 
        DATEPART(HOUR, fecha_creacion) as hora, 
        COUNT(*) as cantidad
      FROM dbo.persona
      WHERE fecha_creacion IS NOT NULL
        AND DATEPART(HOUR, fecha_creacion) BETWEEN 8 AND 19
      GROUP BY DATEPART(HOUR, fecha_creacion)
      ORDER BY hora
    `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("❌ Error en la conexión con MSSQL en la nube:", error);
    res.status(500).json({ error: "Error en el servidor" });
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}
