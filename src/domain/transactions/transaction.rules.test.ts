import { describe, expect, it } from "vitest";
import {
  EMPTY_TRANSACTION_DRAFT,
  TransactionValidationError,
  parseAmount,
  toNewTransaction,
  toSignedAmount,
  validateTransactionDraft,
  type TransactionDraft,
} from "@/domain";

const valid: TransactionDraft = {
  description: "Mercado",
  amount: "150,90",
  category: "food",
  date: "2026-10-25",
  type: "debit",
};

describe("parseAmount", () => {
  it.each([
    ["10", 10],
    ["10,5", 10.5],
    ["10.50", 10.5],
    ["1.234,56", 1234.56],
  ])("%s → %d", (raw, expected) => {
    expect(parseAmount(raw)).toBeCloseTo(expected);
  });

  it("vazio vira NaN", () => expect(parseAmount("  ")).toBeNaN());
});

describe("validateTransactionDraft", () => {
  it("aceita rascunho válido", () => expect(validateTransactionDraft(valid)).toBeNull());
  it("exige descrição", () =>
    expect(validateTransactionDraft({ ...valid, description: " " })).toMatch(/Descrição/));
  it("rejeita valor zero/negativo/texto", () => {
    for (const amount of ["0", "-5", "abc"]) {
      expect(validateTransactionDraft({ ...valid, amount })).toMatch(/valor/);
    }
  });
  it("exige categoria e data", () => {
    expect(validateTransactionDraft({ ...valid, category: "" })).toMatch(/categoria/);
    expect(validateTransactionDraft({ ...valid, date: "" })).toMatch(/data/);
  });
});

describe("toSignedAmount", () => {
  it("despesa negativa, receita positiva", () => {
    expect(toSignedAmount(50, "debit")).toBe(-50);
    expect(toSignedAmount(-50, "credit")).toBe(50);
  });
});

describe("toNewTransaction", () => {
  it("monta a entidade com valor assinado e descrição limpa", () => {
    const tx = toNewTransaction({ ...valid, description: "  Mercado  " }, new Date(2026, 9, 25, 14, 30));
    expect(tx).toMatchObject({ description: "Mercado", amount: -150.9, category: "food", type: "debit" });
    expect(tx.dateLabel).toBe("25 out, 14:30");
  });

  it("lança erro de validação para rascunho inválido", () => {
    expect(() => toNewTransaction(EMPTY_TRANSACTION_DRAFT)).toThrow(TransactionValidationError);
  });
});
