// Utilidades de autenticação (somente Node): token assinado, hash de senha
// e opções do cookie de sessão. Nada daqui vai para o bundle do cliente.
import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

export const AUTH_COOKIE = "finance-app-token";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 dias

// Em produção defina AUTH_SECRET (>= 32 chars). O fallback existe só p/ dev/demo.
const SECRET =
  process.env.AUTH_SECRET ?? "dev-only-insecure-secret-change-me-in-production";

if (!process.env.AUTH_SECRET && process.env.NODE_ENV === "production") {
  console.warn(
    "[auth] AUTH_SECRET não definido: usando segredo padrão inseguro."
  );
}

// ── Token de sessão: base64url(payload).hmac ──────────────────
function sign(data: string): string {
  return createHmac("sha256", SECRET).update(data).digest("base64url");
}

export function createSessionToken(userId: number): string {
  const payload = Buffer.from(
    JSON.stringify({
      sub: userId,
      exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

/** Retorna o id do usuário se o token for válido e não expirado. */
export function verifySessionToken(token: string | undefined): number | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    return null;
  }

  try {
    const { sub, exp } = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as { sub: number; exp: number };
    if (typeof sub !== "number" || exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return sub;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true, // inacessível via JS (mitiga roubo por XSS)
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};

// ── Hash de senha (scrypt + salt) ─────────────────────────────
const PREFIX = "scrypt$";

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `${PREFIX}${salt.toString("hex")}$${hash.toString("hex")}`;
}

export function isHashed(stored: string): boolean {
  return stored.startsWith(PREFIX);
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!isHashed(stored)) {
    // Legado (texto puro): comparação em tempo constante; é re-hasheado no login.
    const a = Buffer.from(password);
    const b = Buffer.from(stored);
    return a.length === b.length && timingSafeEqual(a, b);
  }
  const [, saltHex, hashHex] = stored.split("$");
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
  return timingSafeEqual(actual, expected);
}
