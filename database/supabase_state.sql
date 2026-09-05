-- Persistencia cloud para la versión desplegable en Render.
-- Ejecuta TODO este archivo en Supabase > SQL Editor > New query.

create table if not exists public.app_state (
  id bigint primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- La aplicación accede a esta tabla únicamente desde el backend de Render
-- usando SUPABASE_SECRET_KEY. No expongas esa llave en React/Vite.
alter table public.app_state enable row level security;

-- Garantiza permisos para el rol administrativo utilizado por la llave secreta.
grant select, insert, update, delete on table public.app_state to service_role;

-- Fila única que almacena el estado completo de la aplicación.
insert into public.app_state (id, data)
values (1, '{}'::jsonb)
on conflict (id) do nothing;
