import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Método no permitido" });
    return;
  }

  try {
    const body = req.body;

    const cookies = req.headers.cookie;

    //Mejorar este mensaje
    if(!cookies) {
      res.status(401).json({ success: false, message: "No se encontraron cookies" });
      return;
    }

    const parsedCookies = cookie.parse(cookies);
    const jwtToken = parsedCookies.jwtToken;
  
    //Mejorar este mensaje
    if (!jwtToken) {
      res.status(401).json({ success: false, message: "No se encontró el token en las cookies" });
      return;
    }

    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY as string);

    const email =  (decoded as { email: string }).email
    
    // Registrar los datos en la consola (solo para pruebas)
    console.log("Datos recibidos del formulario:", body);

    // Responder con un mensaje de éxito
    res.status(200).json({ success: true, message: "Formulario recibido exitosamente" });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ success: false, message: "Error al procesar la solicitud" });
  }
}
