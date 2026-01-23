import { NextApiRequest, NextApiResponse } from "next";
import { dbQuery } from "../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // Consulta para obtener datos de la tabla 'nova' con detalles desde 'persona'
    const result = await dbQuery<{
      id_grupo: number;
      correo: string;
      charla: string;
      departamento: string;
      nombre_miembro: string;
      nombre: string | null;
      pregrado: string | null;
      semestre: number | null;
    }>(`
      SELECT 
        n.id_grupo,
        n.correo,
        n.charla,
        n.departamento,
        n.nombre_miembro,
        pe.nombre,
        pe.pregrado,
        pe.semestre
      FROM nova AS n
      LEFT JOIN persona AS pe ON n.correo = pe.correo
      ORDER BY n.charla, pe.nombre;
    `);

    if (!result.rows || result.rows.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Retornar datos planos (sin agrupar) para que el frontend los agrupe
    const data = result.rows.map(row => ({
      id_grupo: row.id_grupo,
      correo: row.correo,
      charla: row.charla,
      departamento: row.departamento,
      nombre_miembro: row.nombre_miembro,
      nombre: row.nombre,
      pregrado: row.pregrado,
      semestre: row.semestre
    }));

    console.log(`✅ NOVA: ${result.rows.length} participantes encontrados`);

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error("❌ Error en la consulta de nova:", error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
}
