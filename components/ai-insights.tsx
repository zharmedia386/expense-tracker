"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Sparkles, TrendingDown, Target, AlertCircle, ChevronRight } from "lucide-react"

const insights = [
  {
    icon: TrendingDown,
    title: "Spending reduces",
    description: "Your weekend spending is down 12% compared to last month. Great job!",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10"
  },
  {
    icon: Target,
    title: "Budget Goal",
    description: "You're on track to save $450 this month if you maintain your current pace.",
    color: "text-[#9055ff]",
    bg: "bg-[#7b39fc]/10"
  },
  {
    icon: AlertCircle,
    title: "Unusual activity",
    description: "We detected a $29.99 recurring charge for 'PixelStream'. Is this expected?",
    color: "text-amber-400",
    bg: "bg-amber-400/10"
  }
]

export function AIInsights() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="p-8 rounded-[32px] bg-white/5 border border-white/10"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7b39fc] to-[#9055ff] flex items-center justify-center shadow-[0_0_15px_rgba(123,57,252,0.4)]">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">AI Insights</h3>
          <p className="text-white/40 text-sm">Personalized financial advice</p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
            className="group p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] hover:border-[#7b39fc]/20 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg ${insight.bg} flex items-center justify-center shrink-0`}>
                <insight.icon className={`w-5 h-5 ${insight.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-white">{insight.title}</h4>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-white/40 leading-relaxed">{insight.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-6 py-3 rounded-xl bg-white/5 text-white/60 text-xs font-medium hover:bg-white/10 hover:text-white transition-all border border-dashed border-white/10">
        Ask AI anything...
      </button>
    </motion.div>
  )
}
