"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/auth/PasswordInput"

export function LoginForm() {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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

      {/* Senha */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            Senha
          </Label>
          <Link
            href="/recuperar-senha"
            className="text-xs text-primary hover:underline font-medium"
          >
            Esqueci minha senha
          </Link>
        </div>
        <PasswordInput id="password" autoComplete="current-password" />
      </div>

      {/* Botão */}
      <Button type="submit" className="w-full h-10 mt-2 font-semibold">
        Entrar
      </Button>

      {/* Divisor */}
      <div className="relative my-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-3 text-muted-foreground">ou</span>
        </div>
      </div>

      {/* Link de cadastro */}
      <p className="text-center text-sm text-muted-foreground">
        Não tem uma conta?{" "}
        <Link href="/cadastro" className="text-primary font-semibold hover:underline">
          Cadastre-se grátis
        </Link>
      </p>
    </form>
  )
}
