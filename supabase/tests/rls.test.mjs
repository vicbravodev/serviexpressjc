// Prueba la migración 0004 en Postgres (PGlite) con el entorno de Supabase simulado.
// Uso: pnpm test:rls  (PGlite: Postgres en memoria, sin Docker ni Supabase CLI)
import { PGlite } from "@electric-sql/pglite"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const dir = join(dirname(fileURLToPath(import.meta.url)), "../migrations")
const mig = (f) => readFileSync(join(dir, f), "utf8").replace(/create extension if not exists pgcrypto;/, "")
const db = new PGlite()

const ADMIN = "11111111-1111-1111-1111-111111111111"
const USER = "22222222-2222-2222-2222-222222222222"

// --- Entorno Supabase mínimo: roles, auth.*, privilegios por defecto ---
await db.exec(`
  create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
  create schema auth;
  grant usage on schema auth to anon, authenticated, service_role;
  create table auth.users (id uuid primary key, email text);
  create function auth.jwt() returns jsonb language sql stable as
    $$ select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
  create function auth.uid() returns uuid language sql stable as $$ select (auth.jwt() ->> 'sub')::uuid $$;
  grant execute on all functions in schema auth to anon, authenticated, service_role;
  -- Supabase otorga ALL sobre tablas nuevas de public a estos roles.
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
  insert into auth.users values ('${ADMIN}', 'admin@sx.mx'), ('${USER}', 'user@sx.mx');
`)
await db.exec(mig("0001_leads_admin.sql"))
await db.exec(mig("0002_partner_leads.sql"))
await db.exec(mig("0003_performance_indexes_rls.sql"))
// Fila "vieja" que viola los nuevos topes: la migración no debe fallar por ella.
await db.exec(`insert into public.load_requests (service, contact_name) values ('ftl', repeat('x', 500))`)
await db.exec(mig("0004_harden_rls.sql"))
await db.exec(mig("0004_harden_rls.sql")) // idempotente

const claims = { anon: null,
  admin: { sub: ADMIN, email: "admin@sx.mx", role: "authenticated", app_metadata: { role: "admin" } },
  user: { sub: USER, email: "user@sx.mx", role: "authenticated", app_metadata: { role: "user" } } }

async function as(who, sql) {
  const role = who === "anon" ? "anon" : who === "service" ? "service_role" : "authenticated"
  return db.transaction(async (tx) => {
    await tx.exec(`set local role ${role}`)
    if (claims[who]) await tx.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify(claims[who])])
    return tx.query(sql)
  })
}

let failed = 0
async function expect(name, ok, who, sql, check) {
  let res, err
  try { res = await as(who, sql) } catch (e) { err = e }
  const passed = ok ? !err && (!check || (await check(res))) : Boolean(err)
  if (!passed) failed++
  console.log(`${passed ? "PASS" : "FAIL"}  ${name}${err && ok ? `  -> ${err.message}` : ""}${!err && !ok ? "  -> no falló" : ""}`)
}
const one = async (sql) => (await db.query(sql)).rows[0]

const lead = (await one(`select id from public.load_requests limit 1`)).id

// Inserts públicos
await expect("anon inserta cotización normal", true, "anon",
  `insert into public.load_requests (service, origin_id, origin_name, destination_id, destination_name, unit, tons, urgency, cargo, distance_km, contact_name, contact_phone, locale)
   values ('ftl','mty','Monterrey','lrd','Laredo','caja-seca',20,'normal','acero',230,'Juan','81 1234 5678','es')`)
await expect("anon inserta postulación normal", true, "anon",
  `insert into public.job_applications (name, phone, position, experience, locale) values ('Ana','8112345678','b1','2to5','es')`)
await expect("anon inserta socio normal", true, "anon",
  `insert into public.partner_leads (name, phone, unit_type, locale) values ('Luis','8112345678','tractor','es')`)
await expect("staff logueado también puede usar los formularios", true, "user",
  `insert into public.partner_leads (name, phone, unit_type, locale) values ('Eva','8112345678','ambos','en')`)
await expect("anon NO puede fijar status='won'", false, "anon",
  `insert into public.load_requests (service, contact_name, status) values ('ftl','x','won')`)
await expect("anon NO puede atrasar created_at", false, "anon",
  `insert into public.job_applications (name, phone, created_at) values ('x','1','2020-01-01')`)
await expect("anon NO puede asignar el lead", false, "anon",
  `insert into public.partner_leads (name, phone, assigned_to) values ('x','1','${USER}')`)
await expect("anon NO puede mandar nombre de 81 caracteres", false, "anon",
  `insert into public.load_requests (service, contact_name) values ('ftl', repeat('x', 81))`)
await expect("anon NO puede mandar tons=500", false, "anon",
  `insert into public.load_requests (service, tons) values ('ftl', 500)`)

// Updates del staff
await expect("user cambia status y motivo de un lead", true, "user",
  `update public.load_requests set status='lost', lost_reason='precio' where id='${lead}' returning id`,
  (r) => r.rows.length === 1)
await expect("  ...y el trigger lo audita + actualiza updated_at", true, "service",
  `select (select count(*) from public.audit_log where entity_id='${lead}' and action='status_change') as n,
          (select updated_at > created_at from public.load_requests where id='${lead}') as touched`,
  (r) => Number(r.rows[0].n) === 1 && r.rows[0].touched === true)
await expect("user asigna el lead", true, "user",
  `update public.load_requests set assigned_to='${USER}' where id='${lead}' returning id`, (r) => r.rows.length === 1)
await expect("user NO puede reescribir el teléfono del lead", false, "user",
  `update public.load_requests set contact_phone='0000' where id='${lead}'`)
await expect("user NO puede reescribir created_at", false, "user",
  `update public.partner_leads set created_at='2020-01-01'`)
await expect("admin cambia status de una postulación", true, "admin",
  `update public.job_applications set status='reviewed' returning id`, (r) => r.rows.length === 1)
await expect("user NO ve/actualiza postulaciones (RLS, 0 filas)", true, "user",
  `update public.job_applications set status='hired' returning id`, (r) => r.rows.length === 0)
await expect("anon NO puede actualizar leads", false, "anon",
  `update public.load_requests set status='won'`)

// Notas del audit_log
await expect("user agrega nota con su propio email", true, "user",
  `insert into public.audit_log (actor_id, actor_email, entity_type, entity_id, action, note)
   values ('${USER}','user@sx.mx','load_request','${lead}','note','Llamé al cliente')`)
await expect("user NO puede firmar una nota como el admin", false, "user",
  `insert into public.audit_log (actor_id, actor_email, entity_type, entity_id, action, note)
   values ('${USER}','admin@sx.mx','load_request','${lead}','note','Aprobado por el dueño')`)
await expect("user NO puede usar el actor_id de otro", false, "user",
  `insert into public.audit_log (actor_id, actor_email, entity_type, entity_id, action, note)
   values ('${ADMIN}','user@sx.mx','load_request','${lead}','note','x')`)
await expect("service_role (acciones de gestión) sigue escribiendo el audit", true, "service",
  `insert into public.audit_log (actor_id, actor_email, entity_type, entity_id, action, new_value)
   values ('${ADMIN}','admin@sx.mx','user','${USER}','role_change','{"role":"user"}')`)

console.log(failed ? `\n${failed} FALLARON` : "\nTodo pasó")
process.exit(failed ? 1 : 0)
