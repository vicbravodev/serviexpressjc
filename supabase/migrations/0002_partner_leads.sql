-- Socios comerciales: transportistas que se afilian con su propia unidad.
-- Mismo pipeline de venta que load_requests (lead_status + assigned_to), no
-- el de reclutamiento (job_applications), porque aquí se negocia una alianza
-- comercial, no una contratación.

create table if not exists public.partner_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  unit_type text,
  locale text,
  status lead_status not null default 'new',
  lost_reason text,
  assigned_to uuid references auth.users(id)
);

drop trigger if exists trg_partner_leads_updated on public.partner_leads;
create trigger trg_partner_leads_updated before update on public.partner_leads
  for each row execute function public.handle_updated_at();
drop trigger if exists trg_partner_leads_audit_ins on public.partner_leads;
create trigger trg_partner_leads_audit_ins after insert on public.partner_leads
  for each row execute function public.audit_row_change('partner_lead');
drop trigger if exists trg_partner_leads_audit_upd on public.partner_leads;
create trigger trg_partner_leads_audit_upd after update on public.partner_leads
  for each row execute function public.audit_row_change('partner_lead');

alter table public.partner_leads enable row level security;

drop policy if exists partner_leads_insert_public on public.partner_leads;
create policy partner_leads_insert_public on public.partner_leads for insert to anon, authenticated with check (true);
drop policy if exists partner_leads_select_staff on public.partner_leads;
create policy partner_leads_select_staff on public.partner_leads for select to authenticated
  using (public.current_app_role() in ('admin','user'));
drop policy if exists partner_leads_update_staff on public.partner_leads;
create policy partner_leads_update_staff on public.partner_leads for update to authenticated
  using (public.current_app_role() in ('admin','user'))
  with check (public.current_app_role() in ('admin','user'));

-- audit_log: mismo alcance de lectura/nota que load_request (staff, no solo admin).
drop policy if exists audit_select_staff on public.audit_log;
create policy audit_select_staff on public.audit_log for select to authenticated
  using (public.current_app_role() = 'admin'
         or (public.current_app_role() = 'user' and entity_type in ('load_request','partner_lead')));
drop policy if exists audit_insert_note on public.audit_log;
create policy audit_insert_note on public.audit_log for insert to authenticated
  with check (action = 'note' and old_value is null and new_value is null
              and actor_id = (select auth.uid())
              and (public.current_app_role() = 'admin'
                   or (public.current_app_role() = 'user' and entity_type in ('load_request','partner_lead'))));

grant insert on public.partner_leads to anon, authenticated;
grant select, update on public.partner_leads to authenticated;
