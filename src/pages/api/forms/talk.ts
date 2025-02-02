import { NextApiRequest, NextApiResponse } from "next";
import { connect, Int, VarChar, config as SqlConfig, ConnectionPool } from "mssql";
import { verifyJwtFromCookies } from "../cookieManagement";

const config: SqlConfig = {
  user: process.env.DB_USER as string,
  password: process.env.DB_PASS as string,
  database: process.env.DB_NAME as string,
  server: process.env.DB_SERVER as string,
  port: parseInt(process.env.DB_PORT ?? "1433", 10),
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let pool: ConnectionPool | null = null;

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Método no permitido." });
    }

    pool = await connect(config);

    const { talk, IdNovato } = req.body;
    const groupId = 5;
    const email = verifyJwtFromCookies(req, res);

    try {
      await pool.request()
        .input("correo", VarChar, email)
        .input("asesor", VarChar, IdNovato)
        .input("charla", VarChar, talk)
        .input("id_grupo", Int, groupId)
        .query(`
          INSERT INTO nova (asesor, charla, id_grupo, correo)
          VALUES (@asesor, @charla, @id_grupo, @correo);
        `);

      return res.status(200).json({ message: "Formulario enviado con éxito." });
    } catch (error: any) {
      if (error.number === 2627) {
        // Manejo de error de clave primaria duplicada
        return res.status(400).json({
          message: "Ya estás registrado en este grupo.",
        });
      }
      throw error;
    }
  } catch (err) {
    console.error("Error en la conexión SQL:", err);
    return res.status(500).json({
      message: "Error de servidor.",
    });
  } finally {
    if (pool) {
      pool.close();
    }
  }
}
