"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { TransactionModal } from "@/components/transactions";
import { api } from "@/lib/api";
import type { Category } from "@/lib/api";

type Props = {
  className?: string;
  categories?: Category[];
};

export default function NewTransactionAction({ className, categories: categoriesProp }: Props) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>(categoriesProp ?? []);

  useEffect(() => {
    if (categoriesProp && categoriesProp.length > 0) return;
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={[
          "flex flex-col items-center justify-center bg-white py-6 shadow hover:bg-gray-100",
          className,
        ].join(" ")}
      >
        <span className="flex items-center justify-center rounded-full bg-brand-secondary p-3 text-brand-primary">
          <Plus className="size-6 shrink-0" aria-hidden />
        </span>
        <span className="pt-2 text-[18px] font-medium">Transação</span>
      </button>

      <TransactionModal
        open={open}
        onOpenChange={setOpen}
        categories={categories}
        mode="create"
      />
    </>
  );
}
