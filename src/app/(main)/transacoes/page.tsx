'use client'

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Search } from "lucide-react";
import { DeleteIcon } from "@/components/icons/delete.icon";
import { EditIcon } from "@/components/icons/edit-icon";
import Headline from "@/components/layout/default/headLine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/dataTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TRANSACTION_TYPES_ENUM } from "@/shared/enums/transaction-types.enum";
import { TransactionModal } from "@/features/transactions";
import type { TransactionFormState } from "@/features/transactions";
import type { Category } from "@/lib/api";

interface Transactions {
    id: string
    description: string
    category: string
    amount: string
    date: string
    dateLabel: string
    type: string
}

const mockCategories: Category[] = [
    { id: "food", label: "Alimentação", icon: "utensils" },
    { id: "transport", label: "Transporte", icon: "car" },
    { id: "housing", label: "Moradia", icon: "home" },
    { id: "income", label: "Renda", icon: "trending-up" },
    { id: "transfer", label: "Transferência", icon: "arrow-right-left" },
    { id: "entertainment", label: "Lazer", icon: "tv" },
    { id: "health", label: "Saúde", icon: "heart-pulse" },
    { id: "education", label: "Educação", icon: "book-open" },
]

const mock: Transactions[] = [
    { id: "1", description: "Boleto Faculdade", category: "education", type: "Transferência", amount: "-100.00", date: "2025-05-01T10:00:00Z", dateLabel: "01 Mai, 10:00" },
    { id: "2", description: "Supermercado Master", category: "food", amount: "-100.00", date: "2025-05-01T10:00:00Z", dateLabel: "01 Mai, 10:00", type: "Transferência" },
    { id: "3", description: "Freelancer", category: "income", amount: "+100.00", date: "2025-05-01T10:00:00Z", dateLabel: "01 Mai, 10:00", type: "Depósito" },
    { id: "4", description: "Boleto Faculdade", category: "education", type: "Transferência", amount: "-100.00", date: "2025-05-01T10:00:00Z", dateLabel: "01 Mai, 10:00" },
    { id: "5", description: "Supermercado Master", category: "food", amount: "-100.00", date: "2025-05-01T10:00:00Z", dateLabel: "01 Mai, 10:00", type: "Transferência" },
    { id: "6", description: "Freelancer", category: "income", amount: "+100.00", date: "2025-05-01T10:00:00Z", dateLabel: "01 Mai, 10:00", type: "Depósito" },
    { id: "7", description: "Boleto Faculdade", category: "education", type: "Transferência", amount: "-100.00", date: "2025-05-01T10:00:00Z", dateLabel: "01 Mai, 10:00" },
    { id: "8", description: "Supermercado Master", category: "food", amount: "-100.00", date: "2025-05-01T10:00:00Z", dateLabel: "01 Mai, 10:00", type: "Transferência" },
    { id: "9", description: "Freelancer", category: "income", amount: "+100.00", date: "2025-05-01T10:00:00Z", dateLabel: "01 Mai, 10:00", type: "Depósito" },
    { id: "10", description: "Boleto Faculdade", category: "education", type: "Transferência", amount: "-100.00", date: "2025-05-01T10:00:00Z", dateLabel: "01 Mai, 10:00" },
    { id: "11", description: "Supermercado Master", category: "food", amount: "-100.00", date: "2025-05-01T10:00:00Z", dateLabel: "01 Mai, 10:00", type: "Transferência" },
    { id: "12", description: "Freelancer", category: "income", amount: "+100.00", date: "2025-05-01T10:00:00Z", dateLabel: "01 Mai, 10:00", type: "Depósito" },
]

