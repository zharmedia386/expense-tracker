import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { mkdir } from "fs/promises"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const extension = file.name.split(".").pop() || "png"
    const filename = `${user.id}-${Date.now()}.${extension}`
    const publicPath = join(process.cwd(), "public", "avatar")
    
    // Ensure directory exists
    await mkdir(publicPath, { recursive: true })
    
    const filePath = join(publicPath, filename)
    await writeFile(filePath, buffer)

    const avatarUrl = `/avatar/${filename}`

    // Update profiles table
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", user.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ avatar_url: avatarUrl })
  } catch (error) {
    console.error("Avatar upload error:", error)
    return NextResponse.json({ error: "Failed to upload avatar" }, { status: 500 })
  }
}
