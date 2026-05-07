// ─────────────────────────────────────────────
//  Mock Server — FinanceApp
//  Powered by json-server v0
//  Porta padrão: 3001
// ─────────────────────────────────────────────
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router(join(__dirname, "db.json"));
const middlewares = jsonServer.defaults({ nolog: false });

const PORT = process.env.MOCK_PORT || 3001;


// ── Middlewares padrão (logger, cors) ──
server.use(middlewares);
server.use(jsonServer.bodyParser);

// ── Delay simulado (descomentar para testar loading states) ──
// server.use((req, res, next) => setTimeout(next, 800));

// ─────────────────────────────────────────────
//  ROTAS CUSTOMIZADAS
//  Registre aqui ANTES do router automático.
// ─────────────────────────────────────────────

/**
 * GET /api/dashboard
 * Resumo consolidado: user + balance + últimas 5 transações.
 */

function getInitials(name) {
  return String(name)
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function removePassword(user) {
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

server.post("/api/auth/register", (req, res) => {
  const db = router.db;
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Nome, e-mail e senha são obrigatórios.",
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  const existingUser = db.get("users").find({ email: normalizedEmail }).value();

  if (existingUser) {
    return res.status(409).json({
      message: "E-mail já cadastrado.",
    });
  }

  
  const users = db.get("users").value();
    const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    name: String(name).trim(),
    email: normalizedEmail,
    password: String(password),
    initials: getInitials(name),
    plan: "Plano Grátis",
    avatar: null,
  };

  db.get("users").push(newUser).write();

  return res.status(201).json({
    user: removePassword(newUser),
    token: `fake-token-${newUser.id}`,
  });
});

server.post("/api/auth/login", (req, res) => {
  const db = router.db;
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "E-mail e senha são obrigatórios.",
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  const user = db
    .get("users")
    .find({
      email: normalizedEmail,
      password: String(password),
    })
    .value();

  if (!user) {
    return res.status(401).json({
      message: "E-mail ou senha inválidos.",
    });
  }

  return res.json({
    user: removePassword(user),
    token: `fake-token-${user.id}`,
  });
});

server.get("/api/dashboard", (req, res) => {
  const db = router.db;
  const user = db.get("user").value();
  const all = db.get("transactions").value();
  const recentTransactions = db
    .get("transactions")
    .orderBy("date", "desc")
    .take(5)
    .value();

  const current = all.reduce((sum, t) => sum + t.amount, 0);
  const balance = {
    current,
    variation: 0,
    variationLabel: "+0% este mês",
  };

  res.json({ user, balance, recentTransactions });
});

/**
 * GET /api/transactions/summary
 * Receitas, despesas, saldo atual (até hoje) e lançamentos futuros.
 * Aceita os mesmos filtros de /api/transactions.
 */
server.get("/api/transactions/summary", (req, res) => {
  const db = router.db;
  let transactions = db.get("transactions").value();

  if (req.query.type) {
    transactions = transactions.filter((t) => t.type === req.query.type);
  }

  if (req.query.description_like) {
    transactions = transactions.filter((t) =>
      t.description
        .toLowerCase()
        .includes(req.query.description_like.toLowerCase())
    );
  }

  if (req.query.date_gte) {
    transactions = transactions.filter((t) => t.date >= req.query.date_gte);
  }

  if (req.query.date_lte) {
    transactions = transactions.filter((t) => t.date <= req.query.date_lte);
  }

  const now = new Date().toISOString();

  const income = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const future = transactions
    .filter((t) => t.date > now)
    .reduce((sum, t) => sum + t.amount, 0);

  res.json({
    income,
    expense,
    currentBalance: income - expense,
    future,
  });
});

// ── Roteador automático com prefixo /api ──
server.use("/api", router);

const instance = server.listen(PORT, () => {
  console.log("");
  console.log("  ┌─────────────────────────────────────────┐");
  console.log("  │                                         │");
  console.log("  │   🟢  Mock Server rodando               │");
  console.log(`  │   📡  http://localhost:${PORT}              │`);
  console.log("  │                                         │");
  console.log("  │   Rotas disponíveis:                    │");
  console.log("  │   POST /api/auth/register               │");
  console.log("  │   POST /api/auth/login                  │");
  console.log("  │   GET  /api/user                        │");
  console.log("  │   GET  /api/balance                     │");
  console.log("  │   GET  /api/transactions                │");
  console.log("  │   GET  /api/transactions/summary        │");
  console.log("  │   GET  /api/categories                  │");
  console.log("  │   GET  /api/budgets                     │");
  console.log("  │   GET  /api/reports                     │");
  console.log("  │   GET  /api/dashboard                   │");
  console.log("  │                                         │");
  console.log("  │   Docs: mock/README.md                  │");
  console.log("  └─────────────────────────────────────────┘");
  console.log("");
});

instance.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n  ❌  Porta ${PORT} já está em uso.`);
    console.error(
      `  ➜   Encerre o processo anterior ou use: MOCK_PORT=3002 npm run dev:mock\n`
    );
    process.exit(1);
  }

  throw err;
});