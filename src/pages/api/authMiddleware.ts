import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

// Define una interfaz para el payload decodificado del JWT
interface JwtPayload {
  id: string;
  email: string;
  // Agrega otros campos relevantes si los tienes en tu JWT
}

// Se crea una interfaz que extiende de NextApiRequest para agregar la propiedad user
interface CustomNextApiRequest extends NextApiRequest {
  user?: JwtPayload; // Cambiamos 'any' por la interfaz JwtPayload
}

// Middleware para verificar si el usuario está autenticado
const authMiddleware = (
  handler: (req: CustomNextApiRequest, res: NextApiResponse) => void
) => {
  return async (req: CustomNextApiRequest, res: NextApiResponse) => {
    try {
      // Obtener la cookie jwtToken del header de la petición
      const cookies = cookie.parse(req.headers.cookie || '');
      const token = cookies.jwtToken;

      if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing' });
      }

      // Verificar el token con la clave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
      req.user = decoded;

      return handler(req, res);
    } catch {
      return res.status(401).json({ message: 'Invalid or expired authentication token' });
    }
  };
};

export default authMiddleware;
