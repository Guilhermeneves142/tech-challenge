// ─────────────────────────────────────────────
//  API Client — aponta para o Mock Server
//  Base URL configurável via variável de ambiente
// ─────────────────────────────────────────────

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

// ── Tipos ─────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  initials: string;
  plan: string;
  avatar: string | null;
}

export interface Balance {
  current: number;
  variation: number;
  variationLabel: string;
}

export interface Transaction {
  id: number;
  description: string;
  category: string;
  amount: number;
  date: string;
  dateLabel: string;
  type: "credit" | "debit";
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}

export interface Budget {
  id: number;
  category: string;
  categoryLabel: string;
  limit: number;
  spent: number;
  period: string;
}

export interface Report {
  month: string;
  income: number;
  expenses: number;
}

export interface TransactionSummary {
  totalCredit: number;
  totalDebit: number;
  net: number;
  count: number;
}

export interface Dashboard {
  user: User;
  balance: Balance;
  recentTransactions: Transaction[];
}

export interface TransactionParams {
  _sort?: keyof Transaction;
  _order?: "asc" | "desc";
  _limit?: number;
  _page?: number;
  type?: "credit" | "debit";
  category?: string;
  description_like?: string;
}

// ── Fetch base ────────────────────────────────

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

function toQueryString(params: TransactionParams): string {
  const qs = new URLSearchParams(
    Object.entries(params as Record<string, unknown>)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)])
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

  /** Totais de crédito/débito do período */
  getTransactionsSummary: () =>
    request<TransactionSummary>("/transactions/summary"),

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
};
