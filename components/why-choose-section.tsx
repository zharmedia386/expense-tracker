"use client"

import { CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const benefits = [
  "No manual data entry required",
  "Real-time fraud detection alerts",
  "Automatic tax deduction identification",
  "Shared accounts for families & teams",
  "Export to CSV, PDF, or QuickBooks",
  "100% private and encrypted data"
]

export function WhyChooseSection() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-[120px] bg-[#0c0a14] relative overflow-hidden" id="about">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#7b39fc]/5 blur-[120px] rounded-full" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
            Why people are <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9055ff] to-[#7b39fc]">
              switching to ExpenseAI
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Standard expense trackers are reactive. They tell you what you spent. ExpenseAI is proactive. It tells you how to save, monitors your subscriptions, and predicts your future balance.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 10 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="flex items-center gap-3 text-white/80"
              >
                <CheckCircle2 className="w-5 h-5 text-[#7b39fc] shrink-0" />
                <span className="text-sm font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>

          <Button size="lg" className="bg-[#7b39fc] hover:bg-[#6a2ee0] text-white px-8 h-14 rounded-2xl text-lg font-medium shadow-[0_0_20px_rgba(123,57,252,0.3)] transition-all group">
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, x: 30 }}
          animate={isVisible ? { opacity: 1, scale: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Decorative frame for image/graphic */}
          <div className="relative p-2 rounded-[40px] bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 shadow-2xl">
            <div className="bg-[#1a1625] rounded-[32px] overflow-hidden aspect-square flex items-center justify-center relative group">
              {/* This represents a premium dashboard feature view */}
              <div className="absolute inset-x-8 top-12 bottom-12 bg-white/[0.03] rounded-3xl border border-white/5 p-6 backdrop-blur-sm overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                  <div className="w-24 h-4 bg-[#7b39fc]/30 rounded-full" />
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10" />
                </div>
                <div className="space-y-4">
                  <div className="h-[40%] bg-gradient-to-t from-[#7b39fc]/20 to-transparent rounded-2xl border-t border-white/10" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-white/5 rounded-xl border border-white/5" />
                    <div className="h-20 bg-white/5 rounded-xl border border-white/5" />
                  </div>
                </div>
                {/* Floating "Insight" card */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={isVisible ? { y: 0, opacity: 1 } : {}}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="absolute bottom-8 left-8 right-8 p-4 rounded-2xl bg-[#2a2438] border border-[#7b39fc]/40 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#7b39fc] flex items-center justify-center font-bold text-white text-xs">AI</div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider">Insight Found</p>
                      <p className="text-xs text-white font-medium">Cancel 'MusicPro' to save $12/mo</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
          {/* Subtle floating circles */}
          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-tr from-[#7b39fc] to-[#9055ff] blur-2xl opacity-20" 
          />
        </motion.div>
      </div>
    </section>
  )
}
