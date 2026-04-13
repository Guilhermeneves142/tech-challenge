export default function TransferTable() {
	return (
		<table className="w-full">
			<thead className="">
				<tr >
					<th className="text-[20px] font-medium w-[90%] text-start mb-4">Extrato Recente</th>
					<th className="text-primary text-end mb-4 cursor-pointer">Ver tudo</th>
				</tr>
			</thead>
			<tbody>
				{
					[1,2,3,4,5].map((e) => {
						return (
							<tr key={e}>
								<td className="flex py-4">
									<span className="p-2 rounded-full material-symbols-outlined text-brand-primary bg-brand-secondary">local_mall</span>
									<article className="flex flex-col ml-3">
										<strong className="text-text-primary font-medium text-[16px]">Supermercado Pão de Açúcar</strong>
										<span className="text-text-secondary text-[12px]">Hoje, 14:30</span>
									</article>
								</td>
								<td className="text-end">
									<span className="font-bold text-feedback-error text-[16px]">
										- R$ 342,12
									</span>
								</td>
							</tr>
						)
					})
				}
			</tbody>
		</table>
	)
}