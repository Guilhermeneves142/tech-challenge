import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card/card"
import { CadastroForm } from "@/components/auth/CadastroForm"

export default function CadastroPage() {
  return (
    <Card className="w-full max-w-[440px] shadow-md ring-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-foreground tracking-tight">
          Crie sua conta
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm mt-1">
          Comece a controlar suas finanças hoje mesmo
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <CadastroForm />
      </CardContent>
    </Card>
  )
}
