"use client"

import { useState } from "react"

/* Muestra el logo del cliente; si la imagen falla (o no hay logo), cae a un
   wordmark tipográfico. Evita imágenes rotas cuando falta el archivo oficial. */
export function ClientLogo({ name, logo, alt }: { name: string; logo?: string; alt: string }) {
  const [failed, setFailed] = useState(false)

  if (logo && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="h-9 max-w-full object-contain grayscale transition-[filter] duration-300 hover:grayscale-0 md:h-10"
      />
    )
  }

  return (
    <span className="text-center font-mono text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors duration-300 hover:text-foreground md:text-base">
      {name}
    </span>
  )
}
