"use client"

import { useState, useEffect, useCallback } from "react"
import type { Expense, ExpenseInsert, ExpenseUpdate } from "@/lib/expenses/types"

export function useExpenses(filters?: { category?: string; status?: string; from?: string; to?: string }) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExpenses = useCallback(async (offset = 0, limit = 100) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filters?.category) params.set("category", filters.category)
      if (filters?.status) params.set("status", filters.status)
      if (filters?.from) params.set("from", filters.from)
      if (filters?.to) params.set("to", filters.to)
      params.set("offset", String(offset))
      params.set("limit", String(limit))

      const res = await fetch(`/api/expenses?${params}`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? "Failed to fetch expenses")
      }
      const { data, count: total } = await res.json()
      setExpenses(data ?? [])
      setCount(total ?? 0)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error")
      setExpenses([])
      setCount(0)
    } finally {
      setLoading(false)
    }
  }, [filters?.category, filters?.status, filters?.from, filters?.to])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  const createExpense = useCallback(async (data: ExpenseInsert): Promise<Expense | null> => {
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error ?? "Failed to create expense")
    }
    const created = await res.json()
    setExpenses((prev) => [created, ...prev])
    setCount((c) => c + 1)
    return created
  }, [])

  const updateExpense = useCallback(async (id: string, data: ExpenseUpdate): Promise<Expense | null> => {
    const res = await fetch(`/api/expenses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error ?? "Failed to update expense")
    }
    const updated = await res.json()
    setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)))
    return updated
  }, [])

  const deleteExpense = useCallback(async (id: string): Promise<void> => {
    const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error ?? "Failed to delete expense")
    }
    setExpenses((prev) => prev.filter((e) => e.id !== id))
    setCount((c) => Math.max(0, c - 1))
  }, [])

  return {
    expenses,
    count,
    loading,
    error,
    refetch: () => fetchExpenses(),
    createExpense,
    updateExpense,
    deleteExpense,
  }
}
