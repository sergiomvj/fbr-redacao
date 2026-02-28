# PRD Backend — FBR-Redacao
> Documento gerado pelo workflow /build-saas · Fevereiro 2026  
> Versão 1.0 · Confidencial — Uso Interno Facebrasil

---

## 1. Resumo do Produto

**Nome:** FBR-Redacao  
**Empresa:** Facebrasil — 16 anos, principal publicação brasileira para imigrantes nos EUA  
**Pitch:** *"Exército de agentes que mantém o imigrante brasileiro informado sobre tudo de forma contextualizada, onde quer que ele viva."*

**Problema resolvido:** Ausência de cobertura jornalística local contextualizada para a comunidade brasileira nas cidades onde vivem. Sem correspondentes humanos viáveis em escala, agentes virtuais assumem esse papel 24/7.

**Usuários do sistema:**
- **Operadores humanos (2 pessoas):** Equipe da Redação Facebrasil — monitoram, revisam e supervisionam via painel interno
- **Público final:** Imigrante brasileiro — consome o conteúdo de forma transparente nos canais Facebrasil existentes

**Escopo do MVP:**
- Painel interno da Redação (web responsivo)
- Pipeline completo de 6 agentes virtuais
- Eu Repórter (UGC)
- Distribuição multicanal automatizada
- Estrutura Freemium (Pro preparado, não ativo)

---

## 2. Requisitos Funcionais

### RF-01 a RF-05 — Gestão de Agentes
- **RF-01:** Criar, editar, ativar e desativar agentes com atributos: nome, tipo, região, LLM provider e config JSONB
- **RF-02:** Log completo de ações por agente: o que coletou, produziu, corrigiu — com timestamp e status
- **RF-03:** Dashboard de saúde em tempo real: online/offline, última ação, volume/24h, alertas de anomalia
- **RF-04:** Hierarquia regional: País → Estado → Condado → Cidade → Bairro com herança de configurações
- **RF-05:** Suporte a LLM server próprio como primary e Claude/GPT-4o como fallback automático

### RF-06 a RF-12 — Pipeline Editorial
- **RF-06:** Agente Coletor varre RSS, NewsAPI e redes sociais por ciclo configurado, deduplica e enfileira apenas conteúdo novo
- **RF-07:** Agente Jornalista produz artigos em Markdown com: título, subtítulo, corpo, seção "O que isso muda pra você", categoria, tags, região e fontes
- **RF-08:** Agente Arte processa cada artigo: busca imagens licenciadas, gera quando necessário, produz thumbnail e anexa antes de avançar no pipeline
- **RF-09:** Editor Virtual Regional revisa e corrige automaticamente, publica e registra log de todas as alterações
- **RF-10:** Chefe de Redação Virtual monitora Publicados Recentemente, classifica problemas por categoria e age automaticamente ou sinaliza para humano
- **RF-11:** Dois murais em tempo real: "Em Produção" e "Publicados Recentemente"
- **RF-12:** Operadores humanos executam sobre artigos publicados: manter, retornar, corrigir, retirar do ar ou excluir

### RF-13 a RF-17 — Eu Repórter (UGC)
- **RF-13:** Aceitar uploads: vídeo MP4/MOV até 500MB, áudio MP3/WAV até 50MB, texto até 5.000 chars, imagem JPG/PNG/WEBP até 10MB
- **RF-14:** Agente Moderador analisa conteúdo, avalia relevância, classifica por região e encaminha para aprovação ou rejeição
- **RF-15:** Contribuições aprovadas entram na fila do Coletor como pauta prioritária com crédito $0,50–$2,00
- **RF-16:** Rejeições notificam o usuário com motivo claro e não genérico
- **RF-17:** Painel do usuário: histórico de envios, status, saldo de créditos e histórico de recompensas

### RF-18 a RF-21 — Auth e Perfis
- **RF-18:** Dois tipos de perfil: Operador (acesso total) e Usuário Final (portal + Eu Repórter)
- **RF-19:** Autenticação via Supabase Auth + iron-session (cookie httpOnly, secure, sameSite=lax)
- **RF-20:** Perfil armazena: nome, email, cidade/região, idioma, histórico de contribuições, saldo de créditos
- **RF-21:** Estrutura de planos Free/Pro preparada no banco sem ativar cobrança no MVP

