import "@/styles/globals.css";
import "@/styles/typography.css"
import Sidebar from "@/components/layout/default/sideBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className="min-h-screen bg-background text-foreground">
      {/* Criar componente do menu lateral e colocar no lugar dessa tag */}
      {/* <aside> */}
      <div className="flex min-h-screen">
        <aside className="w-[255px]">
          <Sidebar />
        </aside>

        <main className="flex-1">
          {children}
        </main>
      </div>
      {/* </aside> */}
      
        <div>
          <h1>DASHBOARD</h1>
          <span>Veja o seu resumo financeiro</span>
        </div>
        {children}
      </body>
    </html>
  );
}
