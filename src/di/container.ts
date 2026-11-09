// ─────────────────────────────────────────────
//  Composition root: único lugar que liga casos de uso às implementações
//  concretas (infra). Trocar HTTP por mock/teste = mudar só aqui.
// ─────────────────────────────────────────────
import { makeDeleteTransaction, makeSaveTransaction } from "@/application/transactions";
import { makeSaveWidget, makeSaveWidgetLayouts } from "@/application/widgets";
import { httpTransactionRepository } from "@/infra/repositories/transaction.http-repository";
import { httpWidgetRepository } from "@/infra/repositories/widget.http-repository";

export const repositories = {
  transactions: httpTransactionRepository,
  widgets: httpWidgetRepository,
};

export const useCases = {
  saveTransaction: makeSaveTransaction(repositories.transactions),
  deleteTransaction: makeDeleteTransaction(repositories.transactions),
  saveWidget: makeSaveWidget(repositories.widgets),
  saveWidgetLayouts: makeSaveWidgetLayouts(repositories.widgets),
};
