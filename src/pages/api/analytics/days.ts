import { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const pool = getPool();

    // 🔍 Consulta para contar usuarios agrupados por fecha de creación
    // COUNT se castea a INTEGER para evitar strings en el frontend
    const result = await pool.query(`
      SELECT (fecha_creacion AT TIME ZONE 'UTC' AT TIME ZONE 'America/Bogota')::DATE AS fecha, COUNT(*)::INTEGER AS cantidad
      FROM persona
      WHERE fecha_creacion IS NOT NULL
      GROUP BY (fecha_creacion AT TIME ZONE 'UTC' AT TIME ZONE 'America/Bogota')::DATE
      ORDER BY fecha
    `);

    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("❌ Error en la conexión con Supabase en la nube:", error.message);
    res.status(500).json({ error: "Error en el servidor" });
  } 
}
