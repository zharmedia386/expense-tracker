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
import type { ExpenseInsert, ExpenseCategory, ExpenseStatus } from "@/lib/expenses/types"

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

const STATUSES: ExpenseStatus[] = ["Completed", "Pending", "Refunded"]

interface AddExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ExpenseInsert) => Promise<unknown>
}

export function AddExpenseDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddExpenseDialogProps) {
  const [description, setDescription] = React.useState("")
  const [category, setCategory] = React.useState<ExpenseCategory>("Food & Dining")
  const [amount, setAmount] = React.useState("")
  const [expenseDate, setExpenseDate] = React.useState(
    new Date().toISOString().slice(0, 10)
  )
  const [merchant, setMerchant] = React.useState("")
  const [status, setStatus] = React.useState<ExpenseStatus>("Completed")
  const [paymentMethod, setPaymentMethod] = React.useState("Personal Card")
  const [saving, setSaving] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseFloat(amount)
    if (!description.trim() || isNaN(amt) || amt <= 0 || !merchant.trim()) {
      return
    }
    setSaving(true)
    try {
      await onSubmit({
        description: description.trim(),
        category,
        amount: amt,
        expense_date: expenseDate,
        merchant: merchant.trim(),
        status,
        payment_method: paymentMethod,
      })
      onOpenChange(false)
      setDescription("")
      setAmount("")
      setMerchant("")
      setExpenseDate(new Date().toISOString().slice(0, 10))
    } catch {
      // Error handling in parent
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0c0a14] border-white/10 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Add Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-white/60 text-sm">Merchant</Label>
            <Input
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="e.g. Starbucks"
              className="bg-white/5 border-white/10 mt-1 text-white"
              required
            />
          </div>
          <div>
            <Label className="text-white/60 text-sm">Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Coffee"
              className="bg-white/5 border-white/10 mt-1 text-white"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white/60 text-sm">Amount</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-white/5 border-white/10 mt-1 text-white"
                required
              />
            </div>
            <div>
              <Label className="text-white/60 text-sm">Date</Label>
              <Input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="bg-white/5 border-white/10 mt-1 text-white"
                required
              />
            </div>
          </div>
          <div>
            <Label className="text-white/60 text-sm">Category</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full mt-1 h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white/60 text-sm">Status</Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ExpenseStatus)}
                className="w-full mt-1 h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-white/60 text-sm">Payment</Label>
              <Input
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                placeholder="Personal Card"
                className="bg-white/5 border-white/10 mt-1 text-white"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <ModernButton
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </ModernButton>
            <ModernButton type="submit" variant="primary" disabled={saving}>
              {saving ? "Saving..." : "Add Expense"}
            </ModernButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
