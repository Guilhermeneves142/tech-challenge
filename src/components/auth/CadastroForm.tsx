"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/auth/PasswordInput"

function getPasswordStrength(password: string): 0 | 1 | 2 | 3 {
  if (password.length === 0) return 0
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score as 0 | 1 | 2 | 3
}

const strengthConfig: Record<0 | 1 | 2 | 3, { label: string; bars: boolean[]; color: string }> = {
  0: { label: "",      bars: [false, false, false], color: "bg-muted" },
  1: { label: "Fraca", bars: [true,  false, false], color: "bg-destructive" },
  2: { label: "Média", bars: [true,  true,  false], color: "bg-[var(--color-feedback-warning)]" },
  3: { label: "Forte", bars: [true,  true,  true],  color: "bg-[var(--color-feedback-success)]" },
}

export function CadastroForm() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm]   = useState("")

  const strength = getPasswordStrength(password)
  const { label, bars, color } = strengthConfig[strength]
  const passwordMismatch = confirm.length > 0 && confirm !== password

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      {/* Nome */}
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-sm font-medium text-foreground">
          Nome completo
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="João Silva"
          autoComplete="name"
          className="h-10 bg-background"
        />
      </div>

      {/* E-mail */}
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium text-foreground">
          E-mail
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          autoComplete="email"
          className="h-10 bg-background"
        />
      </div>

      {/* Senha + indicador de força */}
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-sm font-medium text-foreground">
          Senha
        </Label>
        <PasswordInput
          id="password"
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {password.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="flex gap-1.5">
              {bars.map((active, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${active ? color : "bg-muted"}`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Força da senha:{" "}
              <span className={
                strength === 3 ? "text-[var(--color-feedback-success)] font-medium"
                : strength === 2 ? "text-[var(--color-feedback-warning)] font-medium"
                : "text-destructive font-medium"
              }>
                {label}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Confirmar senha */}
      <div className="space-y-1.5">
        <Label htmlFor="confirm" className="text-sm font-medium text-foreground">
          Confirmar senha
        </Label>
        <PasswordInput
          id="confirm"
          placeholder="Repita a senha"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          aria-invalid={passwordMismatch}
          className={passwordMismatch ? "border-destructive focus-visible:ring-destructive/20" : ""}
        />
        {passwordMismatch && (
          <p className="text-xs text-destructive">As senhas não coincidem</p>
        )}
      </div>

      <Button type="submit" className="w-full h-10 mt-2 font-semibold" disabled={passwordMismatch}>
        Criar conta
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{" "}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  )
}
