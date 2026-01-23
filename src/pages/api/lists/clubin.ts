import { NextApiRequest, NextApiResponse } from "next";
import { dbQuery } from "../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // Consulta para obtener información de la tabla 'club_in' agrupada por slot
    const result = await dbQuery<{
      id_grupo: number;
      correo: string;
      slot_id: number | null;
      day_of_week: string | null;
      start_time: string | null;
      capacity: number | null;
    }>(`
      SELECT 
        c.id_grupo,
        c.correo,
        c.slot_id,
        p.day_of_week,
        p.start_time,
        p.capacity
      FROM club_in AS c
      LEFT JOIN pre_assessment_slot AS p ON c.slot_id = p.slot_id
      ORDER BY p.day_of_week ASC, p.start_time ASC, c.correo;
    `);

    if (!result.rows || result.rows.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Agrupar los datos por day_of_week y start_time
    const groupedData = result.rows.reduce((acc, row) => {
      const key = row.day_of_week && row.start_time 
        ? `${row.day_of_week} - ${row.start_time}` 
        : "Sin slot asignado";
      
      if (!acc[key]) {
        acc[key] = { 
          day_of_week: row.day_of_week, 
          start_time: row.start_time, 
          capacity: row.capacity, 
          participants: [] 
        };
      }
      acc[key].participants.push({
        id_grupo: row.id_grupo,
        correo: row.correo,
        slot_id: row.slot_id
      });
      return acc;
    }, {} as Record<string, { day_of_week: string | null; start_time: string | null; capacity: number | null; participants: any[] }>);

    const finalData = Object.values(groupedData);
    console.log(`✅ Club In: ${finalData.length} slots encontrados, ${result.rows.length} participantes totales`);

    res.status(200).json({ success: true, data: finalData });
  } catch (error: any) {
    console.error("❌ Error en la consulta de clubin:", error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
}
