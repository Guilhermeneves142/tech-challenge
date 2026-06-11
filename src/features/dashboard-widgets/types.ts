import type {
  WidgetChartType,
  WidgetDimension,
  WidgetLayout,
  WidgetMetric,
} from "@/lib/api";

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

export const CHART_TYPES = Object.keys(CHART_TYPE_LABELS) as WidgetChartType[];

interface ChartRules {
  metrics: WidgetMetric[];
  dimensions: WidgetDimension[];
}

/**
 * Combinações válidas de tipo de gráfico × métrica × dimensão.
 * - KPI não usa dimensão (é um número agregado).
 * - Pizza não aceita "saldo" (fatias negativas) nem dimensão temporal.
 * - Linha/Área só fazem sentido sobre eixo temporal (mês).
 * - Extrato (lista) não usa métrica nem dimensão — lista as transações recentes.
 */
export const CHART_RULES: Record<WidgetChartType, ChartRules> = {
  kpi: {
    metrics: ["balance", "income", "expense", "count"],
    dimensions: [],
  },
  bar: {
    metrics: ["comparison", "income", "expense", "balance", "count"],
    dimensions: ["month", "category", "type"],
  },
  line: {
    metrics: ["comparison", "income", "expense", "balance", "count"],
    dimensions: ["month"],
  },
  area: {
    metrics: ["comparison", "income", "expense", "balance", "count"],
    dimensions: ["month"],
  },
  pie: {
    metrics: ["expense", "income", "count"],
    dimensions: ["category", "type"],
  },
  list: {
    metrics: [],
    dimensions: [],
  },
};

export function validMetrics(chartType: WidgetChartType): WidgetMetric[] {
  return CHART_RULES[chartType].metrics;
}

export function validDimensions(
  chartType: WidgetChartType,
  metric: WidgetMetric
): WidgetDimension[] {
  const dims = CHART_RULES[chartType].dimensions;
  // "Receitas × Despesas" já separa por tipo — dimensão "type" seria redundante
  return metric === "comparison" ? dims.filter((d) => d !== "type") : dims;
}

/** Tamanho inicial na grid de 12 colunas conforme o tipo de gráfico */
export function defaultSizeFor(
  chartType: WidgetChartType
): Pick<WidgetLayout, "w" | "h"> {
  if (chartType === "kpi") return { w: 4, h: 3 };
  if (chartType === "list") return { w: 8, h: 8 };
  return { w: 6, h: 8 };
}

export const WIDGET_MIN_SIZE = { minW: 2, minH: 2 };
