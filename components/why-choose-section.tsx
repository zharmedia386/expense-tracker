"use client"

import { Check, ArrowRight, Sparkles } from "lucide-react"
import { ModernButton } from "./modern-button"
import { motion } from "framer-motion"
import { useScrollReveal } from "../hooks/use-scroll-reveal"

const reasons = [
  "No credit card required to start",
  "Free forever plan available",
  "Setup in under 2 minutes",
  "Cancel anytime, no questions asked",
  "24/7 customer support",
  "99.9% uptime guarantee",
  "SOC 2 Type II certified",
  "GDPR compliant",
]

const comparisons = [
  {
    feature: "AI-Powered Categorization",
    us: true,
    others: false,
  },
  {
    feature: "Voice & Image Input",
    us: true,
    others: false,
  },
  {
    feature: "Real-Time Bank Sync",
    us: true,
    others: true,
  },
  {
    feature: "Multi-Currency Support",
    us: true,
    others: "Limited",
  },
  {
    feature: "Free Tier Available",
    us: true,
    others: false,
  },
  {
    feature: "No Per-User Pricing",
    us: true,
    others: false,
  },
]

export function WhyChooseSection() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="relative bg-[#0c0a14] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-[120px] overflow-hidden" id="about">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large bottom glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[1000px] h-[400px] sm:h-[600px] bg-[#7b39fc]/8 rounded-full blur-[150px] sm:blur-[200px]" />
        
        {/* Side accents */}
        <div className="absolute top-1/4 left-0 w-[200px] sm:w-[400px] h-[300px] sm:h-[500px] bg-[#7b39fc]/5 rounded-full blur-[100px] sm:blur-[150px]" />
        <div className="absolute bottom-1/3 right-0 w-[200px] sm:w-[300px] h-[200px] sm:h-[400px] bg-[#4a2090]/10 rounded-full blur-[80px] sm:blur-[120px]" />
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(123,57,252,0.05)_0%,transparent_70%)]" />
      </div>
      
      <div className="relative max-w-7xl mx-auto" ref={ref}>
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#7b39fc]/20 to-[#9055ff]/10 border border-[#7b39fc]/30 mb-6 shadow-[0_0_30px_rgba(123,57,252,0.15)]"
          >
            <Sparkles className="w-4 h-4 text-[#9055ff]" />
            <span className="font-[family-name:var(--font-cabin)] text-sm text-[#9055ff]">Why ExpenseAI</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="font-[family-name:var(--font-instrument-serif)] text-white text-3xl sm:text-4xl lg:text-6xl mb-4 sm:mb-6"
          >
            Why choose{" "}
            <em className="italic bg-gradient-to-r from-[#9055ff] via-[#c084fc] to-[#9055ff] bg-clip-text text-transparent">
              us
            </em>?
          </motion.h2>
          <p className="font-[family-name:var(--font-inter)] text-white/60 text-base sm:text-lg max-w-xl mx-auto px-4">
            We built the expense tracker we always wanted but could never find. Here's why teams love us.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-start">
          {/* Reasons List */}
          <div className="space-y-4 order-2 lg:order-1">
            <h3 className="font-[family-name:var(--font-manrope)] text-white text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
              Everything you need, nothing you don't
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {reasons.map((reason, index) => (
                <motion.div
                  key={reason}
                  initial={{ opacity: 0, x: -24 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.25 + index * 0.06, ease: "easeOut" }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#7b39fc]/30 transition-all duration-300 group"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-[#7b39fc] to-[#4a2090] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#7b39fc]/20 group-hover:shadow-[#7b39fc]/40 transition-shadow">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <span className="font-[family-name:var(--font-inter)] text-white/80 text-sm">
                    {reason}
                  </span>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.65, ease: "easeOut" }}
              className="pt-6 sm:pt-8"
            >
              <ModernButton variant="primary" size="md" className="w-full sm:w-auto">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </ModernButton>
            </motion.div>
          </div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 overflow-hidden order-1 lg:order-2 shadow-[0_0_60px_rgba(123,57,252,0.1)]"
          >
            <div className="p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-[#7b39fc]/10 to-transparent">
              <h3 className="font-[family-name:var(--font-manrope)] text-white text-lg sm:text-xl font-semibold">
                How we compare
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-3 sm:p-4 font-[family-name:var(--font-cabin)] text-white/40 text-xs uppercase tracking-wider">
                      Feature
                    </th>
                    <th className="text-center p-3 sm:p-4 font-[family-name:var(--font-cabin)] text-[#9055ff] text-xs uppercase tracking-wider">
                      Us
                    </th>
                    <th className="text-center p-3 sm:p-4 font-[family-name:var(--font-cabin)] text-white/40 text-xs uppercase tracking-wider">
                      Others
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row, index) => (
                    <motion.tr
                      key={row.feature}
                      initial={{ opacity: 0, y: 12 }}
                      animate={isVisible ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.05, ease: "easeOut" }}
                      className={`${index !== comparisons.length - 1 ? "border-b border-white/5" : ""} hover:bg-white/[0.02] transition-colors`}
                    >
                      <td className="p-3 sm:p-4 font-[family-name:var(--font-inter)] text-white/80 text-sm">
                        {row.feature}
                      </td>
                      <td className="p-3 sm:p-4 text-center">
                        {row.us === true ? (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                        ) : (
                          <span className="text-white/40">-</span>
                        )}
                      </td>
                      <td className="p-3 sm:p-4 text-center">
                        {row.others === true ? (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
                          </div>
                        ) : row.others === false ? (
                          <span className="font-[family-name:var(--font-inter)] text-white/30 text-sm">-</span>
                        ) : (
                          <span className="font-[family-name:var(--font-inter)] text-amber-400/70 text-xs">{row.others}</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
