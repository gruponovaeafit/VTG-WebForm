import { NextApiRequest, NextApiResponse } from "next";
import sql from "mssql";
import { config } from "../db"; // Ajusta la ruta si es necesario

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  let pool: sql.ConnectionPool | null = null;

  try {
    pool = await sql.connect(config);

    // 🔍 Consulta para obtener datos de la tabla 'nova' con detalles desde 'persona'
    const result = await pool.request().query(`
      SELECT 
        n.id_grupo,
        n.correo,
        n.charla,
        n.asesor,
        p.nombre,
        p.pregrado,
        p.semestre
      FROM dbo.nova AS n
      LEFT JOIN dbo.persona AS p ON n.correo = p.correo
      ORDER BY n.charla, p.nombre;
    `);

    res.status(200).json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("❌ Error en la conexión con MSSQL en la nube:", error);
    res.status(500).json({ error: "Error en el servidor" });
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}