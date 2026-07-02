export type ServiceType = "nacional" | "internacional"
export type UnitType = "dryvan" | "flatbed" | "oversize"

export type City = {
  id: string
  name: string
  lat: number
  lng: number
  country: "MX" | "US"
}

export const MX_CITIES: City[] = [
  { id: "mty", name: "Monterrey", lat: 25.6866, lng: -100.3161, country: "MX" },
  { id: "sal", name: "Saltillo", lat: 25.4383, lng: -100.9737, country: "MX" },
  { id: "trc", name: "Torreón", lat: 25.5428, lng: -103.4068, country: "MX" },
  { id: "cuu", name: "Chihuahua", lat: 28.6353, lng: -106.0889, country: "MX" },
  { id: "slp", name: "San Luis Potosí", lat: 22.1565, lng: -100.9855, country: "MX" },
  { id: "qro", name: "Querétaro", lat: 20.5888, lng: -100.3899, country: "MX" },
  { id: "leo", name: "León", lat: 21.1219, lng: -101.6833, country: "MX" },
  { id: "gdl", name: "Guadalajara", lat: 20.6597, lng: -103.3496, country: "MX" },
  { id: "cdmx", name: "CDMX", lat: 19.4326, lng: -99.1332, country: "MX" },
]

export const US_CITIES: City[] = [
  { id: "lrd", name: "Laredo, TX", lat: 27.5306, lng: -99.4803, country: "US" },
  { id: "sat", name: "San Antonio, TX", lat: 29.4241, lng: -98.4936, country: "US" },
  { id: "hou", name: "Houston, TX", lat: 29.7604, lng: -95.3698, country: "US" },
  { id: "dal", name: "Dallas, TX", lat: 32.7767, lng: -96.797, country: "US" },
  { id: "kc", name: "Kansas City, MO", lat: 39.0997, lng: -94.5786, country: "US" },
  { id: "chi", name: "Chicago, IL", lat: 41.8781, lng: -87.6298, country: "US" },
  { id: "det", name: "Detroit, MI", lat: 42.3314, lng: -83.0458, country: "US" },
  { id: "atl", name: "Atlanta, GA", lat: 33.749, lng: -84.388, country: "US" },
  { id: "lax", name: "Los Ángeles, CA", lat: 34.0522, lng: -118.2437, country: "US" },
]

const ALL_CITIES = [...MX_CITIES, ...US_CITIES]

export const cityById = (id: string) => ALL_CITIES.find((c) => c.id === id)

/**
 * Tarifas ORIENTATIVAS para el estimado autoservicio del sitio.
 * Ajustar con las tarifas reales del negocio; el precio final siempre
 * lo afina un agente (báscula, maniobras, seguro, disponibilidad).
 */
export const RATE_CONFIG = {
  /** Distancia por carretera ≈ línea recta × este factor. */
  roadFactor: 1.3,
  mxn: {
    base: 3500,
    perKm: { dryvan: 32, flatbed: 36, oversize: 55 } as Record<UnitType, number>,
  },
  usd: {
    base: 350,
    perKm: { dryvan: 2.1, flatbed: 2.35, oversize: 3.6 } as Record<UnitType, number>,
    /** Cuota fija de cruce fronterizo (documentación, transbordo, espera). */
    borderFee: 450,
  },
  /** El rango mostrado es el punto medio ± este porcentaje. */
  spread: 0.12,
} as const

const weightFactor = (tons: number) => (tons <= 15 ? 1 : tons <= 25 ? 1.08 : 1.18)

const toRad = (deg: number) => (deg * Math.PI) / 180

export function haversineKm(a: City, b: City) {
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export type QuoteEstimate = {
  min: number
  max: number
  currency: "MXN" | "USD"
  distanceKm: number
}

export function estimateQuote(input: {
  service: ServiceType
  originId: string
  destinationId: string
  unit: UnitType
  tons: number
}): QuoteEstimate | null {
  const origin = cityById(input.originId)
  const destination = cityById(input.destinationId)
  if (!origin || !destination || origin.id === destination.id) return null

  const distanceKm = Math.round(haversineKm(origin, destination) * RATE_CONFIG.roadFactor)
  const factor = weightFactor(input.tons)

  if (input.service === "internacional") {
    const { base, perKm, borderFee } = RATE_CONFIG.usd
    const mid = base + distanceKm * perKm[input.unit] * factor + borderFee
    return {
      min: Math.round((mid * (1 - RATE_CONFIG.spread)) / 10) * 10,
      max: Math.round((mid * (1 + RATE_CONFIG.spread)) / 10) * 10,
      currency: "USD",
      distanceKm,
    }
  }

  const { base, perKm } = RATE_CONFIG.mxn
  const mid = base + distanceKm * perKm[input.unit] * factor
  return {
    min: Math.round((mid * (1 - RATE_CONFIG.spread)) / 100) * 100,
    max: Math.round((mid * (1 + RATE_CONFIG.spread)) / 100) * 100,
    currency: "MXN",
    distanceKm,
  }
}
