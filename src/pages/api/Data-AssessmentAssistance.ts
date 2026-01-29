import type { NextApiRequest, NextApiResponse } from "next";
import { verifyJwtFromCookies } from "./cookieManagement";
import { decryptRequestBody } from "@/lib/decrypt";
import { dbQuery } from "./db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({
      notification: {
        type: "error",
        message: "Método no permitido",
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
    
    const { talk } = req.body;

    // 1) Obtener el email desde el JWT en las cookies
    const email = verifyJwtFromCookies(req, res);
    if (!email) {
      return res.status(401).json({
        notification: {
          type: "error",
          message: "No se pudo obtener el email (JWT no válido o ausente).",
        },
      });
    }

    // 2) Verificar que "talk" sea válido
    const normalizedTalk = String(talk ?? "").trim().toLowerCase();
    const asistencia =
      normalizedTalk === "si" || normalizedTalk === "sí" ? true :
      normalizedTalk === "no" ? false :
      null;

    if (asistencia === null) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "El campo 'talk' es obligatorio y debe ser 'Si' o 'No'.",
        },
      });
    }

    const existing = await dbQuery<{ correo: string }>(
      "SELECT correo FROM assessment_nova WHERE correo = $1 LIMIT 1",
      [email]
    );

    if (existing.rows.length > 0) {
      await dbQuery(
        "UPDATE assessment_nova SET asistencia = $1 WHERE correo = $2",
        [asistencia, email]
      );
    } else {
      await dbQuery(
        "INSERT INTO assessment_nova (correo, asistencia) VALUES ($1, $2)",
        [email, asistencia]
      );
    }

    // 6) Decidir la ruta de redirección según la respuesta
    const redirectUrl = asistencia ? "/assessment" : "/90+1";

    return res.status(200).json({
      notification: {
        type: "success",
        message: "Respuesta registrada con éxito.",
      },
      redirectUrl,
    });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error al procesar la solicitud.",
      },
    });
  } finally {
    // dbQuery maneja el pool internamente
  }
}
