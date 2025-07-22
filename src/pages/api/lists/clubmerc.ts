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

    // Consulta para obtener información de la tabla 'clubmerc' junto con los datos de la persona
    const result = await pool.request().query(`
      SELECT 
        c.id_grupo,
        c.correo,
        c.comite,
        c.asistencia_charla,
        c.fecha_inscripcion,
        pe.nombre,
        pe.pregrado,
        pe.semestre
      FROM dbo.clubmerc AS c
      LEFT JOIN dbo.persona AS pe ON c.correo = pe.correo
      ORDER BY c.comite;
    `);

    // Agrupar los datos por comité
    const groupedData = result.recordset.reduce((acc, row) => {
      if (!acc[row.comite]) {
        acc[row.comite] = { comite: row.comite, participants: [] };
      }
      acc[row.comite].participants.push({
        id_grupo: row.id_grupo,
        correo: row.correo,
        asistencia_charla: row.asistencia_charla,
        fecha_inscripcion: row.fecha_inscripcion,
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