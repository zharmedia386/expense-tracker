"use client"

import * as React from "react"
import Link from "next/link"
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
import { useExpenses } from "@/hooks/use-expenses"
import { useAnalytics } from "@/hooks/use-analytics"
import { AddExpenseDialog } from "@/components/add-expense-dialog"

export default function DashboardPage() {
  const [addOpen, setAddOpen] = React.useState(false)
  const { expenses, loading: expensesLoading, createExpense, refetch } = useExpenses()
  const { data: analytics } = useAnalytics(6)

  const recentExpenses = expenses.slice(0, 5)
  const monthlyTotal = analytics?.totals?.net ?? 0
  const pendingCount = expenses.filter((e) => e.status === "Pending").length

  const monthName = new Date().toLocaleString("default", { month: "long" })
  const year = new Date().getFullYear()

  const stats = [
    {
      title: "Net Spending",
      value: `$${monthlyTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      change: `${expenses.length} transactions`,
      trend: "down" as const,
      icon: DollarSign,
    },
    {
      title: "Monthly Expenses",
      value: `$${(analytics?.totals?.spending ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      change: analytics?.categoryData?.length ? `${analytics.categoryData.length} categories` : "—",
      trend: "down" as const,
      icon: CreditCard,
    },
    {
      title: "Refunded",
      value: `$${(analytics?.totals?.refunded ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      change: "—",
      trend: "up" as const,
      icon: TrendingUp,
    },
    {
      title: "Pending",
      value: `${pendingCount} bills`,
      change: "awaiting",
      trend: pendingCount > 0 ? ("up" as const) : ("down" as const),
      icon: Calendar,
    },
  ]

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
          <p className="text-white/40 mt-1">Checking your financial health for <span className="text-[#9055ff]">{monthName} {year}</span></p>
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
          <ModernButton variant="primary" size="md" className="h-12 px-6" onClick={() => setAddOpen(true)}>
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
          <Link href="/dashboard/expenses">
            <ModernButton variant="ghost" size="sm" className="text-[#9055ff] hover:text-[#c084fc] hover:bg-[#7b39fc]/10">
              View All Transactions
            </ModernButton>
          </Link>
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
              {expensesLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-white/40">
                    Loading recent transactions...
                  </td>
                </tr>
              ) : recentExpenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-white/40">
                    No transactions yet. Add your first expense!
                  </td>
                </tr>
              ) : (
                recentExpenses.map((row) => {
                  const amt = Number(row.amount)
                  const dateStr = new Date(row.expense_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                  return (
                    <tr key={row.id} className="group border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="py-5 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs">
                            {row.merchant[0]}
                          </div>
                          <span className="text-white font-medium group-hover:text-[#9055ff] transition-colors">{row.merchant}</span>
                        </div>
                      </td>
                      <td className="py-5 pr-4 text-white/50">{row.category}</td>
                      <td className="py-5 pr-4 text-white/50">{dateStr}</td>
                      <td className="py-5 pr-4 text-right font-bold text-white">
                        - ${Math.abs(amt).toLocaleString()}
                      </td>
                      <td className="py-5 text-right">
                        <Link href={`/dashboard/expenses?edit=${row.id}`}>
                          <ModernButton variant="ghost" size="sm" className="h-8 w-8 p-0 min-w-0 rounded-full hover:bg-white/10">
                            <ArrowUpRight className="w-4 h-4 text-white/30" />
                          </ModernButton>
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <AddExpenseDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={async (data) => {
          await createExpense(data)
          refetch()
        }}
      />
    </DashboardLayout>
  )
}
