const CURRENCY = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const COMPACT = new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 });

/** 1234.5 → "R$ 1.234,50" */
export function formatCurrency(value: number): string {
  return CURRENCY.format(value);
}

/** 1234.5 → "1,2 mil" */
export function formatCompact(value: number): string {
  return COMPACT.format(value);
}

/** -50 → "- R$ 50,00" · 50 → "+ R$ 50,00" */
export function formatSignedCurrency(value: number): string {
  return `${value < 0 ? "- " : "+ "}${CURRENCY.format(Math.abs(value))}`;
}
