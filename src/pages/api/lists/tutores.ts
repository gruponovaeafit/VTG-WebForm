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

    // Consulta para obtener información de la tabla 'tutores' junto con los datos de la persona
    const result = await pool.request().query(`
      SELECT 
        t.id_grupo,
        t.correo,
        t.charla_info,
        pe.nombre,
        pe.pregrado,
        pe.semestre
      FROM dbo.tutores AS t
      LEFT JOIN dbo.persona AS pe ON t.correo = pe.correo
      ORDER BY t.charla_info;
    `);

    // Agrupar los datos por charla
    const groupedData = result.recordset.reduce((acc, row) => {
      if (!acc[row.charla_info]) {
        acc[row.charla_info] = { charla_info: row.charla_info, participants: [] };
      }
      acc[row.charla_info].participants.push({
        id_grupo: row.id_grupo,
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
