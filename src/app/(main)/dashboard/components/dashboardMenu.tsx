"use client";

import Link from "next/link";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { CreditCard, Home } from "lucide-react";

export default function DashboardMenu() {
  const [selectedMenu, setSelectedMenu] = useState("home");

  function checkSelected(key: string) {
    return selectedMenu === key;
  }

  return (
    <section className="flex w-full flex-col gap-2 bg-white p-4">
      <DashboardMenuItem
        name="Home"
        route="/dashboard"
        icon={Home}
        selected={checkSelected("home")}
        onSelect={() => setSelectedMenu("home")}
      />
      <DashboardMenuItem
        name="Relatórios Financeiros"
        icon={CreditCard}
        route="/em-construcao"
        selected={checkSelected("em-construcao")}
        onSelect={() => setSelectedMenu("em-construcao")}
      />
    </section>
  );
}

type DashboardMenuItemProps = {
  name: string;
  route: string;
  selected: boolean;
  icon: LucideIcon;
  onSelect: () => void;
};

function DashboardMenuItem({
  name,
  route,
  selected,
  onSelect,
  icon: Icon,
}: DashboardMenuItemProps) {
  const itemClass = selected
    ? "bg-brand-tertiary text-white hover:opacity-90"
    : "text-text-secondary hover:bg-gray-100";

  return (
    <Link
      className={[
        "flex items-center gap-2 rounded-md px-4 py-3",
        itemClass,
      ].join(" ")}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-label={name}
      href={route}
    >
      <Icon className="size-[18px] shrink-0" aria-hidden />
      <span className="text-[14px] font-medium">{name}</span>
    </Link>
  );
}
