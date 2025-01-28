import { NextApiRequest, NextApiResponse } from "next";
import sql from "mssql";
import { config } from "../db"; // Ajusta la ruta si es necesario

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  let pool: sql.ConnectionPool | null = null;

  try {
    pool = await sql.connect(config);

    // 🔍 Consulta para contar usuarios agrupados por fecha de creación
    const result = await pool.request().query(`
      SELECT CAST(fecha_creacion AS DATE) as fecha, COUNT(*) as cantidad
      FROM dbo.persona
      WHERE fecha_creacion IS NOT NULL
      GROUP BY CAST(fecha_creacion AS DATE)
      ORDER BY fecha
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
