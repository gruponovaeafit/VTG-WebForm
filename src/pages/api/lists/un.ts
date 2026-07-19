import { NextApiRequest, NextApiResponse } from "next";
import { dbQuery } from "../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // Consulta para obtener información de la tabla 'un' junto con los datos de la persona
    const result = await dbQuery<{
      id_grupo: number;
      correo: string;
      comite: string;
      charla: string;
      donde_conocio: string | null;
      nombre: string | null;
      pregrado: string | null;
      semestre: number | null;
      fecha_inscripcion: string | Date | null;
    }>(`
      SELECT 
        u.id_grupo,
        u.correo,
        u.comite,
        u.charla,
        u.donde_conocio,
        pe.nombre,
        pe.pregrado,
        pe.semestre,
        (pe.fecha_creacion AT TIME ZONE 'UTC') AS fecha_inscripcion
      FROM un AS u
      LEFT JOIN persona AS pe ON u.correo = pe.correo
      ORDER BY pe.fecha_creacion NULLS LAST, u.charla, pe.nombre;
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
        comite: row.comite,
        donde_conocio: row.donde_conocio,
        nombre: row.nombre,
        pregrado: row.pregrado,
        semestre: row.semestre,
        fecha_inscripcion: row.fecha_inscripcion
      });
      return acc;
    }, {} as Record<string, { charla: string; participants: any[] }>);

    const finalData = Object.values(groupedData);
    console.log(`✅ UN: ${finalData.length} charlas encontradas, ${result.rows.length} participantes totales`);

    res.status(200).json({ success: true, data: finalData });
  } catch (error: any) {
    console.error("❌ Error en la consulta de un:", error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
}
