import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { getPool } from "../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const pool = await getPool();

    // 🔍 Contar el número total de inscritos en la tabla persona
    const result = await pool.query(`
      SELECT COUNT(*) as total FROM persona
    `);

    res.status(200).json({ total: parseInt(result.rows[0].total) || 0 });
  } catch (error: any) {
    console.error("❌ Error en la conexión con Supabase en la nube:", error.message);
    res.status(500).json({ error: "Error en el servidor" });
  } 
}
