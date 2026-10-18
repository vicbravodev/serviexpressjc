"use client"

import { useId, useRef, useState } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"
import { useLocale, useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react"
import { Link } from "@/i18n/navigation"
import type { ContentHref } from "@/i18n/routing"
import { Reveal } from "@/components/motion-primitives"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { STATES, CITIES } from "@/components/coverage-geo"
import { MX_CITIES, US_CITIES, cityById, routeDistanceKm, type City } from "@/lib/quote"

const EASE = [0.16, 1, 0.3, 1] as const

/* Recorte del Mercator generado: México y el centro/este de EE. UU., donde viven
   los corredores. Así las etiquetas se leen sin ampliar el mapa (Los Ángeles
   queda fuera del encuadre; el buscador igual responde por ella). */
const VIEW = { x: 200, y: 150, w: 500, h: 480 }

const INK = "oklch(0.45 0.15 264)" // Azul Ruta
const AMBER = "oklch(0.75 0.15 85)" // Ámbar Señal: solo la ruta que el visitante busca
const PAPER = "oklch(0.99 0 0)"

/* Proyección en tiempo de ejecución, calibrada con dos ciudades que el script
   ya proyectó (Monterrey y Chicago): ubica cualquier lat/lng del catálogo del
   cotizador sobre la misma geometría. */
const toRad = (deg: number) => (deg * Math.PI) / 180
const mercY = (lat: number) => Math.log(Math.tan(Math.PI / 4 + toRad(lat) / 2))
const MTY = cityById("mty")!
const CHI = cityById("chi")!
const K = (CITIES.chicago.x - CITIES.monterrey.x) / (toRad(CHI.lng) - toRad(MTY.lng))
function project(lat: number, lng: number) {
  return {
    x: CITIES.monterrey.x + K * (toRad(lng) - toRad(MTY.lng)),
    y: CITIES.monterrey.y - K * (mercY(lat) - mercY(MTY.lat)),
  }
}

type Stop = { lat: number; lng: number }
const at = (id: string): Stop => cityById(id)!
const polyline = (stops: Stop[]) =>
  stops
    .map((s, i) => {
      const p = project(s.lat, s.lng)
      return `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`
    })
    .join(" ")

/* Corredores trazados por las ciudades de paso reales de cada carretera
   (rutas de content/routes.ts; sus km viven en LANE_KM). El trazo es aproximado. */
const LANES: { cityId: string; href: ContentHref; d: string }[] = [
  { cityId: "lrd", href: "/rutas/monterrey-laredo", d: polyline([MTY, at("lrd")]) },
  {
    cityId: "hou",
    href: "/rutas/monterrey-houston",
    d: polyline([MTY, at("lrd"), { lat: 28.8053, lng: -97.0036 } /* Victoria, TX */, at("hou")]),
  },
  {
    cityId: "dal",
    href: "/rutas/monterrey-dallas",
    d: polyline([MTY, at("lrd"), at("sat"), { lat: 30.2672, lng: -97.7431 } /* Austin */, at("dal")]),
  },
  {
    cityId: "cdmx",
    href: "/rutas/monterrey-cdmx",
    d: polyline([MTY, at("sal"), { lat: 23.6496, lng: -100.6441 } /* Matehuala */, at("slp"), at("qro"), at("cdmx")]),
  },
]

const SEARCH_CITIES = [...MX_CITIES, ...US_CITIES]
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()

/** Acepta el nombre completo ("Guadalajara, Jal.") o solo la ciudad ("guadalajara"). */
function findCity(query: string): City | undefined {
  const q = normalize(query)
  if (!q) return undefined
  return SEARCH_CITIES.find((c) => {
    const full = normalize(c.name)
    return full === q || full.split(",")[0] === q
  })
}

/** El cotizador escucha este evento para precargar la ruta (ver quote-simulator.tsx). */
const prefillQuote = (cityId: string) => window.dispatchEvent(new CustomEvent("quote:prefill", { detail: cityId }))

/* Tamaños en unidades del viewBox: en móvil el SVG se reduce ~40% más, así que ahí van más grandes. */
const LABEL = "text-[17px] sm:text-[11px] [stroke-width:5px] sm:[stroke-width:3px]"

function MapLabel({ x, y, anchor = "start", weight = "font-medium", children }: {
  x: number
  y: number
  anchor?: "start" | "middle" | "end"
  weight?: string
  children: React.ReactNode
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} className={`fill-foreground ${weight} ${LABEL}`} stroke={PAPER} paintOrder="stroke">
      {children}
    </text>
  )
}

