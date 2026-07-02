"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"
import { useTranslations } from "next-intl"
import { Reveal } from "@/components/motion-primitives"
import { MAP_VIEWBOX, STATES, CITIES } from "@/components/coverage-geo"

const EASE = [0.16, 1, 0.3, 1] as const
const AMBER = "oklch(0.85 0.18 90)"
const BLUE = "oklch(0.62 0.13 264)"

/* Quadratic curve between two projected points, bowed perpendicular to the chord. */
function curve(ax: number, ay: number, bx: number, by: number, bow: number) {
  const mx = (ax + bx) / 2
  const my = (ay + by) / 2
  const dx = bx - ax
  const dy = by - ay
  const len = Math.hypot(dx, dy) || 1
  const nx = -dy / len
  const ny = dx / len
  return `M${ax},${ay} Q${(mx + nx * bow).toFixed(1)},${(my + ny * bow).toFixed(1)} ${bx},${by}`
}

const C = CITIES
type Corridor = { d: string; kind: "main" | "intl" | "dom"; delay: number }

/* Corridors radiating from the Monterrey hub across both countries. */
const CORRIDORS: Corridor[] = [
  { d: curve(C.monterrey.x, C.monterrey.y, C.laredo.x, C.laredo.y, -14), kind: "main", delay: 0.2 },
  { d: curve(C.laredo.x, C.laredo.y, C.houston.x, C.houston.y, -22), kind: "main", delay: 0.5 },
  { d: curve(C.houston.x, C.houston.y, C.atlanta.x, C.atlanta.y, -34), kind: "intl", delay: 0.8 },
  { d: curve(C.atlanta.x, C.atlanta.y, C.miami.x, C.miami.y, -30), kind: "intl", delay: 1.0 },
  { d: curve(C.monterrey.x, C.monterrey.y, C.dallas.x, C.dallas.y, 46), kind: "intl", delay: 0.6 },
  { d: curve(C.dallas.x, C.dallas.y, C.kansascity.x, C.kansascity.y, -28), kind: "intl", delay: 0.9 },
  { d: curve(C.kansascity.x, C.kansascity.y, C.chicago.x, C.chicago.y, -20), kind: "intl", delay: 1.1 },
  { d: curve(C.monterrey.x, C.monterrey.y, C.losangeles.x, C.losangeles.y, -70), kind: "intl", delay: 0.7 },
  { d: curve(C.monterrey.x, C.monterrey.y, C.chihuahua.x, C.chihuahua.y, 26), kind: "dom", delay: 0.5 },
  { d: curve(C.monterrey.x, C.monterrey.y, C.guadalajara.x, C.guadalajara.y, 34), kind: "dom", delay: 0.7 },
  { d: curve(C.monterrey.x, C.monterrey.y, C.cdmx.x, C.cdmx.y, 26), kind: "dom", delay: 0.9 },
  { d: curve(C.cdmx.x, C.cdmx.y, C.merida.x, C.merida.y, -26), kind: "dom", delay: 1.1 },
]

/* Traveling dispatch unit rides the MTY -> Laredo -> Houston spine. */
const CONVOY_D = `M${C.monterrey.x},${C.monterrey.y} Q${((C.monterrey.x + C.laredo.x) / 2 + 14).toFixed(1)},${((C.monterrey.y + C.laredo.y) / 2).toFixed(1)} ${C.laredo.x},${C.laredo.y} Q${((C.laredo.x + C.houston.x) / 2 + 22).toFixed(1)},${((C.laredo.y + C.houston.y) / 2).toFixed(1)} ${C.houston.x},${C.houston.y}`

type Labeled = { key: keyof typeof C; place: "above" | "below" | "left" | "right" }
const LABELS: Labeled[] = [
  { key: "monterrey", place: "left" },
  { key: "laredo", place: "above" },
  { key: "houston", place: "below" },
  { key: "dallas", place: "above" },
  { key: "chicago", place: "above" },
  { key: "atlanta", place: "right" },
  { key: "miami", place: "below" },
  { key: "losangeles", place: "left" },
  { key: "guadalajara", place: "left" },
  { key: "cdmx", place: "below" },
  { key: "merida", place: "right" },
]

