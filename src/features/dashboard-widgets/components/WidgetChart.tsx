"use client";

import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  Category,
  Transaction,
  WidgetChartType,
  WidgetDimension,
  WidgetMetric,
} from "@/lib/api";
import { getCategoryIcon } from "@/lib/categoryIcons";
import {
  buildSeries,
  formatAxisValue,
  formatMetricValue,
  metricValue,
} from "../aggregate";
import { METRIC_LABELS } from "../types";

export interface WidgetChartProps {
  chartType: WidgetChartType;
  metric: WidgetMetric;
  dimension: WidgetDimension;
  transactions: Transaction[];
  categories: Category[];
}

const METRIC_COLORS: Record<Exclude<WidgetMetric, "comparison">, string> = {
  income: "var(--color-brand-primary)",
  expense: "var(--color-feedback-error)",
  balance: "var(--color-brand-tertiary)",
  count: "var(--color-surface-primary)",
};

const INCOME_COLOR = "var(--color-brand-primary)";
const EXPENSE_COLOR = "var(--color-feedback-error)";

const PIE_PALETTE = [
  "var(--color-brand-tertiary)",   
  "var(--color-surface-primary)", 
  "var(--color-brand-primary)",   
  "var(--color-text-secondary)",   
  "var(--color-feedback-error)",   
  "var(--color-feedback-info)",    
  "var(--color-feedback-warning)", 
  "var(--color-text-tertiary)",   
];

const AXIS_TICK = { fontSize: 11, fill: "var(--color-text-tertiary)" };
const GRID_STROKE = "var(--color-gray-200)";
export function WidgetChart({
  chartType,
  metric,
  dimension,
  transactions,
  categories,
}: WidgetChartProps) {
  if (chartType === "kpi") {
    const value = metricValue(transactions, metric);
    const metricText = `${METRIC_LABELS[metric]}: ${formatMetricValue(metric, value)}`;
    const negative = metric === "balance" && value < 0;
    const color =
      metric === "expense" || negative
        ? "text-feedback-error"
        : metric === "count"
          ? "text-text-secondary"
          : "text-brand-primary";

          return (
            <div
              tabIndex={0}
              aria-label={metricText}
              className="flex h-full flex-col items-start justify-center gap-1 px-2 outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <span className="sr-only">{metricText}</span>
          
              <strong
                aria-hidden="true"
                className={`text-3xl font-bold leading-tight ${color}`}
              >
                {formatMetricValue(metric, value)}
              </strong>
          
              <span aria-hidden="true" className="text-sm text-text-tertiary">
                {METRIC_LABELS[metric]}
              </span>
            </div>
          );
  }

  if (chartType === "list") {
    if (transactions.length === 0) {
      return (
        <div className="flex h-full items-center justify-center text-sm text-text-tertiary">
          Sem transações recentes
        </div>
      );
    }

    const recent = [...transactions].sort((a, b) =>
      b.date.localeCompare(a.date)
    );

    return (
      <div className="flex h-full flex-col">
        <ul className="min-h-0 flex-1 divide-y divide-gray-100 overflow-y-auto">
          {recent.map((t) => {
            const Icon = getCategoryIcon(categories, t.category);
            return (
              <li key={t.id} className="flex items-center gap-3 px-1 py-2.5">
                <span className="flex shrink-0 items-center justify-center rounded-full bg-brand-secondary p-2 text-brand-primary">
                  <Icon className="size-4 shrink-0" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {t.description}
                  </p>
                  <span className="text-caption text-text-tertiary">
                    {t.dateLabel}
                  </span>
                </div>
                <span
                  className={`shrink-0 text-sm font-bold ${
                    t.amount < 0 ? "text-feedback-error" : "text-feedback-success"
                  }`}
                >
                  {formatMetricValue("balance", t.amount)}
                </span>
              </li>
            );
          })}
        </ul>
        <Link
          href="/transacoes"
          className="pt-2 text-sm font-bold text-feedback-success transition-opacity hover:opacity-75"
        >
          Ver tudo
        </Link>
      </div>
    );
  }

  const data = buildSeries(transactions, metric, dimension, categories);

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-text-tertiary">
        Sem dados para exibir
      </div>
    );
  }

  const valueFormatter = (value: unknown) =>
    formatMetricValue(metric, Number(value));
  const axisFormatter = (value: unknown) =>
    formatAxisValue(metric, Number(value));

  if (chartType === "pie") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius="55%"
            outerRadius="85%"
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.label}
                fill={PIE_PALETTE[index % PIE_PALETTE.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={valueFormatter} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  const comparison = metric === "comparison";
  const singleColor = comparison
    ? INCOME_COLOR
    : METRIC_COLORS[metric as Exclude<WidgetMetric, "comparison">];

  const axes = (
    <>
      <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
      <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={false} />
      <YAxis
        tick={AXIS_TICK}
        tickLine={false}
        axisLine={false}
        tickFormatter={axisFormatter}
        width={52}
      />
      <Tooltip formatter={valueFormatter} />
      {comparison && (
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
      )}
    </>
  );

  if (chartType === "bar") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          {axes}
          {comparison ? (
            <>
              <Bar dataKey="income" name="Receitas" fill={INCOME_COLOR} radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Despesas" fill={EXPENSE_COLOR} radius={[4, 4, 0, 0]} />
            </>
          ) : (
            <Bar dataKey="value" name={METRIC_LABELS[metric]} fill={singleColor} radius={[4, 4, 0, 0]} />
          )}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === "line") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          {axes}
          {comparison ? (
            <>
              <Line type="monotone" dataKey="income" name="Receitas" stroke={INCOME_COLOR} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="expense" name="Despesas" stroke={EXPENSE_COLOR} strokeWidth={2} dot={false} />
            </>
          ) : (
            <Line type="monotone" dataKey="value" name={METRIC_LABELS[metric]} stroke={singleColor} strokeWidth={2} dot={false} />
          )}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        {axes}
        {comparison ? (
          <>
            <Area type="monotone" dataKey="income" name="Receitas" stroke={INCOME_COLOR} fill={INCOME_COLOR} fillOpacity={0.15} strokeWidth={2} />
            <Area type="monotone" dataKey="expense" name="Despesas" stroke={EXPENSE_COLOR} fill={EXPENSE_COLOR} fillOpacity={0.15} strokeWidth={2} />
          </>
        ) : (
          <Area type="monotone" dataKey="value" name={METRIC_LABELS[metric]} stroke={singleColor} fill={singleColor} fillOpacity={0.15} strokeWidth={2} />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
