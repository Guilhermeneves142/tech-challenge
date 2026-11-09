import type {
  DashboardWidget,
  WidgetChartType,
  WidgetConfig,
  WidgetDimension,
  WidgetLayout,
  WidgetMetric,
} from "./widget.entity";

//   Regras dos widgets

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
  kpi: { metrics: ["balance", "income", "expense", "count"], dimensions: [] },
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
  pie: { metrics: ["expense", "income", "count"], dimensions: ["category", "type"] },
  list: { metrics: [], dimensions: [] },
};

export const CHART_TYPES = Object.keys(CHART_RULES) as WidgetChartType[];

export const WIDGET_MIN_SIZE = { minW: 2, minH: 2 };

export const DEFAULT_WIDGET_CONFIG: WidgetConfig = {
  title: "",
  chartType: "bar",
  metric: "comparison",
  dimension: "month",
};

export function validMetrics(chartType: WidgetChartType): WidgetMetric[] {
  return CHART_RULES[chartType].metrics;
}

export function validDimensions(
  chartType: WidgetChartType,
  metric: WidgetMetric
): WidgetDimension[] {
  const dims = CHART_RULES[chartType].dimensions;
  return metric === "comparison" ? dims.filter((d) => d !== "type") : dims;
}

  //Usado sempre que o usuário troca tipo de gráfico ou métrica no formulário.
 
export function normalizeWidgetConfig(config: WidgetConfig): WidgetConfig {
  const metrics = validMetrics(config.chartType);
  const metric =
    metrics.length === 0 || metrics.includes(config.metric)
      ? config.metric
      : metrics[0];
  const dims = validDimensions(config.chartType, metric);
  const dimension = dims.includes(config.dimension)
    ? config.dimension
    : (dims[0] ?? config.dimension);
  return { ...config, metric, dimension };
}

export function validateWidgetConfig(config: WidgetConfig): string | null {
  if (!config.title.trim()) return "Dê um nome para o widget.";
  return null;
}

export function defaultSizeFor(
  chartType: WidgetChartType
): Pick<WidgetLayout, "w" | "h"> {
  if (chartType === "kpi") return { w: 4, h: 3 };
  if (chartType === "list") return { w: 8, h: 8 };
  return { w: 6, h: 8 };
}

/** Novo widget entra abaixo de todos os existentes, na coluna 0. */
export function nextWidgetLayout(
  widgets: DashboardWidget[],
  chartType: WidgetChartType
): WidgetLayout {
  const bottom = widgets.reduce(
    (max, w) => Math.max(max, w.layout.y + w.layout.h),
    0
  );
  return { x: 0, y: bottom, ...defaultSizeFor(chartType) };
}

export function sameLayout(a: WidgetLayout, b: WidgetLayout): boolean {
  return a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;
}

/** Só os widgets cuja posição/tamanho mudou de fato (evita PATCH desnecessário). */
export function changedLayouts(
  widgets: DashboardWidget[],
  next: Array<{ id: number; layout: WidgetLayout }>
): Array<{ id: number; layout: WidgetLayout }> {
  return next.filter(({ id, layout }) => {
    const widget = widgets.find((w) => w.id === id);
    return widget !== undefined && !sameLayout(widget.layout, layout);
  });
}

/** Aplica as novas posições na lista (usado na atualização otimista do cache). */
export function applyLayouts(
  widgets: DashboardWidget[],
  changes: Array<{ id: number; layout: WidgetLayout }>
): DashboardWidget[] {
  return widgets.map((w) => {
    const change = changes.find((c) => c.id === w.id);
    return change ? { ...w, layout: change.layout } : w;
  });
}
