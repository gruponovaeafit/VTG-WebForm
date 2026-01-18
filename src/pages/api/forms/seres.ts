import { NextApiRequest, NextApiResponse } from "next";
import { dbQuery, getPool } from "../db";
import { verifyJwtFromCookies } from "../cookieManagement";

const recentRequests = new Map<string, number>();

// Constantes para queries SQL (PostgreSQL)
const QUERIES = {
  CHECK_PERSONA: `SELECT 1 FROM persona WHERE correo = $1`,
  GET_TALK_SLOT_CAPACITY: `
    SELECT talk_id, capacity, day_of_week, start_time
    FROM talk_slot
    WHERE day_of_week = $1 AND start_time = $2
  `,
  CHECK_EXISTING_REGISTRATION: `SELECT 1 FROM seres WHERE correo = $1 AND talk_id = $2`,
  UPDATE_TALK_SLOT_CAPACITY: `UPDATE talk_slot SET capacity = capacity - 1 WHERE talk_id = $1`,
  INSERT_SERES: `
    INSERT INTO seres (id_grupo, correo, charla, talk_id)
    VALUES ($1, $2, $3, $4)
  `,
  GET_AVAILABLE_TALKS: `
    SELECT 
      talk_id,
      day_of_week,
      start_time, 
      capacity 
    FROM talk_slot
    WHERE capacity > 0
    ORDER BY day_of_week, start_time
  `,
} as const;

// Funciones helper para queries (PostgreSQL)
async function checkPersonaExists(client: any, email: string): Promise<boolean> {
  const result = await client.query(QUERIES.CHECK_PERSONA, [email]);
  return result.rows.length > 0;
}

async function getTalkSlotCapacity(client: any, dayOfWeek: string, startTime: string) {
  const result = await client.query(QUERIES.GET_TALK_SLOT_CAPACITY, [dayOfWeek, startTime]);
  return result.rows[0];
}

async function checkExistingRegistration(client: any, email: string, talkId: number): Promise<boolean> {
  const result = await client.query(QUERIES.CHECK_EXISTING_REGISTRATION, [email, talkId]);
  return result.rows.length > 0;
}

async function updateTalkSlotCapacity(client: any, talkId: number): Promise<void> {
  await client.query(QUERIES.UPDATE_TALK_SLOT_CAPACITY, [talkId]);
}

async function insertSeresRegistration(
  client: any,
  groupId: number,
  email: string,
  charla: string,
  talkId: number
): Promise<void> {
  await client.query(QUERIES.INSERT_SERES, [groupId, email, charla, talkId]);
}

async function getAvailableTalks() {
  try {
    console.log("🔍 Ejecutando query para obtener charlas disponibles...");
    const result = await dbQuery(QUERIES.GET_AVAILABLE_TALKS);
    console.log("✅ Query ejecutada exitosamente. Registros encontrados:", result.rows.length);
    return result.rows;
  } catch (error) {
    console.error("❌ Error en getAvailableTalks:", error);
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("🔧 Nueva solicitud recibida:", req.method);

  try {
    if (req.method === "POST") {
      const { talk } = req.body;
      console.log("📩 Datos recibidos:", { talk });

      const groupId = 9;
      const email = verifyJwtFromCookies(req, res);
      console.log("📧 Correo verificado:", email);

      if (!email || !talk) {
        console.warn("⚠️ Datos faltantes o usuario no autenticado");
        return res.status(400).json({
          notification: {
            type: "error",
            message: "Datos incompletos o sesión inválida.",
          },
        });
      }

      // Parsear el string de talk para extraer day_of_week y start_time
      // Formato esperado: "Vie. 30 ene, 9-10 a.m." -> day_of_week: "Vie. 30 ene", start_time: "9-10 a.m."
      const talkParts = talk.split(", ");
      if (talkParts.length !== 2) {
        console.warn("⚠️ Formato de charla inválido:", talk);
        return res.status(400).json({
          notification: {
            type: "error",
            message: "Formato de charla inválido.",
          },
        });
      }
      const dayOfWeek = talkParts[0].trim();
      const startTime = talkParts[1].trim();

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

        // Obtener información del talk_slot y capacidad
        const talkSlot = await getTalkSlotCapacity(client, dayOfWeek, startTime);
        const capacity = talkSlot?.capacity;
        const talkId = talkSlot?.talk_id;

        console.log("🪑 Talk slot encontrado:", talkSlot);

        if (!talkId || capacity === undefined || capacity <= 0) {
          console.warn("🚫 No hay capacidad disponible");
          await client.query("ROLLBACK");
          return res.status(400).json({
            notification: {
              type: "error",
              message: "No hay capacidad disponible para la charla seleccionada.",
            },
          });
        }

        // Verificar si el usuario ya está registrado en este talk_slot
        const isAlreadyRegistered = await checkExistingRegistration(client, email, talkId);
        if (isAlreadyRegistered) {
          console.warn("🚫 Usuario ya registrado en este talk_slot");
          await client.query("ROLLBACK");
          return res.status(400).json({
            notification: {
              type: "error",
              message: "Ya estás registrado en este grupo.",
            },
          });
        }

        // Actualizar capacidad del talk_slot
        console.log("➖ Actualizando capacidad...");
        await updateTalkSlotCapacity(client, talkId);

        // Insertar registro en seres
        console.log("📝 Insertando en seres...");
        await insertSeresRegistration(client, groupId, email, talk, talkId);

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
      console.log("📥 Solicitud GET para obtener charlas disponibles");

      try {
        console.log("🔍 Query a ejecutar:", QUERIES.GET_AVAILABLE_TALKS);
        const availableTalks = await getAvailableTalks();
        console.log("📦 Resultados de charlas disponibles:", JSON.stringify(availableTalks, null, 2));
        console.log("📊 Número de registros:", availableTalks?.length || 0);

        return res.status(200).json({
          success: true,
          data: availableTalks || []
        });
      } catch (getError: any) {
        console.error("🔥 Error al obtener charlas disponibles:", getError);
        console.error("🔥 Detalles del error:", {
          message: getError?.message,
          code: getError?.code,
          detail: getError?.detail
        });
        return res.status(500).json({
          success: false,
          error: getError?.message || "Error al obtener las charlas disponibles",
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
