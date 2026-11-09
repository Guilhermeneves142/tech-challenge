import type { User } from "@/domain";
import { resolveApiBaseUrl } from "./api-base";
import { createHttpClient } from "./http-client";

const request = createHttpClient(resolveApiBaseUrl());

export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export type AuthUser = User;

export interface AuthResponse {
  user: AuthUser;
}

export const authApi = {
  login: (body: LoginBody) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  register: (body: RegisterBody) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  /** Usuário da sessão atual (cookie httpOnly). `null` se não autenticado. */
  me: () =>
    request<{ user: AuthUser | null }>("/auth/me")
      .then((data) => data?.user ?? null)
      .catch(() => null),
};
