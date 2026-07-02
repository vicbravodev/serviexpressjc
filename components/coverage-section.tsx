"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"
import { useTranslations } from "next-intl"
import { Reveal } from "@/components/motion-primitives"

const EASE = [0.16, 1, 0.3, 1] as const

// Main cross-border corridor: Monterrey → Nuevo Laredo → Laredo → Houston
const MAIN_ROUTE =
  "M330,350 C 380,322 405,308 430,300 C 452,293 462,275 470,265 C 482,250 505,243 520,240 C 565,233 600,250 620,270"
const BORDER =
  "M120,250 C 250,268 360,288 430,300 C 510,313 565,345 615,398"
const FEEDERS = [
  "M150,470 C 230,432 280,392 330,350", // Guadalajara → MTY
  "M355,548 C 345,470 337,410 330,350", // CDMX → MTY
]
const US_BRANCHES = [
  "M620,270 C 672,248 712,205 748,175", // Houston → Atlanta
  "M520,240 C 535,210 548,190 560,170", // San Antonio → Dallas
  "M560,170 C 600,135 640,105 666,82", //  Dallas → Chicago
]

type Node = { x: number; y: number; label?: string; place?: "below" | "above" | "right" | "left"; kind: "origin" | "border" | "us" | "mx" }
const NODES: Node[] = [
  { x: 330, y: 350, label: "MONTERREY", place: "left", kind: "origin" },
  { x: 430, y: 300, label: "NUEVO LAREDO", place: "below", kind: "border" },
  { x: 470, y: 265, kind: "us" },
  { x: 520, y: 240, label: "SAN ANTONIO", place: "above", kind: "us" },
  { x: 620, y: 270, label: "HOUSTON", place: "right", kind: "us" },
  { x: 560, y: 170, label: "DALLAS", place: "above", kind: "us" },
  { x: 748, y: 175, label: "ATLANTA", place: "right", kind: "us" },
  { x: 666, y: 82, label: "CHICAGO", place: "above", kind: "us" },
  { x: 150, y: 470, label: "GUADALAJARA", place: "below", kind: "mx" },
  { x: 355, y: 548, label: "CDMX", place: "below", kind: "mx" },
]

const labelOffset = (n: Node) => {
  switch (n.place) {
    case "above":
      return { x: n.x, y: n.y - 14, anchor: "middle" as const }
    case "below":
      return { x: n.x, y: n.y + 24, anchor: "middle" as const }
    case "left":
      return { x: n.x - 14, y: n.y + 4, anchor: "end" as const }
    default:
      return { x: n.x + 14, y: n.y + 4, anchor: "start" as const }
  }
}

const mxCities = {
  norte: ["Monterrey", "Saltillo", "Chihuahua", "Nuevo Laredo"],
  bajio: ["Querétaro", "Guanajuato", "Aguascalientes", "San Luis Potosí"],
  pacifico: ["Baja California", "Sonora", "Sinaloa"],
  occidente: ["Guadalajara", "Michoacán", "Colima"],
}
const usCities = {
  texas: ["Laredo", "Houston", "Dallas", "San Antonio"],
  midwest: ["Chicago", "Detroit", "Indianapolis", "Kansas City"],
  southeast: ["Atlanta", "Miami", "Nashville", "Orlando"],
  west: ["Los Angeles", "Phoenix", "San Diego", "Seattle"],
}