### RF-22 a RF-24 — Analytics e Monitoramento
- **RF-22:** Dashboard com KPIs em tempo real: artigos/dia, artigos por região, taxa de correção, volume UGC
- **RF-23:** Métricas por artigo: visualizações, tempo de leitura, compartilhamentos, origem do tráfego
- **RF-24:** Alertas automáticos: agente offline, taxa de rejeição > 20%, fila UGC > 50 itens pendentes

### RF-25 a RF-27 — Distribuição Multicanal
- **RF-25:** Artigos publicados distribuídos automaticamente para: portal web, YouTube, WhatsApp Business e Instagram
- **RF-26:** Formato por canal: artigo completo (web), vídeo com avatar (YouTube), resumo 3 bullets (WhatsApp), Reel 60s (Instagram)
- **RF-27:** Configuração por região de quais canais estão ativos

---

## 3. Database Schema Completo

### Extensions e Types

```sql
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
```

### Tabelas

```sql
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

-- REGIONS (self-reference — suporta Condados)
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
```

### Triggers

```sql
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
  insert into users (auth_id, email, full_name, role)
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
```

### RLS Policies

```sql
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
```

---

## 4. Endpoints

### AUTH
| Método | Path | Descrição | Auth |
|--------|------|-----------|------|
| POST | /auth/login | Login email + senha | público |
| POST | /auth/logout | Encerra sessão | autenticado |
| GET | /auth/me | Perfil do usuário logado | autenticado |

### AGENTS
| Método | Path | Descrição | Auth |
|--------|------|-----------|------|
| GET | /agents | Lista todos os agentes com status | operador |
| POST | /agents | Cria novo agente | operador |
| GET | /agents/{id} | Detalhes + logs recentes | operador |
| PATCH | /agents/{id} | Edita config/região/status | operador |
| DELETE | /agents/{id} | Soft delete | operador |
| GET | /agents/{id}/logs | Histórico completo de ações | operador |
| POST | /agents/{id}/start | Ativa agente | operador |
| POST | /agents/{id}/stop | Pausa agente | operador |

### REGIONS
| Método | Path | Descrição | Auth |
|--------|------|-----------|------|
| GET | /regions | Lista regiões ativas em árvore | público |
| GET | /regions/{slug} | Detalhes da região | público |
| POST | /regions | Cria região | operador |
| PATCH | /regions/{slug} | Edita região | operador |

### SOURCES
| Método | Path | Descrição | Auth |
|--------|------|-----------|------|
| GET | /sources | Lista fontes por região | operador |
| POST | /sources | Adiciona fonte | operador |
| PATCH | /sources/{id} | Edita fonte | operador |
| DELETE | /sources/{id} | Soft delete | operador |

### ARTICLES
| Método | Path | Descrição | Auth |
|--------|------|-----------|------|
| GET | /articles/pipeline | Mural Em Produção (paginado) | operador |
| GET | /articles/published | Mural Publicados Recentemente | operador + público |
| GET | /articles/{slug} | Artigo completo | público |
| PATCH | /articles/{id}/correct | Corrige artigo diretamente | operador |
| PATCH | /articles/{id}/return | Retorna à redação | operador |
| PATCH | /articles/{id}/off-air | Retira do ar | operador |
| DELETE | /articles/{id} | Soft delete | operador |
| GET | /articles/{id}/versions | Histórico de versões | operador |

### UGC
| Método | Path | Descrição | Auth |
|--------|------|-----------|------|
| POST | /ugc/submit | Envia contribuição | usuário |
| GET | /ugc/my-submissions | Histórico próprio | usuário |
| GET | /ugc/queue | Fila de moderação | operador |
| PATCH | /ugc/{id}/approve | Aprova e define crédito | operador |
| PATCH | /ugc/{id}/reject | Rejeita com motivo | operador |

### CREDITS
| Método | Path | Descrição | Auth |
|--------|------|-----------|------|
| GET | /credits/balance | Saldo atual | usuário |
| GET | /credits/history | Histórico de créditos | usuário |

### ALERTS
| Método | Path | Descrição | Auth |
|--------|------|-----------|------|
| GET | /alerts | Alertas abertos | operador |
| PATCH | /alerts/{id}/acknowledge | Reconhece alerta | operador |
| PATCH | /alerts/{id}/resolve | Resolve alerta | operador |

