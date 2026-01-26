// pages/api/forms/final.ts
import { NextApiRequest, NextApiResponse } from "next";
import { decryptRequestBody } from "@/lib/decrypt";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import { dbQuery } from "./db";

// Mapeo de grupos a su configuración (id_grupo, tabla, ruta)
const groupConfig: Record<string, { idGrupo: number; tabla: string; ruta: string }> = {
  AIESEC: { idGrupo: 13, tabla: "aiesec", ruta: "/groups/aiesec" },
  CLUBIN: { idGrupo: 1, tabla: "club_in", ruta: "/groups/clubin" },
  CLUBMERC: { idGrupo: 4, tabla: "club_merc", ruta: "/groups/clubmerc" },
  GPG: { idGrupo: 3, tabla: "gpg", ruta: "/groups/gpg" },
  NEXOS: { idGrupo: 4, tabla: "nexos", ruta: "/groups/nexos" },
  NOVA: { idGrupo: 5, tabla: "nova", ruta: "/groups/nova" },
  OE: { idGrupo: 6, tabla: "oe", ruta: "/groups/oe" },
  PARTNERS: { idGrupo: 7, tabla: "partners", ruta: "/groups/partners" },
  SERES: { idGrupo: 2, tabla: "seres", ruta: "/groups/seres" },
  SPIE: { idGrupo: 9, tabla: "spie", ruta: "/groups/spie" },
  TUTORES: { idGrupo: 10, tabla: "tutores", ruta: "/groups/tutores" },
  TVU: { idGrupo: 11, tabla: "tvu", ruta: "/groups/tvu" },
  "UN SOCIETY": { idGrupo: 12, tabla: "un", ruta: "/groups/unsociety" },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      // Desencriptar el body si viene encriptado
      const decryptResult = decryptRequestBody(req);
      if (!decryptResult.success) {
        return res.status(400).json({
          notification: { type: "error", message: decryptResult.error || "Error al procesar los datos." },
        });
      }

      // 1) Obtener email desde cookie JWT
      // Verificar cookies manualmente para manejar la redirección correctamente
      const cookies = req.headers.cookie;
      if (!cookies) {
        // Si no hay cookies, redirigir al inicio del formulario
        return res.status(200).json({ 
          redirectUrl: "/email",
          notification: {
            type: "info",
            message: "Por favor inicia sesión con tu correo.",
          },
        });
      }

      const parsedCookies = parse(cookies);
      const jwtToken = parsedCookies.jwtToken;
      
      if (!jwtToken) {
        // Si no hay token JWT, redirigir al inicio del formulario
        return res.status(200).json({ 
          redirectUrl: "/email",
          notification: {
            type: "info",
            message: "Por favor inicia sesión con tu correo.",
          },
        });
      }

      // Verificar el token JWT
      let email: string | null = null;
      
      try {
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY as string) as { email: string };
        email = decoded.email;
      } catch (error) {
        // Si el token es inválido o expirado, redirigir al inicio del formulario
        return res.status(200).json({ 
          redirectUrl: "/email",
          notification: {
            type: "error",
            message: "Sesión expirada, debe volver a iniciar.",
          },
        });
      }

      if (!email || typeof email !== "string") {
        return res.status(200).json({ 
          redirectUrl: "/email",
          notification: {
            type: "info",
            message: "Por favor inicia sesión con tu correo.",
          },
        });
      }

      const { studentGroup } = req.body;

      // 2) Validar que el grupo existe
      const config = groupConfig[studentGroup];
      if (!config) {
        return res.status(400).json({
          notification: {
            type: "error",
            message: "Grupo no válido.",
          },
        });
      }

      // 3) Verificar si el usuario ya está registrado en este grupo
      const emailLower = email.toLowerCase().trim();
      
      // Mapeo seguro de nombres de tabla (evita SQL injection)
      const validTables: Record<string, string> = {
        aiesec: "aiesec",
        club_in: "club_in",
        club_merc: "club_merc",
        gpg: "gpg",
        nexos: "nexos",
        nova: "nova",
        oe: "oe",
        partners: "partners",
        seres: "seres",
        spie: "spie",
        tutores: "tutores",
        tvu: "tvu",
        un: "un",
      };
      
      const tableName = validTables[config.tabla];
      if (!tableName) {
        return res.status(500).json({
          notification: {
            type: "error",
            message: "Error de configuración del grupo.",
          },
        });
      }
      
      const checkResult = await dbQuery<{ correo: string }>(
        `SELECT correo 
         FROM ${tableName} 
         WHERE correo = $1 AND id_grupo = $2 
         LIMIT 1`,
        [emailLower, config.idGrupo]
      );

      if (checkResult.rows.length > 0) {
        return res.status(400).json({
          notification: {
            type: "error",
            message: "Ya estás registrado/a en este grupo.",
          },
        });
      }

      // 4) Si no está registrado, devolver la URL de redirección
      return res.status(200).json({ redirectUrl: config.ruta });
    } catch (err) {
      console.error("Error en /api/redirecting:", err);
      return res.status(500).json({
        notification: {
          type: "error",
          message: "Error interno del servidor.",
        },
      });
    }
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

