import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import type { Transaction } from "@/lib/api";

type TransferTableProps = {
  transactions: Transaction[];
};

export default function TransferTable({ transactions }: TransferTableProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-6 pt-4 pb-[17px] border-b border-[rgba(6,96,32,0.05)]">
        <h4 className="text-text-primary">Extrato Recente</h4>
        <Link
          href="/transacoes"
          className="text-[14px] font-bold text-feedback-success hover:opacity-75 transition-opacity"
        >
          Ver tudo
        </Link>
      </div>
      <table className="w-full">
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
    </div>
  );
}

type TransferTableItemProps = {
  description: string;
  date: string;
  value: number;
};

function TransferTableItem({
  description,
  date,
  value,
}: TransferTableItemProps) {
  const classColorValue =
    value < 0 ? "text-feedback-error" : "text-feedback-success";
  const valueFormatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

  return (
    <tr className="hover:bg-gray-100">
      <td className="flex py-4 pl-6">
        <span className="p-2 rounded-full flex items-center justify-center text-brand-primary bg-brand-secondary">
          <ShoppingBag size={20} />
        </span>
        <article className="flex flex-col ml-3">
          <strong className="text-text-primary font-medium text-[16px]">
            {description}
          </strong>
          <span className="text-text-secondary text-[12px]">{date}</span>
        </article>
      </td>
      <td className="text-end pr-6">
        <span className={["font-bold text-[16px]", classColorValue].join(" ")}>
          {valueFormatted}
        </span>
      </td>
    </tr>
  );
}
