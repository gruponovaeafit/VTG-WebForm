import { NextApiRequest, NextApiResponse } from "next";
import { dbQuery } from "../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // Consulta para obtener información de la tabla 'gpg' junto con los datos de la persona
    const result = await dbQuery<{
      id_grupo: number;
      correo: string;
      charla: string;
      prepractica: number;
      nombre: string | null;
      pregrado: string | null;
      semestre: number | null;
    }>(`
      SELECT 
        g.id_grupo,
        g.correo,
        g.charla,
        g.prepractica,
        pe.nombre,
        pe.pregrado,
        pe.semestre
      FROM gpg AS g
      LEFT JOIN persona AS pe ON g.correo = pe.correo
      ORDER BY g.prepractica DESC, g.charla, pe.nombre;
    `);

    if (!result.rows || result.rows.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Agrupar los datos por prepractica
    const groupedData = result.rows.reduce((acc, row) => {
      const key = row.prepractica === 1 ? "Con Prepráctica" : "Sin Prepráctica";
      if (!acc[key]) {
        acc[key] = { prepractica: key, participants: [] };
      }
      acc[key].participants.push({
        id_grupo: row.id_grupo,
        correo: row.correo,
        charla: row.charla,
        nombre: row.nombre,
        pregrado: row.pregrado,
        semestre: row.semestre
      });
      return acc;
    }, {} as Record<string, { prepractica: string; participants: any[] }>);

    const finalData = Object.values(groupedData);
    console.log(`✅ GPG: ${finalData.length} grupos encontrados, ${result.rows.length} participantes totales`);

    res.status(200).json({ success: true, data: finalData });
  } catch (error: any) {
    console.error("❌ Error en la consulta de gpg:", error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
}
