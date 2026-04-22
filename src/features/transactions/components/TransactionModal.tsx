"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransactionForm } from "../hooks/useTransactionForm";
import type { TransactionModalProps, TransactionFormType } from "../types";

export function TransactionModal({
  open,
  onOpenChange,
  categories,
  mode = "create",
  initialData,
  onSuccess,
}: TransactionModalProps) {
  const { form, loading, error, setField, setType, handleSubmit, handleCancel } =
    useTransactionForm({
      mode,
      initialData,
      onSuccess,
      onClose: () => onOpenChange(false),
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-6 gap-0" showCloseButton>
        <DialogHeader className="mb-4">
          <DialogTitle>
            <h3>{mode === "edit" ? "Editar Transação" : "Nova Transação"}</h3>
          </DialogTitle>
        </DialogHeader>

        <form id="transaction-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TypeToggle value={form.type} onChange={setType} />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tx-description" className="text-label">Descrição</Label>
            <Input
              id="tx-description"
              placeholder="Descrição da transação"
              className="rounded-lg h-11"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tx-amount" className="text-label">Valor</Label>
            <Input
              id="tx-amount"
              placeholder="Valor da transação"
              inputMode="decimal"
              className="rounded-lg h-11"
              value={form.amount}
              onChange={(e) => setField("amount", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tx-category" className="text-label">Categoria</Label>
            <Select
              value={form.category}
              onValueChange={(v) => v && setField("category", v)}
            >
              <SelectTrigger id="tx-category" className="rounded-lg h-11">
                <SelectValue placeholder="Seleciona a Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tx-date" className="text-label">Data</Label>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    className="w-full h-11 rounded-lg justify-start gap-2 font-normal text-left"
                  />
                }
              >
                <CalendarIcon className="size-4 text-muted-foreground" />
                {form.date
                  ? format(new Date(form.date + "T00:00:00"), "dd/MM/yyyy", { locale: ptBR })
                  : <span className="text-muted-foreground">dd/mm/aaaa</span>
                }
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  locale={ptBR}
                  selected={form.date ? new Date(form.date + "T00:00:00") : undefined}
                  onSelect={(date) => setField("date", date ? format(date, "yyyy-MM-dd") : "")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {error && <p className="text-caption text-feedback-error">{error}</p>}
        </form>

        <DialogFooter className="mt-4">
          <DialogClose
            render={
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              />
            }
          >
            Cancelar
          </DialogClose>
          <Button
            form="transaction-form"
            type="submit"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface TypeToggleProps {
  value: TransactionFormType;
  onChange: (type: TransactionFormType) => void;
}

function TypeToggle({ value, onChange }: TypeToggleProps) {
  return (
    <div className="grid grid-cols-2 rounded-full bg-brand-secondary p-1">
      <button
        type="button"
        onClick={() => onChange("credit")}
        className={[
          "rounded-full py-2 text-label transition-all",
          value === "credit"
            ? "bg-brand-secondary text-brand-tertiary"
            : "bg-brand-tertiary text-white",
        ].join(" ")}
      >
        Receita
      </button>
      <button
        type="button"
        onClick={() => onChange("debit")}
        className={[
          "rounded-full py-2 text-label transition-all",
          value === "debit"
            ? "bg-brand-tertiary text-white"
            : "bg-brand-secondary text-brand-tertiary",
        ].join(" ")}
      >
        Despesa
      </button>
    </div>
  );
}
