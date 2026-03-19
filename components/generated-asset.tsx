"use client"

import { useState } from "react"
import Image from "next/image"

/**
 * Renders a Gemini-generated asset with fallback when the image fails to load.
 * Use for icons, logos, and avatars from public/generated/
 */
export function GeneratedAsset({
  src,
  alt,
  width = 24,
  height = 24,
  className = "",
  fallback,
  ...props
}: {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallback?: React.ReactNode
  [key: string]: unknown
}) {
  const [error, setError] = useState(false)

  if (error && fallback) {
    return <>{fallback}</>
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
      unoptimized
      {...props}
    />
  )
}
