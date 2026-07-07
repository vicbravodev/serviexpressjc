# Supabase Leads + Panel Admin — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persistir los envíos de los formularios (cotizador de cargas y postulaciones) en Supabase sin romper WhatsApp, y construir un panel admin en subdominio `admin.` con login, RBAC (`admin`/`user`), seguimiento por status + notas, y trazabilidad por triggers de BD.

**Architecture:** Los formularios (client components) siguen abriendo `wa.me` y además llaman Server Actions que insertan como rol `anon`. El panel vive bajo `app/admin/**`, servido en el subdominio `admin.` vía rewrite en `middleware.ts` (que compone next-intl + refresh de sesión Supabase). La lectura/actualización usa la sesión autenticada (rol del JWT `app_metadata.role`). La gestión de usuarios usa un cliente `service_role` server-only. Cada cambio queda en `audit_log` por triggers de Postgres.

**Tech Stack:** Next.js 15 (App Router, RSC, Server Actions), next-intl, @supabase/ssr, @supabase/supabase-js, Supabase Postgres (RLS + triggers), pnpm, TypeScript, Tailwind + shadcn/ui.

## Global Constraints

- **Gestor de paquetes: pnpm** (existe `pnpm-lock.yaml`). Nunca usar `npm install`.
- **WhatsApp nunca se rompe**: la persistencia es aditiva, sin `await` bloqueante antes de abrir `wa.me`, y tolerante a fallos (los errores se loguean, nunca se propagan al UX).
- **`SUPABASE_SERVICE_ROLE_KEY` es secreta**: solo server-side, jamás con prefijo `NEXT_PUBLIC_`, jamás en un client component, jamás commiteada. Vive en `.env.local` (ya creado, gitignored).
- **Autorización se lee de `app_metadata`** del JWT (nunca `user_metadata`, que es editable por el usuario).
- **Alias de imports**: `@/x` → `./x` (raíz del repo).
- **Verificación**: no hay test runner. Verificar con `pnpm exec tsc --noEmit` (type-check, porque `next build` ignora errores TS), consultas SQL, y preview en navegador.
- **Deploy**: rama + PR → Preview de Vercel. Nunca push directo a `main`.
- **Env en Vercel**: replicar las 4 variables en Preview + Production.
- **Variables**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_ADMIN_HOST`.
- **Estados**: leads `new → contacted → in_progress → won → lost` (con `lost_reason`); postulaciones `new → reviewed → contacted → hired → rejected`.

---

## File Structure

**Nuevos**
- `utils/supabase/server.ts` — cliente SSR server (rol anon, cookies).
- `utils/supabase/client.ts` — cliente browser (rol anon).
- `utils/supabase/middleware.ts` — helper `updateSession` (refresh + rewrite opcional).
- `utils/supabase/admin.ts` — cliente `service_role`, server-only.
- `middleware.ts` — reescrito: compone intl + supabase + host admin.
- `supabase/migrations/0001_leads_admin.sql` — enums, tablas, funciones, triggers, RLS, grants.
- `lib/actions/leads.ts` — Server Actions públicas de persistencia.
- `lib/actions/auth.ts` — `signIn` / `signOut`.
- `lib/actions/admin.ts` — status, notas, gestión de usuarios (requiere rol).
- `lib/admin/auth.ts` — helpers `getSessionClaims`, `requireRole` para páginas.
- `app/admin/layout.tsx` — shell no localizado + guard de sesión.
- `app/admin/login/page.tsx` — login (client).
- `app/admin/page.tsx` — dashboard (conteos).
- `app/admin/leads/page.tsx` + `app/admin/leads/[id]/page.tsx`.
- `app/admin/postulaciones/page.tsx` + `app/admin/postulaciones/[id]/page.tsx`.
- `app/admin/usuarios/page.tsx`.
- `app/admin/_components/status-form.tsx`, `note-form.tsx`, `user-form.tsx`, `sign-out-button.tsx` (client).

**Modificados**
- `components/quote-simulator.tsx` — campos contacto opcionales + persistir.
- `components/apply-form.tsx` — persistir.
- `messages/es.json`, `messages/en.json` — labels de contacto.
- `package.json`, `pnpm-lock.yaml` — nuevas deps.

---

## Phase 0 — Fundaciones

### Task 1: Instalar deps + clientes Supabase

**Files:**
- Modify: `package.json`, `pnpm-lock.yaml`
- Create: `utils/supabase/server.ts`, `utils/supabase/client.ts`, `utils/supabase/middleware.ts`, `utils/supabase/admin.ts`

**Interfaces:**
- Produces:
  - `createClient(cookieStore: Awaited<ReturnType<typeof cookies>>)` → server SSR client (en `utils/supabase/server.ts`).
  - `createClient()` → browser client (en `utils/supabase/client.ts`).
  - `updateSession(request: NextRequest, rewriteTo?: URL): Promise<NextResponse>` (en `utils/supabase/middleware.ts`).
  - `createAdminClient()` → service_role client (en `utils/supabase/admin.ts`).

- [ ] **Step 1: Instalar dependencias (pnpm, versiones pineadas)**

Run:
```bash
pnpm add @supabase/supabase-js@2 @supabase/ssr@0.7 && pnpm add -D server-only
```
Expected: se actualizan `package.json` y `pnpm-lock.yaml`. (`server-only` puede venir con Next; instalarlo explícito no daña.)

> Antes de escribir código nuevo de Supabase, verificar breaking changes: fetch `https://supabase.com/changelog.md` y revisar tags `@supabase/ssr`. Si la firma de `createServerClient`/`getAll`/`setAll` cambió, ajustar los archivos de abajo.

- [ ] **Step 2: Crear `utils/supabase/server.ts`**

```ts
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  return createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Llamado desde un Server Component: se puede ignorar si el middleware refresca la sesión.
        }
      },
    },
  })
}
```

- [ ] **Step 3: Crear `utils/supabase/client.ts`**

```ts
import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export const createClient = () => createBrowserClient(supabaseUrl!, supabaseKey!)
```

- [ ] **Step 4: Crear `utils/supabase/middleware.ts`** (con soporte de rewrite para el subdominio admin)

```ts
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

/**
 * Refresca la sesión Supabase y devuelve la respuesta.
 * Si `rewriteTo` viene, la respuesta es un rewrite a esa URL (subdominio admin → /admin/*).
 */
export async function updateSession(request: NextRequest, rewriteTo?: URL) {
  const makeResponse = () =>
    rewriteTo ? NextResponse.rewrite(rewriteTo, { request }) : NextResponse.next({ request })

  let supabaseResponse = makeResponse()

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = makeResponse()
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        )
      },
    },
  })

  // IMPORTANTE: refresca el token. No poner código entre createServerClient y esta llamada.
  await supabase.auth.getClaims()

  return supabaseResponse
}
```

- [ ] **Step 5: Crear `utils/supabase/admin.ts`** (service_role, server-only)

```ts
import "server-only"
import { createClient } from "@supabase/supabase-js"

/** Cliente service_role: saltea RLS. Solo para Server Actions de gestión (crear usuarios, etc.). */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY no está configurada")
  return createClient(url!, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
```

