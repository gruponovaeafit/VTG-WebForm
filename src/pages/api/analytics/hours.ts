import { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "../db";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const pool = getPool();

    // 🔍 Consulta para contar usuarios agrupados por hora (todas las horas del día)
    const result = await pool.query(`
      SELECT 
        EXTRACT(HOUR FROM (fecha_creacion AT TIME ZONE 'UTC' AT TIME ZONE 'America/Bogota'))::INTEGER as hora, 
        COUNT(*)::INTEGER as cantidad
      FROM persona
      WHERE fecha_creacion IS NOT NULL
      GROUP BY EXTRACT(HOUR FROM (fecha_creacion AT TIME ZONE 'UTC' AT TIME ZONE 'America/Bogota'))
      ORDER BY hora
    `);

    console.log("📊 Horas encontradas:", result.rows.length, "registros");
    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("❌ Error en la conexión con Supabase en la nube:", error.message);
    res.status(500).json({ error: "Error en el servidor" });
  } 
}
