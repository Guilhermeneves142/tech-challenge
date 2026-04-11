"use client"

function getPasswordStrength(password: string): 0 | 1 | 2 | 3 {
  if (password.length === 0) return 0
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score as 0 | 1 | 2 | 3
}

const strengthConfig: Record<0 | 1 | 2 | 3, { label: string; bars: boolean[]; color: string }> = {
  0: { label: "",      bars: [false, false, false], color: "bg-muted" },
  1: { label: "Fraca", bars: [true,  false, false], color: "bg-destructive" },
  2: { label: "Média", bars: [true,  true,  false], color: "bg-[var(--color-feedback-warning)]" },
  3: { label: "Forte", bars: [true,  true,  true],  color: "bg-[var(--color-feedback-success)]" },
}

interface PasswordStrengthIndicatorProps {
  password: string
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  if (password.length === 0) return null

  const strength = getPasswordStrength(password)
  const { label, bars, color } = strengthConfig[strength]

  return (
    <div className="space-y-1.5 pt-1">
      <div className="flex gap-1.5">
        {bars.map((active, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${active ? color : "bg-muted"}`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Força da senha:{" "}
        <span className={
          strength === 3 ? "text-[var(--color-feedback-success)] font-medium"
          : strength === 2 ? "text-[var(--color-feedback-warning)] font-medium"
          : "text-destructive font-medium"
        }>
          {label}
        </span>
      </p>
    </div>
  )
}
