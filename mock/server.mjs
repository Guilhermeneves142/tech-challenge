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
server.get("/api/dashboard", (req, res) => {
  const db = router.db;
  const user = db.get("user").value();
  const balance = db.get("balance").value();
  const transactions = db
    .get("transactions")
    .orderBy("date", "desc")
    .take(5)
    .value();

  res.json({ user, balance, recentTransactions: transactions });
});

/**
 * GET /api/transactions/summary
 * Totais de crédito, débito e saldo líquido.
 */
server.get("/api/transactions/summary", (req, res) => {
  const db = router.db;
  let transactions = db.get("transactions").value();

  // aplica os mesmos filtros
  if (req.query.type) {
    transactions = transactions.filter((t) => t.type === req.query.type)
  }

  if (req.query.description_like) {
    transactions = transactions.filter((t) =>
      t.description.toLowerCase().includes(req.query.description_like.toLowerCase())
    )
  }

  const totalCredit = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebit = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  res.json({
    totalCredit,
    totalDebit,
    net: totalCredit - totalDebit,
    count: transactions.length,
  });
});

// ── Roteador automático com prefixo /api ──
server.use("/api", router);

// ─────────────────────────────────────────────
const instance = server.listen(PORT, () => {
  console.log("");
  console.log("  ┌─────────────────────────────────────────┐");
  console.log("  │                                         │");
  console.log("  │   🟢  Mock Server rodando               │");
  console.log(`  │   📡  http://localhost:${PORT}              │`);
  console.log("  │                                         │");
  console.log("  │   Rotas disponíveis:                    │");
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
    console.error(`  ➜   Encerre o processo anterior ou use: MOCK_PORT=3002 npm run dev:mock\n`);
    process.exit(1);
  } else {
    throw err;
  }
});
