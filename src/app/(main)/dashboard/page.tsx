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
        <section className="col-span-12 lg:col-span-9 min-[1400px]:col-span-9">
          <article className="flex flex-wrap items-center gap-2 pb-4">
            <span className="material-symbols-outlined text-[24px] text-brand-tertiary max-lg:text-xl">
              bolt
            </span>
            <h2 className="text-[24px] font-bold max-lg:text-lg">
              O que você quer fazer?
            </h2>
          </article>
          <section className="grid grid-cols-12 gap-3">
            <NewTransactionAction className="col-span-12 sm:col-span-6 lg:col-span-3" />
            <ActionButton
              className="col-span-12 sm:col-span-6 lg:col-span-3"
              text="Transferir"
              icon="sync_alt"
              route="/em-construcao"
            />
            <ActionButton
              className="col-span-12 lg:col-span-3"
              text="Pagar Conta"
              icon="qr_code"
              route="/em-construcao"
            />
          </section>
        </section>
        <article className="col-span-12 flex flex-col justify-between gap-4 rounded-md bg-brand-tertiary p-6 max-lg:min-h-[160px] lg:col-span-3 lg:p-8">
          <div className="min-w-0">
            <strong className="text-[24px] font-bold text-white max-lg:text-base">
              Seu Saldo atual
            </strong>
            <h2 className="wrap-break-word text-[48px] font-bold leading-tight text-white max-lg:text-3xl max-sm:text-2xl">
              {currentBalance}
            </h2>
          </div>
          <div className="flex w-fit max-w-full items-center gap-1 rounded-full bg-secondary px-3 py-1 text-brand-primary">
            <span className="material-symbols-outlined shrink-0 text-[12px]">
              trending_up
            </span>
            <span className="min-w-0 truncate text-sm">
              {balance?.variationLabel ?? "+0% este mês"}
            </span>
          </div>
        </article>

        <section className="col-span-12 overflow-x-auto rounded-md bg-white pt-6 shadow lg:col-span-9">
          <TransferTable transactions={dashboard?.recentTransactions ?? []} />
        </section>
        <section className="col-span-12 lg:col-span-3">
          <DashboardMenu />
        </section>
      </section>
    </>
  );
}
