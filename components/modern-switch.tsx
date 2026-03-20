"use client"

import * as React from "react"
import { motion } from "framer-motion"

export interface ModernSwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

export function ModernSwitch({ checked, onCheckedChange, disabled = false }: ModernSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#7b39fc]/50 focus:ring-offset-2 focus:ring-offset-[#0c0a14] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${
        checked ? "bg-[#7b39fc]" : "bg-white/10"
      }`}
    >
      <span className="sr-only">Toggle</span>
      {/* Background glow when checked */}
      {checked && !disabled && (
        <div className="absolute inset-0 rounded-full bg-[#7b39fc] blur-sm opacity-50" />
      )}
      
      <motion.span
        initial={false}
        animate={{
          x: checked ? 28 : 2,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`pointer-events-none relative mt-0.5 inline-block h-5 w-5 rounded-full shadow-lg ring-0 transition-colors duration-300 ease-in-out z-10 ${
          checked ? "bg-white" : "bg-white/50"
        }`}
      >
        {/* Inner detail on the knob */}
        <span className={`absolute inset-0 rounded-full bg-gradient-to-br transition-opacity ${checked ? "from-white to-gray-200 opacity-100" : "from-transparent to-transparent opacity-0"}`} />
        <span className={`absolute inset-0 rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)]`} />
      </motion.span>
    </button>
  )
}
