"use client";

// Adapter de apresentação: React Query cuida de cache/estado de servidor;
// a regra de negócio fica nos casos de uso (application) e no domínio.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { repositories, useCases } from "@/di/container";
import type { SaveTransactionInput } from "@/application/transactions";
import type { Transaction } from "@/domain";

export const TRANSACTIONS_QUERY_KEY = ["transactions"] as const;
export const CATEGORIES_QUERY_KEY = ["categories"] as const;

/** Transações do dashboard. `initialTransactions` vem do SSR — evita refetch no mount. */
export function useTransactions(initialTransactions?: Transaction[]) {
  return useQuery({
    queryKey: TRANSACTIONS_QUERY_KEY,
    queryFn: () => repositories.transactions.list(),
    initialData: initialTransactions,
  });
}

export function useCategories(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () => repositories.transactions.listCategories(),
    enabled: options?.enabled,
    // Categorias quase nunca mudam: evita refetch à toa
    staleTime: Infinity,
  });
}

export function useSaveTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveTransactionInput) => useCases.saveTransaction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => useCases.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    },
  });
}
