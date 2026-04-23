"use client";

import { useEffect, useState } from "react";
import DashboardMenu from "./components/dashboardMenu";
import ActionButton from "./components/actionButton";
import NewTransactionAction from "./components/newTransactionAction";
import TransferTable from "./components/transferTable";
import Headline from "@/components/layout/default/headLine";
import { api } from "@/lib/api";
import type { Dashboard } from "@/lib/api";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard | undefined>();

  useEffect(() => {
    api.getDashboard().then(setDashboard).catch(console.error);
  }, []);

  const balance = dashboard?.balance;
  const currentBalance = (balance?.current ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <>
      <Headline title="Dashboard" subTitle="Veja o seu resumo financeiro" />
      <section className="grid grid-cols-12 gap-3">
        <section className="min-[1400px]:col-span-9 col-span-8">
          <article className="flex items-center pb-4">
            <span className="text-[24px] material-symbols-outlined text-brand-tertiary">
              bolt
            </span>
            <h2 className="text-[24px] font-bold">O que você quer fazer?</h2>
          </article>
          <section className="grid grid-cols-12 gap-3">
            <NewTransactionAction className="col-span-3" />
            <ActionButton
              className="col-span-3"
              text="Transferir"
              icon="sync_alt"
              route="/em-construcao"
            />
            <ActionButton
              className="col-span-3"
              text="Pagar Conta"
              icon="qr_code"
              route="/em-construcao"
            />
          </section>
        </section>
        <article className="bg-brand-tertiary w-full p-8 rounded-md min-[1400px]:col-span-3 col-span-4 flex flex-col justify-between">
          <div>
            <strong className="text-nowrap text-white text-[24px] font-bold">
              Seu Saldo atual
            </strong>
            <h2 className="text-white text-[48px] font-bold">{currentBalance}</h2>
          </div>
          <div className="bg-secondary w-fit text-brand-primary px-3 py-1 rounded-full flex items-center">
            <span className="text-[12px] material-symbols-outlined mr-1.5">
              trending_up
            </span>
            {balance?.variationLabel ?? "+0% este mês"}
          </div>
        </article>

        <section className="col-span-9 bg-white pt-6 rounded-md shadow">
          <TransferTable transactions={dashboard?.recentTransactions ?? []} />
        </section>
        <section className="col-span-3">
          <DashboardMenu />
        </section>
      </section>
    </>
  );
}
