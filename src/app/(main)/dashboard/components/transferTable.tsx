import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import type { Transaction } from "@/lib/api";

type TransferTableProps = {
  transactions: Transaction[];
};

export default function TransferTable({ transactions }: TransferTableProps) {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="mb-4 pl-6 text-start text-[20px] font-medium">
            Extrato Recente
          </th>
          <th className="text-primary mb-4 cursor-pointer pr-6 text-end">
            <Link
              href="/transacoes"
              className="w-fit rounded-full px-3 py-2 hover:bg-secondary"
            >
              Ver tudo
            </Link>
          </th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((item) => (
          <TransferTableItem
            key={item.id}
            description={item.description}
            date={item.dateLabel}
            value={item.amount}
          />
        ))}
      </tbody>
    </table>
  );
}

type TransferTableItemProps = {
  description: string;
  date: string;
  value: number;
};

function TransferTableItem({ description, date, value }: TransferTableItemProps) {
  const classColorValue =
    value < 0 ? "text-feedback-error" : "text-feedback-success";
  const valueFormatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

  return (
    <tr className="hover:bg-gray-100">
      <td className="flex py-4 pl-6">
        <span className="flex items-center justify-center rounded-full bg-brand-secondary p-2 text-brand-primary">
          <ShoppingBag className="size-5 shrink-0" aria-hidden />
        </span>
        <article className="ml-3 flex flex-col">
          <strong className="text-[16px] font-medium text-text-primary">
            {description}
          </strong>
          <span className="text-[12px] text-text-secondary">{date}</span>
        </article>
      </td>
      <td className="pr-6 text-end">
        <span className={["text-[16px] font-bold", classColorValue].join(" ")}>
          {valueFormatted}
        </span>
      </td>
    </tr>
  );
}
