"use client"

import { motion } from "framer-motion"
import { useScrollReveal } from "../hooks/use-scroll-reveal"

export function SectionDivider() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <div ref={ref} className="relative w-full overflow-hidden py-12 sm:py-16" aria-hidden="true">
      {/* Subtle ambient glow behind the line */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[60px] bg-[#7b39fc]/10 rounded-full blur-[60px]" />

      {/* The gradient line with animated shimmer */}
      <div className="relative mx-auto w-2/3 h-px bg-gradient-to-r from-transparent via-[#7b39fc]/40 to-transparent overflow-hidden">
        {/* Shimmer sweep - plays when scrolled into view */}
        {isVisible && (
          <motion.div
            className="absolute top-1/2 left-0 -translate-y-1/2 h-2 w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full blur-sm"
            initial={{ x: "-20%" }}
            animate={{ x: "120%" }}
            transition={{ duration: 2, delay: 0.2, ease: "easeInOut" }}
          />
        )}
      </div>

      {/* Extra shimmer layer for depth */}
      <div className="absolute inset-0 mx-auto w-1/3 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent blur-[1px] pointer-events-none" />
    </div>
  )
}
