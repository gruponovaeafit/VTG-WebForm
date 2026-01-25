import type { NextApiRequest, NextApiResponse } from "next";
import { dbQuery, withTransaction } from "../db";
import { verifyJwtFromCookies } from "../cookieManagement";
import { decryptRequestBody } from "@/lib/decrypt";

const recentRequests = new Map<string, number>();

const QUERIES = {
  CHECK_PERSONA: `
    SELECT 1 
    FROM persona 
    WHERE correo = $1
  `,

  // Bloquea la fila para evitar carreras de cupos
  GET_SLOT_FOR_UPDATE: `
    SELECT slot_id, capacity
    FROM pre_assessment_slot
    WHERE day_of_week = $1 
      AND start_time = $2
    FOR UPDATE
  `,

  // ❗ No puede estar inscrito en NINGÚN otro preassessment
  CHECK_ANY_REGISTRATION: `
    SELECT 1 
    FROM club_in 
    WHERE correo = $1
    LIMIT 1
  `,

  // Update seguro (solo si hay cupos)
  UPDATE_SLOT_CAPACITY_SAFE: `
    UPDATE pre_assessment_slot
    SET capacity = capacity - 1
    WHERE slot_id = $1 
      AND capacity > 0
    RETURNING capacity
  `,

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

async function getAvailableSlots() {
  const result = await dbQuery(QUERIES.GET_AVAILABLE_SLOTS);
  return result.rows;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      // Desencriptar el body si viene encriptado
      const decryptResult = decryptRequestBody(req);
      if (!decryptResult.success) {
        return res.status(400).json({
          notification: { type: "error", message: decryptResult.error || "Error al procesar los datos." },
        });
      }
      
      const { date, talk } = req.body as { date?: string; talk?: string };

      const groupId = 1;
      const email = verifyJwtFromCookies(req, res);

      if (!email || !date || !talk) {
        return res.status(400).json({
          notification: { type: "error", message: "Datos incompletos o sesión inválida." },
        });
      }

      // Anti-spam simple
      const now = Date.now();
      const lastRequest = recentRequests.get(email);
      if (lastRequest && now - lastRequest < 5000) {
        return res.status(429).json({
          notification: {
            type: "warning",
            message: "Por favor espera unos segundos antes de volver a intentarlo.",
          },
        });
      }
      recentRequests.set(email, now);

      try {
        await withTransaction(async (client) => {
          // 1) Persona existe
          const personaRes = await client.query(QUERIES.CHECK_PERSONA, [email]);
          if (personaRes.rows.length === 0) {
            throw Object.assign(new Error("EMAIL_NOT_REGISTERED"), { code: "EMAIL_NOT_REGISTERED" });
          }

          // 2) No puede estar inscrito en otro preassessment
          const anyReg = await client.query(QUERIES.CHECK_ANY_REGISTRATION, [email]);
          if (anyReg.rows.length > 0) {
            throw Object.assign(new Error("ALREADY_REGISTERED"), { code: "ALREADY_REGISTERED" });
          }

          // 3) Bloquear slot
          const slotRes = await client.query(QUERIES.GET_SLOT_FOR_UPDATE, [date, talk]);
          const slot = slotRes.rows[0];
          const slotId = slot?.slot_id;
          const capacity = slot?.capacity;

          if (!slotId || capacity === undefined || capacity <= 0) {
            throw Object.assign(new Error("NO_CAPACITY"), { code: "NO_CAPACITY" });
          }

          // 4) Reducir cupo (seguro)
          const upd = await client.query(QUERIES.UPDATE_SLOT_CAPACITY_SAFE, [slotId]);
          if (upd.rows.length === 0) {
            throw Object.assign(new Error("NO_CAPACITY"), { code: "NO_CAPACITY" });
          }

          // 5) Insertar inscripción
          await client.query(QUERIES.INSERT_CLUB_IN, [groupId, email, slotId]);
        });

        return res.status(200).json({
          notification: { type: "success", message: "Reserva realizada con éxito." },
        });
      } catch (err: any) {
        if (err?.code === "EMAIL_NOT_REGISTERED") {
          return res.status(400).json({
            notification: { type: "error", message: "Tu correo no está registrado en el sistema." },
          });
        }
        if (err?.code === "ALREADY_REGISTERED") {
          return res.status(400).json({
            notification: { type: "error", message: "Ya estás registrado en un preassessment." },
          });
        }
        if (err?.code === "NO_CAPACITY") {
          return res.status(400).json({
            notification: {
              type: "error",
              message: "No hay capacidad disponible para la fecha y hora seleccionadas.",
            },
          });
        }
        throw err;
      }
    }

    if (req.method === "GET") {
      const availableSlots = await getAvailableSlots();
      return res.status(200).json({
        success: true,
        data: availableSlots || [],
      });
    }

    return res.status(405).json({
      notification: {
        type: "error",
        message: "Método no permitido.",
      },
    });

  } catch (err) {
    console.error("🔥 Error inesperado:", err);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error interno del servidor.",
      },
      details: err instanceof Error ? err.message : String(err),
    });
  }
}