- [ ] **Step 6: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS (sin errores en `utils/supabase/*`).

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-lock.yaml utils/supabase
git commit -m "feat(supabase): clientes SSR (server/client/middleware/admin) + deps"
```

---

### Task 2: Migración de base de datos (esquema, RLS, triggers)

**Files:**
- Create: `supabase/migrations/0001_leads_admin.sql`

**Interfaces:**
- Produces: tablas `public.load_requests`, `public.job_applications`, `public.profiles`, `public.audit_log`; función `public.current_app_role()`; enums `lead_status`, `application_status`, `app_role`.

- [ ] **Step 1: Escribir `supabase/migrations/0001_leads_admin.sql`**

```sql
-- ============ Extensiones ============
create extension if not exists pgcrypto;

-- ============ Enums ============
do $$ begin create type lead_status as enum ('new','contacted','in_progress','won','lost'); exception when duplicate_object then null; end $$;
do $$ begin create type application_status as enum ('new','reviewed','contacted','hired','rejected'); exception when duplicate_object then null; end $$;
do $$ begin create type app_role as enum ('admin','user'); exception when duplicate_object then null; end $$;

-- ============ Tablas ============
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role app_role not null default 'user',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.load_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  service text not null,
  origin_id text,
  origin_name text,
  destination_id text,
  destination_name text,
  unit text,
  tons int,
  urgency text,
  cargo text,
  distance_km int,
  contact_name text,
  contact_phone text,
  locale text,
  status lead_status not null default 'new',
  lost_reason text,
  assigned_to uuid references auth.users(id)
);

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  position text,
  experience text,
  locale text,
  status application_status not null default 'new',
  assigned_to uuid references auth.users(id)
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  actor_id uuid,
  actor_email text,
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  old_value jsonb,
  new_value jsonb,
  note text
);
create index if not exists audit_log_entity_idx on public.audit_log (entity_type, entity_id, created_at desc);

-- ============ Funciones ============
-- Rol del usuario actual desde el JWT (app_metadata); no toca profiles → sin recursión RLS.
create or replace function public.current_app_role() returns text
language sql stable
as $$ select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', 'none') $$;

create or replace function public.handle_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- Escribe audit_log en INSERT/UPDATE de status. SECURITY DEFINER para poder insertar en audit_log
-- saltándose RLS. tg_argv[0] = entity_type ('load_request' | 'job_application').
create or replace function public.audit_row_change() returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_actor uuid := auth.uid();
  v_email text;
begin
  select email into v_email from auth.users where id = v_actor;
  if (tg_op = 'INSERT') then
    insert into public.audit_log(actor_id, actor_email, entity_type, entity_id, action, new_value)
    values (v_actor, v_email, tg_argv[0], new.id, 'create', to_jsonb(new));
    return new;
  elsif (tg_op = 'UPDATE') then
    if (new.status is distinct from old.status) then
      insert into public.audit_log(actor_id, actor_email, entity_type, entity_id, action, old_value, new_value)
      values (v_actor, v_email, tg_argv[0], new.id, 'status_change',
              jsonb_build_object('status', old.status),
              jsonb_build_object('status', new.status, 'lost_reason', new.lost_reason));
    end if;
    return new;
  end if;
  return null;
end $$;
revoke execute on function public.audit_row_change() from public;

-- ============ Triggers ============
drop trigger if exists trg_load_requests_updated on public.load_requests;
create trigger trg_load_requests_updated before update on public.load_requests
  for each row execute function public.handle_updated_at();
drop trigger if exists trg_load_requests_audit_ins on public.load_requests;
create trigger trg_load_requests_audit_ins after insert on public.load_requests
  for each row execute function public.audit_row_change('load_request');
drop trigger if exists trg_load_requests_audit_upd on public.load_requests;
create trigger trg_load_requests_audit_upd after update on public.load_requests
  for each row execute function public.audit_row_change('load_request');

drop trigger if exists trg_job_applications_updated on public.job_applications;
create trigger trg_job_applications_updated before update on public.job_applications
  for each row execute function public.handle_updated_at();
drop trigger if exists trg_job_applications_audit_ins on public.job_applications;
create trigger trg_job_applications_audit_ins after insert on public.job_applications
  for each row execute function public.audit_row_change('job_application');
drop trigger if exists trg_job_applications_audit_upd on public.job_applications;
create trigger trg_job_applications_audit_upd after update on public.job_applications
  for each row execute function public.audit_row_change('job_application');

-- ============ RLS ============
alter table public.profiles enable row level security;
alter table public.load_requests enable row level security;
alter table public.job_applications enable row level security;
alter table public.audit_log enable row level security;

-- profiles
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated
  using (id = (select auth.uid()) or public.current_app_role() = 'admin');
drop policy if exists profiles_write_admin on public.profiles;
create policy profiles_write_admin on public.profiles for all to authenticated
  using (public.current_app_role() = 'admin')
  with check (public.current_app_role() = 'admin');

-- load_requests
drop policy if exists load_requests_insert_public on public.load_requests;
create policy load_requests_insert_public on public.load_requests for insert to anon, authenticated with check (true);
drop policy if exists load_requests_select_staff on public.load_requests;
create policy load_requests_select_staff on public.load_requests for select to authenticated
  using (public.current_app_role() in ('admin','user'));
drop policy if exists load_requests_update_staff on public.load_requests;
create policy load_requests_update_staff on public.load_requests for update to authenticated
  using (public.current_app_role() in ('admin','user'))
  with check (public.current_app_role() in ('admin','user'));

-- job_applications (solo admin lee/actualiza)
drop policy if exists job_applications_insert_public on public.job_applications;
create policy job_applications_insert_public on public.job_applications for insert to anon, authenticated with check (true);
drop policy if exists job_applications_select_admin on public.job_applications;
create policy job_applications_select_admin on public.job_applications for select to authenticated
  using (public.current_app_role() = 'admin');
drop policy if exists job_applications_update_admin on public.job_applications;
create policy job_applications_update_admin on public.job_applications for update to authenticated
  using (public.current_app_role() = 'admin')
  with check (public.current_app_role() = 'admin');

-- audit_log
drop policy if exists audit_select_staff on public.audit_log;
create policy audit_select_staff on public.audit_log for select to authenticated
  using (public.current_app_role() = 'admin'
         or (public.current_app_role() = 'user' and entity_type = 'load_request'));
drop policy if exists audit_insert_note on public.audit_log;
create policy audit_insert_note on public.audit_log for insert to authenticated
  with check (action = 'note' and actor_id = (select auth.uid())
              and (public.current_app_role() = 'admin'
                   or (public.current_app_role() = 'user' and entity_type = 'load_request')));

-- ============ Grants (no confiar en defaults del Data API) ============
grant usage on schema public to anon, authenticated;
grant insert on public.load_requests to anon, authenticated;
grant insert on public.job_applications to anon, authenticated;
grant select, update on public.load_requests to authenticated;
grant select, update on public.job_applications to authenticated;
grant select on public.profiles to authenticated;
grant select, insert on public.audit_log to authenticated;
```

- [ ] **Step 2: Aplicar la migración**

Opción A (MCP Supabase conectado): usar la tool `execute_sql` del MCP con el contenido del archivo.
Opción B (sin MCP): abrir `https://supabase.com/dashboard/project/rbfbidlsivlzjdvcokkc/sql/new`, pegar el SQL y ejecutar.

- [ ] **Step 3: Verificar esquema + RLS**

