"use client";

// Hook de APRESENTAÇÃO: só estado do formulário + ponte com o caso de uso.
// Validação, conversão de valor e montagem do payload vivem em @/domain.
import { useState } from "react";
import {
  EMPTY_TRANSACTION_DRAFT,
  TransactionValidationError,
  type Transaction,
  type TransactionDraft,
  type TransactionType,
} from "@/domain";
import { useSaveTransaction } from "@/lib/queries/transactions";
import type { TransactionModalMode } from "../types";

interface UseTransactionFormOptions {
  mode?: TransactionModalMode;
  transactionId?: number;
  initialData?: Partial<TransactionDraft>;
  onSuccess?: (transaction: Transaction) => void;
  onClose: () => void;
}

const SAVE_ERROR = "Não foi possível salvar a transação. Tente novamente.";

export function useTransactionForm({
  mode = "create",
  transactionId,
  initialData,
  onSuccess,
  onClose,
}: UseTransactionFormOptions) {
  const initial = { ...EMPTY_TRANSACTION_DRAFT, ...initialData };
  const [form, setForm] = useState<TransactionDraft>(initial);
  const [error, setError] = useState<string | null>(null);
  const saveTransaction = useSaveTransaction();

  function setField<K extends keyof TransactionDraft>(key: K, value: TransactionDraft[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setType(type: TransactionType) {
    setField("type", type);
  }

  function reset() {
    setForm(initial);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const result = await saveTransaction.mutateAsync({
        draft: form,
        id: mode === "edit" ? transactionId : undefined,
      });
      onSuccess?.(result);
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof TransactionValidationError ? err.message : SAVE_ERROR);
    }
  }

  function handleCancel() {
    reset();
    onClose();
  }

  return {
    form,
    loading: saveTransaction.isPending,
    error,
    setField,
    setType,
    handleSubmit,
    handleCancel,
    reset,
  };
}
