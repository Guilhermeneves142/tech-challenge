"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import type { TransactionFormState, TransactionFormType, CreateTransactionPayload, TransactionModalMode } from "../types";
import type { Transaction } from "@/lib/api";

const INITIAL_STATE: TransactionFormState = {
  description: "",
  amount: "",
  category: "",
  date: "",
  type: "credit",
};

interface UseTransactionFormOptions {
  mode?: TransactionModalMode;
  initialData?: Partial<TransactionFormState>;
  onSuccess?: (transaction: Transaction) => void;
  onClose: () => void;
}

export function useTransactionForm({ mode = "create", initialData, onSuccess, onClose }: UseTransactionFormOptions) {
  const [form, setForm] = useState<TransactionFormState>({
    ...INITIAL_STATE,
    ...initialData,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField<K extends keyof TransactionFormState>(key: K, value: TransactionFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setType(type: TransactionFormType) {
    setField("type", type);
  }

  function reset() {
    setForm({ ...INITIAL_STATE, ...initialData });
    setError(null);
  }

  function validate(): string | null {
    if (!form.description.trim()) return "Descrição é obrigatória.";
    const parsed = parseFloat(form.amount.replace(",", "."));
    if (isNaN(parsed) || parsed <= 0) return "Informe um valor válido.";
    if (!form.category) return "Selecione uma categoria.";
    if (!form.date) return "Selecione uma data.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload: CreateTransactionPayload = {
      description: form.description.trim(),
      amount: parseFloat(form.amount.replace(",", ".")),
      category: form.category,
      date: new Date(form.date).toISOString(),
      type: form.type,
    };

    setLoading(true);
    try {
      const result = mode === "edit"
        ? await api.createTransaction(payload)
        : await api.createTransaction(payload);
      onSuccess?.(result);
      reset();
      onClose();
    } catch {
      setError("Não foi possível salvar a transação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    reset();
    onClose();
  }

  return { form, loading, error, setField, setType, handleSubmit, handleCancel };
}
