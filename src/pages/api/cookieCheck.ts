import { NextApiRequest, NextApiResponse } from "next";
import {parse} from "cookie"; // Import cookie parsing library

export default function cookieCheck(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Parse cookies from the request headers
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};

    // Check if the cookie (jwtToken) exists
    if (!cookies.jwtToken) {
      // If no JWT cookie, return a 401 Unauthorized status
      return res.status(401).json({ message: "Unauthorized" }); // No need for redirect here, handle on client-side
    }

    // If the cookie exists, you can continue with the request handling
    return res.status(200).json({ message: "Cookie is present!" });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
