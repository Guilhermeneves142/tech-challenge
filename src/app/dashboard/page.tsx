import DepositButton from "@/components/dashboard/depositButton";
import TransferTable from "@/components/dashboard/transferTable";

export default function DashboardPage() {
	return (
		<section className="grid grid-cols-12 gap-3">
			<article className="bg-brand-tertiary w-full p-8 rounded-md col-span-4">
				<strong className="text-nowrap text-white text-[24px] font-bold">Seu Saldo atual</strong>
				<h2 className="text-white text-[48px] font-bold">R$ 12.450,00</h2>
			</article>
			<section className="col-span-8">
				<article className="flex items-center pb-4">
					<span className="text-[24px] material-symbols-outlined text-brand-tertiary">
						bolt
					</span>
					<h2 className="text-[24px] font-bold">O que você quer fazer?</h2>
				</article>
				<section className="grid grid-cols-12 gap-3">
					<DepositButton className="col-span-3" text="Depositar" icon="add_2"/>
					<DepositButton className="col-span-3" text="Transferir" icon="sync_alt"/>
					<DepositButton className="col-span-3" text="Pagar Conta" icon="qr_code"/>
				</section>
			</section>
			<section className="col-span-4">
				{/* vai ter isso? */}
			</section>
			<section className="col-span-8 bg-white pt-6 px-6 rounded-md shadow">
				<TransferTable/>
			</section>
		</section>
	)
}