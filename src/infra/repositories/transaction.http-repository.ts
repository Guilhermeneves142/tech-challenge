import type { TransactionRepository } from "@/domain";
import { api } from "@/infra/http/finance-api";

/** Adapter: implementa a porta do domínio usando a API HTTP (/api). */
export const httpTransactionRepository: TransactionRepository = {
  list: () => api.getTransactions({ _sort: "date", _order: "desc" }),
  create: (data) => api.createTransaction(data),
  update: (id, data) => api.updateTransaction(id, data),
  remove: (id) => api.deleteTransaction(id),
  listCategories: () => api.getCategories(),
};
