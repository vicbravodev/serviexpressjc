"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Volume2, VolumeX, Maximize2, X } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react"
import { useTranslations } from "next-intl"
import { yearsInService } from "@/lib/site"

const heroContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}

const heroItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export function HeroSection() {
  const t = useTranslations("Hero")
  const reduceMotion = useReducedMotion()
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const modalVideoRef = useRef<HTMLVideoElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  // Parallax: drive the oversized video layer a fraction of scroll for depth.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let frame = 0
    const handleScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const el = videoContainerRef.current
        if (!el) return
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
    if (videoRef.current && videoRef.current.readyState >= 3) setVideoLoaded(true)
  }, [])

  useEffect(() => {
    // Save-data: don't autoplay the heavy presentation, keep the poster frame.
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (conn?.saveData && videoRef.current) {
      videoRef.current.removeAttribute("autoplay")
      videoRef.current.pause()
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

  const openModal = useCallback(() => {
    videoRef.current?.pause()
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    const v = videoRef.current
    if (v && !(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) {
      v.play().catch(() => {})
    }
  }, [])

  // Modal: lock scroll, autoplay from the start with sound, close on Escape.
  useEffect(() => {
    if (!modalOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const mv = modalVideoRef.current
    if (mv) {
      mv.currentTime = 0
      mv.muted = false
      mv.play().catch(() => {})
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeModal()
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [modalOpen, closeModal])

  return (
    <section
      id="inicio"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[oklch(0.12_0.01_240)]"
    >
      {/* Parallax video layer, oversized so movement never reveals the edges */}
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

      {/* Cinematic scrim, guarantees text contrast over any frame */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/75 via-black/50 to-background" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.55)_100%)]" />
      {/* Faint blueprint grid ties the hero to the control-room language */}
      <div className="absolute inset-0 z-[1] bg-blueprint opacity-[0.18] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-24 pb-40 sm:pb-44">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={heroContainer}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
        >
          {/* Live operations badge */}
          <motion.div
            variants={heroItem}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-yellow-accent-bright opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-accent-bright" />
            </span>
            <span className="text-xs sm:text-sm font-medium text-white/90 font-mono tracking-wide uppercase">
              {t("badge")}<span className="hidden sm:inline">{t("badgeYears", { years: yearsInService() })}</span>
            </span>
          </motion.div>

          <motion.h1
            variants={heroItem}
            className="text-4xl md:text-6xl font-bold mb-6 text-balance leading-[1.08] text-white"
          >
            {t("titleLead")}{" "}
            <span className="text-yellow-accent-bright">{t("titleAccent")}</span>
          </motion.h1>

          <motion.p
            variants={heroItem}
            className="text-xl md:text-2xl text-white/80 mb-10 text-pretty max-w-3xl mx-auto leading-relaxed"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div variants={heroItem} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="group bg-secondary hover:bg-secondary/90 text-lg px-8 h-14 shadow-lg shadow-black/20"
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
          </motion.div>
        </motion.div>
      </div>

      {/* Ambient video controls: bottom-left on mobile, top-right (under header) on desktop */}
      <div className="absolute bottom-32 left-4 right-auto top-auto sm:bottom-auto sm:left-auto sm:top-28 sm:right-6 z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={soundOn}
          aria-label={soundOn ? t("muteAria") : t("unmuteAria")}
          className="relative flex h-11 items-center gap-2 rounded-full border border-white/25 bg-black/40 backdrop-blur-md px-4 text-xs font-medium text-white/90 transition-colors hover:border-yellow-accent-bright/70 hover:text-white"
        >
          {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span className="hidden sm:inline">{soundOn ? t("soundOn") : t("soundOff")}</span>
          {!soundOn && (
            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-yellow-accent-bright opacity-75 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-yellow-accent-bright" />
            </span>
          )}
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
                poster="/modern-truck-on-highway-at-sunset.jpg"
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
