import type { NextApiRequest, NextApiResponse } from "next";
import { connect, VarChar, config as SqlConfig } from "mssql";
import type { ConnectionPool } from "mssql";
import { verifyJwtFromCookies } from "./cookieManagement"; // <-- Ajusta la ruta a tu helper
import { decryptRequestBody } from "./lib/decrypt";

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
    // Desencriptar el body si viene encriptado
    const decryptResult = decryptRequestBody(req);
    if (!decryptResult.success) {
      return res.status(400).json({
        notification: { type: "error", message: decryptResult.error || "Error al procesar los datos." },
      });
    }
    
    const { talk } = req.body;

    // 1) Obtener el email desde el JWT en las cookies
    const email = verifyJwtFromCookies(req, res);
    if (!email) {
      return res.status(401).json({
        notification: {
          type: "error",
          message: "No se pudo obtener el email (JWT no válido o ausente).",
        },
      });
    }

    // 2) Verificar que "talk" sea válido
    if (!talk || !["Si", "No"].includes(talk)) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "El campo 'talk' es obligatorio y debe ser 'Si' o 'No'.",
        },
      });
    }

    // 3) Conexión a BD
    pool = await connect(config);

    // 4) Revisar si ya existe un registro en assessment_nova con ese correo
    const existing = await pool.request()
      .input("correo", VarChar, email)
      .query("SELECT correo FROM assessment_nova WHERE correo = @correo");

    // 5) Si existe => UPDATE, si no => INSERT
    if (existing.recordset.length > 0) {
      await pool.request()
        .input("correo", VarChar, email)
        .input("asistencia", VarChar, talk)
        .query(`
          UPDATE assessment_nova
          SET asistencia = @asistencia
          WHERE correo = @correo
        `);
    } else {
      await pool.request()
        .input("correo", VarChar, email)
        .input("asistencia", VarChar, talk)
        .query(`
          INSERT INTO assessment_nova (correo, asistencia)
          VALUES (@correo, @asistencia)
        `);
    }

    // 6) Decidir la ruta de redirección según la respuesta
    const redirectUrl = talk === "Si" ? "/assessment" : "/90+1";

    return res.status(200).json({
      notification: {
        type: "success",
        message: "Respuesta registrada con éxito.",
      },
      redirectUrl,
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
      await pool.close();
    }
  }
}
