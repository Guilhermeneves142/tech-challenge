# Mock Server — FinanceApp

Servidor HTTP de dados mock baseado em **json-server**.  
Roda na porta **3001** junto com o Next.js ao executar `npm run dev`.

---

## Iniciando

```bash
# Sobe Next.js (3000) + Mock Server (3001) juntos
npm run dev

# Ou separadamente
npm run dev:next   # só o Next.js
npm run dev:mock   # só o mock server
```

---

## Rotas disponíveis

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/user` | Dados do usuário logado |
| `GET` | `/api/balance` | Saldo atual e variação |
| `GET` | `/api/transactions` | Lista de transações |
| `GET` | `/api/transactions/:id` | Transação por ID |
| `GET` | `/api/transactions/summary` | Totais crédito/débito |
| `GET` | `/api/categories` | Categorias disponíveis |
| `GET` | `/api/budgets` | Orçamentos por categoria |
| `GET` | `/api/budgets/:id` | Orçamento por ID |
| `GET` | `/api/reports` | Dados mensais para gráfico |
| `GET` | `/api/dashboard` | Resumo consolidado (dashboard) |

> O json-server também gera automaticamente `POST`, `PUT`, `PATCH` e `DELETE`  
> para todos os recursos de lista (`transactions`, `budgets`, etc.).

---

## Filtros e paginação (recursos de lista)

O json-server suporta query params nativamente:

```bash
# Ordenar por data decrescente
GET /api/transactions?_sort=date&_order=desc

# Limitar resultados
GET /api/transactions?_limit=5

# Filtrar por tipo
GET /api/transactions?type=debit

# Combinar filtros
GET /api/transactions?type=debit&_sort=date&_order=desc&_limit=10

# Busca em campos de texto
GET /api/transactions?description_like=uber
```

---

## Estrutura dos dados (`mock/db.json`)

```
db.json
├── user          → objeto único
├── balance       → objeto único
├── transactions  → array (CRUD completo)
├── categories    → array (CRUD completo)
├── budgets       → array (CRUD completo)
└── reports       → array (CRUD completo)
```

---

## Como adicionar uma nova API

### 1. Adicionar dados ao `db.json`

```jsonc
{
  // recursos existentes...

  "goals": [
    {
      "id": 1,
      "title": "Reserva de emergência",
      "target": 30000.00,
      "current": 12000.00,
      "deadline": "2025-12-31"
    }
  ]
}
```

Isso já cria automaticamente as rotas:
- `GET /api/goals`
- `GET /api/goals/:id`
- `POST /api/goals`
- `PUT /api/goals/:id`
- `PATCH /api/goals/:id`
- `DELETE /api/goals/:id`

### 2. (Opcional) Adicionar rota customizada em `server.mjs`

Use rotas customizadas quando precisar de lógica que o json-server não faz automaticamente (ex: agregações, joins):

```js
/**
 * GET /api/goals/summary
 * Retorna total investido e percentual atingido
 */
server.get("/api/goals/summary", (req, res) => {
  const db = router.db;
  const goals = db.get("goals").value();

  const total = goals.reduce((sum, g) => sum + g.target, 0);
  const saved = goals.reduce((sum, g) => sum + g.current, 0);

  res.json({ total, saved, percent: (saved / total) * 100 });
});
```

> ⚠️ Rotas customizadas devem ser registradas **antes** do `server.use("/api", router)`.

### 3. Adicionar o endpoint no helper `src/lib/api.ts`

```ts
export const api = {
  // ...endpoints existentes

  getGoals: () => request("/goals"),
  getGoalsSummary: () => request("/goals/summary"),
};
```

### 4. Usar no componente

```tsx
import { api } from "@/lib/api";

const goals = await api.getGoals();
```

---

## Variável de ambiente

Para apontar para outro servidor (ex: backend real em staging):

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.staging.financeapp.com
```

Quando não definida, usa `http://localhost:3001/api`.

---

## Porta customizada

```bash
MOCK_PORT=4000 npm run dev:mock
```
