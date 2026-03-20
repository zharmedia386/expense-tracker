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
  Pencil,
  Trash2,
  ChevronRight,
  ArrowUpRight,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { ModernButton } from "@/components/modern-button"
import { Input } from "@/components/ui/input"
import { useExpenses } from "@/hooks/use-expenses"
import { AddExpenseDialog } from "@/components/add-expense-dialog"
import { formatIDR } from "@/lib/currency"
import { exportExpensesToCSV } from "@/lib/export-expenses"
import { getCategoryStyle } from "@/lib/expense-category-styles"
import { toast } from "sonner"
import type { Expense, ExpenseCategory } from "@/lib/expenses/types"
import { ModernSelect } from "@/components/modern-select"
import { ModernDatepicker } from "@/components/modern-datepicker"

const CATEGORIES: ExpenseCategory[] = [
  "Food & Dining", "Transportation", "Shopping", "Housing",
  "Entertainment", "Travel", "Business", "Healthcare", "Utilities",
]

const CATEGORY_OPTIONS = [
  { label: "All Categories", value: "all" },
  ...CATEGORIES.map(c => ({ label: c, value: c }))
]

const PAGE_SIZE_OPTIONS = [
  { label: "10 per page", value: "10" },
  { label: "25 per page", value: "25" },
  { label: "50 per page", value: "50" },
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
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all")
  const [dateFrom, setDateFrom] = React.useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = React.useState<Date | undefined>(undefined)
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
    category: (categoryFilter === "all" || !categoryFilter) ? undefined : (categoryFilter as ExpenseCategory),
    from: dateFrom?.toISOString().split('T')[0],
    to: dateTo?.toISOString().split('T')[0],
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
        className="flex flex-col xl:flex-row items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-sm"
      >
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#7b39fc] transition-colors" />
          <Input 
            placeholder="Search transactions..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-11 bg-white/5 border-white/10 focus-visible:ring-[#7b39fc] text-sm h-11 rounded-xl"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ModernDatepicker
              date={dateFrom}
              onDateChange={setDateFrom}
              placeholder="From"
              className="flex-1 sm:w-40"
            />
            <span className="text-white/20 font-light">–</span>
            <ModernDatepicker
              date={dateTo}
              onDateChange={setDateTo}
              placeholder="To"
              className="flex-1 sm:w-40"
            />
          </div>
          <ModernSelect
            value={categoryFilter}
            onValueChange={setCategoryFilter}
            options={CATEGORY_OPTIONS}
            placeholder="All Categories"
            triggerClassName="w-full sm:w-48"
          />
        </div>
      </motion.div>

      {/* Expenses Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden backdrop-blur-sm"
      >
        {error && (
          <div className="px-8 py-4 text-amber-400 text-sm">{error}</div>
        )}
        {loading ? (
          <div className="px-8 py-16 text-center text-white/40">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-[#7b39fc] border-t-transparent rounded-full animate-spin" />
              Loading expenses...
            </div>
          </div>
        ) : expenses.length === 0 ? (
          <div className="px-8 py-16 text-center text-white/20 italic">No transactions found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/5">
                    <th className="px-8 py-6">Transaction</th>
                    <th className="px-6 py-6">Category</th>
                    <th className="px-6 py-6 text-center">Date</th>
                    <th className="px-6 py-6 text-center">Status</th>
                    <th className="px-6 py-6 text-right">Amount</th>
                    <th className="px-8 py-6 text-right">Action</th>
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
                            {(() => {
                              const { icon: CategoryIcon, colorClass } = getCategoryStyle(expense.category)
                              return (
                                <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-lg`}>
                                    <CategoryIcon className="w-5 h-5" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-white font-medium group-hover:text-[#9055ff] transition-colors truncate">{expense.merchant}</p>
                                    <p className="text-xs text-white/40 truncate">{expense.description}</p>
                                  </div>
                                </div>
                              )
                            })()}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            {(() => {
                              const { icon: CategoryIcon, colorClass } = getCategoryStyle(expense.category)
                              return (
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${colorClass} bg-opacity-10 border border-current border-opacity-20`}>
                                  <CategoryIcon className="w-3 h-3" />
                                  {expense.category}
                                </span>
                              )
                            })()}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-center text-white/40 text-sm font-medium">
                            {dateStr}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-center">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] ${
                              expense.status === "Completed"
                                ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                                : expense.status === "Pending"
                                ? "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                                : "bg-[#7b39fc]/10 text-[#9055ff] border border-[#7b39fc]/20"
                            }`}>
                              {statusLabel[expense.status] ?? expense.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-right font-bold text-sm text-white tabular-nums">
                            {formatIDR(-amt)}
                          </td>
                          <td className="px-8 py-5 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2 text-white/40">
                              <Link 
                                href={`/dashboard/expenses?edit=${expense.id}`}
                                className="p-2.5 rounded-xl hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                                title="Edit"
                              >
                                <Pencil className="w-4.5 h-4.5" />
                              </Link>
                              <button 
                                onClick={async () => {
                                  if (confirm("Delete this expense?")) {
                                    await deleteExpense(expense.id)
                                    refetch()
                                    toast.success("Expense removed")
                                  }
                                }}
                                className="p-2.5 rounded-xl hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
            
            <div className="px-8 py-6 border-t border-white/5 flex items-center justify-between flex-wrap gap-6 bg-white/[0.01]">
              <div className="flex items-center gap-6">
                <p className="text-xs text-white/20 uppercase tracking-widest font-bold">
                  Showing <span className="text-white/60">{startItem}-{endItem}</span> of <span className="text-white/60">{count}</span>
                </p>
                <div className="w-40">
                  <ModernSelect
                    value={String(pageSize)}
                    onValueChange={(v) => setPageSize(Number(v))}
                    options={PAGE_SIZE_OPTIONS}
                    triggerClassName="h-9 px-3 rounded-lg text-xs"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ModernButton
                  variant="ghost"
                  size="sm"
                  disabled={!hasPrev}
                  onClick={() => goToPage(page - 1)}
                  className="h-9 text-xs"
                >
                  Previous
                </ModernButton>
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        page === i + 1 
                          ? "bg-[#7b39fc] text-white shadow-lg shadow-[#7b39fc]/20" 
                          : "text-white/40 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <ModernButton
                  variant="ghost"
                  size="sm"
                  disabled={!hasNext}
                  onClick={() => goToPage(page + 1)}
                  className="h-9 text-xs"
                >
                  Next
                </ModernButton>
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
