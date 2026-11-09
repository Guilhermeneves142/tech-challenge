// ─────────────────────────────────────────────
//  Infra · API Client — aponta para as Route Handlers em /api
//  (navegador usa "/api"; SSR usa URL absoluta)
// ─────────────────────────────────────────────
// Tipos de domínio — a infra depende do domínio, nunca o contrário.
import type {
  Balance,
  Budget,
  Category,
  Dashboard,
  DashboardWidget,
  NewDashboardWidget,
  NewTransaction,
  Report,
  Transaction,
  TransactionSummary,
  User,
} from "@/domain";
import { resolveApiBaseUrl } from "./api-base";
import { createHttpClient } from "./http-client";

const request = createHttpClient(resolveApiBaseUrl());

export interface TransactionParams {
  _sort?: keyof Transaction;
  _order?: "asc" | "desc";
  _limit?: number;
  _page?: number;
  type?: "credit" | "debit";
  category?: string;
  descriptionLike?: string;
  dateGte?: string;
  dateLte?: string;
}

const PARAM_KEY_MAP: Partial<Record<keyof TransactionParams, string>> = {
  descriptionLike: "description_like",
  dateGte: "date_gte",
  dateLte: "date_lte",
};

function toQueryString(params: TransactionParams): string {
  const qs = new URLSearchParams(
    Object.entries(params as Record<string, unknown>)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [PARAM_KEY_MAP[k as keyof TransactionParams] ?? k, String(v)])
  ).toString();
  return qs ? `?${qs}` : "";
}

// ── Endpoints ─────────────────────────────────

export const api = {
  /** Dados do usuário autenticado */
  getUser: () => request<User>("/user"),

  /** Saldo atual + variação */
  getBalance: () => request<Balance>("/balance"),

  /** Lista de transações com filtros opcionais */
  getTransactions: (params?: TransactionParams) =>
    request<Transaction[]>(`/transactions${params ? toQueryString(params) : ""}`),

  /** Transação por ID */
  getTransactionById: (id: number) =>
    request<Transaction>(`/transactions/${id}`),

  /** Receitas, despesas, saldo atual e lançamentos futuros */
  getTransactionsSummary: (params?: TransactionParams) =>
    request<TransactionSummary>(`/transactions/summary${params ? toQueryString(params) : ""}`),

  /** Categorias disponíveis */
  getCategories: () => request<Category[]>("/categories"),

  /** Planejamento / orçamentos por categoria */
  getBudgets: () => request<Budget[]>("/budgets"),

  /** Orçamento por ID */
  getBudgetById: (id: number) => request<Budget>(`/budgets/${id}`),

  /** Dados de relatório mensal */
  getReports: () => request<Report[]>("/reports"),

  /** Dashboard consolidado (user + balance + últimas 5 transações) */
  getDashboard: () => request<Dashboard>("/dashboard"),

  /** Cria uma nova transação */
  createTransaction: (body: NewTransaction) =>
    request<Transaction>("/transactions", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  /** Atualiza uma transação existente */
  updateTransaction: (id: number, body: Partial<NewTransaction>) =>
    request<Transaction>(`/transactions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  /** Remove uma transação */
  deleteTransaction: (id: number) =>
    request<void>(`/transactions/${id}`, { method: "DELETE" }),

  /** Widgets do dashboard customizável */
  getDashboardWidgets: () =>
    request<DashboardWidget[]>("/dashboardWidgets"),

  /** Cria um widget no dashboard */
  createDashboardWidget: (body: NewDashboardWidget) =>
    request<DashboardWidget>("/dashboardWidgets", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  /** Atualiza um widget (config ou posição/tamanho) */
  updateDashboardWidget: (
    id: number,
    body: Partial<NewDashboardWidget>
  ) =>
    request<DashboardWidget>(`/dashboardWidgets/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  /** Remove um widget do dashboard */
  deleteDashboardWidget: (id: number) =>
    request<void>(`/dashboardWidgets/${id}`, { method: "DELETE" }),
};
