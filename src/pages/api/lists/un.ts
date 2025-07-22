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

    // Consulta para obtener información de la tabla 'un' junto con los datos de la persona
    const result = await pool.request().query(`
      SELECT 
        u.id_grupo,
        u.correo,
        u.departamentos,
        u.charla_info,
        u.asis_assessment,
        u.fecha_inscripcion,
        pe.nombre,
        pe.pregrado,
        pe.semestre
      FROM dbo.un AS u
      LEFT JOIN dbo.persona AS pe ON u.correo = pe.correo
      ORDER BY u.charla_info;
    `);

    // Agrupar los datos por charla
    const groupedData = result.recordset.reduce((acc, row) => {
      if (!acc[row.charla_info]) {
        acc[row.charla_info] = { charla_info: row.charla_info, participants: [] };
      }
      acc[row.charla_info].participants.push({
        id_grupo: row.id_grupo,
        correo: row.correo,
        departamentos: row.departamentos,
        asis_assessment: row.asis_assessment,
        nombre: row.nombre,
        pregrado: row.pregrado,
        semestre: row.semestre,
        fecha_inscripcion: row.fecha_inscripcion
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