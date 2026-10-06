"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Transaction } from "@/lib/api";

export const TRANSACTIONS_QUERY_KEY = ["transactions"] as const;
export const CATEGORIES_QUERY_KEY = ["categories"] as const;

export function useCategories(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: api.getCategories,
    enabled: options?.enabled,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Omit<Transaction, "id">) => api.createTransaction(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: Partial<Omit<Transaction, "id">>;
    }) => api.updateTransaction(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    },
  });
}
