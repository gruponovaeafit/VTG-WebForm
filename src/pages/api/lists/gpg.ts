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

    // Consulta para obtener información de la tabla 'gpg' junto con los datos de la persona
    const result = await pool.request().query(`
      SELECT 
        g.id_grupo,
        g.correo,
        g.prepractica,
        g.edad,
        pe.nombre,
        pe.pregrado,
        pe.semestre
      FROM dbo.gpg AS g
      LEFT JOIN dbo.persona AS pe ON g.correo = pe.correo
      ORDER BY g.prepractica DESC, g.edad ASC;
    `);

    // Agrupar los datos por prepráctica
    const groupedData = result.recordset.reduce((acc, row) => {
      const key = row.prepractica ? "Con Prepráctica" : "Sin Prepráctica";
      if (!acc[key]) {
        acc[key] = { prepractica: key, participants: [] };
      }
      acc[key].participants.push({
        id_grupo: row.id_grupo,
        correo: row.correo,
        edad: row.edad,
        nombre: row.nombre,
        pregrado: row.pregrado,
        semestre: row.semestre
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