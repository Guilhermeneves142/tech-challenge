import DashboardMenu from "./components/dashboardMenu";
import ActionButton from "./components/actionButton";
import TransferTable from "./components/transferTable";
import Headline from "@/components/layout/default/headLine";

export default function DashboardPage() {
  return (
    <>
      <Headline
        title="Dashboard"
        subTitle="Veja o seu resumo financeiro"
      />
      <section className="grid grid-cols-12 gap-3">
        <section className="min-[1400px]:col-span-9 col-span-8">
          <article className="flex items-center pb-4">
            <span className="text-[24px] material-symbols-outlined text-brand-tertiary">
              bolt
            </span>
            <h2 className="text-[24px] font-bold">O que você quer fazer?</h2>
          </article>
          <section className="grid grid-cols-12 gap-3">
            <ActionButton className="col-span-3" text="Depositar" icon="add_2" route="/deposit"/>
            <ActionButton
              className="col-span-3"
              text="Transferir"
              icon="sync_alt"
              route="/transfer"
            />
            <ActionButton
              className="col-span-3"
              text="Pagar Conta"
              icon="qr_code"
              route="/qr-code"
            />
          </section>
        </section>
        <article className="bg-brand-tertiary w-full p-8 rounded-md min-[1400px]:col-span-3 col-span-4 flex flex-col justify-between">
          <div>
            <strong className="text-nowrap text-white text-[24px] font-bold">
              Seu Saldo atual
            </strong>
            <h2 className="text-white text-[48px] font-bold">R$ 12.450,00</h2>
          </div>
          <div className="bg-secondary w-fit text-brand-primary px-3 py-1 rounded-full flex items-center">
            <span  className="text-[12px] material-symbols-outlined mr-1.5">trending_up</span>
            +2.5% este mês
          </div>
        </article>

        <section className="col-span-9 bg-white pt-6 rounded-md shadow">
          <TransferTable />
        </section>
        <section className="col-span-3">
          <DashboardMenu/>
        </section>
      </section>
    </>
  );
}
