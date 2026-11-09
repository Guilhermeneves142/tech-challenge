"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { repositories, useCases } from "@/di/container";
import type { LayoutChange, SaveWidgetInput } from "@/application/widgets";
import { applyLayouts } from "@/domain";
import type { DashboardWidget, NewDashboardWidget } from "@/domain";

export const WIDGETS_QUERY_KEY = ["dashboard-widgets"] as const;

/** Widgets do dashboard. `initialWidgets` vem do SSR da página — evita refetch no mount. */
export function useDashboardWidgets(initialWidgets?: DashboardWidget[]) {
  return useQuery({
    queryKey: WIDGETS_QUERY_KEY,
    queryFn: () => repositories.widgets.list(),
    initialData: initialWidgets,
  });
}

export function useSaveWidget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveWidgetInput) => useCases.saveWidget(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WIDGETS_QUERY_KEY });
    },
  });
}

export function useUpdateWidget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<NewDashboardWidget> }) =>
      repositories.widgets.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WIDGETS_QUERY_KEY });
    },
  });
}

export function useDeleteWidget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => repositories.widgets.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WIDGETS_QUERY_KEY });
    },
  });
}

/**
 * Salva posições após drag/resize.
 * - `scope`: mutações de layout rodam em FILA (uma termina antes da próxima começar).
 * - `onMutate`: cancela refetch em andamento e atualiza o cache na hora (otimista).
 * - Sem invalidate no sucesso: o cache já tem o valor certo; um refetch no meio
 *   de outro salvamento traria posições antigas e o widget "voltaria".
 * - No erro: refaz a busca para sincronizar com o servidor.
 */
export function useSaveWidgetLayouts() {
  const queryClient = useQueryClient();

  return useMutation({
    scope: { id: "dashboard-widgets-layout" },
    mutationFn: (changes: LayoutChange[]) => useCases.saveWidgetLayouts(changes),
    onMutate: async (changes) => {
      await queryClient.cancelQueries({ queryKey: WIDGETS_QUERY_KEY });
      queryClient.setQueryData<DashboardWidget[]>(WIDGETS_QUERY_KEY, (prev) =>
        prev ? applyLayouts(prev, changes) : prev
      );
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: WIDGETS_QUERY_KEY });
    },
  });
}
