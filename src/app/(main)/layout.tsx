import Sidebar from "@/components/layout/default/sideBar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-0 lg:w-[255px] shrink-0">
        <div className="fixed left-0 top-0 h-screen w-[255px] flex flex-col justify-between">
          <Sidebar />
        </div>
      </aside>

      <section className="flex flex-col flex-1 px-6">
        <main className="py-4">{children}</main>
        <footer className="text-center mt-auto">
          <span className="text-[12px] text-text-tertiary">
            © 2023 FinanceApp - Sua Gestão Financeira Profissional.
          </span>
        </footer>
      </section>
    </div>
  );
}
