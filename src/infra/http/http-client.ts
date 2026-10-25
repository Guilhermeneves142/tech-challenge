// ─────────────────────────────────────────────
//  Infra · cliente HTTP genérico (fetch)
// ─────────────────────────────────────────────

export class HttpError extends Error {
  constructor(public readonly status: number, statusText: string) {
    super(`API error ${status}: ${statusText}`);
    this.name = "HttpError";
  }
}

export type HttpRequest = <T>(path: string, options?: RequestInit) => Promise<T>;

export function createHttpClient(baseUrl: string): HttpRequest {
  return async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    if (!res.ok) throw new HttpError(res.status, res.statusText);

    // DELETE / 204 não têm corpo
    if (res.status === 204) return undefined as T;
    const text = await res.text();
    return (text ? JSON.parse(text) : undefined) as T;
  };
}
