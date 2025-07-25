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

    // Consulta actualizada para incluir fecha_inscripcion
    const result = await pool.request().query(`
      SELECT 
        o.id_grupo,
        o.correo,
        o.charla_info,
        o.fecha_inscripcion,
        o.asesor,
        pe.nombre,
        pe.pregrado,
        pe.semestre
      FROM dbo.oe AS o
      LEFT JOIN dbo.persona AS pe ON o.correo = pe.correo
      ORDER BY o.charla_info, o.fecha_inscripcion DESC;
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
        semestre: row.semestre,
        asesor: row.asesor || "N/A", // Asegurarse de que asesor no sea undefined
        fecha_inscripcion: row.fecha_inscripcion, // incluir en la respuesta
      });
      return acc;
    }, {} as Record<string, { charla_info: string; participants: any[] }>);

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