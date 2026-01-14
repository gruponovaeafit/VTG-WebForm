// src/pages/api/db.ts
import { Pool, PoolConfig, QueryResult } from "pg";

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
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 2_000,
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
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 2_000,
  };
}

// Evitar múltiples pools por Hot Reload en Next.js (dev)
declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

export function getPool(): Pool {
  if (!global.__pgPool) {
    const cfg = buildDbConfig();
    global.__pgPool = new Pool(cfg);

    global.__pgPool.on("error", (err) => {
      console.error("❌ Error inesperado en el pool de PostgreSQL:", err);
    });

    if (process.env.NODE_ENV === "development") {
      console.log("✅ PostgreSQL pool listo (db.ts)");
    }
  }

  return global.__pgPool;
}

// Helper para ejecutar queries desde tus endpoints
export async function dbQuery<T = any>(
  text: string,
  params: any[] = []
): Promise<QueryResult<T>> {
  try {
    const pool = getPool();
    return await pool.query<T>(text, params);
  } catch (error: any) {
    // Mensajes útiles sin filtrar secretos
    const msg = error?.message || "Error desconocido en dbQuery";

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