export default function TransactionsPage() {
    const [globalFilter, setGlobalFilter] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Partial<TransactionFormState> | undefined>();

    function handleEdit(row: Transactions) {
        setEditingTransaction({
            description: row.description,
            category: row.category,
            amount: row.amount.replace("+", ""),
            date: row.date.split("T")[0],
            type: row.amount.includes("-") ? "debit" : "credit",
        });
        setModalOpen(true);
    }

    function handleNewTransaction() {
        setEditingTransaction(undefined);
        setModalOpen(true);
    }

    const types = TRANSACTION_TYPES_ENUM;

    const columns: ColumnDef<Transactions>[] = [
        {
            id: "id",
            accessorKey: "description",
            header: () => <p className="text-label text-card-foreground">DESCRIÇÃO</p>,
            cell: ({ row }) => {
                const { dateLabel, description } = row.original;
                return (
                    <div className="flex flex-row gap-4">
                        <span className="p-2 rounded-full material-symbols-outlined text-brand-primary bg-brand-secondary">local_mall</span>
                        <div className="flex flex-col">
                            <h6>{description}</h6>
                            <p className="text-caption text-(--color-text-tertiary)">{dateLabel}</p>
                        </div>
                    </div>
                );
            }
        },
        {
            accessorKey: "category",
            header: () => <p className="text-label text-card-foreground">CATEGORIA</p>,
            cell: ({ row }) => <Badge variant="outline">{row.getValue("category")}</Badge>,
        },
        {
            accessorKey: "amount",
            header: () => <p className="text-label text-card-foreground">VALOR</p>,
            cell: ({ row }) => {
                const { amount } = row.original;
                return amount.includes("-")
                    ? <h6 className="text-feedback-error text-right">{row.getValue("amount")}</h6>
                    : <h6 className="text-primary text-right">{row.getValue("amount")}</h6>
            },
        },
        {
            id: "actions",
            header: () => <p className="text-label text-card-foreground">AÇÕES</p>,
            cell: ({ row }) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)}>
                        <EditIcon className="size-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => console.log("delete", row.original.id)}>
                        <DeleteIcon className="size-5" />
                    </Button>
                </div>
            ),
        }
    ]

    return (
        <>
            <Headline title="Transações" subTitle="Veja as suas transações" />

            <Card className="flex flex-col sm:flex-row items-end gap-3 py-6 px-6 mb-6 flex-wrap">
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                    <Label className="text-label">Período</Label>
                    <Input type="date" className="cursor-pointer w-full sm:w-44" />
                </div>
                <div className="relative flex flex-col gap-1 w-full sm:flex-1">
                    <Label className="text-label">Buscar</Label>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-primary" />
                        <Input
                            type="search"
                            placeholder="Descrição"
                            className="pl-8 w-full"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-1 w-full sm:w-48">
                    <Label className="text-label">Tipo</Label>
                    <Select>
                        <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Todos os tipos" />
                        </SelectTrigger>
                        <SelectContent side="bottom" className="p-1" sideOffset={6} align="start" alignItemWithTrigger={false}>
                            <SelectItem className="cursor-pointer" value="all">Todos os tipos</SelectItem>
                            {Object.values(types).map((type) => (
                                <SelectItem key={type} className="cursor-pointer" value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button variant="default" className="cursor-pointer w-full sm:w-auto shrink-0" onClick={handleNewTransaction}>
                    <Plus size={16} />
                    Nova Transação
                </Button>
            </Card>

            <section className="mx-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10 mb-6">
                <Card className="p-6 bg-brand-secondary text-primary">
                    <h4>Receitas</h4>
                    <h2 className="pe-4 -mt-3">R$ 8.500,00</h2>
                </Card>
                <Card className="p-6 bg-feedback-error text-card">
                    <h4>Despesas</h4>
                    <h2 className="pe-4 -mt-3">R$ 5.246,00</h2>
                </Card>
                <Card className="p-6 bg-brand-tertiary text-card">
                    <h4>Seu Saldo Atual</h4>
                    <h2 className="pe-4 -mt-3">R$ 3.254,00</h2>
                </Card>
                <Card className="p-6 bg-card text-card-foreground">
                    <h4>Lançamentos Futuros</h4>
                    <h2 className="pe-4 -mt-3">R$ 3.254,00</h2>
                </Card>
            </section>

            <DataTable columns={columns} data={mock} pageSize={10} />

            <TransactionModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                categories={mockCategories}
                mode={editingTransaction ? "edit" : "create"}
                initialData={editingTransaction}
                onSuccess={(tx) => console.log("saved", tx)}
            />
        </>
    )
}