Ejecutar en SQL Editor (o MCP `execute_sql`):
```sql
select tablename, rowsecurity from pg_tables where schemaname='public'
  and tablename in ('load_requests','job_applications','profiles','audit_log');
```
Expected: 4 filas, `rowsecurity = true` en todas.

- [ ] **Step 4: Verificar advisors de seguridad**

MCP `get_advisors` (type: security) o `supabase db advisors` si hay CLI. Revisar que no haya errores de "RLS disabled" ni "security definer" inesperados. El único SECURITY DEFINER esperado es `audit_row_change` (con execute revocado de public).

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/0001_leads_admin.sql
git commit -m "feat(db): esquema leads/postulaciones/profiles/audit + RLS + triggers"
```

---

### Task 3: Componer el middleware (intl + supabase + subdominio admin)

**Files:**
- Modify: `middleware.ts` (reescribir por completo)

**Interfaces:**
- Consumes: `updateSession` de `utils/supabase/middleware.ts`; `routing` de `i18n/routing.ts`.

- [ ] **Step 1: Reescribir `middleware.ts`**

```ts
import createMiddleware from "next-intl/middleware"
import { type NextRequest } from "next/server"
import { routing } from "./i18n/routing"
import { updateSession } from "./utils/supabase/middleware"

const intlMiddleware = createMiddleware(routing)
const ADMIN_HOST = process.env.NEXT_PUBLIC_ADMIN_HOST

function isAdminHost(host: string | null): boolean {
  if (!host) return false
  const hostname = host.split(":")[0]
  if (ADMIN_HOST && hostname === ADMIN_HOST.split(":")[0]) return true
  return hostname.startsWith("admin.")
}

export default async function middleware(request: NextRequest) {
  const host = request.headers.get("host")
  const { pathname } = request.nextUrl
  const adminHost = isAdminHost(host)

  if (adminHost || pathname.startsWith("/admin")) {
    // Subdominio admin: reescribe la raíz (rutas sin prefijo /admin) hacia /admin/*.
    if (adminHost && !pathname.startsWith("/admin")) {
      const url = request.nextUrl.clone()
      url.pathname = `/admin${pathname === "/" ? "" : pathname}`
      return updateSession(request, url)
    }
    // Path /admin en cualquier host (fallback + dev local): sin rewrite, solo refresca sesión.
    return updateSession(request)
  }

  return intlMiddleware(request)
}

export const config = {
  // Todo excepto api, internals de Next y archivos estáticos (contienen punto)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
}
```

- [ ] **Step 2: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Verificar que la landing sigue viva (preview)**

Arrancar dev server y confirmar que `/` (locale es) y `/en` cargan como antes (el path `/admin` aún dará 404 hasta la Task 7). Verificar en consola que no hay errores de middleware.

- [ ] **Step 4: Commit**

```bash
git add middleware.ts
git commit -m "feat(middleware): compone next-intl + refresh Supabase + subdominio admin"
```

---

## Phase 1 — Persistencia pública (WhatsApp intacto)

### Task 4: Server Actions de persistencia de formularios

**Files:**
- Create: `lib/actions/leads.ts`

**Interfaces:**
- Produces:
  - `submitLoadRequest(input: LoadRequestInput): Promise<{ ok: boolean }>`
  - `submitApplication(input: ApplicationInput): Promise<{ ok: boolean }>`
  - types `LoadRequestInput`, `ApplicationInput` (exportados).

- [ ] **Step 1: Crear `lib/actions/leads.ts`**

```ts
"use server"

import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

export type LoadRequestInput = {
  service: string
  originId: string
  originName: string
  destinationId: string
  destinationName: string
  unit: string
  tons: number
  urgency: string
  cargo: string
  distanceKm: number | null
  contactName?: string
  contactPhone?: string
  locale: string
}

export type ApplicationInput = {
  name: string
  phone: string
  position: string
  experience: string
  locale: string
}

export async function submitLoadRequest(input: LoadRequestInput): Promise<{ ok: boolean }> {
  try {
    const supabase = createClient(await cookies())
    const { error } = await supabase.from("load_requests").insert({
      service: input.service,
      origin_id: input.originId,
      origin_name: input.originName,
      destination_id: input.destinationId,
      destination_name: input.destinationName,
      unit: input.unit,
      tons: input.tons,
      urgency: input.urgency,
      cargo: input.cargo,
      distance_km: input.distanceKm,
      contact_name: input.contactName?.trim() || null,
      contact_phone: input.contactPhone?.trim() || null,
      locale: input.locale,
    })
    if (error) console.error("submitLoadRequest:", error.message)
    return { ok: !error }
  } catch (e) {
    console.error("submitLoadRequest:", e)
    return { ok: false }
  }
}

export async function submitApplication(input: ApplicationInput): Promise<{ ok: boolean }> {
  try {
    const supabase = createClient(await cookies())
    const { error } = await supabase.from("job_applications").insert({
      name: input.name.trim(),
      phone: input.phone.trim(),
      position: input.position,
      experience: input.experience,
      locale: input.locale,
    })
    if (error) console.error("submitApplication:", error.message)
    return { ok: !error }
  } catch (e) {
    console.error("submitApplication:", e)
    return { ok: false }
  }
}
```

> Nota: `.insert(...)` sin `.select()` usa `Prefer: return=minimal`, así que el rol `anon` (sin política SELECT) puede insertar sin error.

- [ ] **Step 2: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add lib/actions/leads.ts
git commit -m "feat(leads): server actions submitLoadRequest / submitApplication"
```

---

### Task 5: Cotizador — campos de contacto + persistencia

**Files:**
- Modify: `components/quote-simulator.tsx`
- Modify: `messages/es.json`, `messages/en.json`

**Interfaces:**
- Consumes: `submitLoadRequest` de `@/lib/actions/leads`.

- [ ] **Step 1: Agregar claves i18n de contacto en `messages/es.json`** (dentro del objeto `Quote`, junto a `cargo`)

```json
"contact": {
  "nameLabel": "Nombre (opcional)",
  "namePh": "Ej. Juan Pérez",
  "phoneLabel": "Teléfono (opcional)",
  "phonePh": "Ej. 81 1234 5678"
}
```

- [ ] **Step 2: Agregar las mismas claves en `messages/en.json`** (dentro de `Quote`)

```json
"contact": {
  "nameLabel": "Name (optional)",
  "namePh": "e.g. John Doe",
  "phoneLabel": "Phone (optional)",
  "phonePh": "e.g. +1 346 366 9867"
}
```

- [ ] **Step 3: En `components/quote-simulator.tsx`, importar la action y agregar estado de contacto**

Añadir el import (junto a los otros imports):
```ts
import { submitLoadRequest } from "@/lib/actions/leads"
```

Dentro del componente, junto a los otros `useState`:
```ts
const [contactName, setContactName] = useState("")
const [contactPhone, setContactPhone] = useState("")
```

- [ ] **Step 4: Agregar los inputs de contacto en el JSX** (justo después del bloque de "Tipo de mercancía", antes del bloque "Recopilado de la solicitud")

