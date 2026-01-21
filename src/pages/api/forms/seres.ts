import type { NextApiRequest, NextApiResponse } from "next";
import { verifyJwtFromCookies } from "../cookieManagement";
import { dbQuery, withTransaction } from "../db";

const recentRequests = new Map<string, number>();

const QUERIES = {
  CHECK_PERSONA: `SELECT 1 FROM persona WHERE correo = $1 LIMIT 1`,

  // Lock del slot para evitar carreras
  GET_TALK_SLOT_FOR_UPDATE: `
    SELECT talk_id, capacity
    FROM talk_slot
    WHERE day_of_week = $1 AND start_time = $2
    FOR UPDATE
  `,

  // Si ya está registrado en SERES (independiente del talk_id)
  CHECK_ALREADY_IN_GROUP: `
    SELECT 1
    FROM seres
    WHERE correo = $1 AND id_grupo = $2
    LIMIT 1
  `,

  // Decrement seguro
  DECREMENT_CAPACITY_IF_AVAILABLE: `
    UPDATE talk_slot
    SET capacity = capacity - 1
    WHERE talk_id = $1 AND capacity > 0
    RETURNING capacity
  `,

  INSERT_SERES: `
    INSERT INTO seres (id_grupo, correo, charla, talk_id)
    VALUES ($1, $2, $3, $4)
  `,

  GET_AVAILABLE_TALKS: `
    SELECT talk_id, day_of_week, start_time, capacity
    FROM talk_slot
    WHERE capacity > 0
    ORDER BY day_of_week, start_time
  `,
} as const;

function parseTalk(talk: string): { dayOfWeek: string; startTime: string } | null {
  const parts = talk.split(", ");
  if (parts.length !== 2) return null;

  const dayOfWeek = parts[0]?.trim();
  const startTime = parts[1]?.trim();

  if (!dayOfWeek || !startTime) return null;
  return { dayOfWeek, startTime };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const result = await dbQuery(QUERIES.GET_AVAILABLE_TALKS);
      return res.status(200).json({
        success: true,
        data: result.rows ?? [],
      });
    }

    if (req.method !== "POST") {
      return res.status(405).json({
        notification: { 
          type: "error", 
          message: "Método no permitido." },
      });
    }

    const groupId = 2;

    // 1) Email desde JWT cookie
    const emailRaw = verifyJwtFromCookies(req, res);
    const email = String(emailRaw ?? "").toLowerCase().trim();

    if (!email) {
      return res.status(401).json({
        notification: { type: "error", message: "Sesión inválida o expirada." },
      });
    }

    // 2) talk
    const talk = String(req.body?.talk ?? "").trim();
    if (!talk) {
      return res.status(400).json({
        notification: { type: "error", message: "Debes seleccionar una charla informativa." },
      });
    }

    const parsed = parseTalk(talk);
    if (!parsed) {
      return res.status(400).json({
        notification: { type: "error", message: "Formato de charla inválido." },
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

    const tx = await withTransaction(async (client) => {
      // A) Persona existe
      const persona = await client.query(QUERIES.CHECK_PERSONA, [email]);
      if (persona.rows.length === 0) {
        return { ok: false as const, code: 400, msg: "Tu correo no está registrado en el sistema." };
      }

      // B) Ya está registrado en SERES (no debería poder repetir)
      const already = await client.query(QUERIES.CHECK_ALREADY_IN_GROUP, [email, groupId]);
      if (already.rows.length > 0) {
        return { ok: false as const, code: 400, msg: "Ya estás registrado en este grupo." };
      }

      // C) Lock del slot seleccionado
      const slotRes = await client.query(QUERIES.GET_TALK_SLOT_FOR_UPDATE, [
        parsed.dayOfWeek,
        parsed.startTime,
      ]);

      const slot = slotRes.rows[0];
      if (!slot?.talk_id) {
        return { ok: false as const, code: 400, msg: "La charla seleccionada no existe." };
      }

      // D) Descontar cupo de forma segura
      const dec = await client.query(QUERIES.DECREMENT_CAPACITY_IF_AVAILABLE, [slot.talk_id]);
      if (dec.rows.length === 0) {
        return { ok: false as const, code: 400, msg: "No hay cupo disponible para la charla seleccionada." };
      }

      // E) Insert final
      await client.query(QUERIES.INSERT_SERES, [groupId, email, talk, slot.talk_id]);

      return { ok: true as const };
    });

    if (!tx.ok) {
      return res.status(tx.code).json({
        notification: { type: "error", message: tx.msg },
      });
    }

    return res.status(200).json({
      notification: { type: "success", message: "Reserva realizada con éxito." },
    });
  } catch (err) {
    console.error("🔥 Error en /api/forms/seres:", err);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error interno del servidor.",
      },
    });
  }
}
