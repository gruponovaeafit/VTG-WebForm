import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { connectToDatabase } from "../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  let pool: Pool | null = null;

  try {
    pool = await connectToDatabase();

    // 🔍 Consulta para contar estudiantes por semestre
    const result = await pool.query(`
      SELECT semestre, COUNT(*) as cantidad
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
