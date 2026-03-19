import type { Expense } from "@/lib/expenses/types"

export function exportExpensesToCSV(expenses: Expense[]): void {
  const headers = ["Merchant", "Description", "Category", "Date", "Amount (IDR)", "Status", "Payment Method"]
  const rows = expenses.map((e) => [
    e.merchant,
    e.description,
    e.category,
    e.expense_date,
    String(e.amount),
    e.status,
    e.payment_method,
  ])
  const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n")
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `expenses-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
