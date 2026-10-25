import type { Category, Transaction } from "../transactions/transaction.entity";
import type { WidgetDimension, WidgetMetric } from "./widget.entity";

// ─────────────────────────────────────────────
//  Domínio · Métricas dos widgets
//  Agregações puras sobre transações (sem formatação de UI).
// ─────────────────────────────────────────────

export interface ChartDatum {
  label: string;
  value: number;
  income?: number;
  expense?: number;
}

const MONTH_FORMATTER = new Intl.DateTimeFormat("pt-BR", { month: "short" });

function sumIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);
}

function sumExpense(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

export function metricValue(
  transactions: Transaction[],
  metric: WidgetMetric
): number {
  switch (metric) {
    case "income":
      return sumIncome(transactions);
    case "expense":
      return sumExpense(transactions);
    case "balance":
    case "comparison":
      return sumIncome(transactions) - sumExpense(transactions);
    case "count":
      return transactions.length;
  }
}

interface Group {
  key: string;
  label: string;
  transactions: Transaction[];
}

function groupBy(
  transactions: Transaction[],
  dimension: WidgetDimension,
  categories: Category[]
): Group[] {
  const groups = new Map<string, Group>();

  const labelFor = (t: Transaction): { key: string; label: string } => {
    switch (dimension) {
      case "month": {
        const key = t.date.slice(0, 7); // YYYY-MM
        const date = new Date(`${key}-01T12:00:00`);
        const month = MONTH_FORMATTER.format(date).replace(".", "");
        const label = `${month.charAt(0).toUpperCase()}${month.slice(1)}/${key.slice(2, 4)}`;
        return { key, label };
      }
      case "category": {
        const category = categories.find((c) => c.id === t.category);
        return { key: t.category, label: category?.label ?? t.category };
      }
      case "type":
        return t.type === "credit"
          ? { key: "credit", label: "Receitas" }
          : { key: "debit", label: "Despesas" };
    }
  };

  for (const t of transactions) {
    const { key, label } = labelFor(t);
    const group = groups.get(key);
    if (group) {
      group.transactions.push(t);
    } else {
      groups.set(key, { key, label, transactions: [t] });
    }
  }

  const result = [...groups.values()];

  // Mês ordena cronologicamente; demais dimensões por relevância (valor depois)
  if (dimension === "month") {
    result.sort((a, b) => a.key.localeCompare(b.key));
  }

  return result;
}

/** Constrói a série de dados do gráfico a partir de métrica × dimensão */
export function buildSeries(
  transactions: Transaction[],
  metric: WidgetMetric,
  dimension: WidgetDimension,
  categories: Category[]
): ChartDatum[] {
  const groups = groupBy(transactions, dimension, categories);

  const data = groups.map((group) => ({
    label: group.label,
    value: metricValue(group.transactions, metric),
    ...(metric === "comparison" && {
      income: sumIncome(group.transactions),
      expense: sumExpense(group.transactions),
    }),
  }));

  if (dimension !== "month") {
    data.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  }

  return data;
}
