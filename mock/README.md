# Dados mock — FinanceApp

O `db.json` desta pasta é a **fonte de dados** da API mock, que roda como
**Route Handlers do Next** em `src/app/api/[...path]` (um mini json-server).
Não existe mais servidor separado — a API sobe junto com o host, em `/api`.

Onde os dados vivem, por ambiente:

| Ambiente | Persistência |
|---|---|
| Local / Docker | Este `mock/db.json` (leituras e escritas no arquivo) |
| Vercel (produção) | **Upstash Redis** (chave `finance:db`, criada no 1º acesso com o seed deste arquivo) |

A lógica de acesso fica em `src/server/mock-db.ts`: se as env vars
`UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` existem, usa o Redis;
senão, usa o arquivo.

> `server.mjs` e `package.json` desta pasta são **legado** do json-server —
> não são usados pelo app nem pelo deploy.

---

## Iniciando

```bash
# Sobe host (3000) + MFEs; a API fica em http://localhost:3000/api
npm run dev

# Só o host
npm run dev:next
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
| `POST` | `/api/auth/login` · `/api/auth/register` | Autenticação |

> Todos os recursos de lista (`transactions`, `budgets`, etc.) também aceitam
> `POST`, `PUT`, `PATCH` e `DELETE`, no estilo json-server.

---

## Filtros e paginação (recursos de lista)

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
├── users         → array (autenticação)
├── transactions  → array (CRUD completo)
├── categories    → array (CRUD completo)
├── budgets       → array (CRUD completo)
├── reports       → array (CRUD completo)
└── dashboardWidgets → array (CRUD completo)
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
- `GET /api/goals` · `GET /api/goals/:id`
- `POST /api/goals` · `PUT/PATCH /api/goals/:id` · `DELETE /api/goals/:id`

### 2. (Opcional) Rota customizada

Lógica que o CRUD genérico não cobre (agregações, joins) entra como um
_branch_ em `src/app/api/[...path]/route.ts`, antes do CRUD genérico —
veja `getDashboard()` e `getSummary()` como exemplos.

### 3. Adicionar o endpoint no helper `src/lib/api.ts`

```ts
export const api = {
  // ...endpoints existentes

  getGoals: () => request("/goals"),
};
```

### 4. Usar no componente

```tsx
import { api } from "@/lib/api";

const goals = await api.getGoals();
```

> Em produção, o novo recurso só aparece depois que a chave do Redis for
> re-seedada (`npm run db:seed`) ou apagada (o próximo acesso recria com o
> seed novo), já que o banco de lá foi inicializado com um `db.json` antigo.

---

## Resetar o banco de produção

```bash
# Requer UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN no .env.local
npm run db:seed
```

Envia o `mock/db.json` local para a chave `finance:db` do Redis, sobrescrevendo
os dados atuais de produção.

---

## Variável de ambiente (clientes)

Para os clientes apontarem para outro servidor (ex: backend real em staging):

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.staging.financeapp.com
```

Quando não definida, usa `/api` (mesma origem do host — funciona em qualquer
ambiente por causa do multizone).
