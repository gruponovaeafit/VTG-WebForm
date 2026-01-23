// src/pages/api/db.ts
import { Pool, PoolConfig, QueryResult, QueryResultRow, PoolClient } from "pg";

// Puedes usar SUPABASE_DB_URL (connection string) o variables individuales
const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

function buildDbConfig(): PoolConfig {
  // Opción 1: Connection string
  if (connectionString) {
    return {
      connectionString,
      ssl: { rejectUnauthorized: false }, // Supabase suele requerir SSL
      // IMPORTANTE: en serverless mantener bajo para evitar agotar conexiones
      max: Number(process.env.PG_POOL_MAX ?? 3),
      idleTimeoutMillis: 10000, // 0 = desactivar timeout (mantener conexiones vivas)
      connectionTimeoutMillis: 10_000, // Aumentado para conexiones más lentas
    };
  }

  // Opción 2: Variables individuales
  const host = process.env.SUPABASE_DB_HOST || process.env.DB_HOST;
  const password = process.env.SUPABASE_DB_PASSWORD || process.env.DB_PASSWORD;

  if (!host || !password) {
    throw new Error(
      "DB env vars missing. Configura SUPABASE_DB_URL/DATABASE_URL o SUPABASE_DB_HOST + SUPABASE_DB_PASSWORD en .env.local"
    );
  }

  return {
    host,
    port: parseInt(process.env.SUPABASE_DB_PORT || process.env.DB_PORT || "5432", 10),
    database: process.env.SUPABASE_DB_NAME || process.env.DB_NAME || "postgres",
    user: process.env.SUPABASE_DB_USER || process.env.DB_USER || "postgres",
    password,
    ssl: { rejectUnauthorized: false },
    max: Number(process.env.PG_POOL_MAX ?? 3),
    idleTimeoutMillis: 0, // 0 = desactivar timeout (mantener conexiones vivas)
    connectionTimeoutMillis: 10_000, // Aumentado para conexiones más lentas
  };
}

// Evitar múltiples pools por Hot Reload en Next.js (dev)
declare global {
    var __pgPool: Pool | undefined;
}

export function getPool(): Pool {
  if (!global.__pgPool) {
    const cfg = buildDbConfig();
    global.__pgPool = new Pool(cfg);

    global.__pgPool.on("error", (err) => {
      console.error("❌ Error inesperado en el pool de PostgreSQL:", err);
      // Si hay un error, recrear el pool en la próxima llamada
      global.__pgPool = undefined;
    });

    // Manejar desconexiones y reconectar automáticamente
    global.__pgPool.on("connect", (client) => {
      client.on("error", (err) => {
        console.error("❌ Error en cliente PostgreSQL:", err);
      });
    });

    if (process.env.NODE_ENV === "development") {
      console.log("✅ PostgreSQL pool listo (db.ts)");
    }
  }

  return global.__pgPool;
}

// Helper para ejecutar queries desde tus endpoints
export async function dbQuery<T extends QueryResultRow = any>(
  text: string,
  params: any[] = [],
  retries = 1
): Promise<QueryResult<T>> {
  try {
    const pool = getPool();
    return await pool.query<T>(text, params);
  } catch (error: any) {
    // Mensajes útiles sin filtrar secretos
    const msg = error?.message || "Error desconocido en dbQuery";

    // Si la conexión se cerró, intentar reconectar una vez
    if (
      (msg.includes("Connection terminated") || 
       msg.includes("Connection closed") ||
       msg.includes("server closed the connection") ||
       msg.includes("Connection ended")) &&
      retries > 0
    ) {
      console.log("🔄 Reconectando a la base de datos...");
      // Limpiar el pool para forzar una nueva conexión
      if (global.__pgPool) {
        try {
          await global.__pgPool.end();
        } catch (e) {
          // Ignorar errores al cerrar
        }
        global.__pgPool = undefined;
      }
      // Reintentar la query
      return dbQuery<T>(text, params, retries - 1);
    }

    if (msg.includes("password authentication failed")) {
      throw new Error("Error DB: contraseña incorrecta (password authentication failed).");
    }
    if (msg.includes("ENOTFOUND") || msg.includes("getaddrinfo")) {
      throw new Error("Error DB: host no encontrado (ENOTFOUND). Revisa SUPABASE_DB_HOST.");
    }
    if (msg.toLowerCase().includes("timeout") || msg.includes("ETIMEDOUT")) {
      throw new Error("Error DB: timeout de conexión. Revisa host/puerto/red.");
    }
    if (msg.toLowerCase().includes("ssl")) {
      throw new Error("Error DB: problema SSL. Revisa configuración SSL/URL.");
    }

    throw new Error(`Error DB: ${msg}`);
  }
}

export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // ignorar fallos de rollback
    }
    throw err;
  } finally {
    client.release();
  }
}

// Default export requerido por Next.js para archivos en pages/api
export default function handler() {
  return null;
}