### METRICS
| Método | Path | Descrição | Auth |
|--------|------|-----------|------|
| GET | /metrics/dashboard | KPIs gerais | operador |
| GET | /metrics/articles/{id} | Métricas por artigo | operador |
| GET | /metrics/regions/{slug} | Métricas por região | operador |
| GET | /metrics/agents | Performance dos agentes | operador |

### WEBSOCKET
| Tipo | Path | Descrição | Auth |
|------|------|-----------|------|
| WS | /ws/pipeline | Updates em tempo real do mural | operador |
| WS | /ws/alerts | Alertas em tempo real | operador |

### HEALTH
| Método | Path | Descrição | Auth |
|--------|------|-----------|------|
| GET | /health | Status da API | público |
| GET | /health/agents | Status de todos os agentes | operador |

---

## 5. Agent Graphs (LangGraph)

### Collector Graph (linear)
```
fetch_sources → filter_relevance → deduplicate → score_priority → enqueue_articles
```

### Journalist Graph (linear com retry)
```
receive_headline → research_context → translate_culturalize → write_article → validate_structure → send_to_art
```

**Regras de prompt (prompts/journalist_v1.md):**
- Escrever em Markdown limpo — sem asteriscos desnecessários no meio de parágrafos
- Usar `##` apenas para títulos de seção e listas apenas quando essencial
- Seção "O que isso muda pra você" obrigatória em todo artigo
- Tom: informativo, acessível, culturalmente próximo do imigrante brasileiro
- Citar fontes ao final

### Art Graph (linear com fallback)
```
receive_article → search_stock_images → [found?] → select_best → create_thumbnail → attach_to_article
                                            ↓ [not found]
                                        generate_image (Stable Diffusion local)
```

### Regional Editor Graph (dinâmico)
```
receive_article → analyze_quality → [decision] → correct_and_publish → log_corrections
```

### Chief Editor Graph (dinâmico)
```
monitor_published → [problem_found?] → classify_problem → [severity]
                                                              ↓ low → flag_for_human
                                                              ↓ high → act_automatically
```

### Moderator Graph (linear com score)
```
receive_ugc → analyze_content → score_relevance → [threshold 0.8] → approve_and_credit / reject_with_reason
```

### LLM Factory
```python
async def get_llm(task_type: str) -> BaseChatModel:
    if await is_local_llm_available():
        return local_llm_client(model=LOCAL_MODEL_MAP[task_type])
    await log_fallback_event(task_type, provider="claude")
    if await is_claude_available():
        return ChatAnthropic(model="claude-sonnet-4-6")
    return ChatOpenAI(model="gpt-4o")
```

---

## 6. Auth Middleware

```
FRONTEND (Next.js)
    └── POST /api/proxy/auth/login
          └── Next.js API Route → POST backend /auth/login
                └── Supabase Auth valida → retorna user_id
                      └── iron-session cria cookie httpOnly

REQUEST AUTENTICADO
    └── GET /api/proxy/[...path]
          └── Next.js API Route:
                1. Lê iron-session cookie
                2. Extrai user_id e role
                3. Adiciona X-User-Id + X-User-Role + X-Internal-Key
                4. Faz request para FastAPI
          └── FastAPI middleware:
                1. Valida X-Internal-Key
                2. Valida X-User-Id presente
                3. Verifica role para a rota
                4. Injeta user via dependency injection
```

---

## 7. Integrações Externas

| Serviço | Uso | Timeout |
|---------|-----|---------|
| LLM Server próprio | Primary LLM para todos os agentes | 30s |
| Claude API (Anthropic) | Fallback LLM 1 | 30s |
| GPT-4o (OpenAI) | Fallback LLM 2 | 30s |
| NewsAPI / GNews | Coleta de headlines por cidade | 10s |
| Unsplash API | Imagens licenciadas (Arte) | 10s |
| Pexels API | Segunda fonte de imagens (Arte) | 10s |
| YouTube Data API v3 | Publicação de vídeos | 10s |
| WhatsApp Business API | Distribuição de resumos | 10s |
| Meta Graph API | Instagram Reels e Stories | 10s |
| Stripe API | Billing — preparado, não ativo no MVP | 10s |
| Supabase Auth | Autenticação de usuários | 10s |
| Supabase Storage | Storage de mídia e UGC | 10s |

