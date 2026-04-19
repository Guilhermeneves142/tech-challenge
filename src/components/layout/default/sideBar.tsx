"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Lock } from "lucide-react";
import { DashboardIcon } from "@/components/icons/dashboard-icon";
import { ProfileIcon } from "@/components/icons/profile-icon";
import { TransactionsIcon } from "@/components/icons/transactions-icon";
import { PlanningIcon } from "@/components/icons/planning-icon";
import { LogoIcon } from "@/components/icons/logo-icon";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <DashboardIcon className="h-5 w-5 shrink-0" />,
  },
  {
    label: "Transações",
    href: "/transacoes",
    icon: <TransactionsIcon className="h-5 w-5 shrink-0" />,
  },
  {
    label: "Planejamento",
    href: "/planejamento",
    icon: <PlanningIcon className="h-5 w-5 shrink-0" />,
    disabled: true,
  },
  {
    label: "Perfil",
    href: "/perfil",
    icon: <ProfileIcon className="h-5 w-5 shrink-0" />,
    disabled: true,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  function handleLogout() {
    setOpenLogoutModal(false);
    router.push("/login");
  }

  return (
    <>
      <div className="flex h-full min-h-screen flex-col justify-between bg-[var(--color-brand-tertiary)] px-4 py-5 text-white">
        <div>
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
              <LogoIcon className="h-5 w-5 text-[var(--color-brand-primary)]" />
            </div>

            <span className="text-[20px] font-semibold leading-[24px]">
              FinanceApp
            </span>
          </div>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const isDisabled = item.disabled;

              const baseClass =
                "flex h-12 items-center gap-3 rounded-lg px-4 transition-all duration-200";

              const activeClass = isActive
                ? "bg-[var(--color-brand-secondary)] text-[var(--color-brand-primary)]"
                : "text-white hover:bg-[var(--color-brand-secondary)]/20";

              const disabledClass =
                "text-white/40 cursor-not-allowed opacity-60";

              if (isDisabled) {
                return (
                  <div
                    key={item.label}
                    title="Disponível em breve"
                    className={`${baseClass} ${disabledClass}`}
                  >
                    {item.icon}

                    <span className="text-[16px] font-medium leading-[20px]">
                      {item.label}
                    </span>

                    <Lock className="ml-auto h-4 w-4 opacity-70" />
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`${baseClass} ${activeClass}`}
                >
                  {item.icon}

                  <span className="text-[16px] font-medium leading-[20px]">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[14px] font-semibold text-[var(--color-brand-primary)]">
              JS
            </div>

            <div className="flex flex-col">
              <span className="text-[14px] font-semibold leading-[18px]">
                João Silva
              </span>

              <span className="text-[11px] font-medium leading-[14px] text-white/75">
                Plano Profissional
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpenLogoutModal(true)}
            className="rounded-lg p-2 transition hover:bg-white/10"
          >
            <LogOut className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {openLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-[20px] font-semibold text-[var(--color-brand-primary)]">
              Deseja sair?
            </h2>

            <p className="mt-2 text-[14px] leading-[20px] text-gray-600">
              Você será redirecionada para a tela de login.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpenLogoutModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-[14px] font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-[var(--color-brand-primary)] px-4 py-2 text-[14px] font-medium text-white transition hover:opacity-90"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}