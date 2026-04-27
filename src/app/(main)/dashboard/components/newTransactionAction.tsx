"use client";

import { useEffect, useState } from "react";
import { TransactionModal } from "@/components/transactions";
import { api } from "@/lib/api";
import type { Category } from "@/lib/api";

type Props = {
  className?: string;
};

export default function NewTransactionAction({ className }: Props) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={[
          "bg-white py-6 flex flex-col justify-center items-center shadow cursor-pointer hover:bg-gray-100",
          className,
        ].join(" ")}
      >
        <span className="material-symbols-outlined bg-brand-secondary text-brand-primary p-3 rounded-full">
          add_2
        </span>
        <span className="text-[18px] font-medium pt-2">Transação</span>
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
