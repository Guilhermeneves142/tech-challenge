"use client";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { useEffect, useState } from "react";
import GridLayout, { useContainerWidth } from "react-grid-layout";
import type { Layout } from "react-grid-layout";
import { ChartNoAxesCombined, Plus } from "lucide-react";
import { Button } from "@vandrei/finance-ui";
import type { Category, DashboardWidget, Transaction } from "@/lib/api";
import { useWidgetsStore } from "../store";
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

export function WidgetsBoard({
  initialWidgets,
  transactions,
  categories,
}: WidgetsBoardProps) {
  const { width, containerRef, mounted } = useContainerWidth();
  const widgets = useWidgetsStore((s) => s.widgets);
  const hydrated = useWidgetsStore((s) => s.hydrated);
  const layoutError = useWidgetsStore((s) => s.error);
  const hydrate = useWidgetsStore((s) => s.hydrate);
  const addWidget = useWidgetsStore((s) => s.addWidget);
  const updateWidget = useWidgetsStore((s) => s.updateWidget);
  const removeWidget = useWidgetsStore((s) => s.removeWidget);
  const applyLayouts = useWidgetsStore((s) => s.applyLayouts);

  const [modal, setModal] = useState<ModalState>({ open: false, mode: "create" });
  const [deleting, setDeleting] = useState<DashboardWidget | undefined>();

  useEffect(() => {
    hydrate(initialWidgets);
  }, [hydrate, initialWidgets]);

  const list = hydrated ? widgets : initialWidgets;

  const layout: Layout = list.map((w) => ({
    i: String(w.id),
    ...w.layout,
    ...WIDGET_MIN_SIZE,
  }));

  function handleLayoutChange(next: Layout) {
    if (!hydrated) return;
    applyLayouts(
      next.map((item) => ({
        id: Number(item.i),
        layout: { x: item.x, y: item.y, w: item.w, h: item.h },
      }))
    );
  }

  async function handleSubmit(values: WidgetFormValues) {
    if (modal.mode === "edit" && modal.widget) {
      await updateWidget(modal.widget.id, values);
      return;
    }
    const bottom = list.reduce(
      (max, w) => Math.max(max, w.layout.y + w.layout.h),
      0
    );
    await addWidget({
      ...values,
      layout: { x: 0, y: bottom, ...defaultSizeFor(values.chartType) },
    });
  }

  return (
    <section aria-label="Análises financeiras">
      <header className="flex flex-wrap items-center justify-between gap-2 pb-4 pt-2">
        <div className="flex items-center gap-2">
          <ChartNoAxesCombined
            className="size-6 shrink-0 text-brand-tertiary max-lg:size-5"
            aria-hidden
          />
          <h2 className="text-[24px] font-bold max-lg:text-lg">
            Análises financeiras
          </h2>
        </div>
        <Button
          onClick={() => setModal({ open: true, mode: "create" })}
          className="gap-1.5"
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

      <div ref={containerRef}>
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
              gridConfig={{ cols: 12, rowHeight: 36, margin: [12, 12] }}
              dragConfig={{ enabled: true, handle: ".widget-drag-handle" }}
              resizeConfig={{ enabled: true }}
              onLayoutChange={handleLayoutChange}
              className="-mx-3"
            >
              {list.map((widget) => (
                <div key={String(widget.id)}>
                  <WidgetCard
                    widget={widget}
                    transactions={transactions}
                    categories={categories}
                    onEdit={(w) => setModal({ open: true, mode: "edit", widget: w })}
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
        onConfirm={removeWidget}
      />
    </section>
  );
}
