import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { ExpenseInsert } from "@/lib/expenses/types"

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const status = searchParams.get("status")
  const from = searchParams.get("from")
  const to = searchParams.get("to")
  const search = searchParams.get("search")?.trim()
  const limit = parseInt(searchParams.get("limit") ?? "100", 10)
  const offset = parseInt(searchParams.get("offset") ?? "0", 10)

  let query = supabase
    .from("expenses")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("expense_date", { ascending: false })
    .range(offset, offset + limit - 1)

  if (category) query = query.eq("category", category)
  if (status) query = query.eq("status", status)
  if (from) query = query.gte("expense_date", from)
  if (to) query = query.lte("expense_date", to)
  if (search) {
    query = query.or(
      `description.ilike.%${search}%,merchant.ilike.%${search}%,category.ilike.%${search}%`
    )
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, count: count ?? 0 })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json()) as ExpenseInsert
  const { description, category, amount, expense_date, merchant, status, payment_method } = body

  if (!description || !category || amount == null || !expense_date || !merchant) {
    return NextResponse.json(
      { error: "Missing required fields: description, category, amount, expense_date, merchant" },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from("expenses")
    .insert({
      user_id: user.id,
      description,
      category,
      amount: Number(amount),
      expense_date,
      merchant,
      status: status ?? "Completed",
      payment_method: payment_method ?? "Personal Card",
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
