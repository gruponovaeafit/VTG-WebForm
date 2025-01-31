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

      const capacityResult = await pool.request()
        .input("day_of_week", VarChar, date)
        .input("start_time", VarChar, talk)
        .query(`
          SELECT slot_id, capacity
          FROM dbo.pre_assessment_slot
          WHERE day_of_week = @day_of_week AND start_time = @start_time
        `);

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
        .input("slot_id", Int, slotId)
        .query(`
          UPDATE dbo.pre_assessment_slot
          SET capacity = capacity - 1
          WHERE slot_id = @slot_id
        `);

      // Inserta los datos en la tabla club_in
      try {
        await pool.request()
          .input("id_grupo", Int, groupId)
          .input("correo", VarChar, email)
          .input("slot_id", Int, slotId)
          .input("asesor", VarChar, asesor)
          .query(`
            INSERT INTO dbo.club_in (id_grupo, correo, slot_id, asesor)
            VALUES (@id_grupo, @correo, @slot_id, @asesor)
          `);

        return res.status(200).json({
          notification: {
            type: "success",
            message: "Formulario enviado con éxito."
          }
        });
      } catch (insertError) {
        if (insertError instanceof Error && insertError.message.includes("Violation of PRIMARY KEY constraint")) {
          console.error("El usuario ya está registrado en Club IN.");
          return res.status(400).json({
            notification: {
              type: "error",
              message: "Ya estás registrado en Club IN."
            }
          });
        }
        throw insertError;
      }
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
