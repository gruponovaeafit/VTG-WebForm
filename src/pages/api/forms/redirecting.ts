// pages/api/forms/final.ts
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { studentGroup } = req.body;

    // Mapea los grupos a sus respectivas rutas
    const groupRoutes: Record<string, string> = {
      AIESEC: "/aiesec",
      CLUBIN: "/clubin",
      CLUBMERC: "/clubmerc",
      GPG: "/gpg",
      NEXOS: "/nexos",
      NOVA: "/nova",
      PARTNERS: "/partners",
      SERES: "/seres",
      SPIE: "/spie",
      TUTORES: "/tutores",
      TVU: "/tvu",
      "UN SOCIETY": "/unsociety",
    };

    const redirectUrl = groupRoutes[studentGroup];

    if (!redirectUrl) {
      return res.status(400).json({ error: "Grupo no válido" });
    }

    return res.status(200).json({ redirectUrl });
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
