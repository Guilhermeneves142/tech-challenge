import Link from "next/link";
import type { Category, Transaction } from "@/lib/api";
import { getCategoryIcon } from "@/lib/categoryIcons";

type TransferTableProps = {
  transactions: Transaction[];
  categories: Category[];
};

export default function TransferTable({ transactions, categories }: TransferTableProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(6,96,32,0.05)]">
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
              categoryIcon={getCategoryIcon(categories, item.category)}
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
  categoryIcon: React.ElementType;
};

function TransferTableItem({
  description,
  date,
  value,
  categoryIcon: Icon,
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
        <span className="flex items-center justify-center rounded-full bg-brand-secondary p-2 text-brand-primary">
          <Icon className="size-5 shrink-0" aria-hidden />
        </span>
        <article className="ml-3 flex flex-col">
          <h6 className="text-text-primary">{description}</h6>
          <span className="text-caption text-text-tertiary">{date}</span>
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
