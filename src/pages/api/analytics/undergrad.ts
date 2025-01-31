import { NextApiRequest, NextApiResponse } from "next";
import sql from "mssql";
import { dbConfig } from "../forms/db"; // Importación directa sin "@/lib/"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  let pool: sql.ConnectionPool | null = null;

  try {
    pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .query(`
        SELECT pregrado, COUNT(*) as cantidad
        FROM persona
        WHERE pregrado IS NOT NULL
        GROUP BY pregrado
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
