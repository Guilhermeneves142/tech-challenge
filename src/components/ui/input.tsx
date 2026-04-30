import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode
  iconSide?: "left" | "right"
}

export function Input({ className, type, icon, iconSide = "left", style, ...props }: InputProps) {
  return (
    <label
      className={cn(
        "overflow-hidden rounded-md",
        "inline-grid items-center",
        !icon && "grid-cols-[1fr]",
        icon && iconSide === "left" && "grid-cols-[auto_1fr]",
        icon && iconSide === "right" && "grid-cols-[1fr_auto]",
        "h-8 w-full min-w-0 rounded-md border border-primary",
        "has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/50",
        "has-[input[aria-invalid=true]]:border-destructive has-[input[aria-invalid=true]]:ring-3 has-[input[aria-invalid=true]]:ring-destructive/20",
        "dark:has-[input[aria-invalid=true]]:border-destructive/50 dark:has-[input[aria-invalid=true]]:ring-destructive/40",
        "has-[input:disabled]:pointer-events-none has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50",
      )}
    >
      {/* Icone esquerdo */}
      {icon && iconSide === "left" && (
        <span className="flex items-center text-muted-foreground pl-2.5">
          {icon}
        </span>
      )}

      <InputPrimitive
        type={type}
        data-slot="input"
        className={cn(
          "rounded-md",
          "h-full w-full bg-transparent py-1 text-base md:text-sm transition-colors outline-none",
          "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "placeholder:text-muted-foreground",
          "disabled:bg-input/50 dark:disabled:bg-input/80",
          "dark:bg-input/30",

          (!icon || iconSide === "right") ? "pl-2.5" : "pl-1.5",
          (!icon || iconSide === "left") ? "pr-2.5" : "pr-1.5",
          className
        )}
        style={style}
        {...props}
      />

      {/* Icone direito */}
      {icon && iconSide === "right" && (
        <span className="flex items-center text-muted-foreground pr-2.5">
          {icon}
        </span>
      )}
    </label>
  )
}