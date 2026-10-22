-- Permisos por sección (octubre 2026).
--
-- Antes: admin veía todo; user veía cotizaciones y socios, nunca postulaciones.
-- Ahora: admin sigue viendo todo; a cada user se le dan las secciones que necesita
-- ('leads' = cotizaciones, 'socios', 'postulaciones') en profiles.permissions.
--
-- El rol sigue saliendo del JWT (current_app_role), pero las secciones de un user se
-- leen de profiles en cada consulta: quitar un permiso o desactivar la cuenta corta el
-- acceso de inmediato, sin esperar a que expire el token.
--
-- Requiere 0004 aplicada. Idempotente: se puede correr varias veces.

-- ============ 1. Columna de permisos ============
-- Solo al crear la columna se copia el acceso de hoy (leads + socios) a los user
-- existentes; al re-correr no se pisan los permisos que ya ajustó un admin.
do $$ begin
  if not exists (select 1 from information_schema.columns
                 where table_schema = 'public' and table_name = 'profiles' and column_name = 'permissions') then
    alter table public.profiles add column permissions text[] not null default '{}';
    update public.profiles set permissions = '{leads,socios}' where role = 'user';
  end if;
end $$;

alter table public.profiles drop constraint if exists profiles_permissions_check;
alter table public.profiles add constraint profiles_permissions_check
  check (permissions <@ array['leads', 'socios', 'postulaciones']);

-- ============ 2. has_perm(sección) ============
-- SECURITY DEFINER para leer profiles sin pasar por su RLS (y sin recursión).
create or replace function public.has_perm(p text) returns boolean
language sql stable security definer set search_path = ''
as $$
  select public.current_app_role() = 'admin'
      or (public.current_app_role() = 'user' and exists (
            select 1 from public.profiles
            where id = auth.uid() and is_active and p = any(permissions)))
$$;
revoke execute on function public.has_perm(text) from public, anon;
grant execute on function public.has_perm(text) to authenticated;

-- ============ 3. Políticas por sección ============
-- `(select ...)`: se evalúa una vez por consulta (InitPlan), no por fila.
drop policy if exists load_requests_select_staff on public.load_requests;
create policy load_requests_select_staff on public.load_requests for select to authenticated
  using ((select public.has_perm('leads')));
drop policy if exists load_requests_update_staff on public.load_requests;
create policy load_requests_update_staff on public.load_requests for update to authenticated
  using ((select public.has_perm('leads')))
  with check ((select public.has_perm('leads')));

drop policy if exists partner_leads_select_staff on public.partner_leads;
create policy partner_leads_select_staff on public.partner_leads for select to authenticated
  using ((select public.has_perm('socios')));
drop policy if exists partner_leads_update_staff on public.partner_leads;
create policy partner_leads_update_staff on public.partner_leads for update to authenticated
  using ((select public.has_perm('socios')))
  with check ((select public.has_perm('socios')));

drop policy if exists job_applications_select_admin on public.job_applications;
drop policy if exists job_applications_select_staff on public.job_applications;
create policy job_applications_select_staff on public.job_applications for select to authenticated
  using ((select public.has_perm('postulaciones')));
drop policy if exists job_applications_update_admin on public.job_applications;
drop policy if exists job_applications_update_staff on public.job_applications;
create policy job_applications_update_staff on public.job_applications for update to authenticated
  using ((select public.has_perm('postulaciones')))
  with check ((select public.has_perm('postulaciones')));

-- audit_log: historial y notas solo de las secciones que la persona tiene.
drop policy if exists audit_select_staff on public.audit_log;
create policy audit_select_staff on public.audit_log for select to authenticated
  using ((select public.current_app_role()) = 'admin'
         or (entity_type = 'load_request' and (select public.has_perm('leads')))
         or (entity_type = 'partner_lead' and (select public.has_perm('socios')))
         or (entity_type = 'job_application' and (select public.has_perm('postulaciones'))));
drop policy if exists audit_insert_note on public.audit_log;
create policy audit_insert_note on public.audit_log for insert to authenticated
  with check (action = 'note' and old_value is null and new_value is null
              and actor_id = (select auth.uid())
              and actor_email = (select auth.jwt() ->> 'email')
              and ((entity_type = 'load_request' and (select public.has_perm('leads')))
                   or (entity_type = 'partner_lead' and (select public.has_perm('socios')))
                   or (entity_type = 'job_application' and (select public.has_perm('postulaciones')))));