export function CoverageSection() {
  const t = useTranslations("Coverage")
  const locale = useLocale()
  const mapRef = useRef<HTMLDivElement>(null)
  const inView = useInView(mapRef, { once: true, amount: 0.25 })
  const reduce = useReducedMotion()
  const searchId = useId()
  const listId = useId()
  const [query, setQuery] = useState("")
  const [activeLane, setActiveLane] = useState<string | null>(null)

  const found = findCity(query)
  const searched = normalize(query).length >= 3
  const lane = found ? LANES.find((l) => l.cityId === found.id) : undefined
  // Misma fuente que el cotizador: km publicados en corredores, estimación en el resto.
  const km = found ? routeDistanceKm("mty", found.id) : null
  const kmText = km !== null ? km.toLocaleString(locale === "es" ? "es-MX" : "en-US") : ""
  const isHome = found?.id === "mty"
  const foundPath = found && !isHome ? polyline(found.country === "US" ? [MTY, at("lrd"), found] : [MTY, found]) : null
  const foundPoint = found && !isHome && !lane ? project(found.lat, found.lng) : null

  const hub = project(MTY.lat, MTY.lng)
  const laredo = project(at("lrd").lat, at("lrd").lng)

  return (
    <section id="cobertura" className="py-24">
      <div className="container mx-auto px-4">
        <Reveal className="mb-12 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">{t("title")}</h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">{t("subtitle")}</p>
        </Reveal>

        <div ref={mapRef} className="grid overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-5">
          {/* Mapa estilo atlas: tierra gris, límites estatales en blanco, corredores en azul de marca */}
          <div className="border-b border-border lg:col-span-3 lg:border-b-0 lg:border-r">
            <svg
              viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
              className="block h-auto w-full"
              role="img"
              aria-label={t("mapAria")}
            >
              {STATES.map((s) => (
                <path
                  key={s.id}
                  d={s.d}
                  fill={s.country === "mx" ? "oklch(0.92 0.008 240)" : "oklch(0.955 0.005 240)"}
                  stroke={PAPER}
                  strokeWidth={0.6}
                />
              ))}

              {LANES.map((l, i) => (
                <motion.path
                  key={l.cityId}
                  d={l.d}
                  fill="none"
                  stroke={INK}
                  strokeWidth={activeLane === l.cityId ? 3.5 : 2.5}
                  strokeOpacity={activeLane !== null && activeLane !== l.cityId ? 0.25 : 1}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={inView ? { pathLength: 1 } : undefined}
                  transition={{ delay: reduce ? 0 : 0.2 + i * 0.15, duration: 1.2, ease: EASE }}
                  style={{ transition: "stroke-width 200ms, stroke-opacity 200ms" }}
                />
              ))}

              {/* Ruta que busca el visitante: el único ámbar del mapa */}
              {foundPath && (
                <motion.path
                  key={found!.id}
                  d={foundPath}
                  fill="none"
                  stroke={AMBER}
                  strokeWidth={2.5}
                  strokeDasharray="6 5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: EASE }}
                />
              )}

              {/* Destinos de los corredores (Laredo lleva la etiqueta de cruce) */}
              {LANES.map((l, i) => {
                if (l.cityId === "lrd") return null
                const c = cityById(l.cityId)!
                const p = project(c.lat, c.lng)
                const right = l.cityId === "hou"
                return (
                  <g key={`n-${l.cityId}`}>
                    <circle cx={p.x} cy={p.y} r={3.5} fill={PAPER} stroke={INK} strokeWidth={2} />
                    <MapLabel
                      x={right ? p.x + 8 : p.x}
                      y={right ? p.y + 4 : l.cityId === "cdmx" ? p.y + 18 : p.y - 9}
                      anchor={right ? "start" : "middle"}
                    >
                      {t(`lanes.${i}.city`)}
                    </MapLabel>
                  </g>
                )
              })}

              <circle cx={laredo.x} cy={laredo.y} r={3.5} fill={PAPER} stroke={INK} strokeWidth={2} />
              <MapLabel x={laredo.x + 8} y={laredo.y + 2}>
                {t("crossingLabel")}
              </MapLabel>

              <circle cx={hub.x} cy={hub.y} r={5.5} fill={INK} stroke={PAPER} strokeWidth={2} />
              <MapLabel x={hub.x - 10} y={hub.y + 4} anchor="end" weight="font-bold">
                {t("hubLabel")}
              </MapLabel>

              {foundPoint && (
                <g>
                  <circle cx={foundPoint.x} cy={foundPoint.y} r={5} fill={AMBER} stroke={PAPER} strokeWidth={2} />
                  <MapLabel x={foundPoint.x} y={foundPoint.y - 10} anchor="middle" weight="font-semibold">
                    {found!.name.split(",")[0]}
                  </MapLabel>
                </g>
              )}
            </svg>
          </div>

          {/* Buscador + corredores */}
          <div className="flex flex-col gap-8 p-6 sm:p-8 lg:col-span-2">
            <div>
              <Label htmlFor={searchId} className="text-base font-semibold">
                {t("searchLabel")}
              </Label>
              <Input
                id={searchId}
                list={listId}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                autoComplete="off"
                className="mt-2 h-11"
              />
              <datalist id={listId}>
                {SEARCH_CITIES.map((c) => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>

              <div aria-live="polite">
                {found && (
                  <div className="mt-4 space-y-3">
                    <p className="leading-relaxed">
                      {isHome ? t("resultBase") : t("resultYes", { city: found.name.split(",")[0], km: kmText })}
                      {found.country === "US" && <> {t("resultCrossing")}</>}
                    </p>
                    {!isHome && (
                      <Button asChild className="bg-secondary hover:bg-secondary/90">
                        <a href="#cotizacion" onClick={() => prefillQuote(found.id)}>
                          {t("quoteThis")}
                          <ArrowRight aria-hidden className="ml-2" size={16} />
                        </a>
                      </Button>
                    )}
                  </div>
                )}
                {!found && searched && (
                  <div className="mt-4 space-y-3">
                    <p className="leading-relaxed text-muted-foreground">{t("resultOther")}</p>
                    <Button asChild variant="outline">
                      <a href="#cotizacion">{t("quoteAny")}</a>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold">{t("lanesTitle")}</h3>
              <ul className="mt-3 divide-y divide-border border-y border-border">
                {LANES.map((l, i) => (
                  <li key={l.cityId}>
                    <Link
                      href={l.href}
                      onMouseEnter={() => setActiveLane(l.cityId)}
                      onMouseLeave={() => setActiveLane(null)}
                      onFocus={() => setActiveLane(l.cityId)}
                      onBlur={() => setActiveLane(null)}
                      className="group flex items-center justify-between gap-4 py-3.5"
                    >
                      <span className="text-sm text-muted-foreground">
                        <span className="block text-base font-medium text-foreground group-hover:text-primary">
                          {t(`lanes.${i}.name`)}
                        </span>
                        <span className="block">
                          {t(`lanes.${i}.road`)} · {t(`lanes.${i}.distance`)}
                        </span>
                        <span className="block">{t(`lanes.${i}.time`)}</span>
                      </span>
                      <ArrowRight
                        aria-hidden
                        size={16}
                        className="shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">{t("approxNote")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
