"use client";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import dynamic from "next/dynamic";
import { useState } from "react";
import GridLayout, { useContainerWidth } from "react-grid-layout";
import type { Layout } from "react-grid-layout";
import { ChartNoAxesCombined, Plus } from "lucide-react";
import { Button } from "@vandrei/finance-ui";
import type { Category, DashboardWidget, Transaction, WidgetLayout } from "@/domain";
import { changedLayouts, WIDGET_MIN_SIZE } from "@/domain";
import {
  useDashboardWidgets,
  useDeleteWidget,
  useSaveWidget,
  useSaveWidgetLayouts,
} from "@/lib/queries/widgets";
import { WidgetCard } from "./WidgetCard";
import type { WidgetFormValues } from "./WidgetModal";

// Modais só são necessários após interação: saem do bundle inicial do dashboard.
const WidgetModal = dynamic(() =>
  import("./WidgetModal").then((m) => m.WidgetModal)
);
const DeleteWidgetModal = dynamic(() =>
  import("./DeleteWidgetModal").then((m) => m.DeleteWidgetModal)
);

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
  const { data: widgets } = useDashboardWidgets(initialWidgets);
  const saveWidget = useSaveWidget();
  const saveLayouts = useSaveWidgetLayouts();
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

    const changed = changedLayouts(list, layouts);

    if (changed.length === 0) return;

    saveLayouts.mutate(changed, {
      onSuccess: () => setLayoutError(null),
      onError: () =>
        setLayoutError("Não foi possível salvar a posição dos widgets."),
    });
  }

  async function handleSubmit(values: WidgetFormValues) {
    await saveWidget.mutateAsync({
      config: values,
      current: list,
      id: modal.mode === "edit" ? modal.widget?.id : undefined,
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

      {/* Montados só quando abertos: o chunk do modal é baixado sob demanda. */}
      {modal.open && (
        <WidgetModal
          open={modal.open}
          onOpenChange={(open) => setModal((prev) => ({ ...prev, open }))}
          mode={modal.mode}
          initial={modal.mode === "edit" ? modal.widget : undefined}
          transactions={transactions}
          categories={categories}
          onSubmit={handleSubmit}
        />
      )}

      {deleting !== undefined && (
        <DeleteWidgetModal
          open
          onOpenChange={(open) => !open && setDeleting(undefined)}
          widget={deleting}
          onConfirm={(id) => deleteWidget.mutateAsync(id)}
        />
      )}
    </section>
  );
}