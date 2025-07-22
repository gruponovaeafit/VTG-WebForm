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
        notification: {
          type: "error",
          message: "Método no permitido.",
        },
      });
    }

    const email = verifyJwtFromCookies(req, res);
    const group_id = 13;
    const phone = req.body;

    pool = await connect(config);

    try {
      // Intentar insertar en la base de datos
      await pool.request()
        .input("group_id", Int, group_id)
        .input("email", VarChar, email)
        .input("phone", VarChar, phone)
        .query(`
          INSERT INTO aiesec (id_grupo, correo, telefono)
          VALUES (@group_id, @email, @phone)
        `);

      // Respuesta en caso de éxito
      return res.status(200).json({
        notification: {
          type: "success",
          message: "Formulario enviado con éxito.",
        },
      });
    } catch (error: any) {
      // Manejo de error de clave duplicada
      if (error.number === 2627) {
        return res.status(400).json({
          notification: {
            type: "error",
            message: "Ya estás registrado en este grupo.",
          },
        });
      }

      // Otros errores
      console.error("Error al insertar en la base de datos:", error);
      return res.status(500).json({
        notification: {
          type: "error",
          message: "Error al guardar los datos. Por favor, inténtalo de nuevo más tarde.",
        },
      });
    }
  } catch (err) {
    console.error("Error general en el servidor:", err);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error interno del servidor.",
      },
    });
  } finally {
    if (pool) {
      pool.close();
    }
  }
}
