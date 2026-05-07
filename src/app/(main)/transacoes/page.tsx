import type { TransactionParams } from "@/lib/api";
import { api } from "@/lib/api";
import Headline from "@/components/layout/default/headLine";
import TransactionPageClient from "./components/TransactionPageClient";

type SearchParams = Promise<{
  q?: string;
  type?: string;
  from?: string;
  to?: string;
}>;

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const apiParams: TransactionParams = {};
  if (params.q) apiParams.descriptionLike = params.q;
  if (params.type && params.type !== "all") apiParams.type = params.type as "credit" | "debit";
  if (params.from) apiParams.dateGte = params.from + "T00:00:00.000Z";
  if (params.to) apiParams.dateLte = params.to + "T23:59:59.999Z";

  const [transactions, summary, categories] = await Promise.all([
    api.getTransactions(apiParams).catch(() => []),
    api.getTransactionsSummary(apiParams).catch(() => undefined),
    api.getCategories().catch(() => []),
  ]);

  return (
    <>
      <Headline title="Transações" subTitle="Veja as suas transações" />
      <TransactionPageClient
        transactions={transactions}
        summary={summary}
        categories={categories}
        initialFilters={params}
      />
    </>
  );
}
