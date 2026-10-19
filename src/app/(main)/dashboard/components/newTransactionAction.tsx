"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { useCategories } from "@/lib/queries/transactions";
import type { Category } from "@/lib/api";

const TransactionModal = dynamic(() =>
  import("@/components/transactions").then((m) => m.TransactionModal)
);

type Props = {
  className?: string;
  categories?: Category[];
};

export default function NewTransactionAction({ className, categories: categoriesProp }: Props) {
  const [open, setOpen] = useState(false);
  const hasInitialCategories = !!categoriesProp && categoriesProp.length > 0;
  const { data: fetchedCategories } = useCategories({
    enabled: !hasInitialCategories,
  });
  const categories = hasInitialCategories
    ? categoriesProp
    : (fetchedCategories ?? []);

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

      {open && (
        <TransactionModal
          open={open}
          onOpenChange={setOpen}
          categories={categories}
          mode="create"
        />
      )}
    </>
  );
}
