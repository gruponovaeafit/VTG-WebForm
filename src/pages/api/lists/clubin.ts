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

    // Consulta para obtener información de la tabla 'club_in' agrupada por día y hora de la charla
    const result = await pool.request().query(`
      SELECT 
        p.day_of_week,
        p.start_time,
        p.capacity,
        c.id_grupo,
        c.correo,
        c.slot_id,
        c.asesor
      FROM dbo.club_in AS c
      LEFT JOIN dbo.pre_assessment_slot AS p ON c.slot_id = p.slot_id
      ORDER BY p.day_of_week, p.start_time;
    `);

    // Agrupar los datos por day_of_week y start_time
    const groupedData = result.recordset.reduce((acc, row) => {
      const key = `${row.day_of_week} - ${row.start_time}`;
      if (!acc[key]) {
        acc[key] = { day_of_week: row.day_of_week, start_time: row.start_time, capacity: row.capacity, participants: [] };
      }
      acc[key].participants.push({
        id_grupo: row.id_grupo,
        correo: row.correo,
        slot_id: row.slot_id,
        asesor: row.asesor
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
