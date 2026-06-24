import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Category, Transaction } from "@/lib/api";
import { WidgetCard } from "./WidgetCard";

// ── Dados de exemplo (mock) usados em todas as stories ───────────────
const categories: Category[] = [
  { id: "salario", label: "Salário", icon: "Banknote" },
  { id: "moradia", label: "Moradia", icon: "Home" },
  { id: "alimentacao", label: "Alimentação", icon: "ShoppingBag" },
  { id: "transporte", label: "Transporte", icon: "CarFront" },
  { id: "saude", label: "Saúde", icon: "HeartPulse" },
];

const tx = (
  id: number,
  description: string,
  category: string,
  amount: number,
  date: string,
  dateLabel: string
): Transaction => ({
  id,
  description,
  category,
  amount,
  date,
  dateLabel,
  type: amount >= 0 ? "credit" : "debit",
});

const transactions: Transaction[] = [
  tx(1, "Salário", "salario", 5200, "2025-03-05T09:00:00Z", "05 Mar"),
  tx(2, "Aluguel", "moradia", -1500, "2025-03-08T09:00:00Z", "08 Mar"),
  tx(3, "Mercado", "alimentacao", -640, "2025-03-12T09:00:00Z", "12 Mar"),
  tx(4, "Uber", "transporte", -210, "2025-03-20T09:00:00Z", "20 Mar"),
  tx(5, "Salário", "salario", 5200, "2025-04-05T09:00:00Z", "05 Abr"),
  tx(6, "Aluguel", "moradia", -1500, "2025-04-08T09:00:00Z", "08 Abr"),
  tx(7, "Mercado", "alimentacao", -720, "2025-04-14T09:00:00Z", "14 Abr"),
  tx(8, "Farmácia", "saude", -180, "2025-04-22T09:00:00Z", "22 Abr"),
  tx(9, "Salário", "salario", 5400, "2025-05-05T09:00:00Z", "05 Mai"),
  tx(10, "Aluguel", "moradia", -1500, "2025-05-08T09:00:00Z", "08 Mai"),
  tx(11, "Mercado", "alimentacao", -610, "2025-05-13T09:00:00Z", "13 Mai"),
  tx(12, "Combustível", "transporte", -300, "2025-05-19T09:00:00Z", "19 Mai"),
];

// ── Meta ─────────────────────────────────────────────────────────────
const meta = {
  title: "Dashboard/WidgetCard",
  component: WidgetCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Card de **widget** exibido na Home (dashboard) do host. Renderiza um título, " +
          "ações de editar/excluir e um gráfico (`WidgetChart`) que se adapta ao tipo " +
          "configurado: KPI, barras, linha, área, pizza ou extrato (lista). Os dados " +
          "(`transactions` e `categories`) são agregados conforme `metric` e `dimension`.",
      },
    },
  },
  args: {
    transactions,
    categories,
    onEdit: () => {},
    onDelete: () => {},
  },
  argTypes: {
    transactions: { control: false },
    categories: { control: false },
    onEdit: { control: false },
    onDelete: { control: false },
  },
  // Recharts usa ResponsiveContainer: precisa de um pai com tamanho fixo.
  decorators: [
    (Story) => (
      <div style={{ width: 380, height: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WidgetCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories (uma por tipo de gráfico) ────────────────────────────────
export const KPISaldo: Story = {
  name: "KPI · Saldo",
  args: {
    widget: {
      id: 1,
      title: "Saldo atual",
      chartType: "kpi",
      metric: "balance",
      dimension: "month",
      layout: { x: 0, y: 0, w: 4, h: 3 },
    },
  },
};

export const Barras: Story = {
  name: "Barras · Receitas × Despesas por mês",
  args: {
    widget: {
      id: 2,
      title: "Receitas × Despesas",
      chartType: "bar",
      metric: "comparison",
      dimension: "month",
      layout: { x: 0, y: 0, w: 6, h: 8 },
    },
  },
};

export const Linha: Story = {
  name: "Linha · Saldo por mês",
  args: {
    widget: {
      id: 3,
      title: "Evolução do saldo",
      chartType: "line",
      metric: "balance",
      dimension: "month",
      layout: { x: 0, y: 0, w: 6, h: 8 },
    },
  },
};

export const Area: Story = {
  name: "Área · Despesas por mês",
  args: {
    widget: {
      id: 4,
      title: "Despesas no tempo",
      chartType: "area",
      metric: "expense",
      dimension: "month",
      layout: { x: 0, y: 0, w: 6, h: 8 },
    },
  },
};

export const Pizza: Story = {
  name: "Pizza · Despesas por categoria",
  args: {
    widget: {
      id: 5,
      title: "Despesas por categoria",
      chartType: "pie",
      metric: "expense",
      dimension: "category",
      layout: { x: 0, y: 0, w: 6, h: 8 },
    },
  },
};

export const Extrato: Story = {
  name: "Extrato · Lista de transações",
  args: {
    widget: {
      id: 6,
      title: "Últimas transações",
      chartType: "list",
      metric: "balance",
      dimension: "month",
      layout: { x: 0, y: 0, w: 8, h: 8 },
    },
  },
};
