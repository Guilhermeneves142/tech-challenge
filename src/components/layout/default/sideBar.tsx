"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { DashboardIcon } from "@/components/icons/dashboard-icon";
import { ProfileIcon } from "@/components/icons/profile-icon";
import { TransactionsIcon } from "@/components/icons/transactions-icon";
import { PlanningIcon } from "@/components/icons/planning-icon";
import { LogoIcon } from "@/components/icons/logo-icon";

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  { label: "Transações", href: "/transacoes", icon: TransactionsIcon },
  { label: "Planejamento", href: "/planejamento", icon: PlanningIcon },
  { label: "Perfil", href: "/perfil", icon: ProfileIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  const iconStyle = "h-5 w-5 shrink-0 text-inherit";

  return (
    <div className="flex h-full min-h-screen flex-col justify-between bg-[var(--color-brand-tertiary)] px-4 py-5 text-white">
      
      {/* TOPO */}
      <div>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
            <LogoIcon className="h-5 w-5 text-[var(--color-brand-primary)]" />
          </div>

          <span className="text-[20px] font-semibold leading-[24px] text-white">
            FinanceApp
          </span>
        </div>

        {/* MENU */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex h-12 items-center gap-3 rounded-lg px-4 transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--color-brand-secondary)] text-[var(--color-brand-primary)]"
                    : "text-white hover:bg-[var(--color-brand-secondary)]/20"
                }`}
              >
                <Icon className={iconStyle} />

                <span className="text-[16px] font-medium leading-[20px]">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* RODAPÉ */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[14px] font-semibold text-[var(--color-brand-primary)]">
            JS
          </div>

          <div className="flex flex-col">
            <span className="text-[14px] font-semibold leading-[18px] text-white">
              João Silva
            </span>

            <span className="text-[11px] font-medium leading-[14px] text-white/75">
              Plano Profissional
            </span>
          </div>
        </div>

        <button className="rounded-lg p-2 transition hover:bg-white/10">
          <LogOut className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
}