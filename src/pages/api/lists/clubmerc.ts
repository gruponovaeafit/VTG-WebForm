import { NextApiRequest, NextApiResponse } from "next";
import { dbQuery } from "../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // Consulta para obtener información de la tabla 'club_merc' junto con los datos de la persona
    const result = await dbQuery<{
      id_grupo: number;
      correo: string;
      comite: string;
      nombre: string | null;
      pregrado: string | null;
      semestre: number | null;
    }>(`
      SELECT 
        c.id_grupo,
        c.correo,
        c.comite,
        pe.nombre,
        pe.pregrado,
        pe.semestre
      FROM club_merc AS c
      LEFT JOIN persona AS pe ON c.correo = pe.correo
      ORDER BY c.comite, pe.nombre;
    `);

    if (!result.rows || result.rows.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Agrupar los datos por comité
    const groupedData = result.rows.reduce((acc, row) => {
      const comite = row.comite || "Sin comité";
      if (!acc[comite]) {
        acc[comite] = { comite: comite, participants: [] };
      }
      acc[comite].participants.push({
        id_grupo: row.id_grupo,
        correo: row.correo,
        nombre: row.nombre,
        pregrado: row.pregrado,
        semestre: row.semestre
      });
      return acc;
    }, {} as Record<string, { comite: string; participants: any[] }>);

    const finalData = Object.values(groupedData);
    console.log(`✅ Club Merc: ${finalData.length} comités encontrados, ${result.rows.length} participantes totales`);

    res.status(200).json({ success: true, data: finalData });
  } catch (error: any) {
    console.error("❌ Error en la consulta de clubmerc:", error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
}
