import type { NextConfig } from "next";

// URLs das zonas (MFEs).
// - Local: localhost (dev/Docker).
// - Vercel: usa as URLs de produção por padrão (process.env.VERCEL = "1" no build),
//   então funciona mesmo sem configurar env var. Pode sobrescrever via MFE_*_URL.
const ON_VERCEL = !!process.env.VERCEL;
// Normaliza a URL da zona:
//  - remove barra(s) no final (evita destino "//transacoes" -> 404);
//  - garante o protocolo (env var sem http(s):// quebra os rewrites do Next).
const normalizeUrl = (u: string) => {
  const s = u.trim().replace(/\/+$/, "");
  return /^https?:\/\//.test(s) ? s : `https://${s}`;
};
const MFE_AUTH_URL = normalizeUrl(
  process.env.MFE_AUTH_URL ??
    (ON_VERCEL ? "https://finance-mfe-auth.vercel.app" : "http://localhost:4001")
);
const MFE_TX_URL = normalizeUrl(
  process.env.MFE_TX_URL ??
    (ON_VERCEL
      ? "https://finance-mfe-transactions.vercel.app"
      : "http://localhost:4002")
);

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    // beforeFiles: garante que as zonas vençam rotas locais com o mesmo path.
    return {
      beforeFiles: [
        // Multizone: tudo sob /auth (páginas e assets _next) vai para o MFE de auth.
        { source: "/auth", destination: `${MFE_AUTH_URL}/auth` },
        { source: "/auth/:path*", destination: `${MFE_AUTH_URL}/auth/:path*` },
        // Multizone: tudo sob /transacoes vai para o MFE de transações.
        { source: "/transacoes", destination: `${MFE_TX_URL}/transacoes` },
        { source: "/transacoes/:path*", destination: `${MFE_TX_URL}/transacoes/:path*` },
      ],
    };
  },
};

export default nextConfig;
