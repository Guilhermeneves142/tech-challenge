import type { ReactNode } from "react"

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: "Controle total",
    description: "Acompanhe receitas e despesas em tempo real",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
    title: "Relatórios inteligentes",
    description: "Visualize tendências e tome decisões melhores",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Segurança avançada",
    description: "Seus dados protegidos com criptografia de ponta",
  },
]

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Painel esquerdo — oculto em mobile */}
      <aside className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-col justify-between relative overflow-hidden bg-[var(--color-brand-tertiary)] shrink-0">
        {/* Padrão decorativo de fundo */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Círculos decorativos */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 left-16 w-64 h-64 rounded-full bg-white/5" />
          {/* Grid sutil */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Conteúdo do painel */}
        <div className="relative z-10 flex flex-col h-full p-10 xl:p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12" />
                <path d="M12 2C6.48 2 2 6.48 2 12" strokeOpacity="0.4" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">FinanceApp</span>
          </div>

          {/* Título central */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-2">
              <span className="inline-block text-[var(--color-brand-secondary)] text-sm font-medium tracking-widest uppercase mb-4">
                Gestão Financeira
              </span>
            </div>
            <h1 className="text-white text-4xl xl:text-[2.75rem] font-bold leading-[1.15] mb-5 tracking-tight">
              Tome o controle<br />das suas finanças
            </h1>
            <p className="text-white/60 text-base leading-relaxed max-w-xs">
              Planeje, acompanhe e evolua. Tudo em um só lugar, de forma simples e segura.
            </p>

            {/* Divisor */}
            <div className="w-12 h-px bg-white/20 my-8" />

            {/* Features */}
            <ul className="space-y-5">
              {features.map((f) => (
                <li key={f.title} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-[var(--color-brand-secondary)] flex items-center justify-center text-[var(--color-brand-primary)] shrink-0 mt-0.5">
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{f.title}</p>
                    <p className="text-white/50 text-sm mt-0.5">{f.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Rodapé do painel */}
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} FinanceApp. Todos os direitos reservados.
          </p>
        </div>
      </aside>

      {/* Área do formulário */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 min-h-screen">
        {/* Logo mobile */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <span className="text-foreground font-bold text-lg tracking-tight">FinanceApp</span>
        </div>

        {children}
      </main>
    </div>
  )
}
