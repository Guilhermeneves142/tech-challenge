import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"
 
const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
}
 
export default meta
type Story = StoryObj<typeof Table>
 
const invoices = [
  { id: "INV-001", status: "Paid", method: "Credit Card", amount: "R$ 250,00" },
  { id: "INV-002", status: "Pending", method: "PayPal", amount: "R$ 150,00" },
  { id: "INV-003", status: "Unpaid", method: "Bank Transfer", amount: "R$ 350,00" },
  { id: "INV-004", status: "Paid", method: "Credit Card", amount: "R$ 450,00" },
  { id: "INV-005", status: "Pending", method: "PayPal", amount: "R$ 550,00" },
]
 
export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Lista de faturas recentes.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell className="text-right">{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}
 
export const Empty: Story = {
  name: "Estado vazio",
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
            Nenhum resultado encontrado.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}
 