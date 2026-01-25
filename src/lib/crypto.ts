/**
 * Utilidades de encriptación RSA para datos de formularios
 * Usa RSA con clave pública para encriptar (frontend) y clave privada para desencriptar (backend)
 * Implementa encriptación híbrida: RSA para la clave AES, AES para los datos
 */

import forge from "node-forge";

// La clave pública RSA (segura para exponer en el frontend)
const getPublicKey = (): string => {
  const key = process.env.NEXT_PUBLIC_RSA_PUBLIC_KEY;
  if (!key) {
    throw new Error("NEXT_PUBLIC_RSA_PUBLIC_KEY no está configurada");
  }
  // Reemplazar los \n literales por saltos de línea reales
  return key.replace(/\\n/g, "\n");
};

/**
 * Encripta datos usando encriptación híbrida (RSA + AES)
 * 1. Genera una clave AES aleatoria
 * 2. Encripta los datos con AES
 * 3. Encripta la clave AES con RSA
 * @param data - Objeto con los datos del formulario
 * @returns Objeto con clave AES encriptada y datos encriptados
 */
export function encryptData(data: Record<string, unknown>): { encryptedKey: string; encryptedData: string; iv: string } {
  const jsonString = JSON.stringify(data);
  
  // Generar clave AES aleatoria de 256 bits y IV de 128 bits
  const aesKey = forge.random.getBytesSync(32); // 256 bits
  const iv = forge.random.getBytesSync(16); // 128 bits
  
  // Encriptar datos con AES-CBC
  const cipher = forge.cipher.createCipher("AES-CBC", aesKey);
  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(forge.util.encodeUtf8(jsonString)));
  cipher.finish();
  const encryptedData = forge.util.encode64(cipher.output.getBytes());
  
  // Encriptar clave AES con RSA
  const publicKey = forge.pki.publicKeyFromPem(getPublicKey());
  const encryptedKey = forge.util.encode64(
    publicKey.encrypt(aesKey, "RSA-OAEP", {
      md: forge.md.sha256.create(),
    })
  );
  
  return {
    encryptedKey,
    encryptedData,
    iv: forge.util.encode64(iv),
  };
}

/**
 * Wrapper para fetch que encripta automáticamente el body con RSA híbrido
 * @param url - URL del endpoint
 * @param data - Datos a enviar (serán encriptados)
 * @param options - Opciones adicionales de fetch
 */
export async function encryptedFetch(
  url: string,
  data: Record<string, unknown>,
  options?: RequestInit
): Promise<Response> {
  const encryptedPayload = encryptData(data);
  
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Encrypted": "true",
      ...options?.headers,
    },
    body: JSON.stringify(encryptedPayload),
    ...options,
  });
}
