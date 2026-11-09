export interface User {
  id: number;
  name: string;
  email: string;
  initials: string;
  plan: string;
  avatar: string | null;
}

/** "Maria da Silva" → "MD" (iniciais das duas primeiras palavras) */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
