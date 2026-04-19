'use client'

import { DeleteIcon } from "@/components/icons/delete.icon";
import { EditIcon } from "@/components/icons/edit-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/dataTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TRANSACTION_TYPES_ENUM } from "@/shared/enums/transaction-types.enum";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

interface Transactions {
    id: string,
    description: string,
    category: string,
    amount: string,
    date: string,
    dateLabel: string,
    type: string
}

export default function TransactionsPage() {
    const [globalFilter, setGlobalFilter] = useState("");
    //const [selectedType, setSelectedType] = useState("");
    //const [data, setData] = useState("");

    /* async function handleApiGetAllTransactions() {
        try{
            const response = await getTransactions({ search: globalFilter, type: selectedType })

            setData(response);

        }catch{
            console.error("Não foi possível carregar o histórico de transações")
        }
    } */


    const mock: Transactions[] = [
        {
            "id": "55",
            "description": "Boleto Faculdade",
            "category": "Categoria",
            "type": "Transferência",
            "amount": "-100.00",
            "date": "2025-05-01T10:00:00Z",
            "dateLabel": "01 Mai, 10:00",
        },
        {
            "id": "55",
            "description": "Supermercado Master",
            "category": "Categoria",
            "amount": "-100.00",
            "date": "2025-05-01T10:00:00Z",
            "dateLabel": "01 Mai, 10:00",
            "type": "Transferência"
        },
        {
            "id": "55",
            "description": "Freelancer",
            "category": "Categoria",
            "amount": "+100.00",
            "date": "2025-05-01T10:00:00Z",
            "dateLabel": "01 Mai, 10:00",
            "type": "Depósito"
        },
        {
            "id": "55",
            "description": "Boleto Faculdade",
            "category": "Categoria",
            "type": "Transferência",
            "amount": "-100.00",
            "date": "2025-05-01T10:00:00Z",
            "dateLabel": "01 Mai, 10:00",
        },
        {
            "id": "55",
            "description": "Supermercado Master",
            "category": "Categoria",
            "amount": "-100.00",
            "date": "2025-05-01T10:00:00Z",
            "dateLabel": "01 Mai, 10:00",
            "type": "Transferência"
        },
        {
            "id": "55",
            "description": "Freelancer",
            "category": "Categoria",
            "amount": "+100.00",
            "date": "2025-05-01T10:00:00Z",
            "dateLabel": "01 Mai, 10:00",
            "type": "Depósito"
        },
        {
            "id": "55",
            "description": "Boleto Faculdade",
            "category": "Categoria",
            "type": "Transferência",
            "amount": "-100.00",
            "date": "2025-05-01T10:00:00Z",
            "dateLabel": "01 Mai, 10:00",
        },
        {
            "id": "55",
            "description": "Supermercado Master",
            "category": "Categoria",
            "amount": "-100.00",
            "date": "2025-05-01T10:00:00Z",
            "dateLabel": "01 Mai, 10:00",
            "type": "Transferência"
        },
        {
            "id": "55",
            "description": "Freelancer",
            "category": "Categoria",
            "amount": "+100.00",
            "date": "2025-05-01T10:00:00Z",
            "dateLabel": "01 Mai, 10:00",
            "type": "Depósito"
        },
        {
            "id": "55",
            "description": "Boleto Faculdade",
            "category": "Categoria",
            "type": "Transferência",
            "amount": "-100.00",
            "date": "2025-05-01T10:00:00Z",
            "dateLabel": "01 Mai, 10:00",
        },
        {
            "id": "55",
            "description": "Supermercado Master",
            "category": "Categoria",
            "amount": "-100.00",
            "date": "2025-05-01T10:00:00Z",
            "dateLabel": "01 Mai, 10:00",
            "type": "Transferência"
        },
        {
            "id": "55",
            "description": "Freelancer",
            "category": "Categoria",
            "amount": "+100.00",
            "date": "2025-05-01T10:00:00Z",
            "dateLabel": "01 Mai, 10:00",
            "type": "Depósito"
        }
    ]

    const types = TRANSACTION_TYPES_ENUM;

    const columns: ColumnDef<Transactions>[] = [
        {
            id: "id",
            accessorKey: "description",
            header: () => (
                <p className="text-label text-card-foreground">
                    DESCRIÇÃO
                </p>
            ),
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
            header: () => (
                <p className="text-label text-card-foreground">
                    CATEGORIA
                </p>
            ),
            cell: ({ row }) => {
                return (
                    <Badge variant="outline">{row.getValue("category")}</Badge>
                )

            },
        },
        {
            accessorKey: "amount",
            header: () => (
                <p className="text-label text-card-foreground">
                    VALOR
                </p>
            ),
            cell: ({ row }) => {
                const { amount } = row.original;

                if (amount.includes("-")) {
                    return (
                        <h6 className="text-feedback-error text-right">{row.getValue("amount")}</h6>
                    )
                } else {
                    return (
                        <h6 className="text-primary text-right">{row.getValue("amount")}</h6>
                    )
                }
            },
        },
        {
            id: "actions",
            header: () => (
                <p className="text-label text-card-foreground">
                    AÇÕES
                </p>
            ),
            cell: ({ row }) => {
                const id = row.original.id;

                return (
                    <div className="flex gap-2">
                        <button onClick={() => console.log("edit", id)}>
                            <EditIcon className="size-7 scale-96 cursor-pointer" />
                        </button>

                        <button onClick={() => console.log("delete", id)}>
                            <DeleteIcon className="size-7 scale-96 cursor-pointer" />
                        </button>
                    </div>
                );
            },
        }
    ]

    return (
        <>
            <Card className="flex flex-row items-end 4 py-6 overflow-visible px-6">
                <div className="flex flex-col gap-1">
                    <Label className="text-label">Período</Label>
                    <Input
                        type="date"
                        className="cursor-pointer w-44"
                    />
                </div>
                <div className="relative flex flex-col gap-1 flex-1">
                    <Label className="text-label">Buscar</Label>
                    <div className="relative">
                        <Search
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-primary"
                        />
                        <Input
                            type="search"
                            placeholder="Descrição"
                            className="pl-8"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-1 w-48">
                    <Label className="text-label">Tipo</Label>
                    <Select onValueChange={(value) => {
                        if (value === "Todos os tipos") {
                            //setSelectedType("")
                        } else {
                            //setSelectedType(value])
                        }
                    }}
                    >
                        <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue
                                placeholder="Todos os tipos"
                            />
                        </SelectTrigger>
                        <SelectContent side="bottom" className="p-1" sideOffset={6} align="start" alignItemWithTrigger={false}>
                            <SelectItem className="cursor-pointer" value="Todos os tipos">Todos os tipos</SelectItem>
                            {Object.values(types).map((type) => (
                                <SelectItem key={type} className="cursor-pointer" value={type}>
                                    {type}
                                </SelectItem>
                            ))}

                        </SelectContent>
                    </Select>
                </div>
                <Button variant="default" className="cursor-pointer shrink-0">
                    <Plus size={16} />
                    Nova Transação
                </Button>
            </Card>

            <section className="m-6 me-10 ms-10 flex flex-row gap-12">
                <Card className="p-6 bg-brand-secondary text-primary">
                    <h4 >Receitas</h4>
                    <h2 className="pe-[20px] -mt-3">R$ 8.500,00</h2>
                </Card>
                <Card className="p-6 bg-feedback-error text-card">
                    <h4>Despesas</h4>
                    <h2 className="pe-[20px] -mt-3">R$ 5.246,00</h2>
                </Card>
                <Card className="p-6 bg-brand-tertiary  text-card">
                    <h4>Seu Saldo Atual</h4>
                    <h2 className="pe-[20px] -mt-3">R$ 3.254,00</h2>
                </Card>
                <Card className="p-6 bg-card  text-card-foreground">
                    <h4>Lançamentos Futuros</h4>
                    <h2 className="pe-[20px] -mt-3">R$ 3.254,00</h2>
                </Card>
            </section>

            <DataTable
                columns={columns} 
                data={mock} 
                pageSize={10} 
            />
        </>
    )
}