#!/usr/bin/env node
/**
 * Generate icons, logos, badges, and avatars using Sumopod API (gpt-image-1).
 * Logo: PNG with cool solid background. Others: PNG transparent, outline icon style, light theme colors.
 * Run: pnpm generate:assets [asset-name|all]
 * Requires SUMOPORT_API_KEY in .env
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, "..", "public", "assets")
const BASE_URL = "https://ai.sumopod.com"
const MODEL = "gpt-image-1"

/**
 * Asset config: { prompt, transparent }
 * Logo: transparent=false (solid cool background). Others: transparent=true.
 */
const ASSETS = {
  logo: {
    prompt: "Modern sleek logo for expense tracker app. Geometric abstract mark suggesting chart or receipt, vibrant purple gradient #9055ff to #6B2FD6, glassmorphism or gradient background - dark purple to black, premium fintech aesthetic. NO text, NO letters. Square format. Cool, professional, memorable.",
    transparent: false,
  },
  "icon-excel": {
    prompt: "Excel spreadsheet icon, outline stroke style, thin line art, bright green #217346, transparent background, light theme, 64x64, no fill only outline",
    transparent: true,
  },
  "icon-docs": {
    prompt: "Document icon, outline stroke style, thin line art, bright blue #4285F4, transparent background, light theme, 64x64, no fill only outline",
    transparent: true,
  },
  "icon-images": {
    prompt: "Image or photo icon, outline stroke style, thin line art, bright pink #E91E63, transparent background, light theme, 64x64, no fill only outline",
    transparent: true,
  },
  "icon-text": {
    prompt: "Text or document icon, outline stroke style, thin line art, bright amber #FF8F00, transparent background, light theme, 64x64, no fill only outline",
    transparent: true,
  },
  "icon-voice": {
    prompt: "Microphone or voice icon, outline stroke style, thin line art, bright purple #7B1FA2, transparent background, light theme, 64x64, no fill only outline",
    transparent: true,
  },
  "badge-soc2": {
    prompt: "SOC 2 Type II certification badge, outline stroke style, thin line art, gray #546E7A, transparent background, light theme, no text",
    transparent: true,
  },
  "badge-gdpr": {
    prompt: "GDPR compliance badge, outline stroke style, thin line art, blue #1976D2, transparent background, light theme, no text",
    transparent: true,
  },
  "badge-ssl": {
    prompt: "256-bit SSL security lock badge, outline stroke style, thin line art, green #2E7D32, transparent background, light theme, no text",
    transparent: true,
  },
  "feature-instant": {
    prompt: "Lightning bolt icon, outline stroke style, thin line art, bright purple #7B39FC, transparent background, light theme, 64x64",
    transparent: true,
  },
  "feature-security": {
    prompt: "Shield security icon, outline stroke style, thin line art, emerald green #059669, transparent background, light theme, 64x64",
    transparent: true,
  },
  "feature-insights": {
    prompt: "Bar chart analytics icon, outline stroke style, thin line art, bright blue #2563EB, transparent background, light theme, 64x64",
    transparent: true,
  },
  "feature-subscription": {
    prompt: "Clock or subscription icon, outline stroke style, thin line art, pink #DB2777, transparent background, light theme, 64x64",
    transparent: true,
  },
  "feature-projections": {
    prompt: "Rocket icon for future projections, outline stroke style, thin line art, purple #7B39FC, transparent background, light theme, 64x64",
    transparent: true,
  },
  "feature-currency": {
    prompt: "Globe icon for multi-currency, outline stroke style, thin line art, cyan #0891B2, transparent background, light theme, 64x64",
    transparent: true,
  },
  "avatar-sarah": {
    prompt: "Professional headshot portrait of an Asian woman in her 30s, Finance Director, business casual, transparent background, photorealistic, circular crop suitable",
    transparent: true,
  },
  "avatar-michael": {
    prompt: "Professional headshot portrait of a Hispanic man in his 30s, Sales Director, business casual, transparent background, photorealistic, circular crop suitable",
    transparent: true,
  },
  "avatar-emma": {
    prompt: "Professional headshot portrait of a Caucasian woman in her 30s, Account Manager, business casual, transparent background, photorealistic, circular crop suitable",
    transparent: true,
  },
  "avatar-david": {
    prompt: "Professional headshot portrait of an Asian man in his 40s, CFO, business suit, transparent background, photorealistic, circular crop suitable",
    transparent: true,
  },
  "avatar-anna": {
    prompt: "Professional headshot portrait of a Caucasian woman in her 30s, Operations Lead, business casual, transparent background, photorealistic, circular crop suitable",
    transparent: true,
  },
  "avatar-james": {
    prompt: "Professional headshot portrait of an Asian man in his 30s, Product Manager, business casual, transparent background, photorealistic, circular crop suitable",
    transparent: true,
  },
}

fs.mkdirSync(OUT_DIR, { recursive: true })

const apiKey = process.env.SUMOPORT_API_KEY
if (!apiKey) {
  console.error("Missing SUMOPORT_API_KEY in .env")
  process.exit(1)
}

async function generateImage(prompt, filename, transparent = true) {
  console.log(`Generating: ${filename}...`)
  try {
    const body = {
      model: MODEL,
      prompt,
      size: "1024x1024",
      response_format: "b64_json",
      output_format: "png",
    }
    if (transparent) body.background = "transparent"

    const res = await fetch(`${BASE_URL}/v1/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(err || res.statusText)
    }

    const json = await res.json()
    const b64 = json.data?.[0]?.b64_json
    if (!b64) {
      console.error("  No image in response.")
      return false
    }

    const buffer = Buffer.from(b64, "base64")
    fs.writeFileSync(path.join(OUT_DIR, filename), buffer)
    console.log(`  Saved: public/assets/${filename}`)
    return true
  } catch (err) {
    console.error("  Error:", err?.message || err)
    return false
  }
}

async function main() {
  const arg = process.argv[2] || "logo"
  const target = arg.toLowerCase()

  if (target === "logo" || target === "all") {
    const list = target === "all" ? Object.entries(ASSETS) : [["logo", ASSETS.logo]]
    for (const [name, config] of list) {
      const { prompt, transparent } = config
      await generateImage(prompt, `${name}.png`, transparent)
      if (list.length > 1) await new Promise((r) => setTimeout(r, 2000))
    }
  } else if (ASSETS[target]) {
    const { prompt, transparent } = ASSETS[target]
    await generateImage(prompt, `${target}.png`, transparent)
  } else {
    console.log("Unknown asset. Available:", Object.keys(ASSETS).join(", "))
    console.log("\nUsage: pnpm generate:assets [logo|icon-excel|...|avatar-sarah|all]")
  }
}

main().catch(console.error)
