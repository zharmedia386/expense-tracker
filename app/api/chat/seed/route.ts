import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const DUMMY_SESSIONS = [
  {
    title: "Summarize my spending for the last 30 days",
    messages: [
      { role: "user" as const, content: "Summarize my spending for the last 30 days" },
      { role: "assistant" as const, content: "Here’s a summary of your spending over the last 30 days:\n\n**Total spending:** Rp 2.450.000\n\n**Top categories:**\n1. Food & Dining – Rp 850.000\n2. Transportation – Rp 420.000\n3. Entertainment – Rp 380.000\n4. Shopping – Rp 320.000\n5. Utilities – Rp 250.000\n\n**Tip:** Consider setting a monthly budget for Food & Dining and Transportation to better control spending." },
    ],
  },
  {
    title: "How can I save more money next month?",
    messages: [
      { role: "user" as const, content: "How can I save more money next month?" },
      { role: "assistant" as const, content: "Here are some practical steps to save more:\n\n1. **Track spending** – Use this app to see where your money goes.\n2. **Set clear goals** – Aim to save 10–20% of your income.\n3. **Reduce dining out** – Cook more at home to cut Food & Dining costs.\n4. **Review subscriptions** – Cancel any recurring payments you don’t use.\n5. **Use the 50/30/20 rule** – 50% needs, 30% wants, 20% savings.\n\nI can also analyze your current expenses for more specific advice." },
    ],
  },
  {
    title: "Show my top 5 expense categories",
    messages: [
      { role: "user" as const, content: "Show my top 5 expense categories" },
      { role: "assistant" as const, content: "Your top 5 expense categories (last 50 transactions):\n\n1. **Food & Dining** – Rp 850.000\n2. **Transportation** – Rp 420.000\n3. **Entertainment** – Rp 380.000\n4. **Shopping** – Rp 320.000\n5. **Utilities** – Rp 250.000\n\n**Total** from these categories: Rp 2.220.000\n\nWant a deeper breakdown of any category?" },
    ],
  },
]

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const insertedSessions: Array<{ id: string; title: string; created_at: string }> = []

    for (const { title, messages } of DUMMY_SESSIONS) {
      const { data: session, error: sessionError } = await supabase
        .from("chat_sessions")
        .insert({ user_id: user.id, title })
        .select("id, title, created_at")
        .single()

      if (sessionError || !session) {
        console.error("Seed session error:", sessionError)
        continue
      }

      insertedSessions.push(session)

      for (const msg of messages) {
        await supabase
          .from("chat_messages")
          .insert({ session_id: session.id, role: msg.role, content: msg.content })
      }
    }

    return NextResponse.json({
      success: true,
      count: insertedSessions.length,
      sessions: insertedSessions,
    })
  } catch (error) {
    console.error("Chat seed error:", error)
    return NextResponse.json({ error: "Failed to seed chat history" }, { status: 500 })
  }
}
