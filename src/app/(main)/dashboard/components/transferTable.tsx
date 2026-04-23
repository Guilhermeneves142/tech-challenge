import Link from "next/link";
import type { Transaction } from "@/lib/api";

type TransferTableProps = {
	transactions: Transaction[];
};

export default function TransferTable({ transactions }: TransferTableProps) {
	return (
		<table className="w-full">
			<thead>
				<tr>
					<th className="text-[20px] font-medium text-start mb-4 pl-6">Extrato Recente</th>
					<th className="text-primary text-end mb-4 cursor-pointer pr-6">
						<Link href="/transacoes" className="hover:bg-secondary w-fit px-3 py-2 rounded-full">Ver tudo</Link>
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
	const classColorValue = value < 0 ? "text-feedback-error" : "text-feedback-success";
	const valueFormatted = new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value);

	return (
		<tr className="hover:bg-gray-100">
			<td className="flex py-4 pl-6">
				<span className="p-2 rounded-full material-symbols-outlined text-brand-primary bg-brand-secondary">
					local_mall
				</span>
				<article className="flex flex-col ml-3">
					<strong className="text-text-primary font-medium text-[16px]">{description}</strong>
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
