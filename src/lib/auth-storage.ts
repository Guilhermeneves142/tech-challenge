// A sessão agora vive num cookie httpOnly emitido pelo servidor (não acessível
// via JS). Aqui só resta o logout, que pede ao servidor para invalidar o cookie.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export async function clearAuth(): Promise<void> {
  try {
    await fetch(`${API_URL}/auth/logout`, { method: "POST" });
  } finally {
    // Limpa resquícios de versões anteriores que guardavam token/usuário aqui.
    try {
      localStorage.removeItem("finance-app-token");
      localStorage.removeItem("finance-app-user");
    } catch {}
  }
}
