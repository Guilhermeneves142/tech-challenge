import Link from "next/link";

export default function TransferTable() {

	const itemsTable = [
		{
			icon: "local_mall",
			description: "Supermercado Pão de Açúcar",
			date: "Hoje, 14:30",
			value: 10
		},
		{
			icon: "local_mall",
			description: "Supermercado Pão de Açúcar",
			date: "Hoje, 14:30",
			value: -120
		},
		{
			icon: "local_mall",
			description: "Supermercado Pão de Açúcar",
			date: "Hoje, 14:30",
			value: 90
		},
		{
			icon: "local_mall",
			description: "Supermercado Pão de Açúcar",
			date: "Hoje, 14:30",
			value: -340
		}
	]
	return (
		<table className="w-full">
			<thead className="">
				<tr>
					<th className="text-[20px] font-medium text-start mb-4 pl-6">Extrato Recente</th>
					<th className="text-primary text-end mb-4 cursor-pointer pr-6">
						<Link href="/transferences" className="hover:bg-secondary w-fit px-3 py-2 rounded-full">Ver tudo</Link>
					</th>
				</tr>
			</thead>
			<tbody>
				{
					itemsTable.map((item, index) => {
						return (
							<TransferTableItem key={index} {...item} />
						)
					})
				}
			</tbody>
		</table>
	)
}

type TransferTableItemProps = {
	icon: string;
	description: string;
	date: string;
	value: number;
}

function TransferTableItem({icon, description, date, value}: TransferTableItemProps) {


	const classColorValue = value < 0 ? "text-feedback-error" : "text-feedback-success"
	const valueFormatted = new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	}).format(value);

	return (
		<tr className="hover:bg-gray-100">
			<td className="flex py-4 pl-6">
				<span className="p-2 rounded-full material-symbols-outlined text-brand-primary bg-brand-secondary">{icon}</span>
				<article className="flex flex-col ml-3">
					<strong className="text-text-primary font-medium text-[16px]">{description}</strong>
					<span className="text-text-secondary text-[12px]">{date}</span>
				</article>
			</td>
			<td className="text-end pr-6">
				<span className={["font-bold text-[16px]",classColorValue].join(" ")}>
					{valueFormatted}
				</span>
			</td>
		</tr>
	)
}