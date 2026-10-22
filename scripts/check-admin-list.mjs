// Chequeo rápido de los parámetros de lista del panel: node scripts/check-admin-list.mjs
import assert from "node:assert/strict"
import { applyListFilters, clearFilters, hasFilters, listHref, pageRange, parseListParams, presetRange, todayMty } from "../lib/admin/list.ts"

const opts = { sorts: ["created_at", "name"], statuses: ["new", "won"] }
const p = parseListParams({ page: "3", pageSize: "50", sort: "drop table", status: "nope", asignado: "x", q: "  garza " }, opts)
assert.deepEqual(p, { page: 3, pageSize: 50, sort: "created_at", dir: "desc", status: "todos", q: "garza", asignado: "todos", desde: "", hasta: "", f: {} })
assert.equal(parseListParams({ pageSize: "7", page: "-2" }, opts).pageSize, 25)
assert.equal(parseListParams({ page: "-2" }, opts).page, 1)
assert.deepEqual(pageRange({ page: 3, pageSize: 25 }), [50, 74])
assert.equal(listHref("/admin/leads", p, { page: 1 }), "/admin/leads?pageSize=50&q=garza")

// Registra las llamadas del query builder en vez de ir a Supabase.
const spy = () => {
  const calls = []
  const q = new Proxy({}, { get: (_, m) => (...a) => (calls.push([m, ...a]), q) })
  return { q, calls }
}
const run = (params, filters = { textColumns: ["name"], phoneColumn: "phone" }) => {
  const s = spy()
  applyListFilters(s.q, { status: "todos", asignado: "todos", desde: "", hasta: "", f: {}, ...params }, filters)
  return s.calls
}
assert.deepEqual(run({ q: "COT-3A37F6" }), [["or", "and(id.gte.3a37f600-0000-0000-0000-000000000000,id.lte.3a37f6ff-ffff-ffff-ffff-ffffffffffff)"]])
assert.deepEqual(run({ q: "81 4931" }), [["or", "name.ilike.*81 4931*,phone.ilike.*8*1*4*9*3*1*"]])
assert.deepEqual(run({ q: "a,b(c)*" }), [["or", "name.ilike.*a b c*"]])
assert.deepEqual(run({ status: "new", asignado: "sin", q: "" }), [["eq", "status", "new"], ["is", "assigned_to", null]])

// Fechas y filtros por tipo
const facets = [{ key: "service", label: "Servicio", allLabel: "", options: [{ value: "nacional", label: "Nacional" }] }]
const fp = parseListParams(
  { desde: "2026-10-22", hasta: "2026-10-01", service: "nacional", unit: "flatbed", "select": "x" },
  { ...opts, facets },
)
assert.deepEqual([fp.desde, fp.hasta], ["2026-10-01", "2026-10-22"], "rango invertido se acomoda")
assert.deepEqual(fp.f, { service: "nacional" }, "solo columnas declaradas")
assert.deepEqual(parseListParams({ service: "'; drop", desde: "2026-13-45" }, { ...opts, facets }).f, {})
assert.equal(parseListParams({ desde: "2026-02-30x" }, opts).desde, "")
assert.equal(listHref("/admin/leads", fp), "/admin/leads?desde=2026-10-01&hasta=2026-10-22&service=nacional")
assert.equal(hasFilters(fp), true)
assert.equal(listHref("/admin/leads", clearFilters({ ...fp, status: "won" })), "/admin/leads?status=won")
// Días de Monterrey (UTC-6): hasta es inclusivo.
assert.deepEqual(run({ q: "", desde: "2026-10-01", hasta: "2026-10-31", f: { service: "nacional" } }), [
  ["gte", "created_at", "2026-10-01T06:00:00.000Z"],
  ["lt", "created_at", "2026-11-01T06:00:00.000Z"],
  ["eq", "service", "nacional"],
])
assert.equal(todayMty(new Date("2026-10-23T03:00:00Z")), "2026-10-22", "21:00 en Monterrey sigue siendo el 22")
assert.deepEqual(presetRange("7d", "2026-03-03"), ["2026-02-25", "2026-03-03"])
assert.deepEqual(presetRange("mes", "2026-03-03"), ["2026-03-01", "2026-03-03"])
assert.deepEqual(presetRange("ayer", "2026-01-01"), ["2025-12-31", "2025-12-31"])
console.log("check-admin-list: ok")
