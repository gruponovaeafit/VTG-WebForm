import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { connectToDatabase } from "../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let pool: Pool | null = null;

  try {
    pool = await connectToDatabase();

    if (req.method === "GET") {
      // Obtener todas las personas
      const result = await pool.query(
        "SELECT correo, nombre, pregrado, pregrado_2, semestre, fecha_creacion FROM persona ORDER BY fecha_creacion DESC LIMIT 100"
      );

      return res.status(200).json({
        success: true,
        data: result.rows,
        count: result.rows.length,
      });
    }

    if (req.method === "POST") {
      // Insertar o actualizar una persona y (opcionalmente) asignarla a un grupo
      const { correo, nombre, pregrado, pregrado_2, semestre, grupo } = req.body;

      if (!correo || !nombre || !pregrado) {
        return res.status(400).json({
          success: false,
          message: "Correo, nombre y pregrado son obligatorios",
        });
      }

      // Verificar si la persona ya existe
      const existing = await pool.query(
        "SELECT correo FROM persona WHERE correo = $1",
        [correo.toLowerCase()]
      );

      if (existing.rows.length > 0) {
        // Actualizar
        await pool.query(
          "UPDATE persona SET nombre = $1, pregrado = $2, pregrado_2 = $3, semestre = $4 WHERE correo = $5",
          [nombre, pregrado, pregrado_2 || null, semestre || null, correo.toLowerCase()]
        );
      } else {
        // Insertar nueva persona
        await pool.query(
          "INSERT INTO persona (correo, nombre, pregrado, pregrado_2, semestre) VALUES ($1, $2, $3, $4, $5)",
          [correo.toLowerCase(), nombre, pregrado, pregrado_2 || null, semestre || null]
        );

        // No hacemos return aquí, continuamos para permitir asignar grupo
      }

      // Si se envía un grupo, intentar asignar a la tabla correspondiente (solo para pruebas)
      if (grupo) {
        const emailLower = correo.toLowerCase();

        // Mapear nombre de grupo a consulta de inserción de prueba
        const groupInsertQueries: Record<string, string> = {
          aiesec:
            "INSERT INTO aiesec (id_grupo, correo, departamento) VALUES (1, $1, 'TEST-DEPARTAMENTO') ON CONFLICT (id_grupo, correo) DO NOTHING",
          club_in:
            "INSERT INTO club_in (id_grupo, correo, slot_id) VALUES (2, $1, NULL) ON CONFLICT (id_grupo, correo) DO NOTHING",
          club_merc:
            "INSERT INTO club_merc (id_grupo, correo, comite) VALUES (3, $1, 'TEST-COMITE') ON CONFLICT (id_grupo, correo) DO NOTHING",
          gpg:
            "INSERT INTO gpg (id_grupo, correo, charla, prepractica) VALUES (4, $1, 'TEST-CHARLA', 'TEST-PRE') ON CONFLICT (id_grupo, correo) DO NOTHING",
          nexos:
            "INSERT INTO nexos (id_grupo, correo, nombre_miembro, charla) VALUES (5, $1, 'TEST-MIEMBRO', 'TEST-CHARLA') ON CONFLICT (id_grupo, correo) DO NOTHING",
          nova:
            "INSERT INTO nova (id_grupo, correo, charla, departamento, nombre_miembro) VALUES (6, $1, 'TEST-CHARLA', 'TEST-DEP', 'TEST-MIEMBRO') ON CONFLICT (id_grupo, correo) DO NOTHING",
          oe:
            "INSERT INTO oe (id_grupo, correo, charla) VALUES (7, $1, 'TEST-CHARLA') ON CONFLICT (id_grupo, correo) DO NOTHING",
          partners:
            "INSERT INTO partners (id_grupo, correo, charla, nombre_miembro) VALUES (8, $1, 'TEST-CHARLA', 'TEST-MIEMBRO') ON CONFLICT (id_grupo, correo) DO NOTHING",
          seres:
            "INSERT INTO seres (id_grupo, correo, charla, talk_id) VALUES (9, $1, 'TEST-CHARLA', NULL) ON CONFLICT (id_grupo, correo) DO NOTHING",
          spie:
            "INSERT INTO spie (id_grupo, correo, charla, nombre_miembro) VALUES (10, $1, 'TEST-CHARLA', 'TEST-MIEMBRO') ON CONFLICT (id_grupo, correo) DO NOTHING",
          tutores:
            "INSERT INTO tutores (id_grupo, correo, nombre_miembro) VALUES (11, $1, 'TEST-MIEMBRO') ON CONFLICT (id_grupo, correo) DO NOTHING",
          tvu:
            "INSERT INTO tvu (id_grupo, correo, charla) VALUES (12, $1, 'TEST-CHARLA') ON CONFLICT (id_grupo, correo) DO NOTHING",
          un:
            "INSERT INTO un (id_grupo, correo, charla, nombre_miembro, comite) VALUES (13, $1, 'TEST-CHARLA', 'TEST-MIEMBRO', 'TEST-COMITE') ON CONFLICT (id_grupo, correo) DO NOTHING",
        };

        const normalizedGroup = String(grupo).toLowerCase();
        const insertQuery = groupInsertQueries[normalizedGroup];

        if (!insertQuery) {
          return res.status(400).json({
            success: false,
            message:
              "Grupo no válido. Usa uno de: aiesec, club_in, club_merc, gpg, nexos, nova, oe, partners, seres, spie, tutores, tvu, un",
          });
        }

        await pool.query(insertQuery, [emailLower]);

        return res.status(existing.rows.length > 0 ? 200 : 201).json({
          success: true,
          message:
            existing.rows.length > 0
              ? `Persona actualizada y asignada al grupo ${normalizedGroup}`
              : `Persona creada y asignada al grupo ${normalizedGroup}`,
        });
      }

      // Si no se envió grupo, solo reportar creación/actualización de persona
      return res.status(existing.rows.length > 0 ? 200 : 201).json({
        success: true,
        message:
          existing.rows.length > 0
            ? "Persona actualizada exitosamente"
            : "Persona creada exitosamente",
      });
    }

    if (req.method === "DELETE") {
      // Eliminar una persona
      const { correo } = req.body;

      if (!correo) {
        return res.status(400).json({
          success: false,
          message: "Correo es obligatorio",
        });
      }

      const result = await pool.query(
        "DELETE FROM persona WHERE correo = $1 RETURNING correo",
        [correo.toLowerCase()]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Persona no encontrada",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Persona eliminada exitosamente",
      });
    }

    return res.status(405).json({
      success: false,
      message: "Método no permitido",
    });
  } catch (error: any) {
    console.error("Error en la API:", error);
    return res.status(500).json({
      success: false,
      message: "Error al procesar la solicitud",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

