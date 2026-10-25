import type { Category, NewTransaction, Transaction } from "./transaction.entity";

/**
 * Porta (contrato) de persistência. O domínio só conhece esta interface;
 * quem implementa (HTTP, mock, Redis…) fica na camada de infra.
 */
export interface TransactionRepository {
  create(data: NewTransaction): Promise<Transaction>;
  update(id: number, data: Partial<NewTransaction>): Promise<Transaction>;
  remove(id: number): Promise<void>;
  listCategories(): Promise<Category[]>;
}
