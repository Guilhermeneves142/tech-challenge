import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Prefixo das zonas públicas (MFE de autenticação via multizone).
const PUBLIC_PREFIX = "/auth";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Deixa os assets dos MFEs (/auth/_next/...) passarem direto para o rewrite.
  if (pathname.includes("/_next/")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("finance-app-token")?.value;
  const isPublic = pathname.startsWith(PUBLIC_PREFIX);

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (token && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|em-construcao).*)"],
};
