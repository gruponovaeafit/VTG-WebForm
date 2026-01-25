import { NextApiRequest, NextApiResponse } from "next";
import { verifyJwtFromCookies } from "../cookieManagement";
import { dbQuery } from "../db";
import { decryptRequestBody } from "../lib/decrypt";




export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        notification: { 
          type: "error", 
        message: "Método no permitido." },
      });
    }

    // Desencriptar el body si viene encriptado
    const decryptResult = decryptRequestBody(req);
    if (!decryptResult.success) {
      return res.status(400).json({
        notification: { type: "error", message: decryptResult.error || "Error al procesar los datos." },
      });
    }

    // 1) Email desde JWT cookie
    const email = verifyJwtFromCookies(req, res);
    if (!email || typeof email !== "string") {
      return res.status(401).json({
        notification: { 
          type: "error", 
          message: "Sesión inválida o expirada." },
      });
    }

    // 2) Datos del form
    const groupId = 4;
    const talk = String(req.body?.talk ?? "").trim();
    const registeredBy = String(req.body?.name ?? "").trim(); 

    if (!talk) {
      return res.status(400).json({
        notification: { 
          type: "error", 
          message: "Debes seleccionar una charla informativa." },
      });
    }

    if (!registeredBy) {
      return res.status(400).json({
        notification: { 
          type: "error", 
          message: "Debes indicar quién te inscribió." },
      });
    }
    
    // 3) Insert en Supabase
    const result = await dbQuery<{ id_grupo: number }>(
      `INSERT INTO nexos (id_grupo, correo, charla, nombre_miembro)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id_grupo, correo) DO NOTHING
       RETURNING id_grupo`,
      [groupId, email.toLowerCase().trim(), talk, registeredBy]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        notification: { 
          type: "error", 
          message: "Ya estás registrado en este grupo." },
      });
    }

    return res.status(200).json({
      notification: { 
        type: "success", 
        message: "Formulario enviado con éxito." },
    });
  } catch (err) {
    console.error("Error en /api/forms/nexos:", err);
    return res.status(500).json({
      notification: { 
        type: "error", 
        message: "Error interno del servidor." },
    });
  }
}