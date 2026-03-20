import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get("days") ?? "180", 10)

  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - days)
  const from = fromDate.toISOString().slice(0, 10)

  const { data: expenses, error } = await supabase
    .from("expenses")
    .select("amount, category, expense_date, status")
    .eq("user_id", user.id)
    .gte("expense_date", from)
    .order("expense_date", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const completed = (expenses ?? []).filter((e) => e.status === "Completed")
  const refunded = (expenses ?? []).filter((e) => e.status === "Refunded")

  const byMonth = new Map<string, { spending: number }>()
  const byCategory = new Map<string, number>()
  const byDayOfWeek = new Map<string, number>()

  for (const e of completed) {
    const amt = Number(e.amount)
    const month = e.expense_date.slice(0, 7)
    const existing = byMonth.get(month) ?? { spending: 0 }
    existing.spending += amt
    byMonth.set(month, existing)

    const cat = e.category ?? "Other"
    byCategory.set(cat, (byCategory.get(cat) ?? 0) + amt)

    const d = new Date(e.expense_date)
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()]
    byDayOfWeek.set(day, (byDayOfWeek.get(day) ?? 0) + amt)
  }

  for (const e of refunded) {
    const amt = Number(e.amount)
    const cat = e.category ?? "Other"
    byCategory.set(cat, (byCategory.get(cat) ?? 0) - amt)
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const monthlyData = Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, { spending }]) => {
      const [y, m] = month.split("-")
      return { name: monthNames[parseInt(m, 10) - 1], spending }
    })

  const categoryColors: Record<string, string> = {
    "Food & Dining": "#7b39fc",
    "Transportation": "#9055ff",
    "Shopping": "#c084fc",
    "Housing": "#e879f9",
    "Entertainment": "#312e81",
    "Travel": "#1e1b4b",
    "Business": "#4c1d95",
    "Healthcare": "#5b21b6",
    "Utilities": "#6d28d9",
    Other: "#a78bfa",
  }

  const categoryData = Array.from(byCategory.entries())
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value]) => ({
      name,
      value: Math.round(value),
      color: categoryColors[name] ?? "#7b39fc",
    }))

  const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const weeklySpending = dayOrder.map((day) => ({
    day,
    amount: Math.round(byDayOfWeek.get(day) ?? 0),
  }))

  const maxDay = weeklySpending.reduce(
    (acc, cur) => (cur.amount > acc.amount ? cur : acc),
    { day: "Mon", amount: 0 }
  )

  const totalSpending = completed.reduce((s, e) => s + Number(e.amount), 0)
  const totalRefunded = refunded.reduce((s, e) => s + Number(e.amount), 0)
  const netSpending = totalSpending - totalRefunded

  return NextResponse.json({
    monthlyData,
    categoryData,
    weeklySpending,
    spendingPeak: { amount: maxDay.amount, day: maxDay.day },
    totals: { spending: totalSpending, refunded: totalRefunded, net: netSpending },
  })
}
