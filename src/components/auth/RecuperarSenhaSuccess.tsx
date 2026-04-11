"use client"

import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RecuperarSenhaSuccessProps {
  email: string
  onReset: () => void
}

export function RecuperarSenhaSuccess({ email, onReset }: RecuperarSenhaSuccessProps) {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-4">
      <div className="w-16 h-16 rounded-full bg-[var(--color-feedback-success)]/10 flex items-center justify-center">
        <CheckCircle size={32} stroke="var(--color-feedback-success)" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground tracking-tight">E-mail enviado!</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          Enviamos um link de recuperação para{" "}
          <span className="font-medium text-foreground">{email}</span>.
          Verifique sua caixa de entrada.
        </p>
      </div>

      <div className="w-full pt-2 space-y-3">
        <Button variant="outline" className="w-full h-10" onClick={onReset}>
          Usar outro e-mail
        </Button>
        <Link href="/login" className="block">
          <Button variant="ghost" className="w-full h-10 text-primary">
            Voltar para o login
          </Button>
        </Link>
      </div>

      <p className="text-xs text-muted-foreground pt-2">
        Não recebeu?{" "}
        <button onClick={onReset} className="text-primary hover:underline font-medium">
          Reenviar e-mail
        </button>
      </p>
    </div>
  )
}
