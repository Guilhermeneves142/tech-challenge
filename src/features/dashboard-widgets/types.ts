import type { WidgetChartType, WidgetDimension, WidgetMetric } from "@/domain";

export {
  CHART_RULES,
  CHART_TYPES,
  WIDGET_MIN_SIZE,
  defaultSizeFor,
  validDimensions,
  validMetrics,
} from "@/domain";

export const CHART_TYPE_LABELS: Record<WidgetChartType, string> = {
  kpi: "Indicador (KPI)",
  bar: "Barras",
  line: "Linha",
  area: "Área",
  pie: "Pizza",
  list: "Extrato (lista)",
};

export const METRIC_LABELS: Record<WidgetMetric, string> = {
  income: "Receitas",
  expense: "Despesas",
  balance: "Saldo (resultado)",
  count: "Nº de transações",
  comparison: "Receitas × Despesas",
};

export const DIMENSION_LABELS: Record<WidgetDimension, string> = {
  month: "Por mês",
  category: "Por categoria",
  type: "Por tipo (receita/despesa)",
};
