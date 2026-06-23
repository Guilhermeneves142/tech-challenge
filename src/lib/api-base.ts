// Resolve a base URL da API tanto no navegador quanto no servidor (SSR).
//
// - Navegador: usa caminho RELATIVO ("/api"). No multizone o navegador está
//   sempre na origem do host, então "/api" cai nas Route Handlers do host.
// - Servidor (SSR): precisa de URL ABSOLUTA. Na Vercel usa VERCEL_URL; em
//   local/Docker usa http://localhost:<PORT>.
//
// Override opcional via NEXT_PUBLIC_API_URL (ex.: apontar p/ uma API externa).
export function resolveApiBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_URL;

  if (typeof window !== "undefined") {
    return env ?? "/api";
  }

  // A partir daqui é servidor.
  if (env && /^https?:\/\//.test(env)) return env; // já é absoluta

  const rel = env ?? "/api";
  const origin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT ?? 3000}`;

  return `${origin}${rel.startsWith("/") ? rel : `/${rel}`}`;
}
