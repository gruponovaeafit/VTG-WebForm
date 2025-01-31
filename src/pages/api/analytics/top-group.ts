import { NextApiRequest, NextApiResponse } from "next";
import sql from "mssql";
import { dbConfig } from "../forms/db"; // Ajusta la ruta si es necesario

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  let pool: sql.ConnectionPool | null = null;

  try {
    pool = await sql.connect(dbConfig);

    // 🔍 Consulta para encontrar el grupo con más inscritos
    const result = await pool.request().query(`
      SELECT TOP 1 grupo, cantidad FROM (
        SELECT 'aiesec' AS grupo, COUNT(*) as cantidad FROM dbo.aiesec
        UNION ALL
        SELECT 'club_in', COUNT(*) FROM dbo.club_in
        UNION ALL
        SELECT 'clubmerc', COUNT(*) FROM dbo.clubmerc
        UNION ALL
        SELECT 'gpg', COUNT(*) FROM dbo.gpg
        UNION ALL
        SELECT 'nexos', COUNT(*) FROM dbo.nexos
        UNION ALL
        SELECT 'nova', COUNT(*) FROM dbo.nova
        UNION ALL
        SELECT 'oe', COUNT(*) FROM dbo.oe
        UNION ALL
        SELECT 'partners', COUNT(*) FROM dbo.partners
        UNION ALL
        SELECT 'seres', COUNT(*) FROM dbo.seres
        UNION ALL
        SELECT 'spie', COUNT(*) FROM dbo.spie
        UNION ALL
        SELECT 'tutores', COUNT(*) FROM dbo.tutores
        UNION ALL
        SELECT 'tvu', COUNT(*) FROM dbo.tvu
        UNION ALL
        SELECT 'un', COUNT(*) FROM dbo.un
      ) AS grupos
      ORDER BY cantidad DESC
    `);

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error("❌ Error en la conexión con MSSQL en la nube:", error);
    res.status(500).json({ error: "Error en el servidor" });
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}
