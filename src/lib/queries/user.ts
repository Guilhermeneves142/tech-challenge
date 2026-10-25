"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/infra/http/auth-api";

export const CURRENT_USER_QUERY_KEY = ["current-user"] as const;

/** Usuário da sessão (cookie httpOnly via /api/auth/me). Cacheado pelo React Query. */
export function useCurrentUser() {
  return useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: () => authApi.me(),
    staleTime: 5 * 60 * 1000,
  });
}
