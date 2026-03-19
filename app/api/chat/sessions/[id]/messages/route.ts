import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id: sessionId } = await params

  const { data: session } = await supabase
    .from("chat_sessions")
    .select("id")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single()

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 })
  }

  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, role, content, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id: sessionId } = await params

  const { data: session } = await supabase
    .from("chat_sessions")
    .select("id")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single()

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 })
  }

  const body = await request.json().catch(() => ({}))
  const role = body.role as string
  const rawContent = body.content
  const content = typeof rawContent === "string" ? rawContent.trim() : ""

  if (!role || !["user", "assistant"].includes(role)) {
    return NextResponse.json(
      { error: "Invalid role. Role must be 'user' or 'assistant'." },
      { status: 400 }
    )
  }

  if (role === "user" && !content) {
    return NextResponse.json(
      { error: "User messages must have non-empty content." },
      { status: 400 }
    )
  }

  const contentToSave = content || (role === "assistant" ? "(No response)" : "")

  const { data, error } = await supabase
    .from("chat_messages")
    .insert({ session_id: sessionId, role, content: contentToSave })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
