import { NextApiRequest, NextApiResponse } from "next";
import { dbQuery } from "../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const result = await dbQuery<{
      id_grupo: number;
      correo: string;
      charla: string | null;
      practica: string | null;
      intercambio: string | null;
      nombre: string | null;
      pregrado: string | null;
      semestre: number | null;
      fecha_inscripcion: string | Date | null;
    }>(`
      SELECT 
        c.id_grupo,
        c.correo,
        c.charla,
        c.practica,
        c.intercambio,
        pe.nombre,
        pe.pregrado,
        pe.semestre,
        (pe.fecha_creacion AT TIME ZONE 'UTC') AS fecha_inscripcion
      FROM club_in AS c
      LEFT JOIN persona AS pe ON c.correo = pe.correo
      ORDER BY pe.fecha_creacion NULLS LAST, c.charla, pe.nombre;
    `);

    if (!result.rows || result.rows.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const groupedData = result.rows.reduce((acc, row) => {
      const charla = row.charla || "Sin charla";
      if (!acc[charla]) {
        acc[charla] = { charla, participants: [] };
      }
      acc[charla].participants.push({
        id_grupo: row.id_grupo,
        correo: row.correo,
        practica: row.practica,
        intercambio: row.intercambio,
        nombre: row.nombre,
        pregrado: row.pregrado,
        semestre: row.semestre,
        fecha_inscripcion: row.fecha_inscripcion,
      });
      return acc;
    }, {} as Record<string, { charla: string; participants: any[] }>);

    const finalData = Object.values(groupedData);
    console.log(
      `✅ Club In: ${finalData.length} grupos por charla, ${result.rows.length} participantes totales`
    );

    res.status(200).json({ success: true, data: finalData });
  } catch (error: any) {
    console.error("❌ Error en la consulta de clubin:", error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
}
