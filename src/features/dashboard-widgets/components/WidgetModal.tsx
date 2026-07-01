"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@vandrei/finance-ui";
import type {
  Category,
  DashboardWidget,
  Transaction,
  WidgetChartType,
  WidgetDimension,
  WidgetMetric,
} from "@/lib/api";
import {
  CHART_TYPES,
  CHART_TYPE_LABELS,
  DIMENSION_LABELS,
  METRIC_LABELS,
  validDimensions,
  validMetrics,
} from "../types";
import { WidgetChart } from "./WidgetChart";

export interface WidgetFormValues {
  title: string;
  chartType: WidgetChartType;
  metric: WidgetMetric;
  dimension: WidgetDimension;
}

export interface WidgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initial?: DashboardWidget;
  transactions: Transaction[];
  categories: Category[];
  onSubmit: (values: WidgetFormValues) => Promise<void>;
}

const DEFAULT_FORM: WidgetFormValues = {
  title: "",
  chartType: "bar",
  metric: "comparison",
  dimension: "month",
};

export function WidgetModal({
  open,
  onOpenChange,
  mode,
  initial,
  transactions,
  categories,
  onSubmit,
}: WidgetModalProps) {
  const [form, setForm] = useState<WidgetFormValues>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              title: initial.title,
              chartType: initial.chartType,
              metric: initial.metric,
              dimension: initial.dimension,
            }
          : DEFAULT_FORM
      );
      setError(null);
    }
  }, [open, initial]);

  const metrics = validMetrics(form.chartType);
  const dimensions = validDimensions(form.chartType, form.metric);
  const hasMetric = metrics.length > 0;
  const hasDimension = dimensions.length > 0;

  function setChartType(chartType: WidgetChartType) {
    setForm((prev) => {
      const validM = validMetrics(chartType);
      const metric =
        validM.length === 0 || validM.includes(prev.metric)
          ? prev.metric
          : validM[0];
      const dims = validDimensions(chartType, metric);
      const dimension = dims.includes(prev.dimension)
        ? prev.dimension
        : (dims[0] ?? prev.dimension);
      return { ...prev, chartType, metric, dimension };
    });
  }

  function setMetric(metric: WidgetMetric) {
    setForm((prev) => {
      const dims = validDimensions(prev.chartType, metric);
      const dimension = dims.includes(prev.dimension)
        ? prev.dimension
        : (dims[0] ?? prev.dimension);
      return { ...prev, metric, dimension };
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("Dê um nome para o widget.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onSubmit({ ...form, title: form.title.trim() });
      onOpenChange(false);
    } catch {
      setError("Não foi possível salvar o widget. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const totalReceitas = transactions
    .filter((transaction) => transaction.type === "credit")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalDespesas = transactions
    .filter((transaction) => transaction.type === "debit")
    .reduce((total, transaction) => total + transaction.amount, 0);

    const getPreviewValue = () => {
      if (form.metric === ("revenue" as WidgetMetric)) {
        return formatCurrency(totalReceitas);
      }
    
      if (form.metric === ("expenses" as WidgetMetric)) {
        return formatCurrency(totalDespesas);
      }
    
      if (form.metric === "balance") {
        return formatCurrency(totalReceitas - totalDespesas);
      }
    
      if (form.metric === "count") {
        return `${transactions.length} transações`;
      }
    
      if (form.metric === "comparison") {
        const totalCredit = transactions.filter((t) => t.type === "credit").length;
        const totalDebit = transactions.filter((t) => t.type === "debit").length;
    
        return `Comparação com ${totalCredit} receitas e ${totalDebit} despesas`;
      }
    
      return "Gráfico disponível";
    };

  const previewText = `${METRIC_LABELS[form.metric] ?? "Indicador"}: ${getPreviewValue()}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-6 gap-0" showCloseButton>
        <DialogHeader className="mb-4">
          <DialogTitle>
            {mode === "edit" ? "Editar Widget" : "Novo Widget"}
          </DialogTitle>
        </DialogHeader>

        <form
          id="widget-form"
          onSubmit={handleSubmit}
          className="my-2 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="widget-title" className="text-label">
              Nome
            </Label>
            <Input
              id="widget-title"
              placeholder="Ex.: Despesas por categoria"
              className="rounded-lg"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              maxLength={40}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="widget-chart-type" className="text-label">
                Tipo de gráfico
              </Label>
              <Select
                value={form.chartType}
                onValueChange={(v) => v && setChartType(v as WidgetChartType)}
                items={CHART_TYPE_LABELS}
              >
                <SelectTrigger id="widget-chart-type" className="w-full rounded-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHART_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {CHART_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {hasMetric && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="widget-metric" className="text-label">
                KPI
              </Label>
              <Select
                value={form.metric}
                onValueChange={(v) => v && setMetric(v as WidgetMetric)}
                items={METRIC_LABELS}
              >
                <SelectTrigger id="widget-metric" className="w-full rounded-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {metrics.map((metric) => (
                    <SelectItem key={metric} value={metric}>
                      {METRIC_LABELS[metric]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            )}

            {hasDimension && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="widget-dimension" className="text-label">
                  Dimensão
                </Label>
                <Select
                  value={form.dimension}
                  onValueChange={(v) =>
                    v &&
                    setForm((prev) => ({
                      ...prev,
                      dimension: v as WidgetDimension,
                    }))
                  }
                  items={DIMENSION_LABELS}
                >
                  <SelectTrigger id="widget-dimension" className="w-full rounded-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dimensions.map((dimension) => (
                      <SelectItem key={dimension} value={dimension}>
                        {DIMENSION_LABELS[dimension]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
  <span id="widget-preview-title" className="text-label">
    Pré-visualização
  </span>

  <div
    tabIndex={0}
    aria-describedby="widget-preview-description"
    className="h-52 rounded-md border border-gray-200 bg-white p-3 outline-none focus:ring-2 focus:ring-brand-primary"
  >
    <span id="widget-preview-description" className="sr-only">
      {previewText}
    </span>

    <WidgetChart
      chartType={form.chartType}
      metric={form.metric}
      dimension={form.dimension}
      transactions={transactions}
      categories={categories}
    />
  </div>
</div>

          {error && (
            <p role="alert" className="text-caption text-feedback-error">
              {error}
            </p>
          )}
        </form>

        <DialogFooter className="mt-4 bg-white border-none">
          <DialogClose render={<Button variant="outline" disabled={loading} />}>
            Cancelar
          </DialogClose>
          <Button form="widget-form" type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
