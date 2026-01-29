import type { NextApiRequest, NextApiResponse } from "next";
import { verifyJwtFromCookies } from "./cookieManagement";
import { decryptRequestBody } from "@/lib/decrypt";
import { dbQuery } from "./db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({
      notification: {
        type: "error",
        message: "Método no permitido.",
      },
    });
  }

  try {
    // Desencriptar el body si viene encriptado
    const decryptResult = decryptRequestBody(req);
    if (!decryptResult.success) {
      return res.status(400).json({
        notification: { type: "error", message: decryptResult.error || "Error al procesar los datos." },
      });
    }
    
    // 1) Extraemos los campos del body (SIN token)
    const { foodRestrictions, healthConsiderations } = req.body;

    const email = verifyJwtFromCookies(req, res);
    if (!email) return;

    // Validar que los campos existan
    if (!foodRestrictions || !healthConsiderations) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "Faltan campos requeridos en el formulario.",
        },
      });
    }

    const existing = await dbQuery<{ correo: string }>(
      "SELECT correo FROM assessment_nova WHERE correo = $1 LIMIT 1",
      [email]
    );

    if (existing.rows.length > 0) {
      await dbQuery(
        `UPDATE assessment_nova
         SET restriccion_alimentaria = $1,
             consideracion_salud = $2
         WHERE correo = $3`,
        [foodRestrictions, healthConsiderations, email]
      );
    } else {
      await dbQuery(
        `INSERT INTO assessment_nova (correo, asistencia, restriccion_alimentaria, consideracion_salud)
         VALUES ($1, $2, $3, $4)`,
        [email, true, foodRestrictions, healthConsiderations]
      );
    }

    // 6) Devolver resultado y la ruta para redirigir
    return res.status(200).json({
      notification: {
        type: "success",
        message: "Información guardada con éxito.",
      },
      redirectUrl: "/talk",
    });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error interno del servidor.",
      },
    });
  } finally {
    // dbQuery maneja el pool internamente
  }
}
