export type WidgetChartType = "kpi" | "bar" | "line" | "area" | "pie" | "list";
export type WidgetMetric = "income" | "expense" | "balance" | "count" | "comparison";
export type WidgetDimension = "month" | "category" | "type";

export interface WidgetLayout {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DashboardWidget {
  id: number;
  title: string;
  chartType: WidgetChartType;
  metric: WidgetMetric;
  dimension: WidgetDimension;
  layout: WidgetLayout;
}

export type NewDashboardWidget = Omit<DashboardWidget, "id">;

/** Configuração editável de um widget (o que o modal manipula). */
export interface WidgetConfig {
  title: string;
  chartType: WidgetChartType;
  metric: WidgetMetric;
  dimension: WidgetDimension;
}
