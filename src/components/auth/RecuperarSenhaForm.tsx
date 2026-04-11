"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function RecuperarSenhaForm() {
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState("")

  if (sent) {
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
          <Button variant="outline" className="w-full h-10" onClick={() => setSent(false)}>
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
          <button onClick={() => setSent(false)} className="text-primary hover:underline font-medium">
            Reenviar e-mail
          </button>
        </p>
      </div>
    )
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        if (email) setSent(true)
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium text-foreground">
          E-mail cadastrado
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 bg-background"
          required
        />
      </div>

      <Button type="submit" className="w-full h-10 font-semibold mt-2">
        Enviar link de recuperação
      </Button>

      <Link href="/login" className="block">
        <Button type="button" variant="ghost" className="w-full h-10 text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} className="mr-2" />
          Voltar para o login
        </Button>
      </Link>
    </form>
  )
}
