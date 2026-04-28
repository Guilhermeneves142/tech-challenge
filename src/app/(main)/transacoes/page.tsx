"use client";

import Headline from "@/components/layout/default/headLine";
import type { TransactionFormState } from "@/components/transactions";
import {
  DeleteTransactionModal,
  TransactionModal,
} from "@/components/transactions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/dataTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { api } from "@/lib/api";
import type {
  Category,
  Transaction,
  TransactionParams,
  TransactionSummary,
} from "@/lib/api";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import { useDebounce } from "use-debounce";

export default function TransactionsPage() {
  const [filterDescription, setFilterDescription] = useState("");
  const [debouncedDescription] = useDebounce(filterDescription, 300);
  const [filterType, setFilterType] = useState("");
  const [filterRange, setFilterRange] = useState<DateRange | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState<
    Transaction | undefined
  >();
  const [editingTransaction, setEditingTransaction] = useState<
    Partial<TransactionFormState> | undefined
  >();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<TransactionSummary | undefined>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<number | undefined>();
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    const params: TransactionParams = {};
    if (debouncedDescription) params.descriptionLike = debouncedDescription;
    if (filterType) params.type = filterType as "credit" | "debit";
    if (filterRange?.from)
      params.dateGte =
        format(filterRange.from, "yyyy-MM-dd") + "T00:00:00.000Z";
    if (filterRange?.to)
      params.dateLte = format(filterRange.to, "yyyy-MM-dd") + "T23:59:59.999Z";
    api.getTransactions(params).then(setTransactions).catch(console.error);
    api.getTransactionsSummary(params).then(setSummary).catch(console.error);
  }, [debouncedDescription, filterType, filterRange, refresh]);

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function handleEdit(row: Transaction) {
    setEditingId(row.id);
    setEditingTransaction({
      description: row.description,
      category: row.category,
      amount: Math.abs(row.amount).toString(),
      date: row.date.split("T")[0],
      type: row.amount < 0 ? "debit" : "credit",
    });
    setModalOpen(true);
  }

  function handleNewTransaction() {
    setEditingId(undefined);
    setEditingTransaction(undefined);
    setModalOpen(true);
  }

  function handleDelete(row: Transaction) {
    setDeletingTransaction(row);
    setDeleteModalOpen(true);
  }

  const columns: ColumnDef<Transaction>[] = [
    {
      id: "id",
      accessorKey: "description",
      meta: { width: "60%" },
      header: () => (
        <p className="text-label text-card-foreground">DESCRIÇÃO</p>
      ),
      cell: ({ row }) => {
        const { dateLabel, description } = row.original;
        return (
          <div className="flex flex-row gap-4">
            <span className="p-2 rounded-full material-symbols-outlined text-brand-primary bg-brand-secondary">
              local_mall
            </span>
            <div className="flex flex-col">
              <h6>{description}</h6>
              <p className="text-caption text-(--color-text-tertiary)">
                {dateLabel}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: () => (
        <p className="text-label text-card-foreground">CATEGORIA</p>
      ),
      cell: ({ row }) => {
        const id = row.getValue("category") as string;
        const label = categories.find((c) => c.id === id)?.label ?? id;
        return <Badge variant="outline">{label}</Badge>;
      },
    },
    {
      accessorKey: "amount",
      header: () => <p className="text-label text-card-foreground">VALOR</p>,
      cell: ({ row }) => {
        const amount = row.original.amount;
        const formatted = `R$ ${Math.abs(amount).toFixed(2).replace(".", ",")}`;
        return amount < 0 ? (
          <h6 className="text-feedback-error text-right">- {formatted}</h6>
        ) : (
          <h6 className="text-primary text-right">+ {formatted}</h6>
        );
      },
    },
    {
      id: "actions",
      meta: { width: 120 },
      header: () => <p className="text-label text-card-foreground">AÇÕES</p>,
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row.original)}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(row.original)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Headline title="Transações" subTitle="Veja as suas transações" />

      <Card className="flex flex-col sm:flex-row items-end gap-5 py-6 px-6 flex-wrap">
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <Label className="text-label">Período</Label>
          <div className="flex items-center gap-1">
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    className="w-full sm:w-56 h-8 justify-start gap-2 font-normal !border-primary"
                  />
                }
              >
                <CalendarIcon className="size-4 text-muted-foreground" />
                {filterRange?.from ? (
                  filterRange.to ? (
                    `${format(filterRange.from, "dd/MM/yyyy")} - ${format(filterRange.to, "dd/MM/yyyy")}`
                  ) : (
                    format(filterRange.from, "dd/MM/yyyy")
                  )
                ) : (
                  <span className="text-muted-foreground">
                    dd/mm/aaaa - dd/mm/aaaa
                  </span>
                )}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  locale={ptBR}
                  selected={filterRange}
                  onSelect={setFilterRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            {filterRange && (
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0"
                onClick={() => setFilterRange(undefined)}
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="relative flex flex-col gap-1 w-full sm:flex-1">
          <Label className="text-label">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-primary" />
            <Input
              type="search"
              placeholder="Descrição"
              className="pl-8 w-full"
              value={filterDescription}
              onChange={(e) => setFilterDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full sm:w-48">
          <Label className="text-label">Tipo</Label>
          <Select
            value={filterType}
            onValueChange={(v) => setFilterType(!v || v === "all" ? "" : v)}
          >
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Todos os tipos">
                {(v) =>
                  v === "credit"
                    ? "Receita"
                    : v === "debit"
                      ? "Despesa"
                      : "Todos os tipos"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent
              side="bottom"
              className="p-1"
              sideOffset={6}
              align="start"
              alignItemWithTrigger={false}
            >
              <SelectItem className="cursor-pointer" value="all">
                Todos os tipos
              </SelectItem>
              <SelectItem className="cursor-pointer" value="credit">
                Receita
              </SelectItem>
              <SelectItem className="cursor-pointer" value="debit">
                Despesa
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="default"
          className="cursor-pointer w-full sm:w-auto shrink-0"
          onClick={handleNewTransaction}
        >
          <Plus size={16} />
          Nova Transação
        </Button>
      </Card>

      <section className="mx-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 xl:gap-10 my-6">
        <Card className="p-6 bg-brand-secondary text-primary">
          <h4>Receitas</h4>
          <h2 className="pe-4 -mt-3">{formatCurrency(summary?.income ?? 0)}</h2>
        </Card>
        <Card className="p-6 bg-feedback-error text-card">
          <h4>Despesas</h4>
          <h2 className="pe-4 -mt-3">
            {formatCurrency(summary?.expense ?? 0)}
          </h2>
        </Card>
        <Card className="p-6 bg-brand-tertiary text-card">
          <h4>Seu Saldo Atual</h4>
          <h2 className="pe-4 -mt-3">
            {formatCurrency(summary?.currentBalance ?? 0)}
          </h2>
        </Card>
      </section>

      <DataTable columns={columns} data={transactions} pageSize={10} />

      <TransactionModal
        key={editingId ?? "create"}
        open={modalOpen}
        onOpenChange={setModalOpen}
        categories={categories}
        mode={editingTransaction ? "edit" : "create"}
        initialData={editingTransaction}
        transactionId={editingId}
        onSuccess={() => setRefresh((r) => r + 1)}
      />

      <DeleteTransactionModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        transaction={deletingTransaction}
        onSuccess={() => setRefresh((r) => r + 1)}
      />
    </>
  );
}
