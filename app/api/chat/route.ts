import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const apiKey = process.env.SUMOPORT_API_KEY

    const response = await fetch("https://ai.sumopod.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey || ""}`,
      },
      body: JSON.stringify({
        model: "gpt-5.1",
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("AI API Error:", error)
      return NextResponse.json({ error: "Failed to fetch from AI API" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Chat Proxy Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
