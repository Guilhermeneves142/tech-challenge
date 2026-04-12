import "@/styles/globals.css";
import "@/styles/typography.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
    >
      <body className="min-h-full flex flex-col">
        {/* Criar componente do menu lateral e colocar no lugar dessa tag */}
        {/* <aside> */}
        <div>
          <h2 className="text-brand-primary">FinanceApp</h2>
        </div>
        {/* </aside> */}
        <div>
          <h1>DASHBOARD</h1>
          <span>Veja o seu resumo financeiro</span>
        </div>
        {children}
        <footer>
          <span>© 2023 FinanceApp - Sua Gestão Financeira Profissional.</span>
        </footer>
      </body>
    </html>
  );
}
