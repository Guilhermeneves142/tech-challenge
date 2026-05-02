import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
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
  { id: "INV-001", status: "Pago", método: "Crédito", valor: "R$ 250,00" },
  { id: "INV-002", status: "Pendente", método: "Dinheiro", valor: "R$ 150,00" },
  { id: "INV-003", status: "Processando", método: "Pix", valor: "R$ 350,00" },
  { id: "INV-004", status: "Pago", método: "Crédito", valor: "R$ 450,00" },
  { id: "INV-005", status: "Pendente", método: "Dinheiro", valor: "R$ 550,00" },
]
 
export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Lista de faturas recentes.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nota fiscal</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>método</TableHead>
          <TableHead className="text-right">valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.método}</TableCell>
            <TableCell className="text-right">{invoice.valor}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}
 
export const Empty: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nota fiscal</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>método</TableHead>
          <TableHead className="text-right">valor</TableHead>
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
 