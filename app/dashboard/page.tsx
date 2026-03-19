"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatCard } from "@/components/dashboard-stats"
import { ExpenseCharts } from "@/components/expense-charts"
import { AIInsights } from "@/components/ai-insights"
import { motion } from "framer-motion"
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Calendar,
  ArrowUpRight,
  Plus
} from "lucide-react"
import { ModernButton } from "@/components/modern-button"

const stats = [
  {
    title: "Total Balance",
    value: "$12,450.80",
    change: "+4.5%",
    trend: "up" as const,
    icon: DollarSign
  },
  {
    title: "Monthly Expenses",
    value: "$3,240.15",
    change: "-12.3%",
    trend: "down" as const,
    icon: CreditCard
  },
  {
    title: "AI Savings",
    value: "$840.00",
    change: "+28.4%",
    trend: "up" as const,
    icon: TrendingUp
  },
  {
    title: "Upcoming Bills",
    value: "$1,120.00",
    change: "2 bills",
    trend: "up" as const,
    icon: Calendar
  }
]

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-white/40 mt-1">Checking your financial health for <span className="text-[#9055ff]">March 2024</span></p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <ModernButton variant="secondary" size="md" className="h-12 px-6">
            Generate Report
          </ModernButton>
          <ModernButton variant="primary" size="md" className="h-12 px-6">
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </ModernButton>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} {...stat} index={i} />
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="w-full">
        <ExpenseCharts />
      </div>

      {/* AI Insights Section - New Row */}
      <AIInsights />

      {/* Recent Activity Table (Simplified for now) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="p-8 rounded-[32px] bg-white/5 border border-white/10"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
            <p className="text-white/40 text-sm">Latest updates across all categories</p>
          </div>
          <ModernButton variant="ghost" size="sm" className="text-[#9055ff] hover:text-[#c084fc] hover:bg-[#7b39fc]/10">
            View All Transactions
          </ModernButton>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-white/30 text-xs uppercase tracking-wider border-b border-white/5">
                <th className="pb-4 font-semibold">Transaction</th>
                <th className="pb-4 font-semibold">Category</th>
                <th className="pb-4 font-semibold">Date</th>
                <th className="pb-4 font-semibold text-right">Amount</th>
                <th className="pb-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { name: "Apple One Subscription", cat: "Entertainment", date: "Mar 12, 2024", amt: "-$19.95", status: "Auto" },
                { name: "Grocery Mart Inc", cat: "Food & Drinks", date: "Mar 11, 2024", amt: "-$142.30", status: "Verified" },
                { name: "Stripe Payout", cat: "Income", date: "Mar 10, 2024", amt: "+$2,450.00", status: "Success" },
                { name: "Uber Technologies", cat: "Transport", date: "Mar 09, 2024", amt: "-$32.40", status: "Verified" },
              ].map((row, i) => (
                <tr key={i} className="group border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="py-5 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs">
                        {row.name[0]}
                      </div>
                      <span className="text-white font-medium group-hover:text-[#9055ff] transition-colors">{row.name}</span>
                    </div>
                  </td>
                  <td className="py-5 pr-4 text-white/50">{row.cat}</td>
                  <td className="py-5 pr-4 text-white/50">{row.date}</td>
                  <td className={`py-5 pr-4 text-right font-bold ${row.amt.startsWith("+") ? "text-emerald-400" : "text-white"}`}>
                    {row.amt}
                  </td>
                  <td className="py-5 text-right">
                    <ModernButton variant="ghost" size="sm" className="h-8 w-8 p-0 min-w-0 rounded-full hover:bg-white/10">
                      <ArrowUpRight className="w-4 h-4 text-white/30" />
                    </ModernButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
