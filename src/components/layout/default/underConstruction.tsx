"use client";

import { ArrowLeft, Construction } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function UnderConstruction() {
  const router = useRouter();

  return (
    <section className="flex items-center justify-center min-h-[70vh] px-6">
      <Card className="flex flex-col items-center gap-4 py-12 px-8 max-w-md text-center">
        <div className="rounded-full bg-brand-secondary p-5 text-brand-primary">
          <Construction className="size-10" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-card-foreground">Em breve</h2>
          <p className="text-text-secondary">
            Essa funcionalidade ainda está sendo desenvolvida. Volte em breve para conferir as novidades.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
          Voltar
        </Button>
      </Card>
    </section>
  );
}
