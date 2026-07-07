# Diseño: Persistencia Supabase + Panel Admin con RBAC y Trazabilidad

- **Fecha**: 2026-07-06
- **Proyecto**: servi-express-landing-page (Next.js 15 App Router, next-intl, pnpm)
- **Supabase project ref**: `rbfbidlsivlzjdvcokkc`

## 1. Objetivo

Los formularios de la landing (cotizador de cargas nacional/internacional y postulaciones
de operadores) hoy solo abren WhatsApp. Este cambio agrega **persistencia en Supabase** sin
romper el envío por WhatsApp, más un **panel de administración** en subdominio `admin.` con:

- Login real (Supabase Auth).
- **RBAC**: rol `admin` (ve todo + gestiona usuarios) y rol `user` (solo leads).
- **Seguimiento** de cada lead y postulación mediante status + timeline de notas.
- **Trazabilidad robusta**: cada cambio queda registrado por triggers de base de datos.

## 2. Principio rector: WhatsApp nunca se rompe

El envío por link `wa.me` se mantiene idéntico. La persistencia es **aditiva** y tolerante a
fallos: si el insert en Supabase falla, el usuario igual llega a WhatsApp. La persistencia se
dispara vía **Server Action** llamada sin bloquear el gesto del usuario (para no activar el
bloqueador de popups).

## 3. Arquitectura

```
Visitante → Form (client component) ──┬── href/window → WhatsApp   (comportamiento actual, intacto)
                                      └── Server Action insert (rol anon) → Supabase

Admin/User → admin.dominio → middleware (rewrite raíz→/admin + refresh sesión Supabase)
             → login (Supabase Auth) → panel (lee/actualiza según rol, rol authenticated)

Gestión de usuarios (solo admin) → Server Action → cliente service_role (Admin API) → Supabase Auth + profiles
```

### 3.1 Detección de host / subdominio (middleware)

`middleware.ts` compone tres responsabilidades:

1. Host empieza con `admin.` (comparado contra `NEXT_PUBLIC_ADMIN_HOST`, o prefijo `admin.`):
   - Rewrite de la raíz del subdominio a `/admin` (p. ej. `admin.dominio/` → `/admin`,
     `admin.dominio/leads` → `/admin/leads`).
   - Refresca cookies de sesión Supabase (`updateSession`).
   - **No** aplica next-intl (el panel no es multi-idioma).
2. Cualquier host con path que empiece por `/admin` → sirve el panel + refresh de sesión, sin
   i18n. Esto habilita el fallback `dominio/admin` y el desarrollo local
   (`localhost:3000/admin` o `admin.localhost:3000`).
3. Resto → `next-intl` como hoy.

El `matcher` actual (`/((?!api|_next|_vercel|.*\\..*).*)`) se conserva.

## 4. Modelo de datos (Postgres / Supabase, esquema `public`)

### 4.1 Enums

```sql
create type lead_status as enum ('new','contacted','in_progress','won','lost');
create type application_status as enum ('new','reviewed','contacted','hired','rejected');
create type app_role as enum ('admin','user');
```

### 4.2 `load_requests` (cotizaciones de carga)

| columna            | tipo          | notas                                        |
|--------------------|---------------|----------------------------------------------|
| id                 | uuid PK       | `gen_random_uuid()`                          |
| created_at         | timestamptz   | `now()`                                      |
| updated_at         | timestamptz   | `now()`, trigger lo mantiene                 |
| service            | text          | `nacional` \| `internacional`                |
| origin_id          | text          |                                              |
| origin_name        | text          |                                              |
| destination_id     | text          |                                              |
| destination_name   | text          |                                              |
| unit               | text          | `dryvan` \| `flatbed` \| `oversize`          |
| tons               | int           |                                              |
| urgency            | text          | `normal` \| `urgente`                        |
| cargo              | text          | mercancía (texto libre)                      |
| distance_km        | int           | informativo                                  |
| contact_name       | text NULL     | nuevo campo opcional del form                |
| contact_phone      | text NULL     | nuevo campo opcional del form                |
| locale             | text          | `es` \| `en`                                 |
| status             | lead_status   | default `new`                                |
| lost_reason        | text NULL     | obligatorio en app cuando status = `lost`    |
| assigned_to        | uuid NULL     | FK `auth.users` (opcional, quién da seguimiento) |

### 4.3 `job_applications` (postulaciones)

| columna     | tipo               | notas                              |
|-------------|--------------------|------------------------------------|
| id          | uuid PK            |                                    |
| created_at  | timestamptz        | `now()`                            |
| updated_at  | timestamptz        | `now()`                            |
| name        | text               |                                    |
| phone       | text               |                                    |
| position    | text               | `b1` \| `national` \| `mechanic` \| `admin` |
| experience  | text               | `lt2` \| `2to5` \| `5to10` \| `gt10` |
| locale      | text               |                                    |
| status      | application_status | default `new`                      |
| assigned_to | uuid NULL          | FK `auth.users`                    |

