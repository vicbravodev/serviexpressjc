"use client"

import Image from "next/image"
import { useState } from "react"

type FleetImageProps = {
  src: string
  alt: string
  /** Mono caption shown while the real file is missing (graceful fallback). */
  caption?: string
  className?: string
  /** Anchos que ocupa la imagen por breakpoint (atributo sizes de next/image). */
  sizes?: string
}

/**
 * Photo of the real fleet. If the file isn't present yet, it degrades to a
 * steel/blueprint panel with a mono caption so layouts never look broken.
 * Sirve formatos modernos (AVIF/WebP) vía next/image y carga lazy bajo el fold.
 */
export function FleetImage({ src, alt, caption, className, sizes }: FleetImageProps) {
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
    <Image
      src={src}
      alt={alt}
      width={1600}
      height={900}
      loading="lazy"
      sizes={sizes ?? "(max-width: 1024px) 100vw, 50vw"}
      onError={() => setFailed(true)}
      className={`object-cover ${className ?? ""}`}
    />
  )
}
