import Sidebar from "@/components/layout/default/sideBar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-[255px]">
        <Sidebar />
      </aside>

      <section className="flex-1 px-6 py-2">
        <main>{children}</main>
        <footer className="text-center">
          <span className="text-[12px] text-text-tertiary">
            © 2023 FinanceApp - Sua Gestão Financeira Profissional.
          </span>
        </footer>
      </section>
    </div>
  );
}
