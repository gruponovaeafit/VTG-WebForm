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
      // Insertar o actualizar una persona
      const { correo, nombre, pregrado, pregrado_2, semestre } = req.body;

      if (!correo || !nombre || !pregrado) {
        return res.status(400).json({
          success: false,
          message: "Correo, nombre y pregrado son obligatorios",
        });
      }

      // Verificar si existe
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

        return res.status(200).json({
          success: true,
          message: "Persona actualizada exitosamente",
        });
      } else {
        // Insertar
        await pool.query(
          "INSERT INTO persona (correo, nombre, pregrado, pregrado_2, semestre) VALUES ($1, $2, $3, $4, $5)",
          [correo.toLowerCase(), nombre, pregrado, pregrado_2 || null, semestre || null]
        );

        return res.status(201).json({
          success: true,
          message: "Persona creada exitosamente",
        });
      }
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