### 4.4 `profiles` (fuente de verdad de roles)

| columna    | tipo        | notas                                  |
|------------|-------------|----------------------------------------|
| id         | uuid PK     | FK `auth.users(id)` on delete cascade  |
| email      | text        |                                        |
| full_name  | text NULL   |                                        |
| role       | app_role    | default `user`                         |
| is_active  | boolean     | default true                           |
| created_at | timestamptz | `now()`                                |

El rol se **espeja en `app_metadata`** del usuario Auth (vía Admin API al crear/editar), para
poder leerlo desde el JWT en las políticas RLS sin recursión:
`(auth.jwt() -> 'app_metadata' ->> 'role')`.

### 4.5 `audit_log` (trazabilidad + timeline de seguimiento)

| columna      | tipo        | notas                                                         |
|--------------|-------------|---------------------------------------------------------------|
| id           | uuid PK     |                                                               |
| created_at   | timestamptz | `now()`                                                       |
| actor_id     | uuid NULL   | `auth.uid()`; NULL = formulario público                       |
| actor_email  | text NULL   | email del actor si aplica                                     |
| entity_type  | text        | `load_request` \| `job_application` \| `user`                 |
| entity_id    | uuid        |                                                               |
| action       | text        | `create` \| `status_change` \| `note` \| `role_change` \| `user_create` \| `user_update` |
| old_value    | jsonb NULL  | estado anterior (para diffs de status/rol)                    |
| new_value    | jsonb NULL  | estado nuevo                                                  |
| note         | text NULL   | texto de la nota de seguimiento                               |

El **timeline de un lead/postulación** = filas de `audit_log` filtradas por `entity_id`,
ordenadas por fecha. Una **nota de seguimiento** es una fila con `action='note'`; un cambio de
status es `action='status_change'` con `old_value`/`new_value`.

## 5. Trazabilidad por triggers (robusta)

Triggers en `load_requests` y `job_applications`:

- **AFTER INSERT** → fila `audit_log` con `action='create'`, `actor_id = auth.uid()`
  (NULL para envíos públicos), `new_value` = snapshot de la fila.
- **BEFORE UPDATE** → mantiene `updated_at = now()`.
- **AFTER UPDATE** cuando cambia `status` → fila `audit_log` con `action='status_change'`,
  `old_value`/`new_value` con el status anterior/nuevo (+ `lost_reason` si aplica),
  `actor_id = auth.uid()`.

Los triggers capturan `auth.uid()`, que Supabase expone dentro de la sesión de Postgres, por lo
que **cualquier cambio deja rastro aunque se ejecute vía SQL directo**, no solo desde la app.

Las notas de seguimiento y la gestión de usuarios/roles se registran con inserts explícitos a
`audit_log` desde las Server Actions (el actor viene de la sesión autenticada).

## 6. Seguridad — RLS y grants

RLS **activado** en las cuatro tablas. Helper para rol en JWT:

```sql
-- rol del usuario actual leído del JWT (sin tocar la tabla profiles → sin recursión)
create or replace function public.current_app_role() returns text
language sql stable as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', 'none')
$$;
```

Políticas:

- **`load_requests`**
  - INSERT `to anon, authenticated with check (true)` (envío público desde el form).
  - SELECT `to authenticated using (current_app_role() in ('admin','user'))`.
  - UPDATE `to authenticated using (current_app_role() in ('admin','user'))
    with check (current_app_role() in ('admin','user'))`.
- **`job_applications`**
  - INSERT `to anon, authenticated with check (true)`.
  - SELECT/UPDATE `to authenticated` solo `current_app_role() = 'admin'`.
- **`profiles`**
  - SELECT: propio (`id = auth.uid()`) o admin.
  - INSERT/UPDATE/DELETE: solo admin (además, la gestión real corre por service_role, que
    saltea RLS; las políticas son defensa en profundidad).
- **`audit_log`**
  - SELECT: admin ve todo; `user` ve entradas de `load_request` (su ámbito).
  - INSERT: vía triggers (SECURITY DEFINER de los triggers) y server actions; sin INSERT directo
    de `anon`/`authenticated` fuera de eso.

Grants explícitos (no confiar en defaults del Data API):
`grant insert on load_requests, job_applications to anon;`
`grant select, update on load_requests to authenticated;` etc.

Notas de seguridad (del checklist Supabase):
- Rol de autorización se lee de `app_metadata` (no `user_metadata`, que es editable por el usuario).
- `service_role`/secret key **solo** server-side; nunca `NEXT_PUBLIC_`.
- UPDATE requiere política SELECT (ya cubierta) y `WITH CHECK`.

## 7. Autenticación y gestión de usuarios

- **Login**: `app/admin/login` → Server Action `signInWithPassword` (cliente server SSR).
- **Guard**: cada página del panel valida con `supabase.auth.getClaims()`; sin sesión → redirect
  a login. El rol se obtiene del claim `app_metadata.role`.
