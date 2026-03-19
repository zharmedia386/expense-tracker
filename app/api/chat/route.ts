import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { formatIDR } from "@/lib/currency"

async function buildUserContext(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<string> {
  const { data: expenses } = await supabase
    .from("expenses")
    .select("description, category, amount, expense_date, merchant, status")
    .eq("user_id", userId)
    .order("expense_date", { ascending: false })
    .limit(50)

  const items = expenses ?? []
  const completed = items.filter((e) => e.status === "Completed")
  const totalSpending = completed.reduce((s, e) => s + Number(e.amount), 0)
  const refunded = items.filter((e) => e.status === "Refunded")
  const totalRefunded = refunded.reduce((s, e) => s + Number(e.amount), 0)
  const netSpending = totalSpending - totalRefunded

  const byCategory = new Map<string, number>()
  for (const e of completed) {
    const cat = e.category ?? "Other"
    byCategory.set(cat, (byCategory.get(cat) ?? 0) + Number(e.amount))
  }
  const topCategories = Array.from(byCategory.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, val]) => `${name}: ${formatIDR(val)}`)
    .join(", ")

  const recentExpenses = items.slice(0, 10).map(
    (e) => `- ${e.merchant}: ${formatIDR(Number(e.amount))} (${e.category}, ${e.expense_date})`
  ).join("\n")

  return `## User's Expense Data (use this to answer questions accurately)

**Summary (last 50 transactions):**
- Total spending (completed): ${formatIDR(totalSpending)}
- Total refunded: ${formatIDR(totalRefunded)}
- Net spending: ${formatIDR(netSpending)}
- Transaction count: ${items.length}

**Top categories by spend:** ${topCategories || "No data"}

**Recent expenses:**
${recentExpenses || "No recent expenses"}

**Important:** All amounts are in Indonesian Rupiah (IDR). Use "Rp" when formatting.`
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized. Please sign in to use the AI assistant." }, { status: 401 })
  }

  const apiKey = process.env.SUMOPORT_API_KEY
  if (!apiKey?.trim()) {
    return NextResponse.json(
      { error: "AI service is not configured. Please add SUMOPORT_API_KEY to your environment." },
      { status: 503 }
    )
  }

  try {
    const body = await req.json()
    const messages: Array<{ role: string; content: string }> = body.messages ?? []

    const userContext = await buildUserContext(supabase, user.id)

    const systemPrompt = `You are a helpful AI financial assistant for ExpenseAI. You assist users with expense tracking, summaries, and financial advice.

${userContext}

Guidelines:
- Always format your response using Markdown: use **bold** for amounts and key terms, - for bullet lists, 1. 2. 3. for numbered lists, and proper line breaks.
- Use the user's actual expense data above when answering questions about their spending, categories, or totals.
- All currency is Indonesian Rupiah (IDR). Format amounts as **Rp X.XXX** (bold) e.g. **Rp 50.000**.
- Be concise and actionable. For "summarize spending" use their real totals and categories.
- For "top categories" or "how much did I spend on X" - query the data provided and present as a formatted list.
- If asked to add an expense, explain they can use the "Add Expense" button in the dashboard; you cannot create expenses directly.
- Never make up numbers - use only the data provided. If data is empty, say so.`

    const withoutSystem = messages.filter((m) => m.role !== "system")
    const enrichedMessages = [
      { role: "system" as const, content: systemPrompt },
      ...withoutSystem,
    ]

    const response = await fetch("https://ai.sumopod.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5.1",
        messages: enrichedMessages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("AI API Error:", response.status, error)
      return NextResponse.json(
        { error: "Failed to get AI response. Please try again." },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Chat Proxy Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
