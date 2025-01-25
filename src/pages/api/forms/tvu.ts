// pages/api/forms/unform.ts
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, secondName, email } = req.body;

    // Opcional: Guarda los datos en una base de datos o realiza alguna acción
    console.log({ name, secondName, email });

    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
