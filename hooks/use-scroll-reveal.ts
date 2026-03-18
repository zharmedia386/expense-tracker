"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"

/**
 * Returns a ref and a boolean `isVisible` that becomes true once
 * the element has scrolled into view (triggers only once).
 */
export function useScrollReveal(options?: { threshold?: number }) {
  const ref = useRef<HTMLElement>(null)
  const isVisible = useInView(ref, {
    once: true,
    amount: options?.threshold ?? 0.15,
  })
  return { ref, isVisible }
}
