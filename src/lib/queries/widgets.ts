"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { DashboardWidget } from "@/lib/api";

export const WIDGETS_QUERY_KEY = ["dashboard-widgets"] as const;

/** Widgets do dashboard. `initialWidgets` vem do SSR da página — evita refetch no mount. */
export function useDashboardWidgets(initialWidgets?: DashboardWidget[]) {
  return useQuery({
    queryKey: WIDGETS_QUERY_KEY,
    queryFn: api.getDashboardWidgets,
    initialData: initialWidgets,
  });
}

export function useCreateWidget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<DashboardWidget, "id">) =>
      api.createDashboardWidget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WIDGETS_QUERY_KEY });
    },
  });
}

export function useUpdateWidget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<Omit<DashboardWidget, "id">>;
    }) => api.updateDashboardWidget(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WIDGETS_QUERY_KEY });
    },
  });
}

export function useDeleteWidget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.deleteDashboardWidget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WIDGETS_QUERY_KEY });
    },
  });
}
