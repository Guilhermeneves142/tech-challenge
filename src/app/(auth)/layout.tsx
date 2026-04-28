import type { ReactNode } from "react"
import { Clock } from "lucide-react"
import { authFeatures } from "./_data/features"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Painel esquerdo — oculto em mobile */}
      <aside className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-col justify-between relative overflow-hidden bg-[var(--color-brand-tertiary)] shrink-0">
        {/* Padrão decorativo de fundo */}
        <div className="absolute inset-0 pointer-events-none">
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
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm border border-white/20 text-white">
              <Clock size={22} />
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
              {authFeatures.map((f) => {
                const Icon = f.icon
                return (
                  <li key={f.title} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-[var(--color-brand-secondary)] flex items-center justify-center text-[var(--color-brand-primary)] shrink-0 mt-0.5">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{f.title}</p>
                      <p className="text-white/50 text-sm mt-0.5">{f.description}</p>
                    </div>
                  </li>
                )
              })}
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
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
            <Clock size={18} />
          </div>
          <span className="text-foreground font-bold text-lg tracking-tight">FinanceApp</span>
        </div>

        {children}
      </main>
    </div>
  )
}