export function CoverageSection() {
  const t = useTranslations("Coverage")
  const mapRef = useRef<HTMLDivElement>(null)
  const inView = useInView(mapRef, { once: true, amount: 0.3 })
  const reduce = useReducedMotion()

  const draw = (delay: number, duration: number) =>
    reduce
      ? { initial: false as const, animate: { pathLength: 1 } }
      : {
          initial: { pathLength: 0 },
          animate: inView ? { pathLength: 1 } : { pathLength: 0 },
          transition: { duration, delay, ease: EASE },
        }

  return (
    <section id="cobertura" className="py-24">
      <div className="container mx-auto px-4">
        <Reveal className="mb-12 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
            {t("kicker")}
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-balance">{t("title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">
            {t("subtitle")}
          </p>
        </Reveal>

        <div className="grid items-start gap-8 lg:grid-cols-5">
          {/* Animated corridor map */}
          <motion.div
            ref={mapRef}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative overflow-hidden rounded-2xl border border-white/10 surface-steel shadow-2xl shadow-black/40 lg:col-span-3"
          >
            {/* Console header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 sm:px-6">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-yellow-accent-bright animate-live-blink" />
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/70">
                  {t("console")}
                </span>
              </div>
              <span className="hidden font-mono text-[11px] text-white/60 sm:inline">{t("consoleTag")}</span>
            </div>

            <div className="relative bg-blueprint">
              <svg viewBox="0 0 820 600" className="block h-auto w-full" role="img" aria-label={t("mapAria")}>
                {/* Border line */}
                <motion.path
                  d={BORDER}
                  fill="none"
                  stroke="white"
                  strokeOpacity={0.22}
                  strokeWidth={1.5}
                  strokeDasharray="2 7"
                  {...draw(0.1, 1.6)}
                />
                <text x="120" y="238" className="fill-white/55 font-mono" fontSize="11" letterSpacing="2">
                  {t("borderLabel")}
                </text>

                {/* Feeder routes (domestic) */}
                {FEEDERS.map((d, i) => (
                  <motion.path
                    key={`f-${i}`}
                    d={d}
                    fill="none"
                    stroke="oklch(0.62 0.13 264)"
                    strokeOpacity={0.65}
                    strokeWidth={2}
                    strokeLinecap="round"
                    {...draw(0.3 + i * 0.15, 1.2)}
                  />
                ))}

                {/* US branch routes */}
                {US_BRANCHES.map((d, i) => (
                  <motion.path
                    key={`b-${i}`}
                    d={d}
                    fill="none"
                    stroke="oklch(0.62 0.13 264)"
                    strokeOpacity={0.6}
                    strokeWidth={2}
                    strokeLinecap="round"
                    {...draw(0.5 + i * 0.15, 1.1)}
                  />
                ))}

                {/* Main corridor: amber, glowing */}
                <motion.path
                  d={MAIN_ROUTE}
                  fill="none"
                  stroke="oklch(0.85 0.18 90)"
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 0 6px oklch(0.85 0.18 90 / 0.5))" }}
                  {...draw(0.45, 1.9)}
                />

                {/* Traveling dispatch unit */}
                {!reduce && (
                  <g className="animate-convoy" style={{ offsetPath: `path('${MAIN_ROUTE}')` }}>
                    <circle r={11} fill="oklch(0.85 0.18 90)" opacity={0.25} />
                    <circle r={4.5} fill="oklch(0.9 0.18 92)" />
                  </g>
                )}

                {/* Nodes */}
                {NODES.map((n, i) => {
                  const lo = labelOffset(n)
                  const amber = n.kind === "origin" || n.kind === "border"
                  const color = amber ? "oklch(0.85 0.18 90)" : "oklch(0.66 0.13 264)"
                  return (
                    <g key={`n-${i}`}>
                      {amber && !reduce && (
                        <circle cx={n.x} cy={n.y} r={6} fill="none" stroke={color} strokeWidth={1.5} opacity={0.6}>
                          <animate attributeName="r" values="6;15;6" dur="2.6s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.6;0;0.6" dur="2.6s" repeatCount="indefinite" />
                        </circle>
                      )}
                      <motion.circle
                        cx={n.x}
                        cy={n.y}
                        r={n.kind === "origin" ? 6 : 4.5}
                        fill={color}
                        stroke="oklch(0.16 0.012 255)"
                        strokeWidth={2}
                        initial={reduce ? false : { scale: 0, opacity: 0 }}
                        animate={inView ? { scale: 1, opacity: 1 } : undefined}
                        transition={{ delay: 0.6 + i * 0.06, duration: 0.4, ease: EASE }}
                        style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                      />
                      {n.label && (
                        <motion.text
                          x={lo.x}
                          y={lo.y}
                          textAnchor={lo.anchor}
                          className={amber ? "fill-yellow-accent-bright font-mono" : "fill-white/65 font-mono"}
                          fontSize="11"
                          letterSpacing="1"
                          initial={reduce ? false : { opacity: 0 }}
                          animate={inView ? { opacity: 1 } : undefined}
                          transition={{ delay: 0.8 + i * 0.06, duration: 0.5 }}
                        >
                          {n.label}
                        </motion.text>
                      )}
                    </g>
                  )
                })}
              </svg>

              {/* Live telemetry readout overlaid on the map */}
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-white/70">
                <span className="rounded-md border border-white/15 bg-black/40 px-3 py-1.5 backdrop-blur-sm">
                  <span className="text-yellow-accent-bright">●</span> {t("telemetry")}
                </span>
                <span className="rounded-md border border-white/15 bg-black/40 px-3 py-1.5 backdrop-blur-sm">
                  {t("crossingChip")}
                </span>
              </div>
            </div>
          </motion.div>

          {/* City directories */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <CityPanel title={t("mxTitle")} cities={mxCities} zonePrefix="mxZones" accent="text-primary" />
            <CityPanel title={t("usTitle")} cities={usCities} zonePrefix="usZones" accent="text-secondary" />
          </div>
        </div>
      </div>
    </section>
  )
}

function CityPanel({
  title,
  cities,
  zonePrefix,
  accent,
}: {
  title: string
  cities: Record<string, string[]>
  zonePrefix: "mxZones" | "usZones"
  accent: string
}) {
  const t = useTranslations("Coverage")
  return (
    <Reveal className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-5 flex items-baseline justify-between">
        <h3 className={`text-xl font-bold ${accent}`}>{title}</h3>
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {t("citiesCount", { count: Object.values(cities).flat().length })}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-5 text-sm">
        {Object.entries(cities).map(([zone, list]) => (
          <div key={zone}>
            <p className="mb-2 flex items-center gap-1.5 font-semibold">
              <span className="h-1 w-1 rounded-full bg-yellow-accent" />
              {t(`${zonePrefix}.${zone}`)}
            </p>
            <ul className="space-y-1 text-muted-foreground">
              {list.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Reveal>
  )
}
