import type { NextApiRequest, NextApiResponse } from "next";
import { dbQuery } from "./db"
import { verify } from "jsonwebtoken";
import { parse } from "cookie";
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

  try {

    // Desencriptar el body si viene encriptado
    const decryptResult = decryptRequestBody(req);
    if (!decryptResult.success) {
      return res.status(400).json({
        notification: { type: "error", message: decryptResult.error || "Error al procesar los datos." },
      });
    }

    // 1) Obtener las cookies
    const cookies = req.headers.cookie;
    if (!cookies) {
      return res.status(401).json({
        notification: {
          type: "error",
          message: "No se encontraron cookies.",
        },
      });
    }

    const parsedCookies = parse(cookies);
    const jwtToken = parsedCookies.jwtToken;

    if (!jwtToken) {
      return res.status(401).json({
        notification: {
          type: "error",
          message: "No se encontró el token en las cookies.",
        },
      });
    }

    const decoded = verify(jwtToken, process.env.JWT_SECRET_KEY as string);
    const email = (decoded as { email: string }).email;

    // 2) Obtener los datos del body
    const { programs, semester, secondaryPrograms = "No aplica" } = req.body;

    if (!programs || !semester) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "El semestre y el programa son obligatorios.",
        },
      });
    }

    const adjustedSemester = semester === "10+" ? 11 : parseInt(semester, 10);

    // 3) Actualizar los datos en la base de datos
    const result = await dbQuery<{ correo: string }>(
      `UPDATE persona
       SET semestre = $1,
           pregrado = $2,
           pregrado_2 = $3
       WHERE correo = $4
       RETURNING correo`,
      [adjustedSemester, programs, secondaryPrograms, email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        notification: { type: "error", message: "No se encontró el usuario para actualizar." },
      });
    }

    return res.status(200).json({
      notification: { type: "success", message: "Información guardada con éxito." },
    });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return res.status(500).json({
      notification: { type: "error", message: "Error al procesar la solicitud." },
    });
  } 
}
