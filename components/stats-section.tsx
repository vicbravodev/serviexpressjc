"use client"

import { Clock, Truck, ShieldCheck, BadgeCheck } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"
import { useTranslations } from "next-intl"
import { yearsInService } from "@/lib/site"

type Metric = {
  icon: typeof Clock
  /** Numeric target for the roll-up, or null for non-numeric values. */
  target: number | null
  /** Static text shown when target is null (e.g. "24/7", "B1"). */
  display?: string
  prefix?: string
  suffix?: string
}

const metrics: Metric[] = [
  { icon: BadgeCheck, target: yearsInService() },
  { icon: Clock, target: null, display: "24/7" },
  { icon: Truck, target: 100, suffix: "%" },
  { icon: ShieldCheck, target: null, display: "B1" },
]

function useCountUp(target: number | null, active: boolean, duration = 1400) {
  // SSR/HTML inicial: SIEMPRE el valor real (Google no debe indexar "0").
  // El roll-up 0→target corre solo en cliente, como mejora visual.
  const [value, setValue] = useState(target ?? 0)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (target === null || !active || reduce) return
    let raf = 0
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now
      const p = Math.min((now - start) / duration, 1)
      // easeOutQuart for a confident, decelerating count
      const eased = 1 - Math.pow(1 - p, 4)
      setValue(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, active, duration, reduce])
  return value
}

function MetricCell({ metric, active, index }: { metric: Metric; active: boolean; index: number }) {
  const t = useTranslations("Stats")
  const counted = useCountUp(metric.target, active)
  const Icon = metric.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={active ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col gap-3 bg-[oklch(0.16_0.012_255)] px-6 py-7 sm:px-8 sm:py-9 transition-colors hover:bg-[oklch(0.185_0.014_255)]"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
          {String(index + 1).padStart(2, "0")}
        </span>
        <Icon className="h-4 w-4 text-yellow-accent-bright/70" />
      </div>
      <div className="flex items-baseline gap-0.5 text-white">
        <span className="text-4xl sm:text-5xl font-bold tabular-nums tracking-tight">
          {metric.target === null ? metric.display : `${metric.prefix ?? ""}${counted}`}
        </span>
        {metric.suffix && (
          <span className="text-2xl sm:text-3xl font-bold text-yellow-accent-bright">{metric.suffix}</span>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-white/90">{t(`metrics.${index}.label`)}</p>
        <p className="font-mono text-[11px] text-white/60">{t(`metrics.${index}.caption`)}</p>
      </div>
    </motion.div>
  )
}

export function StatsSection() {
  const t = useTranslations("Stats")
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="relative -mt-24 sm:-mt-28 pb-20 z-20">
      <div className="container mx-auto px-4">
        <div
          ref={ref}
          className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/10 surface-steel"
        >
          {/* Console header bar */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-3.5 sm:px-8">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-yellow-accent-bright animate-live-blink" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
                {t("console")}
              </span>
            </div>
            <span className="hidden font-mono text-[11px] text-white/55 sm:inline">{t("consoleTag")}</span>
          </div>

          {/* Instrument cells, hairline-divided (no identical card grid) */}
          <div className="grid grid-cols-2 gap-px bg-white/10 md:grid-cols-4">
            {metrics.map((metric, i) => (
              <MetricCell key={i} metric={metric} active={inView} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
