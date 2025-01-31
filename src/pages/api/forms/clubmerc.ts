// pages/api/forms/clubmerc.ts
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
    pool = await connect(config);

    if (req.method === "POST") {
      const { committieSelect, talk } = req.body as {
        committieSelect: string;
        talk: string;
      };

      const email = verifyJwtFromCookies(req, res);
      const grupoId = 2; // ID del grupo seleccionado
      const talkValue = talk === "Sí" ? 1 : 0;

      try {
        await pool.request()
          .input("id_grupo", Int, grupoId)
          .input("correo", VarChar, email)
          .input("comite", VarChar, committieSelect)
          .input("asistencia_charla", Int, talkValue)
          .query(`
            INSERT INTO clubmerc (id_grupo, correo, comite, asistencia_charla)
            VALUES (@id_grupo, @correo, @comite, @asistencia_charla)
          `);

        return res.status(200).json({
          message: "Formulario enviado con éxito.",
        });
      } catch (error: any) {
        if (error.number === 2627) {
          return res.status(400).json({
            message: "Ya estás registrado en este grupo.",
          });
        }
        throw error;
      }
    } else {
      return res.status(405).json({
        message: "Método no permitido.",
      });
    }
  } catch (err) {
    console.error("Error en la conexión SQL:", err);
    return res.status(500).json({
      message: "Error de servidor.",
      details: err,
    });
  } finally {
    if (pool) {
      pool.close();
    }
  }
}
