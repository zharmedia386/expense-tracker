import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export interface ModernButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline"
  size?: "sm" | "md" | "lg"
}

const ModernButton = forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = `
      relative inline-flex items-center justify-center font-[family-name:var(--font-cabin)] font-medium 
      rounded-xl transition-all duration-200 ease-out
      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-[0.98]
    `

    const variants = {
      primary: `
        bg-gradient-to-b from-[#9055ff] to-[#6b2fd6]
        text-white
        shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),inset_0_-2px_4px_0_rgba(0,0,0,0.2),0_4px_12px_-2px_rgba(123,57,252,0.4)]
        hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),inset_0_-2px_4px_0_rgba(0,0,0,0.25),0_6px_16px_-2px_rgba(123,57,252,0.5)]
        hover:from-[#9d66ff] hover:to-[#7b39fc]
        focus-visible:ring-[#7b39fc]
      `,
      secondary: `
        bg-gradient-to-b from-[#3d3557] to-[#2b2344]
        text-[#f6f7f9]
        shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),inset_0_-2px_4px_0_rgba(0,0,0,0.3),0_4px_12px_-2px_rgba(0,0,0,0.3)]
        hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),inset_0_-2px_4px_0_rgba(0,0,0,0.35),0_6px_16px_-2px_rgba(0,0,0,0.4)]
        hover:from-[#4a4066] hover:to-[#3a3057]
        focus-visible:ring-[#4a4066]
      `,
      ghost: `
        bg-transparent
        text-white
        shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]
        hover:bg-white/5
        hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25),inset_0_1px_0_0_rgba(255,255,255,0.1)]
        focus-visible:ring-white/30
      `,
      outline: `
        bg-gradient-to-b from-white to-[#f5f5f5]
        text-[#171717]
        border border-[#e0e0e0]
        shadow-[inset_0_1px_0_0_rgba(255,255,255,1),inset_0_-2px_4px_0_rgba(0,0,0,0.05),0_2px_8px_-2px_rgba(0,0,0,0.1)]
        hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,1),inset_0_-2px_4px_0_rgba(0,0,0,0.08),0_4px_12px_-2px_rgba(0,0,0,0.15)]
        hover:from-white hover:to-[#f0f0f0]
        focus-visible:ring-[#7b39fc]
      `,
    }

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

ModernButton.displayName = "ModernButton"

export { ModernButton }
