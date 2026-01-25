

import type { NextApiRequest, NextApiResponse } from "next";
import { dbQuery } from "./db"
import { verifyJwtFromCookies } from "./cookieManagement";
import { decryptRequestBody } from "@/lib/decrypt";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({
      notification: {
        type: "error",
        message: "Método no permitido",
      },
    });
  }

// 1) Obtener el nombre y el apellido del usuario
  try {
    // Desencriptar el body si viene encriptado
    const decryptResult = decryptRequestBody(req);
    if (!decryptResult.success) {
      return res.status(400).json({
        notification: { type: "error", message: decryptResult.error || "Error al procesar los datos." },
      });
    }
    
    const body = req.body;

    const email = verifyJwtFromCookies(req, res);
    if (!email) return; // Ya se envió respuesta 401 desde verifyJwtFromCookies
    
    const { name, secondName } = body;

    if (!name || !secondName) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "El nombre y el apellido son obligatorios.",
        },
      });
    }

    const fullName = `${String(name).trim()} ${String(secondName).trim()}`.trim();
  

    const result = await dbQuery<{ correo: string }>(
      `UPDATE persona
       SET nombre = $1
       WHERE correo = $2
       RETURNING correo`,
      [fullName, email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        notification: { type: "error", message: "No se encontró el usuario para actualizar." },
      });
    }

    return res.status(200).json({
      notification: {
        type: "success",
        message: "Registro actualizado exitosamente.",
      },
    });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error al procesar la solicitud.",
      },
    });
  }
}
