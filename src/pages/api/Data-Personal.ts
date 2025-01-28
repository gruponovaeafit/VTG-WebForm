import type { NextApiRequest, NextApiResponse } from "next";
import { connect, VarChar, config as SqlConfig } from "mssql";
import type { ConnectionPool } from "mssql";
import { verifyJwtFromCookies } from "./cookieManagement";

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
  if (req.method !== "POST") {
    return res.status(405).json({
      notification: {
        type: "error",
        message: "Método no permitido",
      },
    });
  }

  let pool: ConnectionPool | null = null;

  try {
    const body = req.body;

    const email = verifyJwtFromCookies(req, res);
    const { name, secondName } = body;

    if (!name || !secondName) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "El nombre y el apellido son obligatorios.",
        },
      });
    }

    const nombre = `${name} ${secondName}`;
    pool = await connect(config);

    await pool.request()
      .input("correo", VarChar, email)
      .input("nombre", VarChar, nombre)
      .query(`
        UPDATE persona
        SET nombre = @nombre
        WHERE correo = @correo
      `);

    return res.status(200).json({
      notification: {
        type: "success",
        message: "Registro actualizado exitosamente.",
      },
    });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error al procesar la solicitud.",
      },
    });
  } finally {
    if (pool) {
      pool.close();
    }
  }
}