---

## 8. Requisitos Não-Funcionais

- API responde em < 500ms para operações síncronas
- Pipeline de agentes totalmente assíncrono via Celery + Redis
- Streaming via SSE internamente entre agentes
- Todos os agentes com Structured Output (Pydantic) — nunca texto livre para dados estruturados
- Logs estruturados em JSON — nunca dados sensíveis
- Soft delete em todas as tabelas
- Backup automático do banco a cada 24h com retenção de 30 dias
- Zero downtime deploy com Docker

---

## 9. Security Checklist

```
✅ iron-session httpOnly + secure + sameSite=lax
✅ SESSION_SECRET 32+ chars em variável de ambiente
✅ Frontend nunca fala direto com backend — proxy Next.js obrigatório
✅ X-Internal-Key valida origem dos requests
✅ X-User-Id validado em todas as rotas protegidas via dependency injection
✅ RLS habilitado em 14/14 tabelas
✅ Operações de escrita em tabelas públicas via service_role
✅ Pydantic validation em todos os endpoints
✅ Rate limiting: auth 5/min · upload 10/hora · agente 100/hora · geral 300/min
✅ File upload com validação de magic bytes
✅ CORS restritivo — apenas domínios do frontend
✅ Logs estruturados em JSON — nunca dados sensíveis
✅ Secrets exclusivamente em .env
✅ Exceptions customizadas — nunca stack trace retornado ao cliente
✅ Timeouts em todas as chamadas externas
✅ Soft delete em todas as tabelas
✅ IDs internos nunca expostos em URLs do frontend
```

---

## 10. Stack e Dependências

```txt
# requirements.txt
fastapi==0.115.0
uvicorn[standard]==0.30.0
pydantic==2.7.0
pydantic-settings==2.3.0
supabase==2.5.0
langgraph==0.1.0
langchain-anthropic==0.1.0
langchain-openai==0.1.0
celery==5.4.0
redis==5.0.0
slowapi==0.1.9
httpx==0.27.0
python-multipart==0.0.9
pillow==10.3.0
python-magic==0.4.27
structlog==24.2.0
```

---

## 11. Estrutura de Pastas

```
backend/
├── main.py
├── requirements.txt
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── core/
│   ├── config.py
│   ├── database.py
│   ├── redis.py
│   ├── security.py
│   ├── exceptions.py
│   └── middleware.py
├── prompts/
│   ├── collector_v1.md
│   ├── journalist_v1.md
│   ├── art_v1.md
│   ├── regional_editor_v1.md
│   ├── chief_editor_v1.md
│   └── moderator_v1.md
├── agents/
│   ├── base.py
│   ├── llm.py
│   ├── collector/
│   ├── journalist/
│   ├── art/
│   ├── regional_editor/
│   ├── chief_editor/
│   └── moderator/
├── workers/
│   ├── celery_app.py
│   ├── collector_worker.py
│   ├── journalist_worker.py
│   ├── art_worker.py
│   ├── editor_worker.py
│   ├── distribution_worker.py
│   └── moderation_worker.py
├── domains/
│   ├── agents/
│   ├── articles/
│   ├── regions/
│   ├── sources/
│   ├── ugc/
│   ├── credits/
│   ├── alerts/
│   ├── metrics/
│   └── auth/
└── integrations/
    ├── newsapi.py
    ├── unsplash.py
    ├── pexels.py
    ├── youtube.py
    ├── whatsapp.py
    ├── instagram.py
    └── stripe.py
```

---

## 12. .env.example

```bash
# SESSION
SESSION_SECRET=                    # 32+ caracteres obrigatório

# SUPABASE
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# INTERNAL API
INTERNAL_API_KEY=

# LLM
LOCAL_LLM_URL=
LOCAL_LLM_MODEL=
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# REDIS
REDIS_URL=

# INTEGRAÇÕES
NEWSAPI_KEY=
UNSPLASH_ACCESS_KEY=
PEXELS_API_KEY=
YOUTUBE_API_KEY=
WHATSAPP_TOKEN=
META_ACCESS_TOKEN=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# APP
NODE_ENV=development
BACKEND_URL=
```
