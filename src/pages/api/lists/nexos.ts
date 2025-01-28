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

    // Consulta para obtener información de la tabla 'nexos' junto con los datos de la persona
    const result = await pool.request().query(`
      SELECT 
        n.id_grupo,
        n.correo,
        n.departamento,
        n.charla_informativa,
        n.justificacion,
        pe.nombre,
        pe.pregrado,
        pe.semestre
      FROM dbo.nexos AS n
      LEFT JOIN dbo.persona AS pe ON n.correo = pe.correo
      ORDER BY n.departamento;
    `);

    // Agrupar los datos por departamento
    const groupedData = result.recordset.reduce((acc, row) => {
      if (!acc[row.departamento]) {
        acc[row.departamento] = { departamento: row.departamento, participants: [] };
      }
      acc[row.departamento].participants.push({
        id_grupo: row.id_grupo,
        correo: row.correo,
        charla_informativa: row.charla_informativa,
        justificacion: row.justificacion,
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