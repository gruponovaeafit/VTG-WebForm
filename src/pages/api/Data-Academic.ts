import type { NextApiRequest, NextApiResponse } from "next";
import { connect, VarChar, Int, config as SqlConfig } from "mssql";
import { verify } from "jsonwebtoken";
import { parse } from "cookie";

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

  let pool = null;

  try {
    const cookies = req.headers.cookie;
    if (!cookies) {
      return res.status(401).json({
        notification: {
          type: "error",
          message: "No se encontraron cookies.",
        },
      });
    }

    const parsedCookies = parse(cookies);
    const jwtToken = parsedCookies.jwtToken;

    if (!jwtToken) {
      return res.status(401).json({
        notification: {
          type: "error",
          message: "No se encontró el token en las cookies.",
        },
      });
    }

    const decoded = verify(jwtToken, process.env.JWT_SECRET_KEY as string);
    const email = (decoded as { email: string }).email;

    const { programs, semester, secondaryPrograms = "No aplica" } = req.body;

    if (!programs || !semester) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "El semestre y el programa son obligatorios.",
        },
      });
    }

    const adjustedSemester = semester === "10+" ? 11 : parseInt(semester, 10);

    pool = await connect(config);

    await pool.request()
      .input("programs", VarChar, programs)
      .input("secondaryPrograms", VarChar, secondaryPrograms)
      .input("semester", Int, adjustedSemester)
      .input("correo", VarChar, email)
      .query(`
        UPDATE persona
        SET semestre = @semester, pregrado = @programs, pregrado_2 = @secondaryPrograms
        WHERE correo = @correo;
      `);

    return res.status(200).json({
      notification: {
        type: "success",
        message: "Información guardada con éxito.",
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