- **Logout**: Server Action `signOut`.
- **Alta de usuarios** (solo admin): `app/admin/usuarios` → Server Action que usa
  `utils/supabase/admin.ts` (cliente `service_role`) para:
  1. `auth.admin.createUser({ email, password, email_confirm: true, app_metadata: { role } })`.
  2. Insertar/actualizar fila en `profiles`.
  3. Escribir `audit_log` (`action='user_create'`).
- **Editar rol / activar-desactivar**: Server Action admin → actualiza `profiles` +
  `auth.admin.updateUserById(app_metadata)` + `audit_log` (`role_change`/`user_update`).
- **Primer admin**: se crea manualmente una vez en el dashboard de Supabase (Auth → Users) con
  `app_metadata: { "role": "admin" }`, o mediante un script SQL/seed documentado en el plan.

## 8. Flujo de persistencia de formularios

- **Cotizador** (`quote-simulator.tsx`): hoy envía por `<a href>`. Se agregan campos
  **nombre** y **teléfono opcionales**; en `onClick` del botón WhatsApp se llama (sin `await`
  bloqueante) la Server Action `submitLoadRequest(payload)`; el link a `wa.me` procede normal.
- **Postulaciones** (`apply-form.tsx`): hoy usa `window.open`. Se dispara `submitApplication(payload)`
  (sin await) y acto seguido, **síncronamente**, `window.open(wa.me...)` para no perder el gesto.
- Server Actions viven en `app/(actions)/leads.ts` (o `lib/actions/leads.ts`), usan el cliente
  server SSR (rol anon) y hacen el insert. Errores se capturan y loguean, nunca se propagan al UX.

## 9. Panel admin (UI)

Reutiliza los componentes shadcn ya instalados y los tokens de diseño existentes.

- `app/admin/layout.tsx`: shell no localizado (sidebar/nav simple), guard de sesión.
- `app/admin/page.tsx`: dashboard con resumen (conteos por status) + accesos.
- `app/admin/leads/page.tsx`: tabla de `load_requests` con filtro por status; visible para
  `admin` y `user`.
- `app/admin/leads/[id]/page.tsx`: detalle del lead + **timeline** (audit_log) + cambiar status
  (+ `lost_reason` cuando `lost`) + agregar nota.
- `app/admin/postulaciones/page.tsx` y `[id]`: igual que leads, solo `admin`.
- `app/admin/usuarios/page.tsx`: lista + alta + editar rol/estado; solo `admin`.

Acciones de status/nota vía Server Actions con revalidación (`revalidatePath`).

## 10. Archivos

**Nuevos**
- `utils/supabase/server.ts`, `utils/supabase/client.ts`, `utils/supabase/middleware.ts`,
  `utils/supabase/admin.ts` (service_role, server-only).
- `middleware.ts` (reescrito para componer intl + supabase + admin host).
- `lib/actions/leads.ts` (persistencia pública), `lib/actions/admin.ts` (status/notas/usuarios),
  `lib/actions/auth.ts` (signIn/signOut).
- `app/admin/**` (layout, dashboard, leads, postulaciones, usuarios, login).
- `lib/db-types.ts` (tipos de las tablas) — opcional/manual.
- Migraciones SQL (aplicadas por MCP Supabase o pegadas en el SQL Editor):
  enums, tablas, RLS, grants, funciones y triggers.

**Modificados**
- `components/quote-simulator.tsx` (campos contacto + persistir).
- `components/apply-form.tsx` (persistir).
- `messages/es.json`, `messages/en.json` (labels de contacto + textos admin si aplica).
- `package.json` + `pnpm-lock.yaml` (`@supabase/supabase-js`, `@supabase/ssr`).
- `.env.local` (ya creado, gitignored).

## 11. Variables de entorno

| variable                             | ámbito       | uso                                        |
|--------------------------------------|--------------|--------------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`           | público      | clientes browser/server                    |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`| público     | clientes browser/server (rol anon)         |
| `SUPABASE_SERVICE_ROLE_KEY`          | **server**   | Admin API (crear usuarios); **nunca** al browser |
| `NEXT_PUBLIC_ADMIN_HOST`             | público      | detección de subdominio en middleware      |

Deben replicarse en Vercel (Preview + Production). Deploy vía rama + PR → Preview (nunca push
directo a main).

## 12. Fuera de alcance (YAGNI)

Export CSV, notificaciones por email/push, invitaciones por email (SMTP), reasignación masiva,
métricas avanzadas, borrado de leads, i18n del panel, realtime. Se pueden añadir después.

## 13. Verificación

- SQL: tras aplicar migraciones, correr advisors (MCP `get_advisors` o `supabase db advisors`)
  y query de prueba de insert anon + select authenticated.
- App: `pnpm build`; probar en preview del dev server: enviar cotización y postulación
  (verificar fila en Supabase + que WhatsApp abre), login admin, cambio de status deja audit,
  usuario `user` no ve postulaciones ni usuarios, admin sí.
