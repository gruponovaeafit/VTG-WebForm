import { NextApiRequest, NextApiResponse } from "next";
import sql from "mssql";
import { config } from "../db"; // Ajusta la ruta según la ubicación de tu archivo db.ts

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  let pool: sql.ConnectionPool | null = null;

  try {
    pool = await sql.connect(config);

    // 🔍 Contar la cantidad de registros en cada tabla de grupos
    const result = await pool
      .request()
      .query(`
        SELECT 'aiesec' AS grupo, COUNT(*) as cantidad FROM dbo.aiesec
        UNION ALL
        SELECT 'club_in' AS grupo, COUNT(*) as cantidad FROM dbo.club_in
        UNION ALL
        SELECT 'clubmerc' AS grupo, COUNT(*) as cantidad FROM dbo.clubmerc
        UNION ALL
        SELECT 'gpg' AS grupo, COUNT(*) as cantidad FROM dbo.gpg
        UNION ALL
        SELECT 'nexos' AS grupo, COUNT(*) as cantidad FROM dbo.nexos
        UNION ALL
        SELECT 'nova' AS grupo, COUNT(*) as cantidad FROM dbo.nova
        UNION ALL
        SELECT 'oe' AS grupo, COUNT(*) as cantidad FROM dbo.oe
        UNION ALL
        SELECT 'partners' AS grupo, COUNT(*) as cantidad FROM dbo.partners
        UNION ALL
        SELECT 'seres' AS grupo, COUNT(*) as cantidad FROM dbo.seres
        UNION ALL
        SELECT 'spie' AS grupo, COUNT(*) as cantidad FROM dbo.spie
        UNION ALL
        SELECT 'tutores' AS grupo, COUNT(*) as cantidad FROM dbo.tutores
        UNION ALL
        SELECT 'tvu' AS grupo, COUNT(*) as cantidad FROM dbo.tvu
        UNION ALL
        SELECT 'un' AS grupo, COUNT(*) as cantidad FROM dbo.un
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
