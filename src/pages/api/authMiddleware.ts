import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

// Se crea una interfaz que extiende de NextApiRequest para agregar la propiedad user
interface CustomNextApiRequest extends NextApiRequest {
    user?: any;
}

// Se crea un middleware para verificar si el usuario está autenticado
const authMiddleware = (handler: (req: CustomNextApiRequest, res: NextApiResponse) => void) => {
    return async (req: CustomNextApiRequest, res: NextApiResponse) => {
        try {
            // Se obtiene la cookie jwtToken del header de la petición
            const cookies = cookie.parse(req.headers.cookie || '');
            const token = cookies.jwtToken;

            if (!token) {
                return res.status(401).json({ message: 'Authentication token is missing' });
            }
            // Se verifica el token con la clave secreta
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
            req.user = decoded;

            return handler(req, res);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired authentication token' });
        }
    };
};

export default authMiddleware;