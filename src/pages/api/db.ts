import type { NextApiRequest, NextApiResponse } from "next";
import { Pool, PoolConfig } from "pg";

// Configuración para Supabase (PostgreSQL)
// Puedes usar SUPABASE_DB_URL (connection string) o las variables individuales
const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

export const dbConfig: PoolConfig = connectionString
  ? // Opción 1: Connection string (si lo tienes)
    {
      connectionString: connectionString,
      ssl: { rejectUnauthorized: false }, // Supabase requiere SSL
      max: 20, // Máximo de conexiones en el pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    }
  : // Opción 2: Variables individuales
    {
      host: process.env.SUPABASE_DB_HOST || process.env.DB_HOST,
      port: parseInt(process.env.SUPABASE_DB_PORT || process.env.DB_PORT || "5432", 10),
      database: process.env.SUPABASE_DB_NAME || process.env.DB_NAME || "postgres",
      user: process.env.SUPABASE_DB_USER || process.env.DB_USER || "postgres",
      password: process.env.SUPABASE_DB_PASSWORD || process.env.DB_PASSWORD,
      ssl: { rejectUnauthorized: false }, // Supabase requiere SSL
      max: 20, // Máximo de conexiones en el pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };

// Pool global para reutilizar conexiones
let pool: Pool | null = null;

// Función para conectar a la base de datos
export async function connectToDatabase(): Promise<Pool> {
  try {
    // Verificar que las variables de entorno estén configuradas
    const hasConnectionString = !!(process.env.SUPABASE_DB_URL || process.env.DATABASE_URL);
    const hasIndividualVars = !!(process.env.SUPABASE_DB_HOST || process.env.DB_HOST);
    
    if (!hasConnectionString && !hasIndividualVars) {
      throw new Error("Variables de entorno no configuradas. Verifica .env.local");
    }

    // Log de configuración (sin mostrar contraseñas)
    if (process.env.NODE_ENV === "development") {
      console.log("🔧 Configuración DB:", {
        hasConnectionString,
        hasIndividualVars,
        host: process.env.SUPABASE_DB_HOST || process.env.DB_HOST || "N/A",
        port: process.env.SUPABASE_DB_PORT || process.env.DB_PORT || "N/A",
        database: process.env.SUPABASE_DB_NAME || process.env.DB_NAME || "N/A",
        user: process.env.SUPABASE_DB_USER || process.env.DB_USER || "N/A",
      });
    }

    if (!pool) {
      pool = new Pool(dbConfig);
      
      // Manejar errores del pool
      pool.on("error", (err: Error) => {
        console.error("❌ Error inesperado en el pool de PostgreSQL:", err);
      });
    }
    
    // Probar la conexión con timeout
    await pool.query("SELECT NOW()");
    return pool;
  } catch (error: any) {
    console.error("❌ Error conectando a Supabase (PostgreSQL):", error);
    
    // Proporcionar mensajes de error más específicos
    let errorMessage = "No se pudo conectar a la base de datos de Supabase";
    
    if (error.message?.includes("password authentication failed")) {
      errorMessage = "Error de autenticación: La contraseña es incorrecta";
    } else if (error.message?.includes("getaddrinfo ENOTFOUND") || error.message?.includes("ENOTFOUND")) {
      errorMessage = `Host no encontrado: ${process.env.SUPABASE_DB_HOST || process.env.DB_HOST || "N/A"}`;
    } else if (error.message?.includes("timeout") || error.message?.includes("ETIMEDOUT")) {
      errorMessage = "Timeout: No se pudo conectar al servidor. Verifica el host y puerto";
    } else if (error.message?.includes("SSL")) {
      errorMessage = "Error SSL: Problema con la conexión segura";
    } else if (error.message?.includes("Variables de entorno")) {
      errorMessage = error.message;
    } else {
      errorMessage = error.message || errorMessage;
    }
    
    throw new Error(errorMessage);
  }
}

// Función para cerrar el pool (útil para cleanup)
export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

// Exportación por defecto para la API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verificar que las variables de entorno estén configuradas
    const hasConnectionString = !!(process.env.SUPABASE_DB_URL || process.env.DATABASE_URL);
    const hasIndividualVars = !!(process.env.SUPABASE_DB_HOST || process.env.DB_HOST);
    
    // Diagnóstico en desarrollo
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 Diagnóstico de variables de entorno:", {
        SUPABASE_DB_URL: process.env.SUPABASE_DB_URL ? "✅ Configurado" : "❌ No configurado",
        DATABASE_URL: process.env.DATABASE_URL ? "✅ Configurado" : "❌ No configurado",
        SUPABASE_DB_HOST: process.env.SUPABASE_DB_HOST ? "✅ Configurado" : "❌ No configurado",
        DB_HOST: process.env.DB_HOST ? "✅ Configurado" : "❌ No configurado",
        hasConnectionString,
        hasIndividualVars,
      });
    }
    
    if (!hasConnectionString && !hasIndividualVars) {
      return res.status(500).json({ 
        error: "Variables de entorno no configuradas",
        message: "Por favor configura SUPABASE_DB_URL o las variables individuales (SUPABASE_DB_HOST, etc.) en .env.local",
        hint: "Asegúrate de reiniciar el servidor (npm run dev) después de crear/modificar .env.local"
      });
    }

    const pool = await connectToDatabase();
    const result = await pool.query("SELECT NOW() as current_time, version() as pg_version");
    res.status(200).json({ 
      message: "Conexión exitosa a Supabase",
      timestamp: result.rows[0].current_time,
      version: result.rows[0].pg_version
    });
  } catch (error: any) {
    console.error("❌ Error en handler:", error);
    
    // Mensajes de error más específicos
    let errorMessage = "Error conectando a la base de datos de Supabase";
    let errorDetails = error.message || "Error desconocido";
    
    if (error.message?.includes("password authentication failed")) {
      errorMessage = "Error de autenticación";
      errorDetails = "La contraseña es incorrecta. Verifica SUPABASE_DB_PASSWORD en .env.local";
    } else if (error.message?.includes("getaddrinfo ENOTFOUND") || error.message?.includes("ENOTFOUND")) {
      errorMessage = "Host no encontrado";
      errorDetails = "El host es incorrecto. Verifica SUPABASE_DB_HOST en .env.local (debe ser: db.[tu-project-ref].supabase.co)";
    } else if (error.message?.includes("timeout")) {
      errorMessage = "Timeout de conexión";
      errorDetails = "No se pudo conectar al servidor. Verifica el puerto y que el firewall permita la conexión";
    } else if (error.message?.includes("SSL")) {
      errorMessage = "Error SSL";
      errorDetails = "Problema con la conexión SSL. Verifica la configuración";
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: errorDetails,
      fullError: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
}
