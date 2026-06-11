"use client";

import { create } from "zustand";
import { api } from "@/lib/api";
import type { DashboardWidget, WidgetLayout } from "@/lib/api";

interface WidgetsState {
  widgets: DashboardWidget[];
  hydrated: boolean;
  error: string | null;
  hydrate: (widgets: DashboardWidget[]) => void;
  addWidget: (data: Omit<DashboardWidget, "id">) => Promise<void>;
  updateWidget: (
    id: number,
    data: Partial<Omit<DashboardWidget, "id">>
  ) => Promise<void>;
  removeWidget: (id: number) => Promise<void>;
  applyLayouts: (
    layouts: Array<{ id: number; layout: WidgetLayout }>
  ) => void;
}

function sameLayout(a: WidgetLayout, b: WidgetLayout): boolean {
  return a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;
}

export const useWidgetsStore = create<WidgetsState>((set, get) => ({
  widgets: [],
  hydrated: false,
  error: null,

  hydrate: (widgets) => {
    // O store é a fonte de verdade após a primeira carga — evita que uma
    // navegação com payload em cache do servidor sobrescreva mutações já feitas
    if (!get().hydrated) {
      set({ widgets, hydrated: true });
    }
  },

  addWidget: async (data) => {
    const created = await api.createDashboardWidget(data);
    set((state) => ({ widgets: [...state.widgets, created], error: null }));
  },

  updateWidget: async (id, data) => {
    const updated = await api.updateDashboardWidget(id, data);
    set((state) => ({
      widgets: state.widgets.map((w) => (w.id === id ? updated : w)),
      error: null,
    }));
  },

  removeWidget: async (id) => {
    await api.deleteDashboardWidget(id);
    set((state) => ({
      widgets: state.widgets.filter((w) => w.id !== id),
      error: null,
    }));
  },

  applyLayouts: (layouts) => {
    const { widgets } = get();
    const changed = layouts.filter(({ id, layout }) => {
      const widget = widgets.find((w) => w.id === id);
      return widget && !sameLayout(widget.layout, layout);
    });

    if (changed.length === 0) return;

    set({
      widgets: widgets.map((w) => {
        const next = changed.find((c) => c.id === w.id);
        return next ? { ...w, layout: next.layout } : w;
      }),
    });

    Promise.all(
      changed.map(({ id, layout }) =>
        api.updateDashboardWidget(id, { layout })
      )
    ).catch(() =>
      set({ error: "Não foi possível salvar a posição dos widgets." })
    );
  },
}));
