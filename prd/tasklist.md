# Task List - 1FBR-Redacao

Lista de tarefas derivadas do `implementation-plan.md`, com o mapeamento das skills (da pasta `.agent/skills`) que serão utilizadas para cada etapa do projeto.

---

## Batch 1 — Infraestrutura e Configuração Base
*Foco na estrutura inicial e infra.*
- [ ] **Task 1.1** — Criar estrutura de pastas do projeto
  - **Skills:** `backend-dev-guidelines`, `frontend-dev-guidelines`
- [ ] **Task 1.2** — Criar .env.example do backend
  - **Skills:** `backend-dev-guidelines`, `backend-security-coder`
- [ ] **Task 1.3** — Criar .env.example do frontend
  - **Skills:** `frontend-dev-guidelines`
- [ ] **Task 1.4** — Configurar Docker Compose
  - **Skills:** `backend-dev-guidelines`, `frontend-dev-guidelines`
- [ ] **Task 1.5** — Criar Dockerfile do backend
  - **Skills:** `backend-dev-guidelines`
- [ ] **Task 1.6** — Criar Dockerfile do frontend
  - **Skills:** `frontend-dev-guidelines`

## Batch 2 — Database (Supabase)
*Foco na modelagem de banco, RLS e Storage.*
- [ ] **Task 2.1** — Criar extensions e enum types
  - **Skills:** `backend-dev-guidelines`
- [ ] **Task 2.2** — Criar tabelas: users, plans, regions
  - **Skills:** `backend-dev-guidelines`
- [ ] **Task 2.3** — Criar tabelas: sources, agents, agent_logs
  - **Skills:** `backend-dev-guidelines`
- [ ] **Task 2.4** — Criar tabelas: articles, article_versions, article_media
  - **Skills:** `backend-dev-guidelines`
- [ ] **Task 2.5** — Criar tabelas: distributions, ugc_submissions, credits, alerts, metrics
  - **Skills:** `backend-dev-guidelines`
- [ ] **Task 2.6** — Criar triggers (updated_at + handle_new_user)
  - **Skills:** `backend-dev-guidelines`
- [ ] **Task 2.7** — Habilitar RLS e criar policies
  - **Skills:** `backend-security-coder`, `backend-dev-guidelines`
- [ ] **Task 2.8** — Configurar Supabase Storage buckets
  - **Skills:** `backend-dev-guidelines`, `backend-security-coder`

## Batch 3 — Backend Core
*Foco na fundação da API.*
- [ ] **Task 3.1** — Criar main.py e core/config.py
  - **Skills:** `backend-dev-guidelines`
- [ ] **Task 3.2** — Criar core/database.py e core/redis.py
  - **Skills:** `backend-dev-guidelines`
- [ ] **Task 3.3** — Criar core/exceptions.py com exceptions customizadas
  - **Skills:** `backend-dev-guidelines`
- [ ] **Task 3.4** — Criar core/middleware.py (CORS + rate limiting + auth)
  - **Skills:** `backend-dev-guidelines`, `backend-security-coder`
- [ ] **Task 3.5** — Criar core/security.py (dependency injection de usuário)
  - **Skills:** `backend-dev-guidelines`, `backend-security-coder`
- [ ] **Task 3.6** — Criar domain auth (router + service + schemas)
  - **Skills:** `backend-dev-guidelines`, `backend-security-coder`
- [ ] **Task 3.7** — Criar domain regions (router + service + schemas)
  - **Skills:** `backend-dev-guidelines`
- [ ] **Task 3.8** — Criar domain agents (router + service + schemas)
  - **Skills:** `backend-dev-guidelines`
- [ ] **Task 3.9** — Criar domain sources (router + service + schemas)
  - **Skills:** `backend-dev-guidelines`
- [ ] **Task 3.10** — Criar domain articles (router + service + schemas)
  - **Skills:** `backend-dev-guidelines`
- [ ] **Task 3.11** — Criar domain ugc (router + service + schemas)
  - **Skills:** `backend-dev-guidelines`, `backend-security-coder`
- [ ] **Task 3.12** — Criar domain credits, alerts, metrics
  - **Skills:** `backend-dev-guidelines`
- [ ] **Task 3.13** — Criar WebSocket endpoints
  - **Skills:** `backend-dev-guidelines`
- [ ] **Task 3.14** — Criar health endpoints
  - **Skills:** `backend-dev-guidelines`

## Batch 4 — Backend Workers (Celery)
*Foco na comunicação assíncrona baseada no Celery/Redis.*
- [ ] **Task 4.1 a 4.7** — Configurar app e criar task workers
  - **Skills:** `backend-dev-guidelines`

## Batch 5 — Backend Agentes (LangGraph)
*Foco na modelagem do LangGraph e integração com LLMs.*
- [ ] **Task 5.1 e 5.2** — Criar LLM factory e base agent
  - **Skills:** `backend-dev-guidelines`
- [ ] **Task 5.3** — Criar prompts de todos os agentes
  - **Skills:** `content-creator`, `copywriting`
- [ ] **Task 5.4 a 5.9** — Implementar Grafos (Collector, Journalist, Art, Editor, Chief, Moderator)
  - **Skills:** `backend-dev-guidelines`, `machine-learning-ops-ml-pipeline`
- [ ] **Task 5.10** — Criar integrações externas
  - **Skills:** `backend-dev-guidelines`, `youtube-automation`, `whatsapp-automation`

## Batch 6 — Frontend Setup
*Foco na estrutura do WebApp React/Next.js/Tailwind.*
- [ ] **Task 6.1 a 6.4** — Setup, Design Tokens, Fontes, e Componentes shadcn/ui
  - **Skills:** `frontend-dev-guidelines`, `ui-skills`, `ui-ux-designer`, `ui-ux-pro-max`
