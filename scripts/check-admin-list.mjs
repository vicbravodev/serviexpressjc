// Chequeo rápido de los parámetros de lista del panel: node scripts/check-admin-list.mjs
import assert from "node:assert/strict"
import { applyListFilters, listHref, pageRange, parseListParams } from "../lib/admin/list.ts"

const opts = { sorts: ["created_at", "name"], statuses: ["new", "won"] }
const p = parseListParams({ page: "3", pageSize: "50", sort: "drop table", status: "nope", asignado: "x", q: "  garza " }, opts)
assert.deepEqual(p, { page: 3, pageSize: 50, sort: "created_at", dir: "desc", status: "todos", q: "garza", asignado: "todos" })
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
  applyListFilters(s.q, { status: "todos", asignado: "todos", ...params }, filters)
  return s.calls
}
assert.deepEqual(run({ q: "COT-3A37F6" }), [["or", "and(id.gte.3a37f600-0000-0000-0000-000000000000,id.lte.3a37f6ff-ffff-ffff-ffff-ffffffffffff)"]])
assert.deepEqual(run({ q: "81 4931" }), [["or", "name.ilike.*81 4931*,phone.ilike.*8*1*4*9*3*1*"]])
assert.deepEqual(run({ q: "a,b(c)*" }), [["or", "name.ilike.*a b c*"]])
assert.deepEqual(run({ status: "new", asignado: "sin", q: "" }), [["eq", "status", "new"], ["is", "assigned_to", null]])
console.log("check-admin-list: ok")
