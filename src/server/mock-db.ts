import "server-only";
import { promises as fs } from "fs";
import path from "path";
// Seed importado: garante que os dados existam no bundle da Vercel (FS read-only).
import seed from "../../mock/db.json";

export type Db = Record<string, unknown>;

const DB_PATH = path.join(process.cwd(), "mock", "db.json");

// Cache em memória do "banco". Em serverless (Vercel) é onde as mutações vivem
// (efêmeras). Em local/Docker o arquivo é a fonte e este cache é só atalho.
let cache: Db | null = null;

/**
 * Lê o "banco".
 * - Local/Docker: lê `mock/db.json` (reflete escritas persistidas).
 * - Vercel: o FS é somente-leitura → usa o seed importado + mutações em memória.
 */
export async function getDb(): Promise<Db> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    cache = JSON.parse(raw) as Db;
  } catch {
    // FS indisponível/somente-leitura (Vercel): mantém o cache atual ou usa o seed.
    if (!cache) cache = structuredClone(seed) as Db;
  }
  return cache;
}

/**
 * Grava o "banco".
 * - Local/Docker: escreve em `mock/db.json` (persiste de verdade).
 * - Vercel: a escrita falha (FS read-only) → fica só em memória (efêmero, ok p/ demo).
 */
export async function saveDb(db: Db): Promise<void> {
  cache = db;
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
  } catch {
    // Serverless: ignora — o cache em memória já reflete a mudança.
  }
}
