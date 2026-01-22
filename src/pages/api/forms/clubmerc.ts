import { NextApiRequest, NextApiResponse } from "next";
import { verifyJwtFromCookies } from "../cookieManagement";
import { dbQuery } from "../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        notification: {
          type: "error",
          message: "Método no permitido.",
        },
      });
    }

    // 1) Email desde cookie JWT
    const email = verifyJwtFromCookies(req, res);
    
    if (!email || typeof email !== "string") {
      return res.status(401).json({
        notification: {
          type: "error",
          message: "Sesión inválida o expirada.",
        },
      });
    }

    // 2) Datos del form
    const groupId = 4;
    // El formulario envía "committieSelect" pero también aceptamos "comite" por compatibilidad
    const comite = String(req.body?.committieSelect ?? req.body?.comite ?? "").trim();

    if (!comite) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "Debes seleccionar un comité.",
        },
      });
    }

    // 3) Insert en Supabase
    const result = await dbQuery<{ id_grupo: number }>(
        `
        INSERT INTO club_merc (id_grupo, correo, comite)
        VALUES ($1, $2, $3)
        ON CONFLICT (id_grupo, correo) DO NOTHING
        RETURNING id_grupo
        `,
        [groupId, email.toLowerCase().trim(), comite]
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
      notification: {
        type: "success",
        message: "Formulario enviado con éxito.",
      },
    });
  } catch (err) {
    console.error("Error en /api/forms/clubmerc:", err);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error interno del servidor.",
      },
    });
  }
}