- [ ] **Task 6.5 a 6.7** — Auth Middleware (iron-session) e Proxy API route
  - **Skills:** `frontend-dev-guidelines`, `backend-security-coder`
- [ ] **Task 6.8 e 6.9** — API lib, WebSockets, Markdown e formatadores
  - **Skills:** `frontend-dev-guidelines`

## Batch 7 — Frontend — Autenticação
*Foco na interface de autenticação e proteção de rotas client-side.*
- [ ] **Task 7.1** — Criar página de login
  - **Skills:** `frontend-dev-guidelines`, `ui-ux-pro-max`, `frontend-mobile-development-component-scaffold`
- [ ] **Task 7.2** — Criar useAuth hook e layout de auth
  - **Skills:** `frontend-dev-guidelines`

## Batch 8 — Frontend — Layout Principal
*Foco na identidade visual macro e navegação (Sidebar/Header).*
- [ ] **Task 8.1** — Criar layout da Redação com Sidebar
  - **Skills:** `frontend-dev-guidelines`, `ui-ux-pro-max`, `ui-ux-designer`, `frontend-mobile-development-component-scaffold`
- [ ] **Task 8.2** — Criar SidebarNav com badges em tempo real
  - **Skills:** `frontend-dev-guidelines`, `ui-ux-pro-max`
- [ ] **Task 8.3** — Criar Header com perfil do operador
  - **Skills:** `frontend-dev-guidelines`, `ui-ux-pro-max`

## Batch 9 — Frontend — Murais
*Foco em listagens, visualização de conteúdo, editor Kanban-like e Real-time.*
- [ ] **Task 9.1** — Criar ArticleCard com status e presença
  - **Skills:** `frontend-dev-guidelines`, `ui-ux-pro-max`, `frontend-mobile-development-component-scaffold`
- [ ] **Task 9.2** — Criar ArticleDrawer com editor Markdown
  - **Skills:** `frontend-dev-guidelines`, `ui-ux-designer`, `ui-ux-pro-max`
- [ ] **Task 9.3** — Criar Mural Em Produção com WebSocket
  - **Skills:** `frontend-dev-guidelines`, `ui-ux-pro-max`
- [ ] **Task 9.4** — Criar Mural Publicados com ações e presença
  - **Skills:** `frontend-dev-guidelines`, `ui-ux-pro-max`
- [ ] **Task 9.5** — Criar usePresence hook
  - **Skills:** `frontend-dev-guidelines`

## Batch 10 — Frontend — Agentes
*Foco no dashboard e gerenciamento dos agentes de IA.*
- [ ] **Task 10.1** — Criar Dashboard de Agentes
  - **Skills:** `frontend-dev-guidelines`, `ui-ux-pro-max`
- [ ] **Task 10.2** — Criar página de detalhes do agente
  - **Skills:** `frontend-dev-guidelines`, `ui-ux-pro-max`
- [ ] **Task 10.3** — Criar formulário de novo agente
  - **Skills:** `frontend-dev-guidelines`, `ui-ux-pro-max`

## Batch 11 — Frontend — Eu Repórter
*Foco em listagem e aprovação de User Generated Content (UGC).*
- [ ] **Task 11.1** — Criar fila de moderação UGC
  - **Skills:** `frontend-dev-guidelines`, `ui-ux-pro-max`
- [ ] **Task 11.2** — Criar UGCCard com player e ações
  - **Skills:** `frontend-dev-guidelines`, `ui-ux-pro-max`, `frontend-mobile-development-component-scaffold`

## Batch 12 — Frontend — Regiões, Analytics e Alertas
*Foco no controle regional e visões analíticas.*
- [ ] **Task 12.1** — Criar árvore de regiões
  - **Skills:** `frontend-dev-guidelines`, `ui-ux-pro-max`
- [ ] **Task 12.2** — Criar página de analytics
  - **Skills:** `frontend-dev-guidelines`, `kpi-dashboard-design`, `ui-ux-pro-max`
- [ ] **Task 12.3** — Criar central de alertas
  - **Skills:** `frontend-dev-guidelines`, `ui-ux-pro-max`

## Batch 13 — Integração Frontend ↔ Backend
*Foco em testes de fluxo End-to-End (E2E).*
- [ ] **Task 13.1 a 13.6** — Testar fluxos E2E (Login, Pipeline, Presença, Repórter, Alertas, Canais)
  - **Skills:** `frontend-dev-guidelines`, `backend-dev-guidelines`

## Batch 14 — Segurança e Hardening
*Foco em testes de vulnerabilidade.*
- [ ] **Task 14.1** — Testar isolamento RLS
  - **Skills:** `backend-security-coder`
- [ ] **Task 14.2** — Testar rate limiting
  - **Skills:** `backend-security-coder`
- [ ] **Task 14.3** — Testar validação de upload
  - **Skills:** `backend-security-coder`
- [ ] **Task 14.4** — Verificar que user_id nunca é exposto
  - **Skills:** `backend-security-coder`, `frontend-dev-guidelines`
- [ ] **Task 14.5** — Verificar variáveis de ambiente
  - **Skills:** `backend-security-coder`, `frontend-dev-guidelines`

## Batch 15 — Deploy na VPS
*Foco na infraestrutura produtiva.*
- [ ] **Task 15.1 e 15.2** — Nginx reverse proxy e SSL/TLS
  - **Skills:** `backend-dev-guidelines`, `backend-security-coder`
- [ ] **Task 15.3 e 15.4** — Backups e teste de instâncias (Smoke test)
  - **Skills:** `backend-dev-guidelines`, `frontend-dev-guidelines`
