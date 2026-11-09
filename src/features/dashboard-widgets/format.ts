import type { WidgetMetric } from "@/domain";
import { formatCompact, formatCurrency } from "@/shared/formatters/currency";

export function formatMetricValue(metric: WidgetMetric, value: number): string {
  return metric === "count" ? String(value) : formatCurrency(value);
}

export function formatAxisValue(metric: WidgetMetric, value: number): string {
  return metric === "count" ? String(value) : formatCompact(value);
}
