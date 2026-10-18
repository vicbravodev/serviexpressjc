"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Pause, Play, Volume2, VolumeX, Maximize2, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { useTranslations } from "next-intl"
import { trackEvent } from "@/lib/analytics"

export function HeroSection() {
  const t = useTranslations("Hero")
  const reduceMotion = useReducedMotion()
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const modalVideoRef = useRef<HTMLVideoElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  // Solo se reanuda al cerrar el modal si ya estaba corriendo: respeta reduced-motion y redes lentas.
  const resumeAmbientRef = useRef(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  // Parallax: la capa de video (sobredimensionada) baja al 40% del scroll, fuera del render de React.
  const { scrollY } = useScroll()
  const parallaxY = useTransform(scrollY, (v) => v * 0.4)

  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 3) setVideoLoaded(true)
  }, [])

  // Video diferido: el LCP es el poster optimizado (next/image priority), no el
  // MP4 de 18 MB. El video arranca solo cuando el hero es visible y la página
  // ya cargó, respetando prefers-reduced-motion y save-data.
  useEffect(() => {
    const v = videoRef.current
    const container = videoContainerRef.current
    if (!v || !container) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
      .connection
    // 18 MB de video en 2G/3G compite con el resto de la página: se queda el poster.
    if (conn?.saveData || /(^|-)(2g|3g)$/.test(conn?.effectiveType ?? "")) return

    let started = false
    const start = () => {
      if (started) return
      started = true
      v.play().catch(() => {})
    }
    const whenIdle = () => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(start, { timeout: 2500 })
      } else {
        setTimeout(start, 400)
      }
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      if (document.readyState === "complete") whenIdle()
      else window.addEventListener("load", whenIdle, { once: true })
    })
    observer.observe(container)
    return () => {
      observer.disconnect()
      window.removeEventListener("load", whenIdle)
    }
  }, [])

  const toggleSound = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    const next = !soundOn
    v.muted = !next
    if (next) v.play().catch(() => {})
    setSoundOn(next)
  }, [soundOn])

  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }, [])

  const openModal = useCallback(() => {
    const v = videoRef.current
    resumeAmbientRef.current = Boolean(v && !v.paused)
    v?.pause()
    setModalOpen(true)
    trackEvent("hero_video_play", {})
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    if (resumeAmbientRef.current) videoRef.current?.play().catch(() => {})
  }, [])

  // Modal: lock scroll, autoplay from the start with sound, close on Escape,
  // focus inside while open (Tab cycles close button ↔ video) and back to the trigger on close.
  useEffect(() => {
    if (!modalOpen) return
    const trigger = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const mv = modalVideoRef.current
    if (mv) {
      mv.currentTime = 0
      mv.muted = false
      mv.play().catch(() => {})
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return closeModal()
      if (e.key !== "Tab") return
      const focusables = [closeButtonRef.current, modalVideoRef.current].filter(Boolean) as HTMLElement[]
      const i = focusables.indexOf(document.activeElement as HTMLElement)
      const next = focusables[(i + (e.shiftKey ? -1 : 1) + focusables.length) % focusables.length]
      e.preventDefault()
      next.focus()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
      trigger?.focus()
    }
  }, [modalOpen, closeModal])

  return (
    <section
      id="inicio"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[oklch(0.12_0.01_240)]"
    >
      {/* Parallax video layer, oversized so movement never reveals the edges */}
      <motion.div
        ref={videoContainerRef}
        style={reduceMotion ? undefined : { y: parallaxY }}
        className="absolute -inset-x-0 -top-[8%] h-[124%] z-0 parallax-video"
      >
        {/* Poster optimizado: es el LCP y pinta de inmediato; el video hace fade-in encima */}
        <Image
          src="/fleet/flota-patio.jpg"
          alt={t("posterAlt")}
          fill
          priority
          fetchPriority="high"
          quality={68}
          sizes="100vw"
          className="object-cover"
        />
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          onCanPlay={() => setVideoLoaded(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          data-loaded={videoLoaded}
          className="hero-video absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-videop.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Cinematic scrim, guarantees text contrast over any frame. Termina oscuro:
          el hero es el único bloque oscuro y corta limpio contra el lienzo claro. */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/75 via-black/50 to-black/70" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.55)_100%)]" />
      {/* Faint blueprint grid ties the hero to the control-room language */}
      <div className="absolute inset-0 z-[1] bg-blueprint opacity-[0.18] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-36 pb-24 sm:pt-24 sm:pb-28">
        {/* Entrada por CSS (animate-hero-rise): el texto pinta sin esperar JS */}
        <div className="max-w-5xl mx-auto text-center">
          <h1
            className="animate-hero-rise text-4xl md:text-5xl lg:text-[3.5rem] font-bold mb-5 text-balance leading-[1.08] tracking-tight text-white"
            style={{ animationDelay: "0.15s" }}
          >
            {t("titleLead")}{" "}
            <span className="text-yellow-accent-bright">{t("titleAccent")}</span>
          </h1>

          {/* Slogan histórico: se conserva como subtítulo visual (ya no es el H1) */}
          <p
            className="animate-hero-rise mb-6 font-mono text-xs sm:text-sm uppercase tracking-[0.24em] text-yellow-accent-bright/90"
            style={{ animationDelay: "0.27s" }}
          >
            {t("slogan")}
          </p>

          <p
            className="animate-hero-rise text-xl md:text-2xl text-white/80 mb-10 text-pretty max-w-3xl mx-auto leading-relaxed"
            style={{ animationDelay: "0.39s" }}
          >
            {t("subtitle")}
          </p>

          <div
            className="animate-hero-rise flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{ animationDelay: "0.51s" }}
          >
            <Button
              size="lg"
              className="group bg-secondary hover:bg-secondary/90 text-lg px-8 h-14"
              asChild
            >
              <Link href="#cotizacion">
                {t("cta")}
                <ArrowRight
                  className="ml-2 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                  size={20}
                />
              </Link>
            </Button>
            <button
              type="button"
              onClick={openModal}
              className="group inline-flex items-center gap-3 text-white/90 hover:text-white transition-colors"
            >
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md transition-colors group-hover:border-yellow-accent-bright/70">
                <Play size={18} className="ml-0.5 fill-current" />
              </span>
              <span className="text-left">
                <span className="block text-base font-medium leading-tight">{t("watch")}</span>
                <span className="block text-xs text-white/60 font-mono">{t("watchMeta")}</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Ambient video controls: top-right, under the header (abajo chocaban con "Ver presentación" en móvil) */}
      <div className="absolute right-4 top-[5.5rem] sm:right-6 sm:top-24 z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleSound}
          aria-label={soundOn ? t("muteAria") : t("unmuteAria")}
          className="relative flex h-11 items-center gap-2 rounded-full border border-white/25 bg-black/40 backdrop-blur-md px-4 text-xs font-medium text-white/90 transition-colors hover:border-yellow-accent-bright/70 hover:text-white"
        >
          {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span className="hidden sm:inline">{soundOn ? t("soundOn") : t("soundOff")}</span>
        </button>
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? t("pauseAria") : t("playAria")}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/40 backdrop-blur-md text-white/90 transition-colors hover:border-yellow-accent-bright/70 hover:text-white"
        >
          {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
        </button>
        <button
          type="button"
          onClick={openModal}
          aria-label={t("fullscreenAria")}
          className="hidden sm:flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/40 backdrop-blur-md text-white/90 transition-colors hover:border-yellow-accent-bright/70 hover:text-white"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {/* Presentation lightbox: full video, from start, with sound + controls */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-label={t("modalAria")}
          >
            <motion.div
              className="relative w-full max-w-5xl"
              initial={reduceMotion ? false : { scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduceMotion ? undefined : { scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeModal}
                aria-label={t("closeAria")}
                className="absolute -top-3 -right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-foreground shadow-lg transition-transform hover:scale-105"
              >
                <X size={18} />
              </button>
              <video
                ref={modalVideoRef}
                controls
                playsInline
                className="w-full aspect-video rounded-xl border border-white/10 bg-black shadow-2xl"
                poster="/fleet/flota-patio.jpg"
              >
                <source src="/hero-videop.mp4" type="video/mp4" />
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
