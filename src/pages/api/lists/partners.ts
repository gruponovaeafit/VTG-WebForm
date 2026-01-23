import { NextApiRequest, NextApiResponse } from "next";
import { dbQuery } from "../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // Consulta para obtener información de la tabla 'partners' junto con los datos de la persona
    const result = await dbQuery<{
      id_grupo: number;
      correo: string;
      nombre_miembro: string;
      charla: string;
      nombre: string | null;
      pregrado: string | null;
      semestre: number | null;
    }>(`
      SELECT 
        p.id_grupo,
        p.correo,
        p.nombre_miembro,
        p.charla,
        pe.nombre,
        pe.pregrado,
        pe.semestre
      FROM partners AS p
      LEFT JOIN persona AS pe ON p.correo = pe.correo
      ORDER BY p.charla, pe.nombre;
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
        nombre_miembro: row.nombre_miembro,
        nombre: row.nombre,
        pregrado: row.pregrado,
        semestre: row.semestre
      });
      return acc;
    }, {} as Record<string, { charla: string; participants: any[] }>);

    const finalData = Object.values(groupedData);
    console.log(`✅ Partners: ${finalData.length} charlas encontradas, ${result.rows.length} participantes totales`);

    res.status(200).json({ success: true, data: finalData });
  } catch (error: any) {
    console.error("❌ Error en la consulta de partners:", error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
}