```tsx
{/* Contacto (opcional) para seguimiento */}
<div className="grid gap-4 sm:grid-cols-2">
  <div className="space-y-2">
    <Label htmlFor="quote-contact-name">{t("contact.nameLabel")}</Label>
    <Input
      id="quote-contact-name"
      value={contactName}
      onChange={(e) => setContactName(e.target.value)}
      placeholder={t("contact.namePh")}
      autoComplete="name"
      maxLength={80}
      className="h-11"
    />
  </div>
  <div className="space-y-2">
    <Label htmlFor="quote-contact-phone">{t("contact.phoneLabel")}</Label>
    <Input
      id="quote-contact-phone"
      type="tel"
      value={contactPhone}
      onChange={(e) => setContactPhone(e.target.value)}
      placeholder={t("contact.phonePh")}
      autoComplete="tel"
      maxLength={30}
      className="h-11"
    />
  </div>
</div>
```

- [ ] **Step 5: Persistir al enviar por WhatsApp** — agregar `onClick` al `<a>` del botón "Enviar solicitud por WhatsApp" (el que tiene `href={whatsappHref}`)

Modificar ese `<a>` para incluir el handler (sin `await`: no bloquea la navegación al `wa.me`):
```tsx
<a
  href={whatsappHref}
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => {
    void submitLoadRequest({
      service,
      originId,
      originName,
      destinationId,
      destinationName,
      unit,
      tons,
      urgency,
      cargo: cargoText,
      distanceKm,
      contactName,
      contactPhone,
      locale,
    })
  }}
>
```
(El resto del contenido del `<a>` — ícono + `{t("send")}` — queda igual.)

- [ ] **Step 6: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 7: Verificar en preview + BD**

Arrancar dev server, abrir el cotizador, completar ruta y (opcional) contacto, clic en "Enviar por WhatsApp". Confirmar: (a) se abre `wa.me` con el mensaje, (b) aparece una fila nueva:
```sql
select id, service, origin_name, destination_name, contact_name, status, created_at
from public.load_requests order by created_at desc limit 3;
```
Expected: la solicitud recién enviada, `status = 'new'`. Verificar también que el trigger dejó audit:
```sql
select action, entity_type, actor_id from public.audit_log order by created_at desc limit 3;
```
Expected: fila `action='create'`, `entity_type='load_request'`, `actor_id = null` (envío público).

- [ ] **Step 8: Commit**

```bash
git add components/quote-simulator.tsx messages/es.json messages/en.json
git commit -m "feat(cotizador): contacto opcional + persiste load_request al enviar"
```

---

### Task 6: Postulaciones — persistencia

**Files:**
- Modify: `components/apply-form.tsx`

**Interfaces:**
- Consumes: `submitApplication` de `@/lib/actions/leads`.

- [ ] **Step 1: Importar la action** en `components/apply-form.tsx`

```ts
import { submitApplication } from "@/lib/actions/leads"
```
Y `useLocale` de next-intl (para guardar el idioma):
```ts
import { useLocale, useTranslations } from "next-intl"
```
Dentro del componente:
```ts
const locale = useLocale()
```

- [ ] **Step 2: Persistir en `handleSubmit`** — modificar la función para disparar la persistencia (sin await) y luego abrir WhatsApp síncronamente (mantiene el gesto, evita bloqueo de popup)

Reemplazar el cuerpo de `handleSubmit` por:
```ts
const handleSubmit = (e: FormEvent) => {
  e.preventDefault()
  if (name.trim().length <= 1 || phone.trim().length < 8 || position === "" || experience === "") return

  // Persistir (no bloquea el window.open de abajo).
  void submitApplication({
    name: name.trim(),
    phone: phone.trim(),
    position,
    experience,
    locale,
  })

  const message = t("whatsappMessage", {
    name: name.trim(),
    phone: phone.trim(),
    position: t(`positions.${position}`),
    experience: t(`experiences.${experience}`),
  })
  window.open(whatsappUrl(message, WHATSAPP_PHONE_JOBS), "_blank", "noopener,noreferrer")
}
```

- [ ] **Step 3: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Verificar en preview + BD**

Enviar una postulación. Confirmar apertura de WhatsApp y:
```sql
select name, phone, position, experience, status from public.job_applications order by created_at desc limit 3;
```
Expected: la postulación, `status='new'`, y audit `action='create'` `entity_type='job_application'`.

- [ ] **Step 5: Commit**

```bash
git add components/apply-form.tsx
git commit -m "feat(postulaciones): persiste job_application al postularse"
```

---

## Phase 2 — Auth + shell admin

### Task 7: Login, guard de sesión y layout admin

**Files:**
- Create: `lib/actions/auth.ts`, `lib/admin/auth.ts`, `app/admin/layout.tsx`, `app/admin/login/page.tsx`, `app/admin/page.tsx`, `app/admin/_components/sign-out-button.tsx`

**Interfaces:**
- Produces:
  - `signIn(prev, formData)` / `signOut()` en `lib/actions/auth.ts`.
  - `getSessionClaims()` → `{ userId, email, role } | null`; `requireStaff()` (redirect si no hay sesión) en `lib/admin/auth.ts`.

- [ ] **Step 1: Crear `lib/admin/auth.ts`** (helpers de sesión para páginas server)

```ts
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export type SessionClaims = { userId: string; email: string; role: "admin" | "user" | "none" }

export async function getSessionClaims(): Promise<SessionClaims | null> {
  const supabase = createClient(await cookies())
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims as Record<string, unknown> | undefined
  if (!claims) return null
  const appMeta = (claims.app_metadata ?? {}) as Record<string, unknown>
  return {
    userId: String(claims.sub ?? ""),
    email: String(claims.email ?? ""),
    role: (appMeta.role as SessionClaims["role"]) ?? "none",
  }
}

/** Exige sesión válida con rol admin|user. Redirige a login si no. Devuelve los claims. */
export async function requireStaff(): Promise<SessionClaims> {
  const claims = await getSessionClaims()
  if (!claims || (claims.role !== "admin" && claims.role !== "user")) redirect("/admin/login")
  return claims
}

/** Exige rol admin. Redirige a /admin si es user, a login si no hay sesión. */
export async function requireAdmin(): Promise<SessionClaims> {
  const claims = await getSessionClaims()
  if (!claims) redirect("/admin/login")
  if (claims.role !== "admin") redirect("/admin")
  return claims
}
```

- [ ] **Step 2: Crear `lib/actions/auth.ts`**

```ts
"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export type SignInState = { error?: string }

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  if (!email || !password) return { error: "Ingresa email y contraseña." }

  const supabase = createClient(await cookies())
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: "Credenciales inválidas." }
  redirect("/admin")
}

export async function signOut(): Promise<void> {
  const supabase = createClient(await cookies())
  await supabase.auth.signOut()
  redirect("/admin/login")
}
```

- [ ] **Step 3: Crear `app/admin/login/page.tsx`** (client, usa `useActionState`)

```tsx
"use client"

import { useActionState } from "react"
import { signIn, type SignInState } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<SignInState, FormData>(signIn, {})
  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="mb-1 text-2xl font-bold">Panel JC Serviexpress</h1>
      <p className="mb-6 text-sm text-muted-foreground">Acceso restringido.</p>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required className="h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" required className="h-11" />
        </div>
        {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
        <Button type="submit" disabled={pending} className="h-11 w-full">
          {pending ? "Entrando…" : "Entrar"}
        </Button>
      </form>
    </div>
  )
}
```

- [ ] **Step 4: Crear `app/admin/_components/sign-out-button.tsx`**

