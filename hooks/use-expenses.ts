"use client"

import { useState, useEffect, useCallback } from "react"
import type { Expense, ExpenseInsert, ExpenseUpdate } from "@/lib/expenses/types"

const DEFAULT_PAGE_SIZE = 10

export interface UseExpensesOptions {
  category?: string
  status?: string
  from?: string
  to?: string
  search?: string
  pageSize?: number
}

export function useExpenses(filters?: UseExpensesOptions) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const pageSize = filters?.pageSize ?? DEFAULT_PAGE_SIZE
  const totalPages = Math.ceil(count / pageSize) || 1
  const hasNext = page < totalPages
  const hasPrev = page > 1
  const startItem = count === 0 ? 0 : (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, count)

  const fetchExpenses = useCallback(
    async (targetPage = 1) => {
      setLoading(true)
      setError(null)
      const offset = (targetPage - 1) * pageSize
      try {
        const params = new URLSearchParams()
        if (filters?.category) params.set("category", filters.category)
        if (filters?.status) params.set("status", filters.status)
        if (filters?.from) params.set("from", filters.from)
        if (filters?.to) params.set("to", filters.to)
        if (filters?.search) params.set("search", filters.search)
        params.set("offset", String(offset))
        params.set("limit", String(pageSize))

        const res = await fetch(`/api/expenses?${params}`)
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.error ?? "Failed to fetch expenses")
        }
        const { data, count: total } = await res.json()
        setExpenses(data ?? [])
        setCount(total ?? 0)
        setPage(targetPage)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error")
        setExpenses([])
        setCount(0)
      } finally {
        setLoading(false)
      }
    },
    [
      filters?.category,
      filters?.status,
      filters?.from,
      filters?.to,
      filters?.search,
      pageSize,
    ]
  )

  useEffect(() => {
    fetchExpenses(1)
  }, [fetchExpenses])

  const goToPage = useCallback(
    (p: number) => {
      const target = Math.max(1, p)
      fetchExpenses(target)
    },
    [fetchExpenses]
  )

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

  const exportAll = useCallback(async () => {
    const params = new URLSearchParams()
    if (filters?.category) params.set("category", filters.category)
    if (filters?.status) params.set("status", filters.status)
    if (filters?.from) params.set("from", filters.from)
    if (filters?.to) params.set("to", filters.to)
    if (filters?.search) params.set("search", filters.search)
    params.set("limit", "5000")
    params.set("offset", "0")
    const res = await fetch(`/api/expenses?${params}`)
    if (!res.ok) throw new Error("Failed to fetch expenses for export")
    const { data } = await res.json()
    return data ?? []
  }, [filters?.category, filters?.status, filters?.from, filters?.to, filters?.search])

  return {
    expenses,
    count,
    loading,
    error,
    page,
    pageSize,
    totalPages,
    hasNext,
    hasPrev,
    startItem,
    endItem,
    refetch: () => fetchExpenses(page),
    goToPage,
    createExpense,
    updateExpense,
    deleteExpense,
    exportAll,
  }
}
