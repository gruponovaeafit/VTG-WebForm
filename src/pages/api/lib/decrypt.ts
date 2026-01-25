/**
 * Utilidades de desencriptación RSA para el backend
 * Usa clave privada RSA para desencriptar datos del frontend
 * Implementa desencriptación híbrida: RSA para la clave AES, AES para los datos
 */

import forge from "node-forge";
import type { NextApiRequest } from "next";

// La clave privada RSA (NUNCA exponer en el frontend)
const getPrivateKey = (): string => {
  const key = process.env.RSA_PRIVATE_KEY;
  if (!key) {
    throw new Error("RSA_PRIVATE_KEY no está configurada");
  }
  // Reemplazar los \n literales por saltos de línea reales
  return key.replace(/\\n/g, "\n");
};

interface EncryptedPayload {
  encryptedKey: string;
  encryptedData: string;
  iv: string;
}

/**
 * Desencripta datos usando desencriptación híbrida (RSA + AES)
 * 1. Desencripta la clave AES con RSA
 * 2. Desencripta los datos con AES
 * @param payload - Objeto con clave encriptada, datos encriptados e IV
 * @returns Objeto con los datos originales
 */
export function decryptData<T = Record<string, unknown>>(payload: EncryptedPayload): T {
  const { encryptedKey, encryptedData, iv } = payload;
  
  // Desencriptar clave AES con RSA
  const privateKey = forge.pki.privateKeyFromPem(getPrivateKey());
  const aesKey = privateKey.decrypt(
    forge.util.decode64(encryptedKey),
    "RSA-OAEP",
    {
      md: forge.md.sha256.create(),
    }
  );
  
  // Desencriptar datos con AES-CBC
  const decipher = forge.cipher.createDecipher("AES-CBC", aesKey);
  decipher.start({ iv: forge.util.createBuffer(forge.util.decode64(iv)) });
  decipher.update(forge.util.createBuffer(forge.util.decode64(encryptedData)));
  const success = decipher.finish();
  
  if (!success) {
    throw new Error("Error al desencriptar los datos AES");
  }
  
  const decryptedString = forge.util.decodeUtf8(decipher.output.getBytes());
  
  if (!decryptedString) {
    throw new Error("Error al desencriptar los datos");
  }
  
  return JSON.parse(decryptedString) as T;
}

/**
 * Verifica si el request contiene datos encriptados
 * @param req - NextApiRequest
 * @returns boolean
 */
export function isEncryptedRequest(req: NextApiRequest): boolean {
  return req.headers["x-encrypted"] === "true";
}

/**
 * Obtiene los datos del body, desencriptando si es necesario
 * Soporta tanto requests encriptados como no encriptados para retrocompatibilidad
 * @param req - NextApiRequest
 * @returns Objeto con los datos (desencriptados si venían encriptados)
 */
export function getRequestBody<T = Record<string, unknown>>(req: NextApiRequest): T {
  if (isEncryptedRequest(req)) {
    const payload = req.body as EncryptedPayload;
    
    if (!payload.encryptedKey || !payload.encryptedData || !payload.iv) {
      throw new Error("Se esperaban datos encriptados pero el formato es inválido");
    }
    
    return decryptData<T>(payload);
  }
  
  // Si no está encriptado, devuelve el body directamente (retrocompatibilidad)
  return req.body as T;
}

/**
 * Middleware helper para desencriptar automáticamente el body del request
 * Modifica req.body con los datos desencriptados
 * @param req - NextApiRequest
 * @returns true si se desencriptó correctamente o no era necesario, false si hubo error
 */
export function decryptRequestBody(req: NextApiRequest): { success: boolean; error?: string } {
  if (isEncryptedRequest(req)) {
    try {
      const payload = req.body as EncryptedPayload;
      
      if (!payload.encryptedKey || !payload.encryptedData || !payload.iv) {
        return { success: false, error: "Formato de datos encriptados inválido" };
      }
      
      req.body = decryptData(payload);
      return { success: true };
    } catch (error) {
      console.error("Error al desencriptar:", error);
      return { success: false, error: "Error al desencriptar los datos" };
    }
  }
  return { success: true };
}
