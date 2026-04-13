"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RecuperarSenhaSuccess } from "@/components/auth/RecuperarSenhaSuccess"

export function RecuperarSenhaForm() {
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState("")

  if (sent) {
    return <RecuperarSenhaSuccess email={email} onReset={() => setSent(false)} />
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
