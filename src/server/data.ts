import "server-only";
import { getDb } from "@/server/mock-db";
import type { Category, DashboardWidget, Transaction } from "@/lib/api";

// Acesso DIRETO aos dados no servidor (sem HTTP). Usado pelo SSR do dashboard:
// evita self-fetch (VERCEL_URL/proteção de deployment) e funciona em qualquer ambiente.

export async function getCategoriesServer(): Promise<Category[]> {
  const db = await getDb();
  return (db.categories as Category[]) ?? [];
}

export async function getDashboardWidgetsServer(): Promise<DashboardWidget[]> {
  const db = await getDb();
  return (db.dashboardWidgets as DashboardWidget[]) ?? [];
}

export async function getTransactionsServer(): Promise<Transaction[]> {
  const db = await getDb();
  return (db.transactions as Transaction[]) ?? [];
}
