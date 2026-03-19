"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, TrendingDown, TrendingUp, Target, PieChart, ChevronRight } from "lucide-react"
import { useAnalytics } from "@/hooks/use-analytics"
import { formatIDR } from "@/lib/currency"

export function AIInsights() {
  const { data: analytics } = useAnalytics(6)

  const insights = React.useMemo(() => {
    const result: Array<{
      icon: typeof TrendingDown
      title: string
      description: string
      color: string
      bg: string
    }> = []

    const monthlyData = analytics?.monthlyData ?? []
    const totals = analytics?.totals
    const categoryData = analytics?.categoryData ?? []

    // 1. Spending trend: compare current vs previous month
    if (monthlyData.length >= 2) {
      const curr = monthlyData[monthlyData.length - 1]?.spending ?? 0
      const prev = monthlyData[monthlyData.length - 2]?.spending ?? 0
      const change = prev > 0 ? ((curr - prev) / prev) * 100 : 0
      result.push({
        icon: change <= 0 ? TrendingDown : TrendingUp,
        title: change <= 0 ? "Spending reduced" : "Spending increased",
        description:
          change <= 0
            ? `Your spending is down ${Math.abs(Math.round(change))}% compared to last month. Great job!`
            : `Your spending is up ${Math.round(change)}% vs last month. Consider reviewing top categories.`,
        color: change <= 0 ? "text-emerald-400" : "text-amber-400",
        bg: change <= 0 ? "bg-emerald-400/10" : "bg-amber-400/10",
      })
    }

    // 2. Net spending / totals summary
    if (totals && (totals.spending > 0 || totals.refunded > 0)) {
      result.push({
        icon: Target,
        title: "This period",
        description: `Net spending: ${formatIDR(totals.net)} (spent ${formatIDR(totals.spending)}${totals.refunded > 0 ? `, refunded ${formatIDR(totals.refunded)}` : ""})`,
        color: "text-[#9055ff]",
        bg: "bg-[#7b39fc]/10",
      })
    }

    // 3. Top category insight
    if (categoryData.length > 0) {
      const top = categoryData[0]
      result.push({
        icon: PieChart,
        title: "Top category",
        description: `Your highest spend is ${top.name} at ${formatIDR(top.value)}. Consider setting a budget for this category.`,
        color: "text-[#9055ff]",
        bg: "bg-[#7b39fc]/10",
      })
    }

    return result
  }, [analytics])

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
        {insights.length === 0 ? (
          <p className="text-sm text-white/40 py-4">Add expenses to see AI-powered insights based on your spending.</p>
        ) : (
        insights.map((insight, index) => (
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
        ))
        )}
      </div>

      <Link href="/dashboard/chat">
        <button className="w-full mt-6 py-3 rounded-xl bg-white/5 text-white/60 text-xs font-medium hover:bg-white/10 hover:text-white transition-all border border-dashed border-white/10">
          Ask AI anything...
        </button>
      </Link>
    </motion.div>
  )
}
