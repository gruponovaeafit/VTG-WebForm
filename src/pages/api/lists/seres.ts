import { NextApiRequest, NextApiResponse } from "next";
import { dbQuery } from "../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // Consulta para obtener información de la tabla 'seres' junto con los datos de la persona
    const result = await dbQuery<{
      id_grupo: number;
      correo: string;
      charla: string;
      talk_id: number | null;
      nombre: string | null;
      pregrado: string | null;
      semestre: number | null;
    }>(`
      SELECT 
        s.id_grupo,
        s.correo,
        s.charla,
        s.talk_id,
        pe.nombre,
        pe.pregrado,
        pe.semestre
      FROM seres AS s
      LEFT JOIN persona AS pe ON s.correo = pe.correo
      ORDER BY s.charla, pe.nombre;
    `);

    if (!result.rows || result.rows.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Agrupar los datos por charla
    const groupedData = result.rows.reduce((acc, row) => {
      const charla = row.charla || "Sin charla";
      if (!acc[charla]) {
        acc[charla] = { charla: charla, participants: [] };
      }
      acc[charla].participants.push({
        id_grupo: row.id_grupo,
        correo: row.correo,
        talk_id: row.talk_id,
        nombre: row.nombre,
        pregrado: row.pregrado,
        semestre: row.semestre
      });
      return acc;
    }, {} as Record<string, { charla: string; participants: any[] }>);

    const finalData = Object.values(groupedData);
    console.log(`✅ Seres: ${finalData.length} charlas encontradas, ${result.rows.length} participantes totales`);

    res.status(200).json({ success: true, data: finalData });
  } catch (error: any) {
    console.error("❌ Error en la consulta de seres:", error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
}
