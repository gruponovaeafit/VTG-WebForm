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
      return res.status(405).json({
        message: "Método no permitido.",
      });
    }

    pool = await connect(config);

    const { departments, assistance, excuse } = req.body;
    const email = verifyJwtFromCookies(req, res);
    const groupId = 4;
    const assistanceValue = assistance === "Sí" ? 1 : 0;

    try {
      await pool.request()
        .input("id_grupo", Int, groupId)
        .input("correo", VarChar, email)
        .input("departamento", VarChar, departments)
        .input("charla_informativa", Int, assistanceValue)
        .input("justificacion", VarChar, excuse || "")
        .query(`
          INSERT INTO nexos (id_grupo, correo, departamento, charla_informativa, justificacion)
          VALUES (@id_grupo, @correo, @departamento, @charla_informativa, @justificacion)
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
