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

    const systemPrompt = `You are a helpful AI financial assistant for ExpenseAI. You assist users with expense tracking, summaries, savings tips, investment basics, and optimization plans.

${userContext}

CRITICAL: You must ALWAYS return a helpful response. Never return empty content. Every question deserves a substantive answer.

When the user asks about THEIR data (spending, categories, totals, optimization, savings plan):
- Use the expense data above. Reference real numbers from the data when available.
- If they have no expenses yet, give general actionable advice.
- Format as Markdown: **bold** for amounts, - for bullets, 1. 2. 3. for numbered lists.
- Currency is Indonesian Rupiah (IDR). Use **Rp X.XXX** format.

When the user asks for an OPTIMIZATION PLAN, SAVINGS PLAN, or "how to save more":
- Analyze their spending by category from the data above.
- Provide 3-5 specific, actionable steps (numbered list).
- Reference their top categories and suggest cuts or changes.
- If no data: give 3-5 general tips (reduce subscriptions, meal prep, track spending, etc.).

Examples you MUST answer fully:
- "Optimization plan" / "Save more money" / "Personalized plan" → Analyze their data, list 3-5 actionable steps.
- "How can I save money?" → Give 4-6 practical tips.
- "What is investment?" → Explain briefly, mention options relevant to Indonesia (reksadana, deposito, saham).
- "Budgeting tips?" → Provide actionable steps.

If asked to add an expense: direct them to the "Add Expense" button. Never make up expense numbers.`

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
        max_tokens: 2500,
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

    const FALLBACK_MESSAGE =
      "I don't have enough context for that. I'm a **financial tracker assistant**—I help with expense summaries, spending analysis, savings tips, and budgeting based on your data.\n\nTry asking things like:\n- \"Summarize my spending this month\"\n- \"How can I save more?\"\n- \"What are my top expense categories?\""

    // Fallback: if AI returns empty, null, or missing content
    const content = data?.choices?.[0]?.message?.content
    const isEmpty = content == null || (typeof content === "string" && content.trim() === "")

    if (isEmpty) {
      if (!data.choices) data.choices = [{}]
      if (!data.choices[0]) data.choices[0] = { message: {} }
      if (!data.choices[0].message) data.choices[0].message = {}
      data.choices[0].message.content = FALLBACK_MESSAGE
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Chat Proxy Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
