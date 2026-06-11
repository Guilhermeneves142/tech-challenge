"use client";

import { GripVertical, Pencil, Trash2 } from "lucide-react";
import type { Category, DashboardWidget, Transaction } from "@/lib/api";
import { WidgetChart } from "./WidgetChart";

export interface WidgetCardProps {
  widget: DashboardWidget;
  transactions: Transaction[];
  categories: Category[];
  onEdit: (widget: DashboardWidget) => void;
  onDelete: (widget: DashboardWidget) => void;
}

export function WidgetCard({
  widget,
  transactions,
  categories,
  onEdit,
  onDelete,
}: WidgetCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-md bg-white shadow">
      <header className="flex items-center gap-1 border-b border-gray-200 py-2 pl-2 pr-3">
        <button
          type="button"
          className="widget-drag-handle flex cursor-grab items-center rounded p-1 text-gray-400 hover:text-text-secondary active:cursor-grabbing"
          aria-label={`Mover widget ${widget.title}`}
        >
          <GripVertical className="size-4" aria-hidden />
        </button>
        <h3 className="min-w-0 flex-1 truncate text-sm font-bold" title={widget.title}>
          {widget.title}
        </h3>
        <button
          type="button"
          onClick={() => onEdit(widget)}
          className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-ring"
          aria-label={`Editar widget ${widget.title}`}
        >
          <Pencil className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => onDelete(widget)}
          className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-feedback-error focus-visible:outline-2 focus-visible:outline-ring"
          aria-label={`Excluir widget ${widget.title}`}
        >
          <Trash2 className="size-4" aria-hidden />
        </button>
      </header>
      <div className="min-h-0 flex-1 p-3">
        <WidgetChart
          chartType={widget.chartType}
          metric={widget.metric}
          dimension={widget.dimension}
          transactions={transactions}
          categories={categories}
        />
      </div>
    </article>
  );
}
