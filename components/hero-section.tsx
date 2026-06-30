"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion, type Variants } from "motion/react"

const heroContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}

const heroItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export function HeroSection() {
  const reduceMotion = useReducedMotion()
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return

    let frame = 0
    const handleScroll = () => {
      // Throttle to one write per frame so we never block the scroll thread
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const el = videoContainerRef.current
        if (!el) return
        // Only drives while the hero is on screen; subtle 0.4 ratio reads as depth
        el.style.transform = `translate3d(0, ${window.scrollY * 0.4}px, 0)`
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    // If the video is already buffered (cache/fast connection), reveal immediately
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setVideoLoaded(true)
    }
  }, [])

  useEffect(() => {
    // En conexiones con ahorro de datos, no autoreproducir el video pesado: se queda el poster.
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (conn?.saveData && videoRef.current) {
      videoRef.current.removeAttribute("autoplay")
      videoRef.current.pause()
    }
  }, [])

  return (
    <section
      id="inicio"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[oklch(0.12_0.01_240)]"
    >
      {/* Parallax video layer — oversized so movement never reveals the edges */}
      <div ref={videoContainerRef} className="absolute -inset-x-0 -top-[8%] h-[124%] z-0 parallax-video">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={() => setVideoLoaded(true)}
          data-loaded={videoLoaded}
          className="hero-video w-full h-full object-cover"
          poster="/modern-truck-on-highway-at-sunset.jpg"
        >
          <source src="/hero-videop.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Cinematic scrim — guarantees text contrast over any frame of the video */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/70 via-black/45 to-background" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.45)_100%)]" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-24 pb-32">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={heroContainer}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
        >
          {/* Badge */}
          <motion.div
            variants={heroItem}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-yellow-accent-bright opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-accent-bright" />
            </span>
            <span className="text-sm font-medium text-white/90">Más de 10 años de experiencia</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={heroItem}
            className="text-4xl md:text-6xl font-bold mb-6 text-balance leading-[1.08] text-white"
          >
            Eficiencia sobre ruedas,{" "}
            <span className="text-yellow-accent-bright">compromiso sin fronteras</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={heroItem}
            className="text-xl md:text-2xl text-white/80 mb-12 text-pretty max-w-3xl mx-auto leading-relaxed"
          >
            Transporte especializado de carga entre México y Estados Unidos. Entregas puntuales, seguras y
            monitoreadas 24/7.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={heroItem}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="group bg-secondary hover:bg-secondary/90 text-lg px-8 h-14 shadow-lg shadow-black/20"
              asChild
            >
              <Link href="#cotizacion">
                Solicita tu cotización
                <ArrowRight className="ml-2 transition-transform duration-200 ease-out group-hover:translate-x-0.5" size={20} />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 h-14 bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:text-white"
              asChild
            >
              <Link href="#servicios">
                <Play className="mr-2" size={20} />
                Ver servicios
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
