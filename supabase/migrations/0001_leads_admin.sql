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
set search_path = ''
as $$ select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', 'none') $$;

create or replace function public.handle_updated_at() returns trigger
language plpgsql
set search_path = ''
as $$
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
              -- to_jsonb(new)->>'lost_reason' es NULL si la columna no existe (job_applications),
              -- evitando el error "record new has no field lost_reason" al cambiar su status.
              jsonb_build_object('status', new.status, 'lost_reason', to_jsonb(new) ->> 'lost_reason'));
    end if;
    return new;
  end if;
  return null;
end $$;
revoke execute on function public.audit_row_change() from public;
revoke execute on function public.audit_row_change() from anon, authenticated;

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
-- Las notas manuales solo cargan texto (`note`); nunca old_value/new_value (esos los escribe
-- exclusivamente el trigger para status_change). Evita que un usuario fabrique diffs en el audit.
create policy audit_insert_note on public.audit_log for insert to authenticated
  with check (action = 'note' and old_value is null and new_value is null
              and actor_id = (select auth.uid())
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
