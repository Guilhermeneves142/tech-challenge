"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { CreditCard, Home } from "lucide-react";

const menuItems = [
  { name: "Home", route: "/dashboard", icon: Home },
  { name: "Relatórios Financeiros", route: "/em-construcao", icon: CreditCard },
];

export default function DashboardMenu() {
  const pathname = usePathname();

  return (
    <section className="flex w-full flex-col gap-2 bg-white p-4">
      {menuItems.map((item) => (
        <DashboardMenuItem
          key={item.route}
          name={item.name}
          route={item.route}
          icon={item.icon}
          selected={pathname.startsWith(item.route)}
        />
      ))}
    </section>
  );
}

type DashboardMenuItemProps = {
  name: string;
  route: string;
  selected: boolean;
  icon: LucideIcon;
};

function DashboardMenuItem({ name, route, selected, icon: Icon }: DashboardMenuItemProps) {
  const itemClass = selected
    ? "bg-brand-tertiary text-white hover:opacity-90"
    : "text-text-secondary hover:bg-gray-100";

  return (
    <Link
      className={["flex items-center gap-2 rounded-md px-4 py-3", itemClass].join(" ")}
      href={route}
    >
      <Icon className="size-[18px] shrink-0" aria-hidden />
      <span className="text-[14px] font-medium">{name}</span>
    </Link>
  );
}
