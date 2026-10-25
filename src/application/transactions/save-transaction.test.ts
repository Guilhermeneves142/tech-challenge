import { describe, expect, it, vi } from "vitest";
import { TransactionValidationError, type NewTransaction, type TransactionRepository } from "@/domain";
import { makeSaveTransaction } from "./save-transaction";

function fakeRepo(): TransactionRepository {
  return {
    create: vi.fn(async (data) => ({ id: 1, ...data })),
    update: vi.fn(async (id, data) => ({ id, ...(data as NewTransaction) })),
    remove: vi.fn(async () => {}),
    listCategories: vi.fn(async () => []),
  };
}

const draft = { description: "Salário", amount: "5000", category: "salary", date: "2026-10-05", type: "credit" as const };
const clock = () => new Date(2026, 9, 5, 9, 0);

describe("saveTransaction", () => {
  it("cria quando não há id", async () => {
    const repo = fakeRepo();
    await makeSaveTransaction(repo, clock)({ draft });
    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({ amount: 5000 }));
    expect(repo.update).not.toHaveBeenCalled();
  });

  it("edita quando há id", async () => {
    const repo = fakeRepo();
    await makeSaveTransaction(repo, clock)({ draft, id: 7 });
    expect(repo.update).toHaveBeenCalledWith(7, expect.objectContaining({ description: "Salário" }));
  });

  it("não chama a API se o rascunho é inválido", async () => {
    const repo = fakeRepo();
    await expect(makeSaveTransaction(repo, clock)({ draft: { ...draft, amount: "" } })).rejects.toBeInstanceOf(
      TransactionValidationError
    );
    expect(repo.create).not.toHaveBeenCalled();
  });
});
