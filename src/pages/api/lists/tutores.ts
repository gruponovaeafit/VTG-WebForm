import { NextApiRequest, NextApiResponse } from "next";
import { dbQuery } from "../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // Consulta para obtener información de la tabla 'tutores' junto con los datos de la persona
    const result = await dbQuery<{
      id_grupo: number;
      correo: string;
      nombre_miembro: string;
      nombre: string | null;
      pregrado: string | null;
      semestre: number | null;
    }>(`
      SELECT 
        t.id_grupo,
        t.correo,
        t.nombre_miembro,
        pe.nombre,
        pe.pregrado,
        pe.semestre
      FROM tutores AS t
      LEFT JOIN persona AS pe ON t.correo = pe.correo
      ORDER BY t.nombre_miembro, pe.nombre;
    `);

    if (!result.rows || result.rows.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Agrupar los datos por nombre_miembro (tutor)
    const groupedData = result.rows.reduce((acc, row) => {
      const tutor = row.nombre_miembro || "Sin tutor";
      if (!acc[tutor]) {
        acc[tutor] = { tutor: tutor, participants: [] };
      }
      acc[tutor].participants.push({
        id_grupo: row.id_grupo,
        correo: row.correo,
        nombre: row.nombre,
        pregrado: row.pregrado,
        semestre: row.semestre,
        nombre_miembro: row.nombre_miembro
      });
      return acc;
    }, {} as Record<string, { tutor: string; participants: any[] }>);

    const finalData = Object.values(groupedData);
    console.log(`✅ Tutores: ${finalData.length} tutores encontrados, ${result.rows.length} participantes totales`);

    res.status(200).json({ success: true, data: finalData });
  } catch (error: any) {
    console.error("❌ Error en la consulta de tutores:", error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
}
