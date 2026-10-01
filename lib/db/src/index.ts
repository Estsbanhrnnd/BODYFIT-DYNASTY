import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/bodyfit_dev";

if (!process.env.DATABASE_URL) {
  console.warn("[DB WARNING] DATABASE_URL no está configurada en .env. Se usará postgresql://postgres:postgres@localhost:5432/bodyfit_dev por defecto.");
}

export const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });

export * from "./schema";
