import { NextApiRequest, NextApiResponse } from "next";
import { connect, Int, VarChar, config as SqlConfig, ConnectionPool } from "mssql";
import { verifyJwtFromCookies } from "../cookieManagement";

const recentRequests = new Map<string, number>();

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

  console.log("🔧 Nueva solicitud recibida:", req.method);

  try {
    pool = await connect(config);
    console.log("✅ Conexión a base de datos establecida");

    if (req.method === "POST") {
      const { date, talk, asesor } = req.body;
      console.log("📩 Datos recibidos:", { date, talk, asesor });

      const groupId = 1;
      const email = verifyJwtFromCookies(req, res);
      console.log("📧 Correo verificado:", email);

      if (!email || !date || !talk || !asesor) {
        console.warn("⚠️ Datos faltantes o usuario no autenticado");
        return res.status(400).json({
          notification: {
            type: "error",
            message: "Datos incompletos o sesión inválida.",
          },
        });
      }

      const now = Date.now();
      const lastRequest = recentRequests.get(email);
      if (lastRequest && now - lastRequest < 5000) {
        console.warn("⏱️ Petición repetida muy rápido");
        return res.status(429).json({
          notification: {
            type: "warning",
            message: "Por favor espera unos segundos antes de volver a intentarlo.",
          },
        });
      }
      recentRequests.set(email, now);

      const transaction = pool.transaction();
      await transaction.begin();
      console.log("🔁 Transacción iniciada");

      const personaCheck = await transaction.request()
        .input("correo", VarChar, email)
        .query(`SELECT 1 FROM dbo.persona WHERE correo = @correo`);
      if (personaCheck.recordset.length === 0) {
        console.error("❌ El correo no existe en la tabla persona");
        await transaction.rollback();
        return res.status(400).json({
          notification: {
            type: "error",
            message: "Tu correo no está registrado en el sistema.",
          },
        });
      }
      console.log("✅ Correo válido en persona");

      const capacityResult = await transaction.request()
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

      console.log("🪑 Slot encontrado:", slot);

      if (!slotId || capacity === undefined || capacity <= 0) {
        console.warn("🚫 No hay capacidad disponible");
        await transaction.rollback();
        return res.status(400).json({
          notification: {
            type: "error",
            message: "No hay capacidad disponible para la fecha y hora seleccionadas.",
          },
        });
      }

      const alreadyRegistered = await transaction.request()
        .input("correo", VarChar, email)
        .input("slot_id", Int, slotId)
        .query(`SELECT 1 FROM dbo.club_in WHERE correo = @correo AND slot_id = @slot_id`);

      if (alreadyRegistered.recordset.length > 0) {
        console.warn("🚫 Usuario ya registrado en este slot");
        await transaction.rollback();
        return res.status(400).json({
          notification: {
            type: "error",
            message: "Ya estás registrado en esta charla.",
          },
        });
      }

      console.log("➖ Actualizando capacidad...");
      await transaction.request()
        .input("slot_id", Int, slotId)
        .query(`UPDATE dbo.pre_assessment_slot SET capacity = capacity - 1 WHERE slot_id = @slot_id`);

      console.log("📝 Insertando en club_in...");
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
      console.log("✅ Transacción completada con éxito");

      return res.status(200).json({
        notification: {
          type: "success",
          message: "Reserva realizada con éxito.",
        },
      });
    } else if (req.method === "GET") {
        console.log("📥 Solicitud GET para obtener horarios disponibles");

        const result = await pool.request().query(`
          SELECT 
            day_of_week, 
            start_time, 
            capacity 
          FROM dbo.pre_assessment_slot
          WHERE capacity > 0
          ORDER BY day_of_week, start_time
        `);

        console.log("📦 Resultados de horarios disponibles:", result.recordset);

        return res.status(200).json({
          success: true,
          data: result.recordset
        });
      }


    console.warn("❌ Método no permitido:", req.method);
    return res.status(405).json({ message: "Método no permitido" });

  } catch (err) {
    console.error("🔥 Error inesperado:", err);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error interno del servidor. Inténtelo de nuevo más tarde.",
      },
      details: err instanceof Error ? err.message : String(err),
    });
  } finally {
    if (pool) {
      console.log("🔌 Cerrando conexión SQL");
      pool.close();
    }
  }
}