```tsx
"use client"

import { signOut } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="outline" size="sm">Cerrar sesión</Button>
    </form>
  )
}
```

- [ ] **Step 5: Crear `app/admin/layout.tsx`** (shell no localizado; el login se salta el guard porque es su propia página sin este layout aplicándole redirect — el guard vive aquí y `login` cae fuera vía chequeo de rol; ver nota)

```tsx
import Link from "next/link"
import type { ReactNode } from "react"
import { getSessionClaims } from "@/lib/admin/auth"
import { SignOutButton } from "./_components/sign-out-button"

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const claims = await getSessionClaims()
  // Sin sesión: no renderizamos nav; las páginas internas hacen su propio requireStaff/redirect.
  // La página /admin/login renderiza su propio árbol y no necesita nav.
  const isStaff = claims && (claims.role === "admin" || claims.role === "user")

  if (!isStaff) return <>{children}</>

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link href="/admin">Inicio</Link>
            <Link href="/admin/leads">Leads</Link>
            {claims.role === "admin" ? <Link href="/admin/postulaciones">Postulaciones</Link> : null}
            {claims.role === "admin" ? <Link href="/admin/usuarios">Usuarios</Link> : null}
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{claims.email} · {claims.role}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  )
}
```

> Nota de diseño: el guard fuerte vive en cada página (`requireStaff`/`requireAdmin`), no solo en el layout, porque un layout no debe ser la única barrera. El layout solo decide si pinta el nav.

- [ ] **Step 6: Crear `app/admin/page.tsx`** (dashboard con conteos)

```tsx
import Link from "next/link"
import { cookies } from "next/headers"
import { requireStaff } from "@/lib/admin/auth"
import { createClient } from "@/utils/supabase/server"

export const dynamic = "force-dynamic"

export default async function AdminHome() {
  const claims = await requireStaff()
  const supabase = createClient(await cookies())

  const { count: leadsCount } = await supabase
    .from("load_requests")
    .select("*", { count: "exact", head: true })
  const { count: newLeads } = await supabase
    .from("load_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "new")

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Panel</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/admin/leads" className="rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">Leads totales</p>
          <p className="text-3xl font-bold">{leadsCount ?? 0}</p>
          <p className="mt-1 text-xs text-muted-foreground">{newLeads ?? 0} nuevos</p>
        </Link>
        {claims.role === "admin" ? <AdminApplicationsCard /> : null}
      </div>
    </div>
  )
}

async function AdminApplicationsCard() {
  const supabase = createClient(await cookies())
  const { count } = await supabase
    .from("job_applications")
    .select("*", { count: "exact", head: true })
  return (
    <Link href="/admin/postulaciones" className="rounded-xl border border-border p-6">
      <p className="text-sm text-muted-foreground">Postulaciones</p>
      <p className="text-3xl font-bold">{count ?? 0}</p>
    </Link>
  )
}
```

- [ ] **Step 7: Crear el primer usuario admin** (una vez; requiere que la migración de la Task 2 ya corrió)

Opción A — SQL (crea el usuario en Auth y su profile). En el SQL Editor de Supabase:
```sql
-- Cambia email y contraseña. Requiere extensión pgcrypto (ya creada en la migración).
with new_user as (
  insert into auth.users (instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  values ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
    'admin@serviexpressjc.com.mx', crypt('CambiaEstaClave123', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"],"role":"admin"}'::jsonb,
    '{}'::jsonb, now(), now())
  returning id, email
)
insert into public.profiles (id, email, role) select id, email, 'admin' from new_user;
```
Opción B — Dashboard: Auth → Users → Add user (email + password, "Auto Confirm"). Luego editar el usuario y poner en **App Metadata**: `{ "role": "admin" }`. Después insertar su profile:
```sql
insert into public.profiles (id, email, role)
values ('<uuid-del-usuario>', 'admin@serviexpressjc.com.mx', 'admin');
```

> Tras crear/editar `app_metadata`, el rol viaja en el JWT al siguiente login.

- [ ] **Step 8: Verificar login + guard (preview)**

En dev, abrir `http://localhost:3000/admin` → debe redirigir a `/admin/login`. Iniciar sesión con el admin. Debe entrar al dashboard y mostrar los conteos + nav con Leads/Postulaciones/Usuarios. `Cerrar sesión` vuelve a login.

- [ ] **Step 9: Commit**

```bash
git add lib/actions/auth.ts lib/admin/auth.ts app/admin/layout.tsx app/admin/login app/admin/page.tsx app/admin/_components/sign-out-button.tsx
git commit -m "feat(admin): login Supabase Auth, guard por rol y shell del panel"
```

---

## Phase 3 — Panel: seguimiento y gestión

### Task 8: Leads — lista, detalle, status y notas

**Files:**
- Create: `lib/actions/admin.ts` (parte de leads), `app/admin/leads/page.tsx`, `app/admin/leads/[id]/page.tsx`, `app/admin/_components/status-form.tsx`, `app/admin/_components/note-form.tsx`

**Interfaces:**
- Produces (en `lib/actions/admin.ts`): `updateLeadStatus(id, status, lostReason?)`, `addNote(entityType, entityId, note)`.
- Consumes: `requireStaff`/`requireAdmin` de `@/lib/admin/auth`; `createClient` de `@/utils/supabase/server`; `createAdminClient` de `@/utils/supabase/admin`.

- [ ] **Step 1: Crear `lib/actions/admin.ts`** (acciones de seguimiento; la gestión de usuarios se agrega en la Task 10)

```ts
"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { getSessionClaims } from "@/lib/admin/auth"

const LEAD_STATUSES = ["new", "contacted", "in_progress", "won", "lost"] as const
const APPLICATION_STATUSES = ["new", "reviewed", "contacted", "hired", "rejected"] as const

async function requireRole(roles: Array<"admin" | "user">) {
  const claims = await getSessionClaims()
  if (!claims || !roles.includes(claims.role as "admin" | "user")) {
    throw new Error("No autorizado")
  }
  const supabase = createClient(await cookies())
  return { claims, supabase }
}

export async function updateLeadStatus(id: string, status: string, lostReason?: string) {
  if (!LEAD_STATUSES.includes(status as (typeof LEAD_STATUSES)[number])) throw new Error("Status inválido")
  const { supabase } = await requireRole(["admin", "user"])
  const patch: Record<string, unknown> = { status }
  patch.lost_reason = status === "lost" ? (lostReason?.trim() || null) : null
  const { error } = await supabase.from("load_requests").update(patch).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/leads/${id}`)
  revalidatePath("/admin/leads")
}

export async function updateApplicationStatus(id: string, status: string) {
  if (!APPLICATION_STATUSES.includes(status as (typeof APPLICATION_STATUSES)[number])) throw new Error("Status inválido")
  const { supabase } = await requireRole(["admin"])
  const { error } = await supabase.from("job_applications").update({ status }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/postulaciones/${id}`)
  revalidatePath("/admin/postulaciones")
}

export async function addNote(entityType: "load_request" | "job_application", entityId: string, note: string) {
  const roles: Array<"admin" | "user"> = entityType === "load_request" ? ["admin", "user"] : ["admin"]
  const { claims, supabase } = await requireRole(roles)
  const body = note.trim()
  if (!body) throw new Error("La nota está vacía")
  const { error } = await supabase.from("audit_log").insert({
    actor_id: claims.userId,
    actor_email: claims.email,
    entity_type: entityType,
    entity_id: entityId,
    action: "note",
    note: body,
  })
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/${entityType === "load_request" ? "leads" : "postulaciones"}/${entityId}`)
}
```

- [ ] **Step 2: Crear `app/admin/_components/status-form.tsx`** (client, cambia status; pide motivo si `lost`)

```tsx
"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateLeadStatus, updateApplicationStatus } from "@/lib/actions/admin"

