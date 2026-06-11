import { Zap, ArrowLeftRight, QrCode } from "lucide-react";
import ActionButton from "./components/actionButton";
import NewTransactionAction from "./components/newTransactionAction";
import Headline from "@/components/layout/default/headLine";
import { WidgetsBoard } from "@/features/dashboard-widgets";
import { api } from "@/lib/api";

// Dados financeiros são por usuário e mudam a cada transação —
// a página precisa de SSR por request, não de prerender estático
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [categories, widgets, transactions] = await Promise.all([
    api.getCategories().catch(() => []),
    api.getDashboardWidgets().catch(() => []),
    api.getTransactions().catch(() => []),
  ]);

  return (
    <>
      <Headline title="Dashboard" subTitle="Veja o seu resumo financeiro" />
      <section className="flex flex-col gap-4">
        <section>
          <article className="flex flex-wrap items-center gap-2 pb-4">
            <Zap
              className="size-6 shrink-0 text-brand-tertiary max-lg:size-5"
              aria-hidden
            />
            <h2 className="text-[24px] font-bold max-lg:text-lg">
              O que você quer fazer?
            </h2>
          </article>
          <section className="grid grid-cols-12 gap-3">
            <NewTransactionAction
              className="col-span-12 sm:col-span-6 lg:col-span-3"
              categories={categories}
            />
            <ActionButton
              className="col-span-12 sm:col-span-6 lg:col-span-3"
              text="Transferir"
              icon={ArrowLeftRight}
              disabled
              route="/em-construcao"
            />
            <ActionButton
              className="col-span-12 sm:col-span-6 lg:col-span-3"
              text="Pagar Conta"
              icon={QrCode}
              disabled
              route="/em-construcao"
            />
          </section>
        </section>
        <WidgetsBoard
          initialWidgets={widgets}
          transactions={transactions}
          categories={categories}
        />
      </section>
    </>
  );
}
