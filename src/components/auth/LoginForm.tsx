"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/auth-api";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/inputs/input";
import { Label } from "@/components/ui/label/label";
import { PasswordInput } from "@/components/auth/PasswordInput";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Preencha e-mail e senha.");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.login({
        email,
        password,
      });

      localStorage.setItem("finance-app-token", response.token);
      localStorage.setItem("finance-app-user", JSON.stringify(response.user));

      router.push("/dashboard");
    } catch {
      setError("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium text-foreground">
          E-mail
        </Label>

        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          autoComplete="email"         
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          onInvalid={(e) =>
            (e.target as HTMLInputElement).setCustomValidity(
              "Preencha este campo"
            )
          }
          onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            Senha
          </Label>

          <Link
            href="/recuperar-senha"
            className="text-xs text-primary hover:underline font-medium"
          >
            Esqueci minha senha
          </Link>
        </div>

        <PasswordInput
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        type="submit"
        className="w-full h-10 mt-2 font-semibold"
        disabled={loading}
      >
        {loading ? "Entrando..." : "Entrar"}
      </Button>

      <div className="relative my-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>

        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-3 text-muted-foreground">ou</span>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Não tem uma conta?{" "}
        <Link
          href="/cadastro"
          className="text-primary font-semibold hover:underline"
        >
          Cadastre-se grátis
        </Link>
      </p>
    </form>
  );
}