import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
// Seed usado para inicializar o banco (primeiro acesso no Redis / fallback local).
import seed from "../../mock/db.json";

export type Db = Record<string, unknown>;

const DB_PATH = path.join(process.cwd(), "mock", "db.json");
const DB_KEY = "finance:db";

// Upstash Redis (produção/Vercel). Aceita tanto as env vars do console do
// Upstash (UPSTASH_*) quanto as da integração Vercel Marketplace (KV_*).
const REDIS_URL =
  process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const REDIS_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const redis =
  REDIS_URL && REDIS_TOKEN
    ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
    : null;

// Cache em memória usado apenas no modo arquivo (local/Docker) como atalho.
let cache: Db | null = null;

/**
 * Lê o "banco".
 * - Com Upstash configurado (produção): lê a chave no Redis; se não existir,
 *   inicializa com o seed do `mock/db.json`.
 * - Sem Upstash (local/Docker): lê `mock/db.json` do disco.
 */
export async function getDb(): Promise<Db> {
  if (redis) {
    const stored = await redis.get<Db>(DB_KEY);
    if (stored) return stored;
    const initial = structuredClone(seed) as Db;
    await redis.set(DB_KEY, initial);
    return initial;
  }

  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    cache = JSON.parse(raw) as Db;
  } catch {
    if (!cache) cache = structuredClone(seed) as Db;
  }
  return cache;
}

/**
 * Grava o "banco".
 * - Com Upstash configurado (produção): persiste a chave no Redis.
 * - Sem Upstash (local/Docker): escreve em `mock/db.json`.
 */
export async function saveDb(db: Db): Promise<void> {
  if (redis) {
    await redis.set(DB_KEY, db);
    return;
  }

  cache = db;
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
  } catch {
    // FS somente-leitura sem Redis configurado: mantém só em memória (efêmero).
  }
}
