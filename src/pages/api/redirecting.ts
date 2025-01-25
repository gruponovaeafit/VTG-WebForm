// pages/api/forms/final.ts
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { studentGroup } = req.body;

    // Mapea los grupos a sus respectivas rutas
    const groupRoutes: Record<string, string> = {
      AIESEC: "/groups/aiesec",
      CLUBIN: "/groups/clubin",
      CLUBMERC: "/groups/clubmerc",
      GPG: "/groups/gpg",
      NEXOS: "/groups/nexos",
      NOVA: "/groups/nova",
      PARTNERS: "/groups/partners",
      SERES: "/groups/seres",
      SPIE: "/groups/spie",
      TUTORES: "/groups/tutores",
      TVU: "/groups/tvu",
      "UN SOCIETY": "/groups/unsociety",
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
