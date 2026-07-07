export type ServiceType = "nacional" | "internacional"
export type UnitType = "dryvan" | "flatbed" | "oversize"

export type City = {
  id: string
  name: string
  lat: number
  lng: number
  country: "MX" | "US"
}

/**
 * Cobertura nacional: las 32 entidades federativas de México, representadas
 * por su capital (o ciudad principal de intercambio). Ordenadas por estado.
 */
export const MX_CITIES: City[] = [
  { id: "ags", name: "Aguascalientes, Ags.", lat: 21.8853, lng: -102.2916, country: "MX" },
  { id: "mxli", name: "Mexicali, BC", lat: 32.6245, lng: -115.4523, country: "MX" },
  { id: "lpz", name: "La Paz, BCS", lat: 24.1426, lng: -110.3128, country: "MX" },
  { id: "cam", name: "Campeche, Camp.", lat: 19.8301, lng: -90.5349, country: "MX" },
  { id: "tux", name: "Tuxtla Gutiérrez, Chis.", lat: 16.7516, lng: -93.1029, country: "MX" },
  { id: "cuu", name: "Chihuahua, Chih.", lat: 28.6353, lng: -106.0889, country: "MX" },
  { id: "sal", name: "Saltillo, Coah.", lat: 25.4383, lng: -100.9737, country: "MX" },
  { id: "col", name: "Colima, Col.", lat: 19.2452, lng: -103.725, country: "MX" },
  { id: "dgo", name: "Durango, Dgo.", lat: 24.0277, lng: -104.6532, country: "MX" },
  { id: "leo", name: "León, Gto.", lat: 21.1219, lng: -101.6833, country: "MX" },
  { id: "chp", name: "Chilpancingo, Gro.", lat: 17.5514, lng: -99.5006, country: "MX" },
  { id: "pac", name: "Pachuca, Hgo.", lat: 20.1011, lng: -98.7591, country: "MX" },
  { id: "gdl", name: "Guadalajara, Jal.", lat: 20.6597, lng: -103.3496, country: "MX" },
  { id: "tol", name: "Toluca, Méx.", lat: 19.2826, lng: -99.6557, country: "MX" },
  { id: "mor", name: "Morelia, Mich.", lat: 19.7008, lng: -101.1844, country: "MX" },
  { id: "cvc", name: "Cuernavaca, Mor.", lat: 18.9242, lng: -99.2216, country: "MX" },
  { id: "tep", name: "Tepic, Nay.", lat: 21.5041, lng: -104.8942, country: "MX" },
  { id: "mty", name: "Monterrey, NL", lat: 25.6866, lng: -100.3161, country: "MX" },
  { id: "oax", name: "Oaxaca, Oax.", lat: 17.0732, lng: -96.7266, country: "MX" },
  { id: "pue", name: "Puebla, Pue.", lat: 19.0414, lng: -98.2063, country: "MX" },
  { id: "qro", name: "Querétaro, Qro.", lat: 20.5888, lng: -100.3899, country: "MX" },
  { id: "che", name: "Chetumal, Q. Roo", lat: 18.5002, lng: -88.2961, country: "MX" },
  { id: "slp", name: "San Luis Potosí, SLP", lat: 22.1565, lng: -100.9855, country: "MX" },
  { id: "cul", name: "Culiacán, Sin.", lat: 24.8091, lng: -107.394, country: "MX" },
  { id: "her", name: "Hermosillo, Son.", lat: 29.0729, lng: -110.9559, country: "MX" },
  { id: "vil", name: "Villahermosa, Tab.", lat: 17.9895, lng: -92.9475, country: "MX" },
  { id: "cvi", name: "Ciudad Victoria, Tamps.", lat: 23.7369, lng: -99.1411, country: "MX" },
  { id: "tlx", name: "Tlaxcala, Tlax.", lat: 19.3139, lng: -98.2404, country: "MX" },
  { id: "xal", name: "Xalapa, Ver.", lat: 19.5438, lng: -96.9102, country: "MX" },
  { id: "mer", name: "Mérida, Yuc.", lat: 20.9674, lng: -89.5926, country: "MX" },
  { id: "zac", name: "Zacatecas, Zac.", lat: 22.7709, lng: -102.5832, country: "MX" },
  { id: "cdmx", name: "Ciudad de México", lat: 19.4326, lng: -99.1332, country: "MX" },
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

/** Distancia por carretera ≈ línea recta × este factor. */
const ROAD_FACTOR = 1.3

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

/**
 * Distancia aproximada por carretera entre dos ciudades del catálogo.
 * Es solo informativa para el recopilado; no calcula ni sugiere precios.
 */
export function routeDistanceKm(originId: string, destinationId: string): number | null {
  const origin = cityById(originId)
  const destination = cityById(destinationId)
  if (!origin || !destination || origin.id === destination.id) return null
  return Math.round(haversineKm(origin, destination) * ROAD_FACTOR)
}
