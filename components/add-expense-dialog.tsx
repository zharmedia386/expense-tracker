"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModernButton } from "@/components/modern-button"
import { ModernSelect } from "@/components/modern-select"
import { ModernDatepicker } from "@/components/modern-datepicker"
import type { Expense, ExpenseInsert, ExpenseCategory, ExpenseStatus } from "@/lib/expenses/types"

const CATEGORIES: ExpenseCategory[] = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Housing",
  "Entertainment",
  "Travel",
  "Business",
  "Healthcare",
  "Utilities",
]

const CATEGORY_OPTIONS = CATEGORIES.map(c => ({ label: c, value: c }))
const STATUS_OPTIONS = [
  { label: "Verified", value: "Completed" },
  { label: "Pending", value: "Pending" },
  { label: "Refunded", value: "Refunded" },
]

interface AddExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ExpenseInsert) => Promise<unknown>
  onUpdate?: (id: string, data: ExpenseInsert) => Promise<unknown>
  expense?: Expense | null
}

export function AddExpenseDialog({
  open,
  onOpenChange,
  onSubmit,
  onUpdate,
  expense,
}: AddExpenseDialogProps) {
  const [description, setDescription] = React.useState("")
  const [category, setCategory] = React.useState<ExpenseCategory>("Food & Dining")
  const [amount, setAmount] = React.useState("")
  const [expenseDate, setExpenseDate] = React.useState<Date | undefined>(new Date())
  const [merchant, setMerchant] = React.useState("")
  const [status, setStatus] = React.useState<ExpenseStatus>("Completed")
  const [paymentMethod, setPaymentMethod] = React.useState("Personal Card")
  const [saving, setSaving] = React.useState(false)

  const isEdit = !!expense && !!onUpdate
  React.useEffect(() => {
    if (expense) {
      setDescription(expense.description)
      setCategory(expense.category)
      setAmount(String(expense.amount))
      setExpenseDate(new Date(expense.expense_date))
      setMerchant(expense.merchant)
      setStatus(expense.status)
      setPaymentMethod(expense.payment_method ?? "Personal Card")
    } else {
      setDescription("")
      setCategory("Food & Dining")
      setAmount("")
      setExpenseDate(new Date())
      setMerchant("")
      setStatus("Completed")
      setPaymentMethod("Personal Card")
    }
  }, [expense, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseFloat(amount)
    if (!description.trim() || isNaN(amt) || amt <= 0 || !merchant.trim() || !expenseDate) {
      return
    }
    setSaving(true)
    const data = {
      description: description.trim(),
      category,
      amount: amt,
      expense_date: expenseDate.toISOString().split('T')[0],
      merchant: merchant.trim(),
      status,
      payment_method: paymentMethod,
    }
    try {
      if (isEdit && expense) {
        await onUpdate(expense.id, data)
      } else {
        await onSubmit(data)
      }
      onOpenChange(false)
    } catch {
      // Error handling in parent
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0c0a14] border-white/10 text-white sm:max-w-md rounded-[32px] shadow-2xl backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight text-white">{isEdit ? "Edit Transaction" : "New Transaction"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          <div className="space-y-1.5">
            <Label className="text-white/40 text-[10px] uppercase tracking-widest font-bold ml-1">Merchant</Label>
            <Input
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="e.g. Starbucks"
              className="bg-white/5 border-white/10 text-sm h-11 rounded-xl focus-visible:ring-[#7b39fc]"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-white/40 text-[10px] uppercase tracking-widest font-bold ml-1">Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Morning Coffee"
              className="bg-white/5 border-white/10 text-sm h-11 rounded-xl focus-visible:ring-[#7b39fc]"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-white/40 text-[10px] uppercase tracking-widest font-bold ml-1">Amount (IDR)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="bg-white/5 border-white/10 text-sm h-11 rounded-xl focus-visible:ring-[#7b39fc] tabular-nums"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/40 text-[10px] uppercase tracking-widest font-bold ml-1 text-white">Date</Label>
              <ModernDatepicker
                date={expenseDate}
                onDateChange={(d) => setExpenseDate(d)}
                className="h-11"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-white/40 text-[10px] uppercase tracking-widest font-bold ml-1 text-white">Category</Label>
            <ModernSelect
              value={category}
              onValueChange={(v) => setCategory(v as ExpenseCategory)}
              options={CATEGORY_OPTIONS}
              placeholder="Select category"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-white/40 text-[10px] uppercase tracking-widest font-bold ml-1 text-white">Status</Label>
              <ModernSelect
                value={status}
                onValueChange={(v) => setStatus(v as ExpenseStatus)}
                options={STATUS_OPTIONS}
                placeholder="Select status"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/40 text-[10px] uppercase tracking-widest font-bold ml-1 text-white">Payment</Label>
              <Input
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                placeholder="Personal Card"
                className="bg-white/5 border-white/10 text-sm h-11 rounded-xl focus-visible:ring-[#7b39fc]"
              />
            </div>
          </div>
          <DialogFooter className="pt-6 gap-3 sm:gap-2">
            <ModernButton
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="px-8 cursor-pointer"
            >
              Cancel
            </ModernButton>
            <ModernButton type="submit" variant="primary" disabled={saving} className="px-8 min-w-[140px] cursor-pointer">
              {saving ? "Processing..." : isEdit ? "Update" : "Create"}
            </ModernButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
