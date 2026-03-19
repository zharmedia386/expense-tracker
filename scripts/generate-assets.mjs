#!/usr/bin/env node
/**
 * Generate icons, logos, and avatars using Gemini (Nano Banana) API.
 * Run: node --env-file=.env scripts/generate-assets.mjs
 * Requires GEMINI_API_KEY in .env
 */

import { GoogleGenAI } from "@google/genai"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, "..", "public", "generated")
const MODEL = "gemini-2.0-flash-preview-image-generation"

// Ensure output directory exists
fs.mkdirSync(OUT_DIR, { recursive: true })

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  console.error("Missing GEMINI_API_KEY. Add it to .env or run: node --env-file=.env scripts/generate-assets.mjs")
  process.exit(1)
}

const ai = new GoogleGenAI({ apiKey })

async function generateImage(prompt, filename) {
  console.log(`Generating: ${filename}...`)
  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseModalities: ["IMAGE", "TEXT"],
        responseMimeType: "image/png",
      },
    })

    const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)
    if (!part?.inlineData?.data) {
      console.error(`  No image in response for ${filename}. Try a different model or prompt.`)
      return false
    }

    const buffer = Buffer.from(part.inlineData.data, "base64")
    const outPath = path.join(OUT_DIR, filename)
    fs.writeFileSync(outPath, buffer)
    console.log(`  Saved: ${filename}`)
    return true
  } catch (err) {
    console.error(`  Error: ${err.message}`)
    return false
  }
}

async function main() {
  console.log("Generating assets with Gemini API...\n")

  // 1. Project logo
  await generateImage(
    "A minimalist modern logo for an AI expense tracking app called ExpenseAI. Purple gradient (#9055ff to #6B2FD6), geometric abstract shape suggesting a chart or receipt, clean vector style, white/transparent background, square format. Professional fintech aesthetic.",
    "logo.png"
  )

  // 2. Format icons (Excel, Docs, Images, Text, Voice)
  const formatPrompts = [
    ["Excel spreadsheet icon, minimalist flat design, green accent, white background, 64x64 icon style", "icon-excel.png"],
    ["Document icon, minimalist flat design, blue accent, white background, 64x64 icon style", "icon-docs.png"],
    ["Image/photo icon, minimalist flat design, pink accent, white background, 64x64 icon style", "icon-images.png"],
    ["Text/document icon, minimalist flat design, amber accent, white background, 64x64 icon style", "icon-text.png"],
    ["Microphone/voice icon, minimalist flat design, purple accent, white background, 64x64 icon style", "icon-voice.png"],
  ]
  for (const [prompt, filename] of formatPrompts) {
    await generateImage(prompt, filename)
  }

  // 3. Trust badge logos
  const trustPrompts = [
    ["SOC 2 Type II certification badge logo, minimalist, professional, purple/gray tones, white background, small badge style", "badge-soc2.png"],
    ["GDPR compliance badge logo, minimalist, professional, purple/gray tones, white background, small badge style", "badge-gdpr.png"],
    ["256-bit SSL security lock badge logo, minimalist, professional, purple/gray tones, white background, small badge style", "badge-ssl.png"],
  ]
  for (const [prompt, filename] of trustPrompts) {
    await generateImage(prompt, filename)
  }

  // 4. Feature icons
  const featurePrompts = [
    ["Lightning bolt icon for instant processing, minimalist flat design, purple gradient, 64x64", "feature-instant.png"],
    ["Shield/security icon for bank-grade security, minimalist flat design, emerald green, 64x64", "feature-security.png"],
    ["Bar chart analytics icon for smart insights, minimalist flat design, blue gradient, 64x64", "feature-insights.png"],
    ["Clock icon for subscription tracking, minimalist flat design, pink accent, 64x64", "feature-subscription.png"],
    ["Rocket icon for future projections, minimalist flat design, purple accent, 64x64", "feature-projections.png"],
    ["Globe icon for multi-currency, minimalist flat design, cyan accent, 64x64", "feature-currency.png"],
  ]
  for (const [prompt, filename] of featurePrompts) {
    await generateImage(prompt, filename)
  }

  // 5. Testimonial avatars (realistic professional headshots)
  const avatarPrompts = [
    ["Professional headshot portrait of an Asian woman in her 30s, Finance Director, business casual, neutral background, photorealistic", "avatar-sarah.png"],
    ["Professional headshot portrait of a Hispanic man in his 30s, Sales Executive, business casual, neutral background, photorealistic", "avatar-marcus.png"],
    ["Professional headshot portrait of a Caucasian woman in her 30s, Account Manager, business casual, neutral background, photorealistic", "avatar-emily.png"],
    ["Professional headshot portrait of an Asian man in his 40s, CFO, business suit, neutral background, photorealistic", "avatar-david.png"],
    ["Professional headshot portrait of a Caucasian woman in her 30s, Operations Lead, business casual, neutral background, photorealistic", "avatar-anna.png"],
    ["Professional headshot portrait of an Asian man in his 30s, Product Manager, business casual, neutral background, photorealistic", "avatar-james.png"],
  ]
  for (const [prompt, filename] of avatarPrompts) {
    await generateImage(prompt, filename)
  }

  console.log("\nDone! Assets saved to public/generated/")
}

main().catch(console.error)
