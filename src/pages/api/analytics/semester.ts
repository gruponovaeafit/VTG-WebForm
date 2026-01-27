import { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const pool = getPool();

    // 🔍 Consulta para contar estudiantes por semestre
    // Se castea a INTEGER para que el frontend reciba números reales, no strings
    const result = await pool.query(`
      SELECT semestre::INTEGER AS semestre, COUNT(*)::INTEGER AS cantidad
      FROM persona
      WHERE semestre IS NOT NULL
      GROUP BY semestre
      ORDER BY semestre
    `);

    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("❌ Error en la conexión con Supabase en la nube:", error.message);
    res.status(500).json({ error: "Error en el servidor" });
  } 
}
