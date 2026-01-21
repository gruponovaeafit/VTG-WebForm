import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY!;

export default function cookieCheck(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // TODO: Descomentar para producción
  // const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  // const token = cookies.jwtToken;

  // // Debug: Log para verificar si las cookies están llegando
  // console.log("Cookies recibidas:", Object.keys(cookies));
  // console.log("Token encontrado:", !!token);

  // if (!token) {
  //   return res.status(401).json({ message: "Unauthorized: No token found" });
  // }

  // try {
  //   // Verifica el token con la clave secreta
  //   verify(token, JWT_SECRET);
  //   return res.status(200).json({ message: "Token válido" });
  // } catch (error) {
  //   console.error("Error al verificar token:", error);
  //   return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  // }

  // Bypass para pruebas - siempre retorna OK
  return res.status(200).json({ message: "Token válido (modo pruebas)" });
}
