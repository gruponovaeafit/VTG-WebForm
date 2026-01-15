import { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const pool = getPool();

    const result = await pool.query(`
      SELECT pregrado, COUNT(*)::INTEGER as cantidad
      FROM (
        SELECT pregrado FROM persona WHERE pregrado IS NOT NULL
        UNION ALL
        SELECT pregrado_2 as pregrado FROM persona WHERE pregrado_2 IS NOT NULL
      ) todas_carreras
      GROUP BY pregrado
      ORDER BY cantidad DESC
    `);

    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("❌ Error en la conexión con Supabase en la nube:", error.message);
    res.status(500).json({ error: "Error en el servidor" });
  } 
}
