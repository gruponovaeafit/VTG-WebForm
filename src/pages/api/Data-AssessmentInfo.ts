import type { NextApiRequest, NextApiResponse } from "next";
import { connect, VarChar, config as SqlConfig } from "mssql";
import type { ConnectionPool } from "mssql";
import { parse } from "cookie";
import jwt from "jsonwebtoken";

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
        message: "Método no permitido.",
      },
    });
  }

  let pool: ConnectionPool | null = null;

  try {
    // 1) Extraemos los campos del body (SIN token)
    const { foodRestrictions, healthConsiderations } = req.body;

    // 2) Obtener email desde la cookie (jwtToken)
    const { cookie } = req.headers;
    if (!cookie) {
      return res.status(401).json({
        notification: {
          type: "error",
          message: "No se encontró cookie en la petición.",
        },
      });
    }

    const parsedCookies = parse(cookie);
    const jwtToken = parsedCookies.jwtToken;
    if (!jwtToken) {
      return res.status(401).json({
        notification: {
          type: "error",
          message: "No se encontró jwtToken en las cookies.",
        },
      });
    }

    // Decodificar el JWT para extraer el correo
    let decoded;
    try {
      decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY as string) as { email: string };
    } catch (error) {
      return res.status(401).json({
        notification: {
          type: "error",
          message: "JWT inválido o expirado.",
        },
      });
    }

    const email = decoded.email;
    if (!email) {
      return res.status(401).json({
        notification: {
          type: "error",
          message: "No se pudo obtener el email del JWT.",
        },
      });
    }

    // Validar que los campos existan
    if (!foodRestrictions || !healthConsiderations) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "Faltan campos requeridos en el formulario.",
        },
      });
    }

    // 3) Conexión a la base de datos
    pool = await connect(config);

    // 4) Revisar si ya existe un registro en assessment_nova con ese correo
    const existing = await pool.request()
      .input("correo", VarChar, email)
      .query("SELECT correo FROM assessment_nova WHERE correo = @correo");

    // 5) Si existe => UPDATE, si no => INSERT
    if (existing.recordset.length > 0) {
      await pool.request()
        .input("correo", VarChar, email)
        .input("restriccion", VarChar, foodRestrictions)
        .input("salud", VarChar, healthConsiderations)
        .query(`
          UPDATE assessment_nova
          SET restriccion_alimentaria = @restriccion,
              consideracion_salud = @salud
          WHERE correo = @correo
        `);
    } else {
      await pool.request()
        .input("correo", VarChar, email)
        .input("restriccion", VarChar, foodRestrictions)
        .input("salud", VarChar, healthConsiderations)
        .query(`
          INSERT INTO assessment_nova (correo, asistencia, restriccion_alimentaria, consideracion_salud)
          VALUES (@correo, 'Si', @restriccion, @salud)
        `);
      // Ajusta 'asistencia' según la lógica que manejes (por ejemplo 'Si' / 'No'). 
    }

    // 6) Devolver resultado y la ruta para redirigir
    return res.status(200).json({
      notification: {
        type: "success",
        message: "Información guardada con éxito.",
      },
      redirectUrl: "/talk_animation", // Ajusta la ruta que necesites
    });
  } catch (error) {
    console.error("Error en el servidor:", error);
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
