"use client";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { useState } from "react";
import GridLayout, { useContainerWidth } from "react-grid-layout";
import type { Layout } from "react-grid-layout";
import { ChartNoAxesCombined, Plus } from "lucide-react";
import { Button } from "@vandrei/finance-ui";
import { useQueryClient } from "@tanstack/react-query";
import type { Category, DashboardWidget, Transaction, WidgetLayout } from "@/lib/api";
import {
  useCreateWidget,
  useDashboardWidgets,
  useDeleteWidget,
  useUpdateWidget,
  WIDGETS_QUERY_KEY,
} from "@/lib/queries/widgets";
import { defaultSizeFor, WIDGET_MIN_SIZE } from "../types";
import { WidgetCard } from "./WidgetCard";
import { DeleteWidgetModal } from "./DeleteWidgetModal";
import { WidgetModal, type WidgetFormValues } from "./WidgetModal";

export interface WidgetsBoardProps {
  initialWidgets: DashboardWidget[];
  transactions: Transaction[];
  categories: Category[];
}

interface ModalState {
  open: boolean;
  mode: "create" | "edit";
  widget?: DashboardWidget;
}

function sameLayout(a: WidgetLayout, b: WidgetLayout): boolean {
  return a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;
}

export function WidgetsBoard({
  initialWidgets,
  transactions,
  categories,
}: WidgetsBoardProps) {
  const { width, containerRef, mounted } = useContainerWidth();
  const queryClient = useQueryClient();
  const { data: widgets } = useDashboardWidgets(initialWidgets);
  const createWidget = useCreateWidget();
  const updateWidget = useUpdateWidget();
  const deleteWidget = useDeleteWidget();
  const [layoutError, setLayoutError] = useState<string | null>(null);

  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: "create",
  });
  const [deleting, setDeleting] = useState<DashboardWidget | undefined>();

  const list = widgets ?? initialWidgets;
  const isMobile = width < 640;

  const layout: Layout = list.map((w, index) => {
    const base = {
      i: String(w.id),
      ...w.layout,
      ...WIDGET_MIN_SIZE,
    };

    if (isMobile) {
      return {
        ...base,
        x: 0,
        y: index * 8,
        w: 12,
        h: Math.max(base.h - 1, 4)
      };
    }

    return base;
  });

  function handleLayoutChange(next: Layout) {
    if (isMobile) return;

    const layouts: Array<{ id: number; layout: WidgetLayout }> = next.map(
      (item) => ({
        id: Number(item.i),
        layout: { x: item.x, y: item.y, w: item.w, h: item.h },
      })
    );

    const changed = layouts.filter(({ id, layout }) => {
      const widget = list.find((w) => w.id === id);
      return widget && !sameLayout(widget.layout, layout);
    });

    if (changed.length === 0) return;

    // Atualiza o cache localmente antes da persistência, para o drag parecer instantâneo
    queryClient.setQueryData<DashboardWidget[]>(WIDGETS_QUERY_KEY, (prev) =>
      (prev ?? list).map((w) => {
        const next = changed.find((c) => c.id === w.id);
        return next ? { ...w, layout: next.layout } : w;
      })
    );

    Promise.all(
      changed.map(({ id, layout }) =>
        updateWidget.mutateAsync({ id, data: { layout } })
      )
    )
      .then(() => setLayoutError(null))
      .catch(() =>
        setLayoutError("Não foi possível salvar a posição dos widgets.")
      );
  }

  async function handleSubmit(values: WidgetFormValues) {
    if (modal.mode === "edit" && modal.widget) {
      await updateWidget.mutateAsync({ id: modal.widget.id, data: values });
      return;
    }

    const bottom = list.reduce(
      (max, w) => Math.max(max, w.layout.y + w.layout.h),
      0
    );

    await createWidget.mutateAsync({
      ...values,
      layout: {
        x: 0,
        y: bottom,
        ...defaultSizeFor(values.chartType),
      },
    });
  }

  return (
    <section aria-label="Análises financeiras" className="w-full overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-2 pb-4 pt-2">
        <div className="flex min-w-0 items-center gap-2">
          <ChartNoAxesCombined
            className="size-6 shrink-0 text-brand-tertiary max-lg:size-5"
            aria-hidden
          />
          <h2 className="truncate text-[24px] font-bold max-lg:text-lg">
            Análises financeiras
          </h2>
        </div>

        <Button
          onClick={() => setModal({ open: true, mode: "create" })}
          className="gap-1.5 max-sm:w-full"
        >
          <Plus className="size-4" aria-hidden />
          Adicionar widget
        </Button>
      </header>

      {layoutError && (
        <p role="alert" className="pb-2 text-caption text-feedback-error">
          {layoutError}
        </p>
      )}

      <div ref={containerRef} className="w-full overflow-hidden">
        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-gray-300 bg-white/50 px-6 py-12 text-center">
            <p className="text-base text-text-tertiary">
              Seu dashboard está vazio. Adicione um widget para começar a
              acompanhar suas finanças.
            </p>

            <Button onClick={() => setModal({ open: true, mode: "create" })}>
              <Plus className="size-4" aria-hidden />
              Adicionar widget
            </Button>
          </div>
        ) : (
          mounted &&
          width > 0 && (
            <GridLayout
              layout={layout}
              width={width}
              gridConfig={{
                cols: 12,
                rowHeight: isMobile ? 42 : 36,
                margin: isMobile ? [0, 16] : [12, 12],
              }}
              dragConfig={{
                enabled: !isMobile,
                handle: ".widget-drag-handle",
              }}
              resizeConfig={{ enabled: !isMobile }}
              onLayoutChange={handleLayoutChange}
              className={isMobile ? "mx-0" : "-mx-3"}
            >
              {list.map((widget) => (
                <div key={String(widget.id)} className="min-w-0 overflow-hidden">
                  <WidgetCard
                    widget={widget}
                    transactions={transactions}
                    categories={categories}
                    onEdit={(w) =>
                      setModal({ open: true, mode: "edit", widget: w })
                    }
                    onDelete={(w) => setDeleting(w)}
                  />
                </div>
              ))}
            </GridLayout>
          )
        )}
      </div>

      <WidgetModal
        open={modal.open}
        onOpenChange={(open) => setModal((prev) => ({ ...prev, open }))}
        mode={modal.mode}
        initial={modal.mode === "edit" ? modal.widget : undefined}
        transactions={transactions}
        categories={categories}
        onSubmit={handleSubmit}
      />

      <DeleteWidgetModal
        open={deleting !== undefined}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        widget={deleting}
        onConfirm={(id) => deleteWidget.mutateAsync(id)}
      />
    </section>
  );
}