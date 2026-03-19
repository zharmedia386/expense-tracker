"use client"

import { useState, useEffect } from "react"

export interface AnalyticsData {
  monthlyData: { name: string; spending: number }[]
  categoryData: { name: string; value: number; color: string }[]
  weeklySpending: { day: string; amount: number }[]
  spendingPeak: { amount: number; day: string }
  totals: { spending: number; refunded: number; net: number }
}

export function useAnalytics(months = 6) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch(`/api/expenses/analytics?months=${months}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch analytics")
        return res.json()
      })
      .then((json) => {
        if (!cancelled) setData(json)
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Unknown error")
          setData(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [months])

  return { data, loading, error }
}
