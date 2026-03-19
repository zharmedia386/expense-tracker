import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const defaultProfile = {
    full_name: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "",
    avatar_url: user.user_metadata?.avatar_url ?? null,
    company: "",
    phone: "",
    email_notifications: true,
    push_notifications: true,
  }

  if (error && error.code !== "PGRST116") {
    return NextResponse.json(defaultProfile)
  }

  return NextResponse.json({
    ...defaultProfile,
    ...(data ?? {}),
  })
}

export async function PUT(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const updates: Record<string, unknown> = {}

  if (typeof body.full_name === "string") updates.full_name = body.full_name
  if (typeof body.company === "string") updates.company = body.company
  if (typeof body.phone === "string") updates.phone = body.phone
  if (typeof body.avatar_url === "string") updates.avatar_url = body.avatar_url
  if (typeof body.email_notifications === "boolean") updates.email_notifications = body.email_notifications
  if (typeof body.push_notifications === "boolean") updates.push_notifications = body.push_notifications

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ success: true })
  }

  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, updated_at: new Date().toISOString(), ...updates }, { onConflict: "id" })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
