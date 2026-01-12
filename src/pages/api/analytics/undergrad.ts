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

    const result = await pool.query(`
      SELECT pregrado, COUNT(*)::INTEGER as cantidad
      FROM persona
      WHERE pregrado IS NOT NULL
      GROUP BY pregrado
      ORDER BY cantidad DESC
    `);

    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("❌ Error en la conexión con Supabase en la nube:", error.message);
    res.status(500).json({ error: "Error en el servidor" });
  } 
}
