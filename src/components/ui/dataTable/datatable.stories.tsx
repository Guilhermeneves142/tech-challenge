import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from './dataTable'
import { ReactNode } from 'react'
import { ShoppingCart } from 'lucide-react'

type Transaction = {
  id: string
  description: ReactNode
  amount: number
  date: string
  status: 'completed' | 'pending' | 'failed'
}

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'description' as const,
    header: 'Descrição',
    cell: ({ getValue }) => getValue() as ReactNode,
  },
  {
    accessorKey: 'amount' as const,
    header: 'Valor',
    cell: ({ getValue }) =>
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
        .format(getValue() as number),
  },
  {
    accessorKey: 'date' as const,
    header: 'Data',
    meta: { width: 120 },
  },
  {
    accessorKey: 'status' as const,
    header: 'Status',
    cell: ({ getValue }) => {
      const map: Record<string, string> = {
        completed: 'Concluído',
        pending: 'Pendente',
        failed: 'Falhou',
      }
      return map[getValue() as string] ?? String(getValue())
    },
    meta: { width: 120 },
  },
]

function makeRows(count: number): Transaction[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `#${String(i + 1).padStart(4, '0')}`,
    description: (
      <div className="flex flex-row gap-4">
        <span className="p-2 rounded-full text-brand-primary bg-brand-secondary">
          <ShoppingCart className="size-5" />
        </span>
        <div className="flex flex-col">
          <h6>Transação {i + 1}</h6>
          <p className="text-caption text-(--color-text-tertiary)">
            {new Date(2024, i % 12, (i % 28) + 1).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    ),
    amount: Math.random() * 5000,
    date: new Date(2024, i % 12, (i % 28) + 1).toLocaleDateString('pt-BR'),
    status: (['completed', 'pending', 'failed'] as const)[i % 3],
  }))
}

const DataTableTransaction = (props: { data: Transaction[]; pageSize?: number }) => (
  <DataTable columns={columns} {...props} />
)

const meta: Meta<typeof DataTableTransaction> = {
  title: 'Components/DataTable',
  component: DataTableTransaction,
  tags: ['autodocs'],
  argTypes: {
    pageSize: {
      control: { type: 'select' },
      options: [5, 10, 20],
    },
  },
}

export default meta
type Story = StoryObj<typeof DataTableTransaction>

export const Default: Story = {
  args: { data: makeRows(25), pageSize: 10 },
}

export const FewRows: Story = {
  args: { data: makeRows(4), pageSize: 10 },
}

export const Empty: Story = {
  args: { data: [], pageSize: 10 },
}

export const ManyPages: Story = {
  args: { data: makeRows(100), pageSize: 10 },
}