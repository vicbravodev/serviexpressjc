"use client"

import { useState } from "react"

type FleetImageProps = {
  src: string
  alt: string
  /** Mono caption shown while the real file is missing (graceful fallback). */
  caption?: string
  className?: string
}

/**
 * Photo of the real fleet. If the file isn't present yet, it degrades to a
 * steel/blueprint panel with a mono caption so layouts never look broken.
 */
export function FleetImage({ src, alt, caption, className }: FleetImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-[oklch(0.16_0.012_255)] bg-blueprint ${className ?? ""}`}
        aria-label={alt}
        role="img"
      >
        <span className="px-6 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-white/45">
          {caption ?? "Foto de flota"}
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`object-cover ${className ?? ""}`}
    />
  )
}
