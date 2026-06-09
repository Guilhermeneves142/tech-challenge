import { redirect } from "next/navigation";

// Usuário sem token nunca chega aqui (o proxy redireciona para /auth/login).
// Com token, a raiz leva direto ao dashboard.
export default function Home() {
  redirect("/dashboard");
}
