import { NextApiRequest, NextApiResponse } from "next";
import { connect, Int, VarChar, config as SqlConfig, ConnectionPool } from "mssql";
import { verifyJwtFromCookies } from "../cookieManagement";

const recentRequests = new Map<string, number>(); // simple memory cache

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
      const { date, talk, asesor } = req.body;
      const groupId = 1;
      const email = verifyJwtFromCookies(req, res);

      if (!email) {
        return res.status(401).json({
          notification: {
            type: "error",
            message: "No se pudo verificar el usuario."
          }
        });
      }

      // 🕒 Prevención de spam: rechazo si hace doble clic muy rápido
      const now = Date.now();
      const lastRequest = recentRequests.get(email);
      if (lastRequest && now - lastRequest < 5000) {
        return res.status(429).json({
          notification: {
            type: "warning",
            message: "Por favor espera unos segundos antes de volver a intentarlo."
          }
        });
      }
      recentRequests.set(email, now);

      // Comienza una transacción
      const transaction = pool.transaction();
      await transaction.begin();

      const checkCapacity = await transaction.request()
        .input("day_of_week", VarChar, date)
        .input("start_time", VarChar, talk)
        .query(`
          SELECT slot_id, capacity FROM dbo.pre_assessment_slot
          WHERE day_of_week = @day_of_week AND start_time = @start_time
        `);

      const slot = checkCapacity.recordset[0];
      const capacity = slot?.capacity;
      const slotId = slot?.slot_id;

      if (!slotId) {
          await transaction.rollback();
          return res.status(400).json({
            notification: {
              type: "error",
              message: "No se encontró el horario seleccionado."
            }
          });
        }

        if (capacity === undefined || capacity <= 0) {
          await transaction.rollback();
          return res.status(400).json({
            notification: {
              type: "error",
              message: "No hay capacidad disponible para la fecha y hora seleccionadas."
            }
          });
        }


      // Verifica si el usuario ya está inscrito
      const alreadyRegistered = await transaction.request()
        .input("correo", VarChar, email)
        .input("slot_id", Int, slotId)
        .query(`
          SELECT 1 FROM dbo.club_in WHERE correo = @correo AND slot_id = @slot_id
        `);

      if (alreadyRegistered.recordset.length > 0) {
        await transaction.rollback();
        return res.status(400).json({
          notification: {
            type: "error",
            message: "Ya estás registrado en alguna charla."
          }
        });
      }

      // Resta capacidad
      await transaction.request()
        .input("slot_id", Int, slotId)
        .query(`
          UPDATE dbo.pre_assessment_slot
          SET capacity = capacity - 1
          WHERE slot_id = @slot_id
        `);

      // Inserta en club_in
      await transaction.request()
        .input("id_grupo", Int, groupId)
        .input("correo", VarChar, email)
        .input("slot_id", Int, slotId)
        .input("asesor", VarChar, asesor)
        .query(`
          INSERT INTO dbo.club_in (id_grupo, correo, slot_id, asesor)
          VALUES (@id_grupo, @correo, @slot_id, @asesor)
        `);

      await transaction.commit();

      return res.status(200).json({
        notification: {
          type: "success",
          message: "Reserva realizada con éxito."
        }
      });
    }

    // GET para obtener registros de persona (sin cambios)
    else if (req.method === "GET") {
      const result = await pool.request().query("SELECT * FROM persona");
      return res.status(200).json(result.recordset);
    }

    return res.status(405).json({ message: "Método no permitido" });

  } catch (err) {
    console.error("Error en la conexión SQL:", err);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error interno del servidor. Inténtelo de nuevo más tarde."
      },
      details: (err instanceof Error) ? err.message : String(err)
    });
  } finally {
    if (pool) pool.close();
  }
}
