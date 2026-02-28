-- Extensions and Types
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

create type user_role as enum ('operator', 'user');
create type plan_type as enum ('free', 'pro');
create type region_type as enum ('country', 'state', 'county', 'city', 'neighborhood');
create type agent_type as enum ('collector', 'journalist', 'art', 'regional_editor', 'chief_editor', 'moderator');
create type agent_status as enum ('online', 'offline', 'error', 'paused');
create type article_status as enum ('collecting', 'writing', 'art_review', 'regional_review', 'published', 'returned', 'off_air', 'deleted');
create type distribution_channel as enum ('web', 'youtube', 'whatsapp', 'instagram');
create type distribution_status as enum ('pending', 'sent', 'failed');
create type ugc_type as enum ('video', 'audio', 'text');
create type ugc_status as enum ('pending', 'approved', 'rejected');
create type credit_type as enum ('earned', 'used', 'expired');
create type alert_type as enum ('agent_offline', 'high_rejection_rate', 'ugc_queue_overflow', 'llm_fallback');
create type alert_status as enum ('open', 'acknowledged', 'resolved');
create type problem_category as enum ('factual', 'cultural', 'legal', 'quality', 'image', 'other');
create type llm_provider as enum ('local', 'claude', 'gpt4o');

-- Tables
-- USERS
create table users (
  id uuid primary key default uuid_generate_v4(),
  auth_id uuid unique not null references auth.users(id) on delete cascade,
  role user_role not null default 'user',
  plan plan_type not null default 'free',
  full_name text not null,
  email text unique not null,
  avatar_url text,
  region_id uuid,
  preferred_language text not null default 'pt-BR',
  credit_balance numeric(10,2) not null default 0.00,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- PLANS
create table plans (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type plan_type not null unique,
  price_usd numeric(10,2) not null default 0.00,
  features jsonb not null default '[]',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into plans (name, type, price_usd, features) values
  ('Free', 'free', 0.00, '["acesso_conteudo_basico","eu_reporter"]'),
  ('Pro', 'pro', 5.99, '["acesso_completo","eu_reporter","sem_anuncios","alertas_breaking_news"]');

-- REGIONS
create table regions (
  id uuid primary key default uuid_generate_v4(),
  parent_id uuid references regions(id) on delete set null,
  type region_type not null,
  name text not null,
  slug text not null unique,
  country_code char(2),
  timezone text,
  metadata jsonb default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index idx_regions_parent_id on regions(parent_id);
create index idx_regions_type on regions(type);
create index idx_regions_slug on regions(slug);

insert into regions (type, name, slug, country_code, timezone) values
  ('country', 'Estados Unidos', 'us', 'US', 'America/New_York'),
  ('country', 'Brasil', 'br', 'BR', 'America/Sao_Paulo'),
  ('country', 'Portugal', 'pt', 'PT', 'Europe/Lisbon'),
  ('country', 'Reino Unido', 'uk', 'GB', 'Europe/London');

-- SOURCES
create table sources (
  id uuid primary key default uuid_generate_v4(),
  region_id uuid not null references regions(id) on delete cascade,
  name text not null,
  url text not null,
  type text not null,
  config jsonb not null default '{}',
  is_active boolean not null default true,
  last_fetched_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index idx_sources_region_id on sources(region_id);

-- AGENTS
create table agents (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type agent_type not null,
  status agent_status not null default 'offline',
  region_id uuid references regions(id) on delete set null,
  llm_provider llm_provider not null default 'local',
  config jsonb not null default '{}',
  prompt_version text not null default 'v1',
  last_heartbeat_at timestamptz,
  articles_produced_24h integer not null default 0,
  error_count_24h integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index idx_agents_type on agents(type);
create index idx_agents_region_id on agents(region_id);
create index idx_agents_status on agents(status);

-- AGENT LOGS
create table agent_logs (
  id uuid primary key default uuid_generate_v4(),
  agent_id uuid not null references agents(id) on delete cascade,
  article_id uuid,
  action text not null,
  llm_provider llm_provider,
  input_summary text,
  output_summary text,
  metadata jsonb default '{}',
  duration_ms integer,
  success boolean not null default true,
  error_message text,
  created_at timestamptz not null default now()
);

create index idx_agent_logs_agent_id on agent_logs(agent_id);
create index idx_agent_logs_article_id on agent_logs(article_id);
create index idx_agent_logs_created_at on agent_logs(created_at desc);

-- ARTICLES
create table articles (
  id uuid primary key default uuid_generate_v4(),
  region_id uuid not null references regions(id) on delete restrict,
  agent_id uuid references agents(id) on delete set null,
  source_id uuid references sources(id) on delete set null,
  ugc_submission_id uuid,
  title text not null,
  subtitle text,
  slug text unique not null,
  body text not null,
  impact_section text,
  category text not null,
  tags text[] default '{}',
  status article_status not null default 'collecting',
  llm_provider llm_provider,
  regional_editor_id uuid references agents(id) on delete set null,
  chief_editor_id uuid references agents(id) on delete set null,
  regional_editor_notes text,
  chief_editor_notes text,
  problem_category problem_category,
  operator_id uuid references users(id) on delete set null,
  operator_action text,
  operator_notes text,
  published_at timestamptz,
  off_air_at timestamptz,
  views_count integer not null default 0,
  shares_count integer not null default 0,
  read_time_seconds integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index idx_articles_region_id on articles(region_id);
create index idx_articles_status on articles(status);
create index idx_articles_published_at on articles(published_at desc);
create index idx_articles_category on articles(category);
create index idx_articles_slug on articles(slug);
create index idx_articles_title_search on articles using gin(to_tsvector('portuguese', title));
create index idx_articles_body_search on articles using gin(to_tsvector('portuguese', body));

-- ARTICLE VERSIONS
create table article_versions (
  id uuid primary key default uuid_generate_v4(),
  article_id uuid not null references articles(id) on delete cascade,
  version_number integer not null,
  title text not null,
  body text not null,
  impact_section text,
  changed_by_agent_id uuid references agents(id) on delete set null,
  changed_by_user_id uuid references users(id) on delete set null,
  change_reason text,
  created_at timestamptz not null default now()
);

create index idx_article_versions_article_id on article_versions(article_id);

-- ARTICLE MEDIA
create table article_media (
  id uuid primary key default uuid_generate_v4(),
  article_id uuid not null references articles(id) on delete cascade,
  type text not null,
  source text not null,
  url text not null,
  storage_path text,
  alt_text text,
  credit text,
  is_primary boolean not null default false,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

create index idx_article_media_article_id on article_media(article_id);

-- DISTRIBUTIONS
create table distributions (
  id uuid primary key default uuid_generate_v4(),
  article_id uuid not null references articles(id) on delete cascade,
  channel distribution_channel not null,
  status distribution_status not null default 'pending',
  external_id text,
  external_url text,
  payload jsonb default '{}',
  response jsonb default '{}',
  error_message text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_distributions_article_id on distributions(article_id);
create index idx_distributions_channel on distributions(channel);
create index idx_distributions_status on distributions(status);

-- UGC SUBMISSIONS
create table ugc_submissions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete restrict,
  region_id uuid references regions(id) on delete set null,
  type ugc_type not null,
  title text,
  description text,
  storage_path text not null,
  file_size_bytes bigint not null,
  mime_type text not null,
  duration_seconds integer,
  status ugc_status not null default 'pending',
  moderator_agent_id uuid references agents(id) on delete set null,
  moderation_score numeric(3,2),
  moderation_notes text,
  rejection_reason text,
  credit_amount numeric(10,2),
  article_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index idx_ugc_submissions_user_id on ugc_submissions(user_id);
create index idx_ugc_submissions_status on ugc_submissions(status);
create index idx_ugc_submissions_region_id on ugc_submissions(region_id);

-- CREDITS
create table credits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete restrict,
  ugc_submission_id uuid references ugc_submissions(id) on delete set null,
  type credit_type not null,
  amount numeric(10,2) not null,
  balance_after numeric(10,2) not null,
  description text not null,
  created_at timestamptz not null default now()
);

create index idx_credits_user_id on credits(user_id);

-- ALERTS
create table alerts (
  id uuid primary key default uuid_generate_v4(),
  type alert_type not null,
  status alert_status not null default 'open',
  agent_id uuid references agents(id) on delete set null,
  region_id uuid references regions(id) on delete set null,
  message text not null,
  metadata jsonb default '{}',
  acknowledged_by uuid references users(id) on delete set null,
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_alerts_status on alerts(status);
create index idx_alerts_type on alerts(type);

-- METRICS
create table metrics (
  id uuid primary key default uuid_generate_v4(),
  article_id uuid not null references articles(id) on delete cascade,
  channel distribution_channel not null,
  date date not null default current_date,
  views integer not null default 0,
  unique_views integer not null default 0,
  shares integer not null default 0,
  avg_read_time_seconds integer not null default 0,
  clicks integer not null default 0,
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(article_id, channel, date)
);

create index idx_metrics_article_id on metrics(article_id);
create index idx_metrics_date on metrics(date desc);

-- Triggers
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_users_updated_at before update on users for each row execute function update_updated_at();
create trigger trg_regions_updated_at before update on regions for each row execute function update_updated_at();
create trigger trg_agents_updated_at before update on agents for each row execute function update_updated_at();
create trigger trg_articles_updated_at before update on articles for each row execute function update_updated_at();
create trigger trg_ugc_submissions_updated_at before update on ugc_submissions for each row execute function update_updated_at();
create trigger trg_distributions_updated_at before update on distributions for each row execute function update_updated_at();
create trigger trg_metrics_updated_at before update on metrics for each row execute function update_updated_at();

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.users (auth_id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'Usuário'),
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- RLS Policies
alter table users enable row level security;
alter table plans enable row level security;
alter table regions enable row level security;
alter table sources enable row level security;
alter table agents enable row level security;
alter table agent_logs enable row level security;
alter table articles enable row level security;
alter table article_versions enable row level security;
alter table article_media enable row level security;
alter table distributions enable row level security;
alter table ugc_submissions enable row level security;
alter table credits enable row level security;
alter table alerts enable row level security;
alter table metrics enable row level security;

-- USERS
create policy "users_select_own" on users for select using (auth.uid() = auth_id);
create policy "users_update_own" on users for update using (auth.uid() = auth_id);

-- PLANS (somente leitura pública)
create policy "plans_select_all" on plans for select using (true);

-- REGIONS (somente leitura pública)
create policy "regions_select_all" on regions for select using (true);

-- SOURCES (operadores via service_role)
create policy "sources_select_operator" on sources for select using (
  exists (select 1 from users where auth_id = auth.uid() and role = 'operator')
);

-- AGENTS (operadores via service_role)
create policy "agents_select_operator" on agents for select using (
  exists (select 1 from users where auth_id = auth.uid() and role = 'operator')
);

-- AGENT LOGS
create policy "agent_logs_select_operator" on agent_logs for select using (
  exists (select 1 from users where auth_id = auth.uid() and role = 'operator')
);

-- ARTICLES
create policy "articles_select_operator" on articles for select using (
  exists (select 1 from users where auth_id = auth.uid() and role = 'operator')
);
create policy "articles_select_user" on articles for select using (
  status = 'published' and deleted_at is null
);

-- ARTICLE VERSIONS
create policy "article_versions_select_operator" on article_versions for select using (
  exists (select 1 from users where auth_id = auth.uid() and role = 'operator')
);

-- ARTICLE MEDIA
create policy "article_media_select_all" on article_media for select using (true);

-- DISTRIBUTIONS
create policy "distributions_select_operator" on distributions for select using (
  exists (select 1 from users where auth_id = auth.uid() and role = 'operator')
);

-- UGC SUBMISSIONS
create policy "ugc_select_own" on ugc_submissions for select using (
  user_id = (select id from users where auth_id = auth.uid())
);
create policy "ugc_insert_own" on ugc_submissions for insert with check (
  user_id = (select id from users where auth_id = auth.uid())
);
create policy "ugc_select_operator" on ugc_submissions for select using (
  exists (select 1 from users where auth_id = auth.uid() and role = 'operator')
);

-- CREDITS
create policy "credits_select_own" on credits for select using (
  user_id = (select id from users where auth_id = auth.uid())
);

-- ALERTS
create policy "alerts_select_operator" on alerts for select using (
  exists (select 1 from users where auth_id = auth.uid() and role = 'operator')
);

-- METRICS
create policy "metrics_select_operator" on metrics for select using (
  exists (select 1 from users where auth_id = auth.uid() and role = 'operator')
);
