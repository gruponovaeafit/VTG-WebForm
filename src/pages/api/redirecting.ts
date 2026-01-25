// pages/api/forms/final.ts
import { NextApiRequest, NextApiResponse } from "next";
import { decryptRequestBody } from "./lib/decrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Desencriptar el body si viene encriptado
    const decryptResult = decryptRequestBody(req);
    if (!decryptResult.success) {
      return res.status(400).json({
        notification: { type: "error", message: decryptResult.error || "Error al procesar los datos." },
      });
    }
    
    const { studentGroup } = req.body;

    // Mapea los grupos a sus respectivas rutas
    const groupRoutes: Record<string, string> = {
      AIESEC: "/groups/aiesec",
      CLUBIN: "/groups/clubin",
      CLUBMERC: "/groups/clubmerc",
      GPG: "/groups/gpg",
      NEXOS: "/groups/nexos",
      NOVA: "/groups/nova",
      OE: "/groups/oe",
      PARTNERS: "/groups/partners",
      SERES: "/groups/seres",
      SPIE: "/groups/spie",
      TUTORES: "/groups/tutores",
      TVU: "/groups/tvu",
      "UN SOCIETY": "/groups/unsociety",
    };

    const redirectUrl = groupRoutes[studentGroup];

    return res.status(200).json({ redirectUrl });
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

