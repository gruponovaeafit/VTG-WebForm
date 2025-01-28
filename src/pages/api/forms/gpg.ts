import { NextApiRequest, NextApiResponse } from "next";
import { connect, Int, VarChar, TinyInt, config as SqlConfig, ConnectionPool } from "mssql";
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
  const email = verifyJwtFromCookies(req, res);
  const group_id = 3;
  let { talk } = req.body;
  const { age } = req.body;

  // Convertir el valor de 'talk' a entero
  const talkValue = talk === "Si" ? 1 : 0;

  let pool: ConnectionPool | null = null;

  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        message: "Método no permitido.",
      });
    }

    pool = await connect(config);

    try {
      await pool.request()
        .input("group_id", Int, group_id)
        .input("email", VarChar, email)
        .input("age", Int, age)
        .input("talk", TinyInt, talkValue)
        .query(`
          INSERT INTO gpg (id_grupo, correo, edad, prepractica)
          VALUES (@group_id, @email, @age, @talk)
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
    console.error("Error general en el servidor:", err);
    return res.status(500).json({
      message: "Error de servidor.",
    });
  } finally {
    if (pool) {
      pool.close();
    }
  }
}