type Props =
  | { kind: "lead"; id: string; current: string; options: string[] }
  | { kind: "application"; id: string; current: string; options: string[] }

export function StatusForm(props: Props) {
  const [status, setStatus] = useState(props.current)
  const [lostReason, setLostReason] = useState("")
  const [pending, start] = useTransition()

  const submit = () =>
    start(async () => {
      if (props.kind === "lead") await updateLeadStatus(props.id, status, lostReason)
      else await updateApplicationStatus(props.id, status)
    })

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {props.options.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            aria-pressed={status === s}
            className={
              "rounded-md border px-3 py-1.5 text-sm " +
              (status === s ? "border-foreground bg-foreground text-background" : "border-border")
            }
          >
            {s}
          </button>
        ))}
      </div>
      {props.kind === "lead" && status === "lost" ? (
        <Input
          value={lostReason}
          onChange={(e) => setLostReason(e.target.value)}
          placeholder="Motivo de la pérdida"
          className="h-10"
        />
      ) : null}
      <Button onClick={submit} disabled={pending || status === props.current && !(props.kind === "lead" && status === "lost")}>
        {pending ? "Guardando…" : "Actualizar status"}
      </Button>
    </div>
  )
}
```

- [ ] **Step 3: Crear `app/admin/_components/note-form.tsx`** (client)

```tsx
"use client"

import { useRef, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { addNote } from "@/lib/actions/admin"

export function NoteForm({ entityType, entityId }: { entityType: "load_request" | "job_application"; entityId: string }) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [pending, start] = useTransition()
  return (
    <div className="space-y-2">
      <textarea
        ref={ref}
        rows={3}
        placeholder="Agregar nota de seguimiento…"
        className="w-full rounded-md border border-border bg-background p-3 text-sm"
      />
      <Button
        onClick={() =>
          start(async () => {
            const v = ref.current?.value ?? ""
            if (!v.trim()) return
            await addNote(entityType, entityId, v)
            if (ref.current) ref.current.value = ""
          })
        }
        disabled={pending}
      >
        {pending ? "Guardando…" : "Agregar nota"}
      </Button>
    </div>
  )
}
```

- [ ] **Step 4: Crear `app/admin/leads/page.tsx`** (lista, visible para admin y user)

```tsx
import Link from "next/link"
import { cookies } from "next/headers"
import { requireStaff } from "@/lib/admin/auth"
import { createClient } from "@/utils/supabase/server"

export const dynamic = "force-dynamic"

