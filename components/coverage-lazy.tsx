"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"

// El mapa de cobertura arrastra ~225 KB de geometría SVG + framer-motion y vive
// muy por debajo del pliegue. Se carga en un chunk aparte (ssr:false) y solo
// cuando el usuario se acerca por scroll, así sale del First Load JS de la home
// (mejora FCP/LCP/INP). El placeholder reserva altura para no introducir CLS y
// conserva el ancla #cobertura para la navegación.
const CoverageSection = dynamic(
  () => import("@/components/coverage-section").then((m) => m.CoverageSection),
  { ssr: false },
)

export function CoverageLazy() {
  const ref = useRef<HTMLElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Deep-link directo (p. ej. footer -> /es#cobertura): carga de inmediato.
    if (window.location.hash === "#cobertura") {
      setShow(true)
      return
    }
    const el = ref.current
    if (!el) return
    // Navegador sin IntersectionObserver: cargar en cuanto se pueda.
    if (!("IntersectionObserver" in window)) {
      setShow(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true)
          io.disconnect()
        }
      },
      // Precarga ~400px antes de entrar en viewport para que llegue "cargado".
      { rootMargin: "400px 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (show) return <CoverageSection />

  return (
    <section id="cobertura" ref={ref} aria-busy="true" className="py-24">
      <div className="container mx-auto px-4">
        <div className="min-h-[600px] rounded-2xl border border-white/10 surface-steel animate-pulse" />
      </div>
    </section>
  )
}
