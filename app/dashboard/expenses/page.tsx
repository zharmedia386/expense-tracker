"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { motion } from "framer-motion"
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreHorizontal, 
  ArrowUpRight,
  Calendar,
  Tag
} from "lucide-react"
import Link from "next/link"
import { ModernButton } from "@/components/modern-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useExpenses } from "@/hooks/use-expenses"
import { AddExpenseDialog } from "@/components/add-expense-dialog"
import { formatIDR } from "@/lib/currency"
import { exportExpensesToCSV } from "@/lib/export-expenses"
import { toast } from "sonner"
import type { Expense, ExpenseCategory } from "@/lib/expenses/types"

const CATEGORIES: ExpenseCategory[] = [
  "Food & Dining", "Transportation", "Shopping", "Housing",
  "Entertainment", "Travel", "Business", "Healthcare", "Utilities",
]

const statusLabel: Record<string, string> = {
  Completed: "Verified",
  Pending: "Pending",
  Refunded: "Refunded",
}

export default function ExpensesPage() {
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")
  const [searchInput, setSearchInput] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [addOpen, setAddOpen] = React.useState(false)
  const [pageSize, setPageSize] = React.useState(10)
  const [categoryFilter, setCategoryFilter] = React.useState<string>("")
  const [dateFrom, setDateFrom] = React.useState("")
  const [dateTo, setDateTo] = React.useState("")
  const [exportLoading, setExportLoading] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [fetchedEditExpense, setFetchedEditExpense] = React.useState<Expense | null>(null)

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput), 300)
    return () => clearTimeout(t)
  }, [searchInput])

  const {
    expenses,
    count,
    loading,
    error,
    page,
    totalPages,
    hasNext,
    hasPrev,
    startItem,
    endItem,
    createExpense,
    updateExpense,
    deleteExpense,
    refetch,
    goToPage,
    exportAll,
  } = useExpenses({
    pageSize,
    search: debouncedSearch || undefined,
    category: categoryFilter || undefined,
    from: dateFrom || undefined,
    to: dateTo || undefined,
  })

  const editExpense = expenses.find((e) => e.id === editId) ?? fetchedEditExpense

  React.useEffect(() => {
    if (!editId) {
      setFetchedEditExpense(null)
      return
    }
    const inList = expenses.some((e) => e.id === editId)
    if (inList) {
      setFetchedEditExpense(null)
      return
    }
    let cancelled = false
    fetch(`/api/expenses/${editId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!cancelled && data) setFetchedEditExpense(data)
      })
    return () => { cancelled = true }
  }, [editId, expenses])

  React.useEffect(() => {
    if (editId && editExpense) setEditOpen(true)
  }, [editId, editExpense])

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white tracking-tight">Expenses</h1>
          <p className="text-white/40 mt-1">Manage and track your detailed transaction history</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <ModernButton
            variant="secondary"
            size="md"
            className="h-11 px-4"
            disabled={exportLoading}
            onClick={async () => {
              setExportLoading(true)
              try {
                const data = await exportAll()
                if (data.length === 0) {
                  toast.info("No expenses to export")
                  return
                }
                exportExpensesToCSV(data)
                toast.success(`Exported ${data.length} expenses`)
              } catch {
                toast.error("Failed to export")
              } finally {
                setExportLoading(false)
              }
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            {exportLoading ? "Exporting..." : "Export"}
          </ModernButton>
          <ModernButton variant="primary" size="md" className="h-11 px-6" onClick={() => setAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </ModernButton>
        </motion.div>
      </div>

      {/* Filters Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl"
      >
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#7b39fc] transition-colors" />
          <Input 
            placeholder="Search transactions..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 focus-visible:ring-[#7b39fc] text-sm h-11"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-32 h-11 bg-white/5 border-white/10 text-sm text-white"
            />
            <span className="text-white/30">–</span>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-32 h-11 bg-white/5 border-white/10 text-sm text-white"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Expenses Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden"
      >
        {error && (
          <div className="px-8 py-4 text-amber-400 text-sm">{error}</div>
        )}
        {loading ? (
          <div className="px-8 py-16 text-center text-white/40">Loading expenses...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-white/30 text-xs uppercase tracking-wider border-b border-white/5">
                    <th className="px-8 py-5 font-semibold">Transaction</th>
                    <th className="px-6 py-5 font-semibold text-center">Category</th>
                    <th className="px-6 py-5 font-semibold text-center">Date</th>
                    <th className="px-6 py-5 font-semibold text-center">Status</th>
                    <th className="px-6 py-5 font-semibold text-right">Amount</th>
                    <th className="px-8 py-5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {expenses.map((expense) => {
                      const amt = Number(expense.amount)
                      const dateStr = new Date(expense.expense_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                      return (
                        <tr key={expense.id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="px-8 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-white/5 to-white/[0.08] border border-white/10 flex items-center justify-center font-bold text-xs text-white/80 shrink-0">
                                {expense.merchant[0]}
                              </div>
                              <div>
                                <p className="text-white font-medium group-hover:text-[#9055ff] transition-colors">{expense.merchant}</p>
                                <p className="text-xs text-white/30">{expense.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-center">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-white/60">
                              <Tag className="w-3 h-3" />
                              {expense.category}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-center text-white/40 text-sm">
                            {dateStr}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              expense.status === "Completed"
                                ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                                : expense.status === "Pending"
                                ? "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                                : "bg-[#7b39fc]/10 text-[#9055ff] border border-[#7b39fc]/20"
                            }`}>
                              {statusLabel[expense.status] ?? expense.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-right font-bold text-sm text-white">
                            {formatIDR(-amt)}
                          </td>
                          <td className="px-8 py-5 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="p-2 text-white/30 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-[#0c0a14] border-white/10 text-white">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/expenses?edit=${expense.id}`} className="cursor-pointer">
                                      Edit
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    variant="destructive"
                                    className="cursor-pointer"
                                    onClick={async () => {
                                      if (confirm("Delete this expense?")) {
                                        await deleteExpense(expense.id)
                                        refetch()
                                        toast.success("Expense deleted")
                                      }
                                    }}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              <Link href={`/dashboard/expenses?edit=${expense.id}`} className="p-2 text-white/30 hover:text-[#9055ff] hover:bg-[#7b39fc]/10 rounded-lg transition-all inline-flex">
                                <ArrowUpRight className="w-4 h-4" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
            
            <div className="px-8 py-6 border-t border-white/5 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <p className="text-xs text-white/20">
                  Showing <span className="text-white/40">{startItem}-{endItem}</span> of <span className="text-white/40">{count}</span> transactions
                </p>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white"
                >
                  {[10, 25, 50].map((n) => (
                    <option key={n} value={n}>{n} per page</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={!hasPrev}
                  onClick={() => goToPage(page - 1)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs disabled:opacity-40 disabled:cursor-not-allowed text-white hover:bg-white/10 transition-all"
                >
                  Previous
                </button>
                <span className="text-xs text-white/40 px-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={!hasNext}
                  onClick={() => goToPage(page + 1)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs disabled:opacity-40 disabled:cursor-not-allowed text-white hover:bg-white/10 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>

      <AddExpenseDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={async (data) => {
          await createExpense(data)
          refetch()
        }}
      />
      <AddExpenseDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) window.history.replaceState({}, "", "/dashboard/expenses")
        }}
        onSubmit={async () => {}}
        onUpdate={async (id, data) => {
          await updateExpense(id, data)
          refetch()
          setEditOpen(false)
          window.history.replaceState({}, "", "/dashboard/expenses")
        }}
        expense={editExpense}
      />
    </DashboardLayout>
  )
}
