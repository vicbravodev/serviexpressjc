-- Endurecimiento de RLS y grants (auditoría de seguridad, octubre 2026).
--
-- 1. anon/authenticated solo pueden insertar las columnas que mandan los
--    formularios públicos. Antes, con la publishable key, cualquiera podía
--    crear un lead ya "won", con created_at atrasado o con texto de megabytes.
-- 2. Topes de longitud en la política de insert, iguales a los de clean() en
--    lib/actions/leads.ts. Solo aplican a filas nuevas de los formularios.
-- 3. El staff solo puede actualizar status, lost_reason y assigned_to (lo único que
--    escribe el panel). Antes podía reescribir el teléfono o nombre de un lead sin
--    dejar rastro en audit_log.
-- 4. Las notas del audit_log llevan el email real del JWT: antes actor_email era
--    texto libre y un usuario podía firmar una nota como otra persona.
--
-- service_role (acciones de gestión) salta RLS y no usa estos grants.
-- Idempotente: se puede correr varias veces.

-- ============ 1. Inserts públicos por columna ============
-- Revocar a nivel tabla también quita grants por columna previos; luego se otorgan
-- solo las columnas permitidas. Supabase da ALL por defecto a anon/authenticated.
revoke insert on public.load_requests from anon, authenticated;
grant insert (service, origin_id, origin_name, destination_id, destination_name, unit, tons,
              urgency, cargo, distance_km, contact_name, contact_phone, locale)
  on public.load_requests to anon, authenticated;

revoke insert on public.job_applications from anon, authenticated;
grant insert (name, phone, position, experience, locale)
  on public.job_applications to anon, authenticated;

revoke insert on public.partner_leads from anon, authenticated;
grant insert (name, phone, unit_type, locale)
  on public.partner_leads to anon, authenticated;

-- ============ 2. Topes de longitud en la política de insert ============
-- En la política y no como CHECK: un CHECK también se evalúa al actualizar filas
-- viejas, y un lead histórico más largo bloquearía su cambio de estatus.
-- coalesce: en RLS un NULL cuenta como rechazo.
drop policy if exists load_requests_insert_public on public.load_requests;
create policy load_requests_insert_public on public.load_requests for insert to anon, authenticated
  with check (
    coalesce(length(service), 0) <= 40 and coalesce(length(origin_id), 0) <= 40
    and coalesce(length(origin_name), 0) <= 120 and coalesce(length(destination_id), 0) <= 40
    and coalesce(length(destination_name), 0) <= 120 and coalesce(length(unit), 0) <= 40
    and coalesce(tons, 0) between 0 and 100 and coalesce(length(urgency), 0) <= 40
    and coalesce(length(cargo), 0) <= 200 and coalesce(distance_km, 0) between 0 and 20000
    and coalesce(length(contact_name), 0) <= 80 and coalesce(length(contact_phone), 0) <= 30
    and coalesce(length(locale), 0) <= 5
  );

drop policy if exists job_applications_insert_public on public.job_applications;
create policy job_applications_insert_public on public.job_applications for insert to anon, authenticated
  with check (
    length(name) <= 80 and length(phone) <= 30 and coalesce(length(position), 0) <= 40
    and coalesce(length(experience), 0) <= 40 and coalesce(length(locale), 0) <= 5
  );

drop policy if exists partner_leads_insert_public on public.partner_leads;
create policy partner_leads_insert_public on public.partner_leads for insert to anon, authenticated
  with check (
    length(name) <= 80 and length(phone) <= 30
    and coalesce(length(unit_type), 0) <= 40 and coalesce(length(locale), 0) <= 5
  );

-- ============ 3. Updates del staff por columna ============
-- updated_at lo pone el trigger BEFORE UPDATE; los triggers no requieren grant de columna.
revoke update on public.load_requests from anon, authenticated;
grant update (status, lost_reason, assigned_to) on public.load_requests to authenticated;

revoke update on public.partner_leads from anon, authenticated;
grant update (status, lost_reason, assigned_to) on public.partner_leads to authenticated;

revoke update on public.job_applications from anon, authenticated;
grant update (status, assigned_to) on public.job_applications to authenticated;

-- ============ 4. Notas firmadas con el email del JWT ============
drop policy if exists audit_insert_note on public.audit_log;
create policy audit_insert_note on public.audit_log for insert to authenticated
  with check (action = 'note' and old_value is null and new_value is null
              and actor_id = (select auth.uid())
              and actor_email = (select auth.jwt() ->> 'email')
              and ((select public.current_app_role()) = 'admin'
                   or ((select public.current_app_role()) = 'user' and entity_type in ('load_request','partner_lead'))));
