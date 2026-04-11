import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <Card className="w-full max-w-[420px] shadow-md ring-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-foreground tracking-tight">
          Bem-vindo de volta
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm mt-1">
          Entre na sua conta para continuar
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <LoginForm />
      </CardContent>
    </Card>
  )
}
