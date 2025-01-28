import { NextApiRequest, NextApiResponse } from "next";
import sql, { config as SqlConfig, ConnectionPool } from "mssql";
import {verifyJwtFromCookies} from "../cookieManagement";

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
    pool = await sql.connect(config);

    if (req.method === "POST") {
      const { date } = req.body as {
        date: string;
      };
      const { talk } = req.body as {
        talk: string;
      };
      const { asesor } = req.body as {
        asesor: string;
      };

      const groupId = 1; // ID del grupo seleccionado
      const email = verifyJwtFromCookies(req, res);

      console.log("Solicitud recibida con datos:", { date, talk, asesor });

      const capacityResult = await pool.request()
        .input("day_of_week", sql.VarChar, date)
        .input("start_time", sql.VarChar, talk)
        .query(`
          SELECT slot_id, capacity
          FROM dbo.pre_assessment_slot
          WHERE day_of_week = @day_of_week AND start_time = @start_time
        `);

      console.log("Resultado de la consulta SQL para capacidad:", capacityResult.recordset);

      const slot = capacityResult.recordset[0];
      const capacity = slot?.capacity;
      const slotId = slot?.slot_id;

      if (capacity === undefined || capacity == 0) {
        console.error("No hay capacidad disponible para la fecha y hora seleccionadas.");
        return res.status(400).json({
          notification: {
            type: "error",
            message: "No hay capacidad disponible para la fecha y hora seleccionadas."
          },
          frontendAction: {
            showNotification: true,
            notificationType: "error",
            notificationMessage: "No hay capacidad disponible para la fecha y hora seleccionadas."
          }
        });
      }

      console.log("Capacidad disponible, actualizando capacidad del slot con ID:", slotId);

      // Resta 1 a la capacidad del slot
      await pool.request()
        .input("slot_id", sql.Int, slotId)
        .query(`
          UPDATE dbo.pre_assessment_slot
          SET capacity = capacity - 1
          WHERE slot_id = @slot_id
        `);

      console.log("Capacidad actualizada exitosamente para el slot con ID:", slotId);

      // Inserta los datos en la tabla club_in
      await pool.request()
        .input("id_grupo", sql.Int, groupId)
        .input("correo", sql.VarChar, email)
        .input("slot_id", sql.Int, slotId)
        .input("asesor", sql.VarChar, asesor)
        .query(`
          INSERT INTO dbo.club_in (id_grupo, correo, slot_id, asesor)
          VALUES (@id_grupo, @correo, @slot_id, @asesor)
        `);

      console.log("Datos insertados exitosamente en la tabla club_in.");

      return res.status(200).json({
        notification: {
          type: "success",
          message: "Reserva realizada con éxito y capacidad actualizada."
        }
      });
    } 
    
    else if (req.method === "GET") {
      console.log("Solicitud GET recibida, obteniendo todos los registros de la tabla persona.");
      const result = await pool.request().query("SELECT * FROM persona");
      return res.status(200).json(result.recordset);
    } else {
      console.error("Método no permitido: ", req.method);
      return res.status(405).json({ message: "Método no permitido" });
    }
  } 

  catch (err) {
    console.error("Error en la conexión SQL:", err);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error interno del servidor. Inténtelo de nuevo más tarde."
      },
      details: (err instanceof Error) ? err.message : String(err)
    });
  } finally {
    if (pool) {
      console.log("Cerrando conexión SQL.");
      pool.close();
    }
  }
}
