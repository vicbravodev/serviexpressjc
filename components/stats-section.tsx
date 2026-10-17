"use client"

import { Clock, Truck, ShieldCheck, BadgeCheck } from "lucide-react"
import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"
import { useTranslations } from "next-intl"
import { useCountUp } from "@/lib/use-count-up"

type Metric = {
  icon: typeof Clock
  /** Numeric target for the roll-up, or null for non-numeric values. */
  target: number | null
  /** Static text shown when target is null (e.g. "24/7", "B1"). */
  display?: string
  prefix?: string
  suffix?: string
}

const metricsFor = (years: number): Metric[] => [
  { icon: BadgeCheck, target: years },
  { icon: Clock, target: null, display: "24/7" },
  { icon: Truck, target: 100, suffix: "%" },
  { icon: ShieldCheck, target: null, display: "B1" },
]

function MetricCell({ metric, active, index }: { metric: Metric; active: boolean; index: number }) {
  const t = useTranslations("Stats")
  const counted = useCountUp(metric.target, active)
  const reduce = useReducedMotion()
  const Icon = metric.icon
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={active ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col gap-3 bg-[oklch(0.16_0.012_255)] px-6 py-7 sm:px-8 sm:py-9 transition-colors hover:bg-[oklch(0.185_0.014_255)]"
    >
      <Icon aria-hidden className="h-5 w-5 text-yellow-accent-bright/70" />
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
        <p className="text-xs text-white/60">{t(`metrics.${index}.caption`)}</p>
      </div>
    </motion.div>
  )
}

/** `years` llega del servidor: calcularlo aquí con `new Date()` desfasa la hidratación al cambiar de año. */
export function StatsSection({ years }: { years: number }) {
  const t = useTranslations("Stats")
  const metrics = metricsFor(years)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="relative -mt-24 sm:-mt-28 pb-20 z-20">
      <div className="container mx-auto px-4">
        <div
          ref={ref}
          className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/10 surface-steel"
        >
          {/* Celdas divididas por hairlines (no grid de cards idénticas) */}
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
