import { NextApiRequest, NextApiResponse } from "next";
import { dbQuery, getPool } from "../db";
import { verifyJwtFromCookies } from "../cookieManagement";

const recentRequests = new Map<string, number>();

// Constantes para queries SQL (PostgreSQL)
const QUERIES = {
  CHECK_PERSONA: `SELECT 1 FROM persona WHERE correo = $1`,
  GET_SLOT_CAPACITY: `
    SELECT slot_id, capacity
    FROM pre_assessment_slot
    WHERE day_of_week = $1 AND start_time = $2
  `,
  CHECK_EXISTING_REGISTRATION: `SELECT 1 FROM club_in WHERE correo = $1 AND slot_id = $2`,
  UPDATE_SLOT_CAPACITY: `UPDATE pre_assessment_slot SET capacity = capacity - 1 WHERE slot_id = $1`,
  INSERT_CLUB_IN: `
    INSERT INTO club_in (id_grupo, correo, slot_id)
    VALUES ($1, $2, $3)
  `,
  GET_AVAILABLE_SLOTS: `
    SELECT 
      slot_id,
      day_of_week, 
      start_time, 
      capacity 
    FROM pre_assessment_slot
    WHERE capacity > 0
    ORDER BY day_of_week, start_time
  `,
} as const;

// Funciones helper para queries (PostgreSQL)
async function checkPersonaExists(client: any, email: string): Promise<boolean> {
  const result = await client.query(QUERIES.CHECK_PERSONA, [email]);
  return result.rows.length > 0;
}

async function getSlotCapacity(client: any, date: string, talk: string) {
  const result = await client.query(QUERIES.GET_SLOT_CAPACITY, [date, talk]);
  return result.rows[0];
}

async function checkExistingRegistration(client: any, email: string, slotId: number): Promise<boolean> {
  const result = await client.query(QUERIES.CHECK_EXISTING_REGISTRATION, [email, slotId]);
  return result.rows.length > 0;
}

async function updateSlotCapacity(client: any, slotId: number): Promise<void> {
  await client.query(QUERIES.UPDATE_SLOT_CAPACITY, [slotId]);
}

async function insertClubInRegistration(
  client: any,
  groupId: number,
  email: string,
  slotId: number
): Promise<void> {
  await client.query(QUERIES.INSERT_CLUB_IN, [groupId, email, slotId]);
}

async function getAvailableSlots() {
  try {
    console.log("🔍 Ejecutando query para obtener slots disponibles...");
    const result = await dbQuery(QUERIES.GET_AVAILABLE_SLOTS);
    console.log("✅ Query ejecutada exitosamente. Registros encontrados:", result.rows.length);
    return result.rows;
  } catch (error) {
    console.error("❌ Error en getAvailableSlots:", error);
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("🔧 Nueva solicitud recibida:", req.method);

  try {
    if (req.method === "POST") {
      const { date, talk } = req.body;
      console.log("📩 Datos recibidos:", { date, talk });

      const groupId = 1;
      const email = verifyJwtFromCookies(req, res);
      console.log("📧 Correo verificado:", email);

      if (!email || !date || !talk) {
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

      const pool = getPool();
      const client = await pool.connect();
      
      try {
        await client.query("BEGIN");
        console.log("🔁 Transacción iniciada");

        // Validar que el correo existe en la tabla persona
        const personaExists = await checkPersonaExists(client, email);
        if (!personaExists) {
          console.error("❌ El correo no existe en la tabla persona");
          await client.query("ROLLBACK");
          return res.status(400).json({
            notification: {
              type: "error",
              message: "Tu correo no está registrado en el sistema.",
            },
          });
        }
        console.log("✅ Correo válido en persona");

        // Obtener información del slot y capacidad
        const slot = await getSlotCapacity(client, date, talk);
        const capacity = slot?.capacity;
        const slotId = slot?.slot_id;

        console.log("🪑 Slot encontrado:", slot);

        if (!slotId || capacity === undefined || capacity <= 0) {
          console.warn("🚫 No hay capacidad disponible");
          await client.query("ROLLBACK");
          return res.status(400).json({
            notification: {
              type: "error",
              message: "No hay capacidad disponible para la fecha y hora seleccionadas.",
            },
          });
        }

        // Verificar si el usuario ya está registrado en este slot
        const isAlreadyRegistered = await checkExistingRegistration(client, email, slotId);
        if (isAlreadyRegistered) {
          console.warn("🚫 Usuario ya registrado en este slot");
          await client.query("ROLLBACK");
          return res.status(400).json({
            notification: {
              type: "error",
              message: "Ya estás registrado en este grupo.",
            },
          });
        }

        // Actualizar capacidad del slot
        console.log("➖ Actualizando capacidad...");
        await updateSlotCapacity(client, slotId);

        // Insertar registro en club_in
        console.log("📝 Insertando en club_in...");
        await insertClubInRegistration(client, groupId, email, slotId);

        await client.query("COMMIT");
        console.log("✅ Transacción completada con éxito");

        return res.status(200).json({
          notification: {
            type: "success",
            message: "Reserva realizada con éxito.",
          },
        });
      } catch (transactionError) {
        await client.query("ROLLBACK");
        throw transactionError;
      } finally {
        client.release();
      }
    } else if (req.method === "GET") {
      console.log("📥 Solicitud GET para obtener horarios disponibles");

      try {
        console.log("🔍 Query a ejecutar:", QUERIES.GET_AVAILABLE_SLOTS);
        const availableSlots = await getAvailableSlots();
        console.log("📦 Resultados de horarios disponibles:", JSON.stringify(availableSlots, null, 2));
        console.log("📊 Número de registros:", availableSlots?.length || 0);

        return res.status(200).json({
          success: true,
          data: availableSlots || []
        });
      } catch (getError: any) {
        console.error("🔥 Error al obtener horarios disponibles:", getError);
        console.error("🔥 Detalles del error:", {
          message: getError?.message,
          code: getError?.code,
          detail: getError?.detail
        });
        return res.status(500).json({
          success: false,
          error: getError?.message || "Error al obtener los horarios disponibles",
          data: []
        });
      }
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
  }
}
