#!/usr/bin/env node
/**
 * Generate icons and logos using Gemini API. Outputs to public/assets/
 * Run: pnpm generate:assets [asset-name]
 * Example: pnpm generate:assets logo
 * Asset names: logo, icon-excel, icon-docs, icon-images, icon-text, icon-voice,
 *              badge-soc2, badge-gdpr, badge-ssl, feature-instant, etc.
 * If no arg: generates logo only.
 */

import { GoogleGenAI } from "@google/genai"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, "..", "public", "assets")
const MODEL = "gemini-3.1-flash-image-preview"

const ASSETS = {
  logo: "A minimalist modern logo for an Expense Tracker / expense tracking app. Purple gradient (#9055ff to #6B2FD6), geometric abstract shape suggesting a chart or receipt, clean vector style, transparent or white background, square format. Professional fintech aesthetic.",
  "icon-excel": "Excel spreadsheet icon, minimalist flat design, green accent, white background, 64x64 icon style",
  "icon-docs": "Document icon, minimalist flat design, blue accent, white background, 64x64 icon style",
  "icon-images": "Image/photo icon, minimalist flat design, pink accent, white background, 64x64 icon style",
  "icon-text": "Text/document icon, minimalist flat design, amber accent, white background, 64x64 icon style",
  "icon-voice": "Microphone/voice icon, minimalist flat design, purple accent, white background, 64x64 icon style",
  "badge-soc2": "SOC 2 Type II certification badge logo, minimalist, professional, purple/gray tones, white background",
  "badge-gdpr": "GDPR compliance badge logo, minimalist, professional, purple/gray tones, white background",
  "badge-ssl": "256-bit SSL security lock badge logo, minimalist, professional, purple/gray tones, white background",
}

fs.mkdirSync(OUT_DIR, { recursive: true })

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  console.error("Missing GEMINI_API_KEY in .env")
  process.exit(1)
}

const ai = new GoogleGenAI({ apiKey })

async function generateImage(prompt, filename) {
  console.log(`Generating: ${filename}...`)
  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    })

    const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData || p.inline_data)
    const data = part?.inlineData || part?.inline_data
    if (!data?.data && !data?.imageBytes) {
      console.error(`  No image in response.`)
      return false
    }

    const buffer = Buffer.from(data.data || data.imageBytes, "base64")
    fs.writeFileSync(path.join(OUT_DIR, filename), buffer)
    console.log(`  Saved: public/assets/${filename}`)
    return true
  } catch (err) {
    console.error(`  Error:`, err?.message || err)
    return false
  }
}

async function main() {
  const arg = process.argv[2] || "logo"
  const target = arg.toLowerCase()

  if (target === "logo" || target === "all") {
    const list = target === "all" ? Object.entries(ASSETS) : [["logo", ASSETS.logo]]
    for (const [name, prompt] of list) {
      await generateImage(prompt, `${name}.png`)
      if (list.length > 1) await new Promise((r) => setTimeout(r, 2000))
    }
  } else if (ASSETS[target]) {
    await generateImage(ASSETS[target], `${target}.png`)
  } else {
    console.log("Unknown asset. Available:", Object.keys(ASSETS).join(", "))
    console.log("\nUsage: pnpm generate:assets [logo|icon-excel|icon-docs|...|all]")
  }
}

main().catch(console.error)
