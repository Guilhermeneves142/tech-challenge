import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RecuperarSenhaForm } from "@/components/auth/RecuperarSenhaForm"

export default function RecuperarSenhaPage() {
  return (
    <Card className="w-full max-w-[420px] shadow-md ring-0">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-brand-tertiary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground tracking-tight">
            Recuperar senha
          </CardTitle>
        </div>
        <CardDescription className="text-muted-foreground text-sm mt-1">
          Informe seu e-mail e enviaremos um link para redefinir sua senha
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <RecuperarSenhaForm />
      </CardContent>
    </Card>
  )
}
