# FBR-Redacao — Painel Interno da Redação FBR

Sistema de gestão de conteúdo jornalístico da **Rádio Face Brasil**, construído com arquitetura FBR canônica: n8n para orquestração, OpenClaw para execução de agentes de IA, e FastAPI + Next.js para exposição e consumo de dados.

---

## Arquitetura

```
OpenClaw Agents  →  n8n Workflows  →  FastAPI Backend  →  Next.js Frontend
                                          ↕
                                   Supabase (Postgres + Storage)
                                          ↕
                                       Redis
```

### Serviços

| Serviço | Tecnologia | Função |
|---|---|---|
| Backend | FastAPI + Python | API REST + Webhooks FBR |
| Frontend | Next.js 16 + Tailwind v4 | Painel interno da Redação |
| Banco | Supabase (Postgres) | Dados + RLS + Storage |
| Cache | Redis | Rate limiting + status LLMs |
| Auth | Iron Session (httpOnly cookie) | Sessão servidor → proxy |

---

## Features

### Murais
- **Em Produção** — visualização em tempo real (WebSocket) dos artigos sendo produzidos pelos agentes
- **Publicados** — mural editorial com ações de edição, arquivamento e republicação

### Agentes FBR (OpenClaw)
- Dashboard de status dos 6 agentes da redação: Coletor, Jornalista, Arte, Editor Regional, Chefe de Redação, Moderador UGC
- Cada agente vive em repositório Git isolado com 7 Markdowns canônicos (SOUL, IDENTITY, TASKS, AGENTS, MEMORY, TOOLS, USER)
- Logs de execução e health check por agente

### Eu Repórter (UGC)
- Fila de moderação de conteúdo enviado por cidadãos
- Upload com validação de MIME type (imagem/vídeo) e tamanho máximo configurável
- Aprovação com um clique ou escalada para o FBR-Click

### Canais de Distribuição
- Visão consolidada dos canais ativos: Website, App, Newsletter, Redes Sociais, API
- Contagem de distribuições por canal com percentual relativo

### Regiões
- Árvore hierárquica de regiões cobertas pela redação
- Filtro de artigos e agentes por região

### Analytics
- Dashboard com métricas de produção: artigos por dia, tempo médio de produção, taxa de aprovação UGC
- Charts interativos via Recharts

### Central de Alertas
- Feed em tempo real de alertas do sistema (agentes offline, erros de pipeline, anomalias detectadas)

---

## Segurança

- Autenticação via **iron-session** (cookie httpOnly — token nunca exposto ao JS)
- Todo request do frontend passa pelo **proxy autenticado** (`/api/proxy/[...path]`)
- FastAPI valida o **header `X-User-Id`** injetado pelo proxy em todas as rotas protegidas
- **RLS habilitado** em todas as tabelas do Supabase
- **CORS restritivo** via `ALLOWED_ORIGINS` (sem wildcard em produção)
- **Rate limiting**: 30 req/min por IP em rotas sensíveis (`/auth`, `/ugc`, `/distributions`)
- Webhooks FBR protegidos por `X-OpenClaw-Webhook-Key` e `X-N8N-Webhook-Key`
- Variáveis sensíveis exclusivamente em `.env` — nunca com prefixo `NEXT_PUBLIC_`

---

## Integrações FBR

### OpenClaw (Agentes)
- `POST /api/v1/webhooks/openclaw/article-produced` — recebe artigo finalizado pelo Agente Editor Regional
- `POST /api/v1/webhooks/n8n/cycle-completed` — recebe confirmação de ciclo pelo orquestrador n8n
- `POST /api/v1/webhooks/fbr-click/interaction` — recebe aprovações humanas via chat FBR-Click

### n8n Workflows (blueprints em `/n8n-workflows/`)
| Arquivo | Função |
|---|---|
| `Fluxo_Coleta.json` | Cron → Coletor → FastAPI |
| `Fluxo_Producao.json` | Artigo recebido → Jornalista → Arte → Editor Regional |
| `Fluxo_UGC.json` | Submissão UGC → Moderador |
| `Fluxo_FBR_Click.json` | Alertas e aprovações via chat |

---

## Deploy (Easypanel)

1. Conectar o repositório GitHub ao Easypanel
2. Criar 3 serviços: `backend`, `frontend`, `redis`
3. Copiar variáveis de `.env.example` de cada serviço e preencher no painel
4. Easypanel gerencia SSL/TLS e reverse proxy automaticamente

### Variáveis essenciais de produção

**Backend:**
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `SESSION_SECRET` (mínimo 32 chars)
- `ALLOWED_ORIGINS` (ex: `https://redacao.facebrasil.com.br`)
- `OPENCLAW_WEBHOOK_KEY`, `N8N_WEBHOOK_KEY`

**Frontend:**
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- `SESSION_SECRET` (mesmo valor do backend)
- `BACKEND_URL` (URL interna do serviço backend no Easypanel)

---

## Estrutura do Projeto

```
fbr-redacao/
├── backend/               # FastAPI — API REST + Webhooks
│   ├── api/               # Roteador principal
│   ├── core/              # Config, segurança, middleware, exceções
│   ├── domain/            # Domínios: articles, auth, regions, ugc, distributions...
│   └── ws/                # WebSocket endpoints
├── frontend/              # Next.js 16 — Painel da Redação
│   └── src/
│       ├── app/           # Pages (App Router)
│       ├── components/    # Layout, ui, cards
│       └── lib/           # Supabase client (server-only)
├── n8n-workflows/         # Blueprints JSON para importar no n8n
├── openclaw-agents/       # (gitignored) — repos isolados por agente
└── docker-compose.yml     # Backend + Frontend + Redis
```

---

## Desenvolvimento Local

```bash
# 1. Copiar e preencher as variáveis
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# 2. Subir os serviços
docker compose up -d

# 3. Frontend em hot-reload (opcional)
cd frontend && npm run dev
```
