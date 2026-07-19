import type { NextApiRequest, NextApiResponse } from "next";
import { dbQuery } from "../db";
import { verifyJwtFromCookies } from "../cookieManagement";
import { decryptRequestBody } from "@/lib/decrypt";

const recentRequests = new Map<string, number>();

const ALLOWED_CHARLAS = new Set([
  "Miércoles Jul. 22 11:00 AM - 12:00 PM",
  "Miércoles Jul. 22 3:00 PM - 4:00 PM",
  "Jueves Jul. 23 3:00 PM - 4:00 PM",
  "Viernes Jul. 24 11:00 AM - 12:00 PM",
  "Viernes Jul. 24 12:00 PM - 1:00 PM",
]);

const ALLOWED_PRACTICAS = new Set(["2026-2", "2027-1", "Ninguno"]);

function yesNoToString(value: unknown): string | null {
  const v = String(value ?? "").trim().toLowerCase();
  if (v === "si" || v === "sí") return "Si";
  if (v === "no") return "No";
  return null;
}

function truncate(value: string, max: number): string {
  return value.slice(0, max);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        notification: { type: "error", message: "Método no permitido." },
      });
    }

    const decryptResult = decryptRequestBody(req);
    if (!decryptResult.success) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: decryptResult.error || "Error al procesar los datos.",
        },
      });
    }

    const email = verifyJwtFromCookies(req, res);
    if (!email || typeof email !== "string") {
      return res.status(401).json({
        notification: { type: "error", message: "Sesión inválida o expirada." },
      });
    }

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

    const groupId = 1;
    const charla = String(req.body?.charla ?? "").trim();
    const practica = String(req.body?.practica ?? "").trim();
    const intercambio = yesNoToString(req.body?.intercambio);

    if (!ALLOWED_CHARLAS.has(charla)) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "Debes seleccionar un horario de charla válido.",
        },
      });
    }

    if (!ALLOWED_PRACTICAS.has(practica)) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "Debes indicar en qué semestre harás la práctica (o Ninguno).",
        },
      });
    }

    if (intercambio === null) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "Debes indicar si harás intercambio académico (Sí/No).",
        },
      });
    }

    const personaRes = await dbQuery(`SELECT 1 FROM persona WHERE correo = $1 LIMIT 1`, [
      email.toLowerCase().trim(),
    ]);
    if (personaRes.rows.length === 0) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "Tu correo no está registrado en el sistema.",
        },
      });
    }

    // charla varchar(100), practica/intercambio varchar(32)
    const result = await dbQuery<{ id_grupo: number }>(
      `INSERT INTO club_in (id_grupo, correo, charla, practica, intercambio)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id_grupo, correo) DO NOTHING
       RETURNING id_grupo`,
      [
        groupId,
        email.toLowerCase().trim(),
        truncate(charla, 100),
        truncate(practica, 32),
        truncate(intercambio, 32),
      ]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "Ya estás registrado en este grupo.",
        },
      });
    }

    return res.status(200).json({
      notification: { type: "success", message: "Formulario enviado con éxito." },
    });
  } catch (err) {
    console.error("🔥 Error inesperado en /api/forms/clubin:", err);
    return res.status(500).json({
      notification: { type: "error", message: "Error interno del servidor." },
      details: err instanceof Error ? err.message : String(err),
    });
  }
}
