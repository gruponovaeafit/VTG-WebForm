import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { getPool } from "../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  let pool: Pool | null = null;

  try {
    pool = getPool();

    // 🔍 Consulta para contar usuarios agrupados por hora (entre 8:00 AM y 7:00 PM)
    const result = await pool.query(`
      SELECT 
        EXTRACT(HOUR FROM fecha_creacion)::INTEGER as hora, 
        COUNT(*) as cantidad
      FROM persona
      WHERE fecha_creacion IS NOT NULL
        AND EXTRACT(HOUR FROM fecha_creacion) BETWEEN 8 AND 19
      GROUP BY EXTRACT(HOUR FROM fecha_creacion)
      ORDER BY hora
    `);

    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("❌ Error en la conexión con Supabase en la nube:", error.message);
    res.status(500).json({ error: "Error en el servidor" });
  } 
}
