import Headline from "@/components/layout/default/headLine";
import { MfeMount } from "@/components/mfe/MfeMount";

export default function TransactionsPage() {
  return (
    <>
      <Headline title="Transações" subTitle="Veja as suas transações" />
      <MfeMount url={process.env.NEXT_PUBLIC_MF_TX_URL!} />
    </>
  );
}