function labelPos(x: number, y: number, place: Labeled["place"]) {
  switch (place) {
    case "above":
      return { x, y: y - 10, anchor: "middle" as const }
    case "below":
      return { x, y: y + 16, anchor: "middle" as const }
    case "left":
      return { x: x - 9, y: y + 3, anchor: "end" as const }
    default:
      return { x: x + 9, y: y + 3, anchor: "start" as const }
  }
}

export function CoverageSection() {
  const t = useTranslations("Coverage")
  const mapRef = useRef<HTMLDivElement>(null)
  const inView = useInView(mapRef, { once: true, amount: 0.25 })
  const reduce = useReducedMotion()

  const mxStates = STATES.filter((s) => s.country === "mx").sort((a, b) => a.name.localeCompare(b.name))
  const usStates = STATES.filter((s) => s.country === "us" && s.name !== "District of Columbia").sort((a, b) =>
    a.name.localeCompare(b.name),
  )

  const corridorStroke = (k: Corridor["kind"]) => (k === "main" ? AMBER : BLUE)

  return (
    <section id="cobertura" className="py-24">
      <div className="container mx-auto px-4">
        <Reveal className="mb-12 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">{t("kicker")}</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-balance">{t("title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">{t("subtitle")}</p>
        </Reveal>

        <div className="grid items-start gap-8 lg:grid-cols-5">
          {/* Geographic coverage map */}
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
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/70">{t("console")}</span>
              </div>
              <span className="hidden font-mono text-[11px] text-white/60 sm:inline">{t("consoleTag")}</span>
            </div>

            <div className="relative bg-blueprint">
              <svg
                viewBox={`0 0 ${MAP_VIEWBOX.w} ${MAP_VIEWBOX.h}`}
                className="block h-auto w-full"
                role="img"
                aria-label={t("mapAria")}
              >
                {/* State shapes: sweep-lit fills */}
                <g>
                  {STATES.map((s, i) => {
                    const isMx = s.country === "mx"
                    return (
                      <motion.path
                        key={s.id}
                        d={s.d}
                        className="coverage-state"
                        fill={isMx ? "oklch(0.72 0.14 90 / 0.10)" : "oklch(0.62 0.13 264 / 0.08)"}
                        stroke={isMx ? "oklch(0.85 0.18 90 / 0.28)" : "oklch(0.7 0.13 264 / 0.24)"}
                        strokeWidth={0.6}
                        initial={reduce ? false : { opacity: 0 }}
                        animate={inView ? { opacity: 1 } : undefined}
                        transition={{ delay: Math.min(i * 0.012, 1), duration: 0.5, ease: EASE }}
                      />
                    )
                  })}
                </g>

                {/* Corridors */}
                {CORRIDORS.map((c, i) => (
                  <motion.path
                    key={`c-${i}`}
                    d={c.d}
                    fill="none"
                    stroke={corridorStroke(c.kind)}
                    strokeWidth={c.kind === "main" ? 3 : 1.8}
                    strokeOpacity={c.kind === "dom" ? 0.6 : c.kind === "intl" ? 0.7 : 1}
                    strokeLinecap="round"
                    style={c.kind === "main" ? { filter: `drop-shadow(0 0 5px oklch(0.85 0.18 90 / 0.5))` } : undefined}
                    initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
                    animate={inView ? { pathLength: 1 } : undefined}
                    transition={{ delay: reduce ? 0 : c.delay, duration: 1.4, ease: EASE }}
                  />
                ))}

                {/* Traveling dispatch unit on the main spine */}
                {!reduce && (
                  <g className="animate-convoy" style={{ offsetPath: `path('${CONVOY_D}')` }}>
                    <circle r={9} fill={AMBER} opacity={0.25} />
                    <circle r={4} fill="oklch(0.9 0.18 92)" />
                  </g>
                )}

                {/* City nodes */}
                {Object.values(C).map((city, ci) => {
                  const isHub = city.key === "monterrey"
                  const labeled = LABELS.find((l) => l.key === city.key)
                  const color = isHub ? AMBER : "oklch(0.72 0.13 264)"
                  return (
                    <g key={city.key}>
                      {isHub && !reduce && (
                        <circle cx={city.x} cy={city.y} r={6} fill="none" stroke={AMBER} strokeWidth={1.5} opacity={0.6}>
                          <animate attributeName="r" values="6;18;6" dur="2.6s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.6;0;0.6" dur="2.6s" repeatCount="indefinite" />
                        </circle>
                      )}
                      <motion.circle
                        cx={city.x}
                        cy={city.y}
                        r={isHub ? 5.5 : 3.5}
                        fill={color}
                        stroke="oklch(0.16 0.012 255)"
                        strokeWidth={1.5}
                        initial={reduce ? false : { scale: 0, opacity: 0 }}
                        animate={inView ? { scale: 1, opacity: 1 } : undefined}
                        transition={{ delay: reduce ? 0 : 1 + ci * 0.05, duration: 0.4, ease: EASE }}
                        style={{ transformOrigin: `${city.x}px ${city.y}px` }}
                      />
                      {labeled && (
                        <motion.text
                          {...(() => {
                            const p = labelPos(city.x, city.y, labeled.place)
                            return { x: p.x, y: p.y, textAnchor: p.anchor }
                          })()}
                          className={isHub ? "fill-yellow-accent-bright font-mono" : "fill-white/70 font-mono"}
                          fontSize="10.5"
                          letterSpacing="0.5"
                          initial={reduce ? false : { opacity: 0 }}
                          animate={inView ? { opacity: 1 } : undefined}
                          transition={{ delay: reduce ? 0 : 1.2, duration: 0.5 }}
                        >
                          {isHub ? t("hubLabel") : city.name}
                        </motion.text>
                      )}
                    </g>
                  )
                })}
              </svg>

              {/* Legend + crossing chip */}
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-white/70">
                <span className="flex items-center gap-3 rounded-md border border-white/15 bg-black/40 px-3 py-1.5 backdrop-blur-sm">
                  <span className="flex items-center gap-1.5">
                    <span className="h-0.5 w-4 rounded-full" style={{ background: AMBER }} /> {t("legendCorridor")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-[3px]" style={{ background: "oklch(0.62 0.13 264 / 0.5)" }} />{" "}
                    {t("legendState")}
                  </span>
                </span>
                <span className="rounded-md border border-white/15 bg-black/40 px-3 py-1.5 backdrop-blur-sm">
                  {t("crossingChip")}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Coverage directory */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Reveal className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
              <Stat value="32" label={t("mxCount")} accent="text-primary" />
              <Stat value="48" label={t("usCount")} accent="text-secondary" />
            </Reveal>

            <StatesPanel title={t("mxTitle")} count={mxStates.length} names={mxStates.map((s) => s.name)} accent="text-primary" />
            <StatesPanel title={t("usTitle")} count={usStates.length} names={usStates.map((s) => s.name)} accent="text-secondary" />

            <Reveal className="rounded-2xl border border-yellow-accent/30 bg-yellow-accent/[0.06] p-5">
              <p className="text-sm leading-relaxed text-foreground/90">{t("reachNote")}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ value, label, accent }: { value: string; label: string; accent: string }) {
  return (
    <div className="bg-card p-5">
      <p className={`font-mono text-3xl font-bold ${accent}`}>{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  )
}

function StatesPanel({ title, count, names, accent }: { title: string; count: number; names: string[]; accent: string }) {
  const t = useTranslations("Coverage")
  return (
    <Reveal className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className={`text-lg font-bold ${accent}`}>{title}</h3>
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {t("statesReached", { count })}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {names.map((n) => (
          <span
            key={n}
            className="rounded-md border border-border bg-muted/40 px-2 py-1 font-mono text-[10.5px] leading-none text-muted-foreground"
          >
            {n}
          </span>
        ))}
      </div>
    </Reveal>
  )
}
