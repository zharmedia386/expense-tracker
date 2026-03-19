export type ExpenseCategory =
  | "Food & Dining"
  | "Transportation"
  | "Shopping"
  | "Housing"
  | "Entertainment"
  | "Travel"
  | "Business"
  | "Healthcare"
  | "Utilities"

export type ExpenseStatus = "Completed" | "Pending" | "Refunded"

export interface Expense {
  id: string
  user_id: string
  description: string
  category: ExpenseCategory
  amount: number
  expense_date: string
  merchant: string
  status: ExpenseStatus
  payment_method: string
  created_at?: string
  updated_at?: string
}

export interface ExpenseInsert {
  description: string
  category: ExpenseCategory
  amount: number
  expense_date: string
  merchant: string
  status?: ExpenseStatus
  payment_method?: string
}

export interface ExpenseUpdate {
  description?: string
  category?: ExpenseCategory
  amount?: number
  expense_date?: string
  merchant?: string
  status?: ExpenseStatus
  payment_method?: string
}