export default async function LeadsPage() {
  await requireStaff()
  const supabase = createClient(await cookies())
  const { data: leads } = await supabase
    .from("load_requests")
    .select("id, created_at, service, origin_name, destination_name, contact_name, contact_phone, status")
    .order("created_at", { ascending: false })
    .limit(200)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Solicitudes de carga</h1>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">Fecha</th><th className="p-3">Servicio</th><th className="p-3">Ruta</th>
              <th className="p-3">Contacto</th><th className="p-3">Status</th><th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {(leads ?? []).map((l) => (
              <tr key={l.id} className="border-t border-border">
                <td className="p-3 whitespace-nowrap">{new Date(l.created_at).toLocaleString("es-MX")}</td>
                <td className="p-3">{l.service}</td>
                <td className="p-3">{l.origin_name} → {l.destination_name}</td>
                <td className="p-3">{l.contact_name || l.contact_phone || "—"}</td>
                <td className="p-3">{l.status}</td>
                <td className="p-3"><Link className="underline" href={`/admin/leads/${l.id}`}>Ver</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Crear `app/admin/leads/[id]/page.tsx`** (detalle + timeline + acciones)

```tsx
import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { requireStaff } from "@/lib/admin/auth"
import { createClient } from "@/utils/supabase/server"
import { StatusForm } from "@/app/admin/_components/status-form"
import { NoteForm } from "@/app/admin/_components/note-form"

export const dynamic = "force-dynamic"
const LEAD_STATUSES = ["new", "contacted", "in_progress", "won", "lost"]

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff()
  const { id } = await params
  const supabase = createClient(await cookies())

  const { data: lead } = await supabase.from("load_requests").select("*").eq("id", id).single()
  if (!lead) notFound()
  const { data: timeline } = await supabase
    .from("audit_log")
    .select("id, created_at, actor_email, action, old_value, new_value, note")
    .eq("entity_type", "load_request")
    .eq("entity_id", id)
    .order("created_at", { ascending: false })

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h1 className="text-2xl font-bold">{lead.origin_name} → {lead.destination_name}</h1>
        <dl className="grid grid-cols-2 gap-2 rounded-xl border border-border p-4 text-sm">
          <dt className="text-muted-foreground">Servicio</dt><dd>{lead.service}</dd>
          <dt className="text-muted-foreground">Unidad</dt><dd>{lead.unit}</dd>
          <dt className="text-muted-foreground">Toneladas</dt><dd>{lead.tons}</dd>
          <dt className="text-muted-foreground">Urgencia</dt><dd>{lead.urgency}</dd>
          <dt className="text-muted-foreground">Mercancía</dt><dd>{lead.cargo}</dd>
          <dt className="text-muted-foreground">Distancia</dt><dd>{lead.distance_km ? `${lead.distance_km} km` : "—"}</dd>
          <dt className="text-muted-foreground">Contacto</dt><dd>{lead.contact_name || "—"}</dd>
          <dt className="text-muted-foreground">Teléfono</dt><dd>{lead.contact_phone || "—"}</dd>
          {lead.status === "lost" ? (<><dt className="text-muted-foreground">Motivo pérdida</dt><dd>{lead.lost_reason || "—"}</dd></>) : null}
        </dl>

        <section className="space-y-2">
          <h2 className="font-semibold">Seguimiento</h2>
          <NoteForm entityType="load_request" entityId={id} />
          <ul className="space-y-3 pt-2">
            {(timeline ?? []).map((e) => (
              <li key={e.id} className="rounded-md border border-border p-3 text-sm">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{e.action}{e.actor_email ? ` · ${e.actor_email}` : " · público"}</span>
                  <span>{new Date(e.created_at).toLocaleString("es-MX")}</span>
                </div>
                {e.action === "note" ? <p className="mt-1">{e.note}</p> : null}
                {e.action === "status_change" ? (
                  <p className="mt-1">
                    {(e.old_value as { status?: string } | null)?.status} → {(e.new_value as { status?: string } | null)?.status}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="space-y-4">
        <div className="rounded-xl border border-border p-4">
          <h2 className="mb-3 font-semibold">Status</h2>
          <StatusForm kind="lead" id={id} current={lead.status} options={LEAD_STATUSES} />
        </div>
      </aside>
    </div>
  )
}
```

- [ ] **Step 6: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 7: Verificar (preview + BD)**

Logueado como admin, ir a `/admin/leads`, abrir un lead, cambiar status a `contacted`, luego a `lost` con motivo, y agregar una nota. Verificar que el timeline muestra los cambios y notas. En BD:
```sql
select action, old_value->>'status' o, new_value->>'status' n, note, actor_email
from public.audit_log where entity_type='load_request' order by created_at desc limit 5;
```
Expected: filas `status_change` con `o/n` correctos y la `note` con `actor_email` del admin.

- [ ] **Step 8: Commit**

```bash
git add lib/actions/admin.ts app/admin/leads app/admin/_components/status-form.tsx app/admin/_components/note-form.tsx
git commit -m "feat(admin): leads con lista, detalle, cambio de status y notas"
```

---

### Task 9: Postulaciones — lista y detalle (solo admin)

**Files:**
- Create: `app/admin/postulaciones/page.tsx`, `app/admin/postulaciones/[id]/page.tsx`

**Interfaces:**
- Consumes: `requireAdmin`; `updateApplicationStatus`, `addNote` de `@/lib/actions/admin`; `StatusForm`, `NoteForm`.

- [ ] **Step 1: Crear `app/admin/postulaciones/page.tsx`**

```tsx
import Link from "next/link"
import { cookies } from "next/headers"
import { requireAdmin } from "@/lib/admin/auth"
import { createClient } from "@/utils/supabase/server"

export const dynamic = "force-dynamic"

export default async function ApplicationsPage() {
  await requireAdmin()
  const supabase = createClient(await cookies())
  const { data: apps } = await supabase
    .from("job_applications")
    .select("id, created_at, name, phone, position, experience, status")
    .order("created_at", { ascending: false })
    .limit(200)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Postulaciones</h1>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">Fecha</th><th className="p-3">Nombre</th><th className="p-3">Teléfono</th>
              <th className="p-3">Puesto</th><th className="p-3">Status</th><th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {(apps ?? []).map((a) => (
              <tr key={a.id} className="border-t border-border">
                <td className="p-3 whitespace-nowrap">{new Date(a.created_at).toLocaleString("es-MX")}</td>
                <td className="p-3">{a.name}</td>
                <td className="p-3">{a.phone}</td>
                <td className="p-3">{a.position}</td>
                <td className="p-3">{a.status}</td>
                <td className="p-3"><Link className="underline" href={`/admin/postulaciones/${a.id}`}>Ver</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Crear `app/admin/postulaciones/[id]/page.tsx`**

```tsx
import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { requireAdmin } from "@/lib/admin/auth"
import { createClient } from "@/utils/supabase/server"
import { StatusForm } from "@/app/admin/_components/status-form"
import { NoteForm } from "@/app/admin/_components/note-form"

export const dynamic = "force-dynamic"
const APPLICATION_STATUSES = ["new", "reviewed", "contacted", "hired", "rejected"]

export default async function ApplicationDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const supabase = createClient(await cookies())

  const { data: app } = await supabase.from("job_applications").select("*").eq("id", id).single()
  if (!app) notFound()
  const { data: timeline } = await supabase
    .from("audit_log")
    .select("id, created_at, actor_email, action, old_value, new_value, note")
    .eq("entity_type", "job_application")
    .eq("entity_id", id)
    .order("created_at", { ascending: false })

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h1 className="text-2xl font-bold">{app.name}</h1>
        <dl className="grid grid-cols-2 gap-2 rounded-xl border border-border p-4 text-sm">
          <dt className="text-muted-foreground">Teléfono</dt><dd>{app.phone}</dd>
          <dt className="text-muted-foreground">Puesto</dt><dd>{app.position}</dd>
          <dt className="text-muted-foreground">Experiencia</dt><dd>{app.experience}</dd>
        </dl>
        <section className="space-y-2">
          <h2 className="font-semibold">Seguimiento</h2>
          <NoteForm entityType="job_application" entityId={id} />
          <ul className="space-y-3 pt-2">
            {(timeline ?? []).map((e) => (
              <li key={e.id} className="rounded-md border border-border p-3 text-sm">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{e.action}{e.actor_email ? ` · ${e.actor_email}` : " · público"}</span>
                  <span>{new Date(e.created_at).toLocaleString("es-MX")}</span>
                </div>
                {e.action === "note" ? <p className="mt-1">{e.note}</p> : null}
                {e.action === "status_change" ? (
                  <p className="mt-1">
                    {(e.old_value as { status?: string } | null)?.status} → {(e.new_value as { status?: string } | null)?.status}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <aside className="space-y-4">
        <div className="rounded-xl border border-border p-4">
          <h2 className="mb-3 font-semibold">Status</h2>
          <StatusForm kind="application" id={id} current={app.status} options={APPLICATION_STATUSES} />
        </div>
      </aside>
    </div>
  )
}
```

- [ ] **Step 3: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Verificar (preview)**

Como admin: `/admin/postulaciones` lista, abrir una, cambiar status y agregar nota. Confirmar timeline.

- [ ] **Step 5: Commit**

```bash
git add app/admin/postulaciones
git commit -m "feat(admin): postulaciones con detalle, status y notas (solo admin)"
```

---

### Task 10: Gestión de usuarios (solo admin)

**Files:**
- Modify: `lib/actions/admin.ts` (agregar acciones de usuarios)
- Create: `app/admin/usuarios/page.tsx`, `app/admin/_components/user-form.tsx`

**Interfaces:**
- Produces (en `lib/actions/admin.ts`): `createUser({email,password,fullName?,role})`, `updateUserRole(userId, role)`, `setUserActive(userId, isActive)`.
- Consumes: `createAdminClient` de `@/utils/supabase/admin`.

- [ ] **Step 1: Agregar al final de `lib/actions/admin.ts`** las acciones de usuarios

```ts
import { createAdminClient } from "@/utils/supabase/admin"

export async function createUser(input: { email: string; password: string; fullName?: string; role: "admin" | "user" }) {
  const { claims } = await requireRole(["admin"])
  const admin = createAdminClient()
  const { data, error } = await admin.auth.admin.createUser({
    email: input.email.trim(),
    password: input.password,
    email_confirm: true,
    app_metadata: { role: input.role },
    user_metadata: { full_name: input.fullName?.trim() || null },
  })
  if (error || !data.user) throw new Error(error?.message ?? "No se pudo crear el usuario")
  const { error: pErr } = await admin.from("profiles").upsert({
    id: data.user.id,
    email: input.email.trim(),
    full_name: input.fullName?.trim() || null,
    role: input.role,
    is_active: true,
  })
  if (pErr) throw new Error(pErr.message)
  await admin.from("audit_log").insert({
    actor_id: claims.userId, actor_email: claims.email,
    entity_type: "user", entity_id: data.user.id, action: "user_create",
    new_value: { email: input.email.trim(), role: input.role },
  })
  revalidatePath("/admin/usuarios")
}

export async function updateUserRole(userId: string, role: "admin" | "user") {
  const { claims } = await requireRole(["admin"])
  const admin = createAdminClient()
  const { data: before } = await admin.from("profiles").select("role").eq("id", userId).single()
  const { error } = await admin.auth.admin.updateUserById(userId, { app_metadata: { role } })
  if (error) throw new Error(error.message)
  await admin.from("profiles").update({ role }).eq("id", userId)
  await admin.from("audit_log").insert({
    actor_id: claims.userId, actor_email: claims.email,
    entity_type: "user", entity_id: userId, action: "role_change",
    old_value: before ?? null, new_value: { role },
  })
  revalidatePath("/admin/usuarios")
}

export async function setUserActive(userId: string, isActive: boolean) {
  const { claims } = await requireRole(["admin"])
  const admin = createAdminClient()
  await admin.from("profiles").update({ is_active: isActive }).eq("id", userId)
  await admin.auth.admin.updateUserById(userId, { ban_duration: isActive ? "none" : "876000h" })
  await admin.from("audit_log").insert({
    actor_id: claims.userId, actor_email: claims.email,
    entity_type: "user", entity_id: userId, action: "user_update",
    new_value: { is_active: isActive },
  })
  revalidatePath("/admin/usuarios")
}
```

- [ ] **Step 2: Crear `app/admin/_components/user-form.tsx`** (client, alta de usuario)

```tsx
"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createUser } from "@/lib/actions/admin"

export function UserForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState<"admin" | "user">("user")
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()

  return (
    <div className="space-y-3 rounded-xl border border-border p-4">
      <h2 className="font-semibold">Nuevo usuario</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1"><Label htmlFor="u-name">Nombre</Label>
          <Input id="u-name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-10" /></div>
        <div className="space-y-1"><Label htmlFor="u-email">Email</Label>
          <Input id="u-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10" /></div>
        <div className="space-y-1"><Label htmlFor="u-pass">Contraseña</Label>
          <Input id="u-pass" type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="h-10" /></div>
        <div className="space-y-1"><Label htmlFor="u-role">Rol</Label>
          <select id="u-role" value={role} onChange={(e) => setRole(e.target.value as "admin" | "user")}
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm">
            <option value="user">user (solo leads)</option>
            <option value="admin">admin (todo)</option>
          </select></div>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button
        disabled={pending || !email || password.length < 8}
        onClick={() =>
          start(async () => {
            setError(null)
            try {
              await createUser({ email, password, fullName, role })
              setEmail(""); setPassword(""); setFullName(""); setRole("user")
            } catch (e) {
              setError(e instanceof Error ? e.message : "Error")
            }
          })
        }
      >
        {pending ? "Creando…" : "Crear usuario"}
      </Button>
    </div>
  )
}
```

- [ ] **Step 3: Crear `app/admin/usuarios/page.tsx`**

```tsx
import { cookies } from "next/headers"
import { requireAdmin } from "@/lib/admin/auth"
import { createClient } from "@/utils/supabase/server"
import { UserForm } from "@/app/admin/_components/user-form"

export const dynamic = "force-dynamic"

export default async function UsersPage() {
  await requireAdmin()
  const supabase = createClient(await cookies())
  const { data: users } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, is_active, created_at")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Usuarios</h1>
      <UserForm />
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr><th className="p-3">Email</th><th className="p-3">Nombre</th><th className="p-3">Rol</th><th className="p-3">Activo</th></tr>
          </thead>
          <tbody>
            {(users ?? []).map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.full_name || "—"}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.is_active ? "Sí" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

> Nota: editar rol/activar en la tabla (botones que llaman `updateUserRole`/`setUserActive`) queda como mejora incremental; el alta + listado cubre el MVP acordado.

- [ ] **Step 4: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Verificar (preview + BD)** — requiere `SUPABASE_SERVICE_ROLE_KEY` en `.env.local`

Como admin, ir a `/admin/usuarios`, crear un usuario con rol `user`. Confirmar que aparece en la lista. Cerrar sesión, entrar con ese usuario `user`: debe ver `/admin/leads` pero al ir a `/admin/postulaciones` o `/admin/usuarios` ser redirigido a `/admin`. Verificar audit:
```sql
select action, new_value from public.audit_log where entity_type='user' order by created_at desc limit 3;
```
Expected: `user_create` con `{email, role}`.

- [ ] **Step 6: Commit**

```bash
git add lib/actions/admin.ts app/admin/usuarios app/admin/_components/user-form.tsx
git commit -m "feat(admin): gestión de usuarios con roles (solo admin)"
```

---

## Phase 4 — Cierre

### Task 11: Build final, env en Vercel, deploy a Preview

**Files:** ninguno (configuración + verificación).

- [ ] **Step 1: Build completo**

Run: `pnpm build`
Expected: build exitoso, sin errores de runtime en las rutas admin.

- [ ] **Step 2: Verificación end-to-end en preview local**

Checklist en el navegador (dev server):
- Enviar cotización (con y sin contacto) → WhatsApp abre + fila en `load_requests`.
- Enviar postulación → WhatsApp abre + fila en `job_applications`.
- `admin.localhost:3000/` (o `localhost:3000/admin`) → redirige a login.
- Login admin → dashboard, leads, postulaciones, usuarios visibles.
- Cambiar status + nota en un lead y en una postulación → timeline + audit correctos.
- Crear usuario `user` → login como user → solo ve leads; postulaciones/usuarios redirigen.

- [ ] **Step 3: Configurar variables en Vercel** (Preview + Production)

Agregar en el proyecto de Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (marcar como sensible; solo server)
- `NEXT_PUBLIC_ADMIN_HOST=admin.serviexpressjc.com.mx`

(Con Vercel CLI: `vercel env add <NAME> preview` y `production`, o vía dashboard.)

- [ ] **Step 4: Subdominio en Vercel** (para producción del panel)

Agregar el dominio `admin.serviexpressjc.com.mx` al proyecto en Vercel y crear el registro DNS (CNAME) que indique el dashboard. Mientras se propaga, el panel sigue accesible en `serviexpressjc.com.mx/admin`.

- [ ] **Step 5: Push rama + PR → Preview**

```bash
git push -u origin claude/silly-babbage-dac8bc
```
Abrir PR hacia `main`. Verificar el deploy Preview de Vercel: repetir el checklist del Step 2 contra la URL de preview. **No** hacer merge a `main` sin aprobación.

- [ ] **Step 6: Recordatorio de seguridad**

Rotar la `SUPABASE_SERVICE_ROLE_KEY` (quedó expuesta en un chat): dashboard → API Keys → regenerar; actualizar `.env.local` y Vercel.

---

## Self-Review (cobertura del spec)

- §2 WhatsApp intacto → Tasks 5, 6 (persistencia sin await bloqueante). ✔
- §3.1 Middleware/subdominio → Task 3. ✔
- §4 Modelo de datos (4 tablas + enums) → Task 2. ✔
- §5 Trazabilidad por triggers → Task 2 (triggers) + verificado en Tasks 5/6/8. ✔
- §6 RLS + grants + current_app_role → Task 2. ✔
- §7 Auth + gestión de usuarios → Tasks 7, 10. ✔
- §8 Persistencia formularios → Tasks 4, 5, 6. ✔
- §9 Panel (dashboard, leads, postulaciones, usuarios) → Tasks 7, 8, 9, 10. ✔
- §11 Variables de entorno / Vercel → Task 11. ✔
- Estados leads/postulaciones (Global Constraints) → enums Task 2, `StatusForm` Tasks 8/9. ✔
- Notas de seguimiento en `audit_log` → `addNote` Task 8, policy `audit_insert_note` Task 2. ✔
```
