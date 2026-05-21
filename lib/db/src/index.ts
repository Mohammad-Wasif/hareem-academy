import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Catch unhandled errors on idle clients in the pool to prevent process crash
pool.on("error", (err) => {
  console.error("Unexpected error on idle pg client:", err);
});

export const db = drizzle(pool, { schema });

export * from "./schema";
