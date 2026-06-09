import type { NextConfig } from "next";

// URLs das zonas (MFEs). Em produção, apontar para os deploys.
const MFE_AUTH_URL = process.env.MFE_AUTH_URL ?? "http://localhost:4001";
const MFE_TX_URL = process.env.MFE_TX_URL ?? "http://localhost:4002";

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
