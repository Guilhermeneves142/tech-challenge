import { DollarSign, TrendingUp, Shield, type LucideIcon } from "lucide-react"

export type AuthFeature = {
  icon: LucideIcon
  title: string
  description: string
}

export const authFeatures: AuthFeature[] = [
  {
    icon: DollarSign,
    title: "Controle total",
    description: "Acompanhe receitas e despesas em tempo real",
  },
  {
    icon: TrendingUp,
    title: "Relatórios inteligentes",
    description: "Visualize tendências e tome decisões melhores",
  },
  {
    icon: Shield,
    title: "Segurança avançada",
    description: "Seus dados protegidos com criptografia de ponta",
  },
]
