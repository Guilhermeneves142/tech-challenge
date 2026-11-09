import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { NewTransaction, TransactionType } from "./transaction.entity";

export const DESCRIPTION_MAX_LENGTH = 20;

/** O que o usuário preenche no formulário (tudo string, como vem do input). */
export interface TransactionDraft {
  description: string;
  amount: string;
  category: string;
  date: string;
  type: TransactionType;
}

export const EMPTY_TRANSACTION_DRAFT: TransactionDraft = {
  description: "",
  amount: "",
  category: "",
  date: "",
  type: "credit",
};

export class TransactionValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TransactionValidationError";
  }
}

/**
 * Converte o valor digitado em número.
 * Aceita "10", "10,5", "10.50" e "1.234,56" (formato pt-BR com milhar).
 */
export function parseAmount(raw: string): number {
  const value = raw.trim();
  if (!value) return NaN;
  const normalized = value.includes(",")
    ? value.replace(/\./g, "").replace(",", ".")
    : value;
  return Number(normalized);
}

/** Retorna a primeira mensagem de erro ou `null` se o rascunho é válido. */
export function validateTransactionDraft(draft: TransactionDraft): string | null {
  if (!draft.description.trim()) return "Descrição é obrigatória.";
  if (draft.description.trim().length > DESCRIPTION_MAX_LENGTH)
    return `Descrição deve ter no máximo ${DESCRIPTION_MAX_LENGTH} caracteres.`;
  const amount = parseAmount(draft.amount);
  if (!Number.isFinite(amount) || amount <= 0) return "Informe um valor válido.";
  if (!draft.category) return "Selecione uma categoria.";
  if (!draft.date) return "Selecione uma data.";
  return null;
}

/** Despesanegativa; receita positiva. */
export function toSignedAmount(amount: number, type: TransactionType): number {
  const abs = Math.abs(amount);
  return type === "debit" ? -abs : abs;
}

export function buildDateLabel(date: string, now: Date): string {
  const withTime = new Date(`${date}T${format(now, "HH:mm:ss")}`);
  return format(withTime, "dd MMM, HH:mm", { locale: ptBR });
}

export function toNewTransaction(draft: TransactionDraft, now: Date = new Date()): NewTransaction {
  const error = validateTransactionDraft(draft);
  if (error) throw new TransactionValidationError(error);

  return {
    description: draft.description.trim(),
    amount: toSignedAmount(parseAmount(draft.amount), draft.type),
    category: draft.category,
    date: new Date(draft.date).toISOString(),
    dateLabel: buildDateLabel(draft.date, now),
    type: draft.type,
  };
}
