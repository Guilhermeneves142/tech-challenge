// ──────────────────────────────────────────────────────────────
//  Mini "json-server" como Route Handlers do Next (substitui o
//  mock externo). Replica o comportamento usado pelos clientes:
//   - CRUD genérico por recurso (/api/<recurso>[/<id>])
//   - filtros ?campo=valor, ?campo_like=, ?campo_gte=, ?campo_lte=
//   - ordenação ?_sort=&_order= e paginação ?_page=&_limit=
//   - rotas custom: /auth/login, /auth/register, /dashboard,
//     /transactions/summary
//
//  Local/Docker: persiste em mock/db.json. Vercel: efêmero (demo).
// ──────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from "next/server";
import { getDb, saveDb, type Db } from "@/server/mock-db";

export const runtime = "nodejs"; // precisa de FS
export const dynamic = "force-dynamic"; // sem cache

type Item = Record<string, unknown>;

// Recursos que são objeto único (não-coleção) no db.json
const SINGULAR = new Set(["user", "balance"]);

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function stripPassword(user: Item | undefined) {
  if (!user) return user;
  const { password: _omit, ...rest } = user;
  return rest;
}

function getInitials(name: string) {
  return String(name)
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function nextId(items: Item[]) {
  return items.length
    ? Math.max(...items.map((i) => Number(i.id) || 0)) + 1
    : 1;
}

// ── GET ────────────────────────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: seg = [] } = await params;
  const db = await getDb();

  // Rotas custom
  if (seg.length === 1 && seg[0] === "dashboard") return getDashboard(db);
  if (seg.length === 2 && seg[0] === "transactions" && seg[1] === "summary") {
    return getSummary(db, req.nextUrl.searchParams);
  }

  const [resource, id] = seg;
  if (!resource || !(resource in db)) return json({}, 404);

  // Objeto único (user, balance)
  if (SINGULAR.has(resource)) return json(db[resource]);

  const collection = (db[resource] as Item[]) ?? [];

  // /api/<recurso>/<id>
  if (id !== undefined) {
    const found = collection.find((it) => String(it.id) === String(id));
    return found ? json(found) : json({}, 404);
  }

  // /api/<recurso> com filtros/ordenação/paginação
  return json(queryCollection(collection, req.nextUrl.searchParams));
}

// ── POST ───────────────────────────────────────────────────────
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: seg = [] } = await params;

  if (seg[0] === "auth" && seg[1] === "login") return login(req);
  if (seg[0] === "auth" && seg[1] === "register") return register(req);

  const db = await getDb();
  const resource = seg[0];
  if (!resource || !Array.isArray(db[resource])) return json({}, 404);

  const body = (await req.json()) as Item;
  const collection = db[resource] as Item[];
  const created = { id: nextId(collection), ...body };
  collection.push(created);
  await saveDb(db);
  return json(created, 201);
}

// ── PATCH / PUT ────────────────────────────────────────────────
async function updateItem(
  req: NextRequest,
  seg: string[],
  replace: boolean
) {
  const db = await getDb();
  const [resource, id] = seg;
  if (!resource || !Array.isArray(db[resource])) return json({}, 404);

  const collection = db[resource] as Item[];
  const idx = collection.findIndex((it) => String(it.id) === String(id));
  if (idx === -1) return json({}, 404);

  const body = (await req.json()) as Item;
  collection[idx] = replace
    ? { id: collection[idx].id, ...body }
    : { ...collection[idx], ...body };
  await saveDb(db);
  return json(collection[idx]);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return updateItem(req, (await params).path ?? [], false);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return updateItem(req, (await params).path ?? [], true);
}

// ── DELETE ─────────────────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: seg = [] } = await params;
  const db = await getDb();
  const [resource, id] = seg;
  if (!resource || !Array.isArray(db[resource])) return json({}, 404);

  const collection = db[resource] as Item[];
  const idx = collection.findIndex((it) => String(it.id) === String(id));
  if (idx === -1) return json({}, 404);

  collection.splice(idx, 1);
  await saveDb(db);
  return json({});
}

