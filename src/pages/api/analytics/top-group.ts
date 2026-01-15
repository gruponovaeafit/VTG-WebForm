import { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const pool = getPool();

    // 🔍 Consulta para encontrar el grupo con más inscritos
    // Combinamos los conteos de todas las tablas de grupos y obtenemos el primero ordenado por cantidad
    const result = await pool.query(`
      SELECT grupo, cantidad FROM (
        SELECT 'aiesec' AS grupo, COUNT(*)::INTEGER as cantidad FROM aiesec
        UNION ALL
        SELECT 'club_in' AS grupo, COUNT(*)::INTEGER as cantidad FROM club_in
        UNION ALL
        SELECT 'club_merc' AS grupo, COUNT(*)::INTEGER as cantidad FROM club_merc
        UNION ALL
        SELECT 'gpg' AS grupo, COUNT(*)::INTEGER as cantidad FROM gpg
        UNION ALL
        SELECT 'nexos' AS grupo, COUNT(*)::INTEGER as cantidad FROM nexos
        UNION ALL
        SELECT 'nova' AS grupo, COUNT(*)::INTEGER as cantidad FROM nova
        UNION ALL
        SELECT 'oe' AS grupo, COUNT(*)::INTEGER as cantidad FROM oe
        UNION ALL
        SELECT 'partners' AS grupo, COUNT(*)::INTEGER as cantidad FROM partners
        UNION ALL
        SELECT 'seres' AS grupo, COUNT(*)::INTEGER as cantidad FROM seres
        UNION ALL
        SELECT 'spie' AS grupo, COUNT(*)::INTEGER as cantidad FROM spie
        UNION ALL
        SELECT 'tutores' AS grupo, COUNT(*)::INTEGER as cantidad FROM tutores
        UNION ALL
        SELECT 'tvu' AS grupo, COUNT(*)::INTEGER as cantidad FROM tvu
        UNION ALL
        SELECT 'un' AS grupo, COUNT(*)::INTEGER as cantidad FROM un
      ) grupos_combined
      ORDER BY cantidad DESC
      LIMIT 1
    `);

    res.status(200).json(result.rows[0] || { grupo: null, cantidad: 0 });
  } catch (error: any) {
    console.error("❌ Error en la conexión con Supabase en la nube:", error.message);
    res.status(500).json({ error: "Error en el servidor" });
  } 
}
