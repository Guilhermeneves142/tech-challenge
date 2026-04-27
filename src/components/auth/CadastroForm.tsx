"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";

export function CadastroForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const passwordMismatch = confirm.length > 0 && confirm !== password;

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
          className="h-9"
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
          className="h-9"
        />
      </div>

      {/* Senha + indicador de força */}
      <div className="space-y-1.5">
        <Label
          htmlFor="password"
          className="text-sm font-medium text-foreground"
        >
          Senha
        </Label>
        <PasswordInput
          id="password"
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordStrengthIndicator password={password} />
      </div>

      {/* Confirmar senha */}
      <div className="space-y-1.5">
        <Label
          htmlFor="confirm"
          className="text-sm font-medium text-foreground"
        >
          Confirmar senha
        </Label>
        <PasswordInput
          id="confirm"
          placeholder="Repita a senha"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          aria-invalid={passwordMismatch}
          className={
            passwordMismatch
              ? "border-destructive focus-visible:ring-destructive/20"
              : ""
          }
        />
        {passwordMismatch && (
          <p className="text-xs text-destructive">As senhas não coincidem</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-10 mt-2 font-semibold"
        disabled={passwordMismatch}
      >
        Criar conta
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{" "}
        <Link
          href="/login"
          className="text-primary font-semibold hover:underline"
        >
          Entrar
        </Link>
      </p>
    </form>
  );
}