// ── Helpers de query (estilo json-server) ──────────────────────
function queryCollection(items: Item[], sp: URLSearchParams): Item[] {
  let result = [...items];
  let sort: string | undefined;
  let order = "asc";
  let page: number | undefined;
  let limit: number | undefined;

  for (const [key, value] of sp.entries()) {
    if (key === "_sort") sort = value;
    else if (key === "_order") order = value;
    else if (key === "_page") page = Number(value);
    else if (key === "_limit") limit = Number(value);
    else if (key.endsWith("_like")) {
      const field = key.slice(0, -"_like".length);
      result = result.filter((it) =>
        String(it[field] ?? "")
          .toLowerCase()
          .includes(value.toLowerCase())
      );
    } else if (key.endsWith("_gte")) {
      const field = key.slice(0, -"_gte".length);
      result = result.filter((it) => (it[field] as never) >= (value as never));
    } else if (key.endsWith("_lte")) {
      const field = key.slice(0, -"_lte".length);
      result = result.filter((it) => (it[field] as never) <= (value as never));
    } else {
      result = result.filter((it) => String(it[key]) === value);
    }
  }

  if (sort) {
    result.sort((a, b) => {
      const av = a[sort] as never;
      const bv = b[sort] as never;
      if (av < bv) return order === "desc" ? 1 : -1;
      if (av > bv) return order === "desc" ? -1 : 1;
      return 0;
    });
  }

  if (page !== undefined || limit !== undefined) {
    const l = limit ?? 10;
    const p = page ?? 1;
    const start = (p - 1) * l;
    result = result.slice(start, start + l);
  }

  return result;
}

// ── Rotas custom ───────────────────────────────────────────────
function getDashboard(db: Db) {
  const all = (db.transactions as Item[]) ?? [];
  const recentTransactions = [...all]
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 5);
  const current = all.reduce((sum, t) => sum + Number(t.amount), 0);
  return json({
    user: db.user,
    balance: { current, variation: 0, variationLabel: "+0% este mês" },
    recentTransactions,
  });
}

function getSummary(db: Db, sp: URLSearchParams) {
  let txs = (db.transactions as Item[]) ?? [];
  const type = sp.get("type");
  const descLike = sp.get("description_like");
  const dateGte = sp.get("date_gte");
  const dateLte = sp.get("date_lte");

  if (type) txs = txs.filter((t) => t.type === type);
  if (descLike)
    txs = txs.filter((t) =>
      String(t.description).toLowerCase().includes(descLike.toLowerCase())
    );
  if (dateGte) txs = txs.filter((t) => String(t.date) >= dateGte);
  if (dateLte) txs = txs.filter((t) => String(t.date) <= dateLte);

  const now = new Date().toISOString();
  const income = txs
    .filter((t) => t.type === "credit")
    .reduce((s, t) => s + Number(t.amount), 0);
  const expense = txs
    .filter((t) => t.type === "debit")
    .reduce((s, t) => s + Math.abs(Number(t.amount)), 0);
  const future = txs
    .filter((t) => String(t.date) > now)
    .reduce((s, t) => s + Number(t.amount), 0);

  return json({ income, expense, currentBalance: income - expense, future });
}

async function login(req: NextRequest) {
  const db = await getDb();
  const { email, password } = (await req.json()) as {
    email?: string;
    password?: string;
  };
  if (!email || !password)
    return json({ message: "E-mail e senha são obrigatórios." }, 400);

  const normalized = String(email).trim().toLowerCase();
  const user = (db.users as Item[]).find(
    (u) => u.email === normalized && String(u.password) === String(password)
  );
  if (!user) return json({ message: "E-mail ou senha inválidos." }, 401);

  return json({ user: stripPassword(user), token: `fake-token-${user.id}` });
}

async function register(req: NextRequest) {
  const db = await getDb();
  const { name, email, password } = (await req.json()) as {
    name?: string;
    email?: string;
    password?: string;
  };
  if (!name || !email || !password)
    return json({ message: "Nome, e-mail e senha são obrigatórios." }, 400);

  const normalized = String(email).trim().toLowerCase();
  const users = db.users as Item[];
  if (users.find((u) => u.email === normalized))
    return json({ message: "E-mail já cadastrado." }, 409);

  const newUser: Item = {
    id: nextId(users),
    name: String(name).trim(),
    email: normalized,
    password: String(password),
    initials: getInitials(name),
    plan: "Plano Grátis",
    avatar: null,
  };
  users.push(newUser);
  await saveDb(db);
  return json(
    { user: stripPassword(newUser), token: `fake-token-${newUser.id}` },
    201
  );
}
