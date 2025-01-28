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

    // Consulta para obtener información de la tabla 'aiesec' junto con los datos de la persona
    const result = await pool.request().query(`
      SELECT 
        a.id_grupo,
        a.correo,
        pe.nombre,
        pe.pregrado,
        pe.semestre
      FROM dbo.aiesec AS a
      LEFT JOIN dbo.persona AS pe ON a.correo = pe.correo
      ORDER BY a.id_grupo;
    `);

    // Agrupar los datos por grupo
    const groupedData = result.recordset.reduce((acc, row) => {
      if (!acc[row.id_grupo]) {
        acc[row.id_grupo] = { id_grupo: row.id_grupo, participants: [] };
      }
      acc[row.id_grupo].participants.push({
        correo: row.correo,
        nombre: row.nombre,
        pregrado: row.pregrado,
        semestre: row.semestre
      });
      return acc;
    }, {});

    res.status(200).json({ success: true, data: Object.values(groupedData) });
  } catch (error) {
    console.error("❌ Error en la conexión con MSSQL en la nube:", error);
    res.status(500).json({ error: "Error en el servidor" });
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}
