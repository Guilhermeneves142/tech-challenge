// ─────────────────────────────────────────────
//  Domínio · Transações
//  Entidades puras: sem React, sem fetch, sem Next.
// ─────────────────────────────────────────────

export type TransactionType = "credit" | "debit";

export interface Transaction {
  id: number;
  description: string;
  category: string;
  /** Positivo para receita, negativo para despesa. */
  amount: number;
  date: string;
  dateLabel: string;
  type: TransactionType;
}

/** Transação ainda não persistida (sem id). */
export type NewTransaction = Omit<Transaction, "id">;

export interface Category {
  id: string;
  label: string;
  icon: string;
}

export interface TransactionSummary {
  income: number;
  expense: number;
  currentBalance: number;
  future: number;
}
