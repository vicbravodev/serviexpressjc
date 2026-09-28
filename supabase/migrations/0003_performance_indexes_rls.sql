-- Rendimiento para producción: índices que cubren las consultas del panel admin
-- y políticas RLS que evalúan el rol una sola vez por consulta (no por fila).
-- Idempotente: se puede correr varias veces sin efectos secundarios.

-- ============ Índices ============
-- Listados: ORDER BY created_at DESC LIMIT 200 (evita seq scan + sort).
create index if not exists load_requests_created_at_idx on public.load_requests (created_at desc);
create index if not exists job_applications_created_at_idx on public.job_applications (created_at desc);
create index if not exists partner_leads_created_at_idx on public.partner_leads (created_at desc);

-- Contadores del tablero/sidebar: count(*) WHERE status = ...
-- Son índices PARCIALES a propósito: bajo RLS, Postgres no puede usar `status = 'x'`
-- como condición de índice porque el operador de igualdad de enums (enum_eq) no es
-- leakproof, así que un índice normal sobre (status) se recorre completo. Un índice
-- parcial sí aplica (el predicado se prueba al planear). Verificado con EXPLAIN a 200k filas.
create index if not exists load_requests_new_idx on public.load_requests (created_at desc) where status = 'new';
create index if not exists load_requests_followup_idx on public.load_requests (status) where status in ('contacted','in_progress');
create index if not exists load_requests_won_idx on public.load_requests (updated_at) where status = 'won';
create index if not exists job_applications_new_idx on public.job_applications (created_at desc) where status = 'new';
create index if not exists partner_leads_new_idx on public.partner_leads (created_at desc) where status = 'new';

-- FKs sin índice: filtros por asignado y ON DELETE de auth.users no escanean la tabla.
create index if not exists load_requests_assigned_to_idx on public.load_requests (assigned_to);
create index if not exists job_applications_assigned_to_idx on public.job_applications (assigned_to);
create index if not exists partner_leads_assigned_to_idx on public.partner_leads (assigned_to);

-- ============ RLS: rol evaluado una vez por consulta ============
-- `public.current_app_role()` directo en USING se re-evalúa por cada fila.
-- Envuelto en `(select ...)` Postgres lo resuelve como InitPlan (una sola vez).
-- Recomendación del Performance Advisor de Supabase (auth_rls_initplan).

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.current_app_role()) = 'admin');
drop policy if exists profiles_write_admin on public.profiles;
create policy profiles_write_admin on public.profiles for all to authenticated
  using ((select public.current_app_role()) = 'admin')
  with check ((select public.current_app_role()) = 'admin');

drop policy if exists load_requests_select_staff on public.load_requests;
create policy load_requests_select_staff on public.load_requests for select to authenticated
  using ((select public.current_app_role()) in ('admin','user'));
drop policy if exists load_requests_update_staff on public.load_requests;
create policy load_requests_update_staff on public.load_requests for update to authenticated
  using ((select public.current_app_role()) in ('admin','user'))
  with check ((select public.current_app_role()) in ('admin','user'));

drop policy if exists job_applications_select_admin on public.job_applications;
create policy job_applications_select_admin on public.job_applications for select to authenticated
  using ((select public.current_app_role()) = 'admin');
drop policy if exists job_applications_update_admin on public.job_applications;
create policy job_applications_update_admin on public.job_applications for update to authenticated
  using ((select public.current_app_role()) = 'admin')
  with check ((select public.current_app_role()) = 'admin');

drop policy if exists partner_leads_select_staff on public.partner_leads;
create policy partner_leads_select_staff on public.partner_leads for select to authenticated
  using ((select public.current_app_role()) in ('admin','user'));
drop policy if exists partner_leads_update_staff on public.partner_leads;
create policy partner_leads_update_staff on public.partner_leads for update to authenticated
  using ((select public.current_app_role()) in ('admin','user'))
  with check ((select public.current_app_role()) in ('admin','user'));

drop policy if exists audit_select_staff on public.audit_log;
create policy audit_select_staff on public.audit_log for select to authenticated
  using ((select public.current_app_role()) = 'admin'
         or ((select public.current_app_role()) = 'user' and entity_type in ('load_request','partner_lead')));
drop policy if exists audit_insert_note on public.audit_log;
create policy audit_insert_note on public.audit_log for insert to authenticated
  with check (action = 'note' and old_value is null and new_value is null
              and actor_id = (select auth.uid())
              and ((select public.current_app_role()) = 'admin'
                   or ((select public.current_app_role()) = 'user' and entity_type in ('load_request','partner_lead'))));
