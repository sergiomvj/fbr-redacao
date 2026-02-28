# Plano de Implantação — FBR-Redacao
> Documento gerado pelo workflow /build-saas · Fevereiro 2026  
> Versão 1.0 · Confidencial — Uso Interno Facebrasil

---

## Como usar este documento

Cada tarefa tem duração estimada de **5 a 15 minutos** e inclui:
- **Arquivos envolvidos** — o que criar ou editar
- **Referência** — seção do PRD correspondente
- **Verificação** — como confirmar que a tarefa foi concluída corretamente

Execute os batches em ordem. Não pule para o próximo batch sem verificar o atual.

---

## Batch 1 — Infraestrutura e Configuração Base

### Task 1.1 — Criar estrutura de pastas do projeto
**Arquivos:** `/backend/`, `/frontend/`, `/docs/`  
**Ação:**
```bash
mkdir -p backend/{core,prompts,agents/{collector,journalist,art,regional_editor,chief_editor,moderator},workers,domains/{agents,articles,regions,sources,ugc,credits,alerts,metrics,auth},integrations}
mkdir -p frontend/{app/{(auth)/login,(redacao)/{murals/{producao,publicados},agentes,eu-reporter,regioes,analytics,alertas},api/proxy},components/{layout,murais,agentes,eu-reporter,regioes,analytics,alertas,ui},hooks,lib}
```
**Verificação:** Estrutura de pastas criada conforme PRD Backend seção 11 e PRD Frontend seção 12

---

### Task 1.2 — Criar .env.example do backend
**Arquivos:** `backend/.env.example`, `backend/.env`  
**Referência:** PRD Backend seção 12  
**Ação:** Copiar .env.example do PRD Backend. Criar .env com valores reais (nunca commitar).  
**Verificação:** `cat backend/.env.example` mostra todas as variáveis sem valores reais

---

### Task 1.3 — Criar .env.example do frontend
**Arquivos:** `frontend/.env.example`, `frontend/.env.local`  
**Referência:** PRD Frontend seção 13  
**Ação:** Copiar .env.example do PRD Frontend. Criar .env.local com valores reais.  
**Verificação:** `cat frontend/.env.example` mostra todas as variáveis sem valores reais

---

### Task 1.4 — Configurar Docker Compose
**Arquivos:** `docker-compose.yml`  
**Ação:** Criar docker-compose.yml com serviços:
```yaml
version: "3.9"
services:
  backend:
    build: ./backend
    ports: ["8000:8000"]
    env_file: ./backend/.env
    depends_on: [redis]
  
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    env_file: ./frontend/.env.local
    depends_on: [backend]
  
  worker:
    build: ./backend
    command: celery -A workers.celery_app worker --loglevel=info
    env_file: ./backend/.env
    depends_on: [redis, backend]
  
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
  
  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```
**Verificação:** `docker-compose config` sem erros

---

### Task 1.5 — Criar Dockerfile do backend
**Arquivos:** `backend/Dockerfile`
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```
**Verificação:** `docker build -t fbr-backend ./backend` sem erros

---

### Task 1.6 — Criar Dockerfile do frontend
**Arquivos:** `frontend/Dockerfile`
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
CMD ["node", "server.js"]
```
**Verificação:** `docker build -t fbr-frontend ./frontend` sem erros

---

## Batch 2 — Database (Supabase)

### Task 2.1 — Criar extensions e enum types
**Arquivo:** Supabase SQL Editor  
**Referência:** PRD Backend seção 3 — "Extensions e Types"  
**Ação:** Executar o bloco SQL de extensions e enums no Supabase SQL Editor  
**Verificação:** `select typname from pg_type where typtype = 'e'` retorna todos os 14 enums

---

### Task 2.2 — Criar tabelas: users, plans, regions
**Arquivo:** Supabase SQL Editor  
**Referência:** PRD Backend seção 3 — tabelas users, plans, regions  
**Ação:** Executar SQL das 3 tabelas + seed de plans e regions  
**Verificação:** Tables aparecem no Supabase Table Editor. Seed: `select count(*) from plans` retorna 2

---

### Task 2.3 — Criar tabelas: sources, agents, agent_logs
**Arquivo:** Supabase SQL Editor  
**Referência:** PRD Backend seção 3 — tabelas sources, agents, agent_logs  
**Ação:** Executar SQL das 3 tabelas + indexes  
**Verificação:** Indexes criados — `select indexname from pg_indexes where tablename in ('sources','agents','agent_logs')`

---

### Task 2.4 — Criar tabelas: articles, article_versions, article_media
**Arquivo:** Supabase SQL Editor  
**Referência:** PRD Backend seção 3 — tabelas articles, article_versions, article_media  
**Ação:** Executar SQL das 3 tabelas + indexes de busca full-text  
**Verificação:** `select indexname from pg_indexes where tablename = 'articles'` retorna 6 indexes incluindo os gin

---

### Task 2.5 — Criar tabelas: distributions, ugc_submissions, credits, alerts, metrics
**Arquivo:** Supabase SQL Editor  
**Referência:** PRD Backend seção 3 — tabelas restantes  
**Ação:** Executar SQL das 5 tabelas restantes  
**Verificação:** `select count(*) from information_schema.tables where table_schema = 'public'` retorna 14

---

### Task 2.6 — Criar triggers (updated_at + handle_new_user)
**Arquivo:** Supabase SQL Editor  
**Referência:** PRD Backend seção 3 — "Triggers"  
**Ação:** Executar SQL dos triggers  
**Verificação:** Criar usuário de teste no Supabase Auth → verificar se row foi criada em `public.users` automaticamente

---

### Task 2.7 — Habilitar RLS e criar policies
**Arquivo:** Supabase SQL Editor  
**Referência:** PRD Backend seção 3 — "RLS Policies"  
**Ação:** Executar SQL de enable RLS + todas as policies  
**Verificação:** No Supabase Table Editor, todas as 14 tabelas mostram RLS habilitado. Testar isolamento: User A não acessa dados do User B

---

### Task 2.8 — Configurar Supabase Storage buckets
**Arquivo:** Supabase Storage  
**Ação:** Criar buckets:
- `ugc-uploads` — privado (apenas service_role acessa)
- `article-media` — público (imagens dos artigos)
- `thumbnails` — público (thumbnails gerados)

**Verificação:** Buckets criados com policies corretas no Storage

---

## Batch 3 — Backend Core

### Task 3.1 — Criar main.py e core/config.py
**Arquivos:** `backend/main.py`, `backend/core/config.py`  
**Referência:** PRD Backend seção 11  
**Ação:**
```python
# core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str
    internal_api_key: str
    redis_url: str
    local_llm_url: str
    local_llm_model: str
    anthropic_api_key: str
    openai_api_key: str
    session_secret: str
    env: str = "development"
    
    class Config:
        env_file = ".env"

settings = Settings()
```
**Verificação:** `python -c "from core.config import settings; print(settings.env)"` retorna "development"

---

### Task 3.2 — Criar core/database.py e core/redis.py
**Arquivos:** `backend/core/database.py`, `backend/core/redis.py`  
**Ação:** Clientes Supabase (anon + service_role) e Redis com conexão lazy  
**Verificação:** `python -c "from core.database import supabase; print('ok')"` sem erros

---

### Task 3.3 — Criar core/exceptions.py com exceptions customizadas
**Arquivo:** `backend/core/exceptions.py`  
**Referência:** PRD Backend seção 9 — Security Checklist  
```python
class FBRException(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code

class UnauthorizedException(FBRException):
    def __init__(self): super().__init__("Não autorizado", 401)

class AgentNotFoundException(FBRException): ...
class ArticleNotFoundException(FBRException): ...
class InvalidFileException(FBRException): ...
class QuotaExceededException(FBRException): ...
class InvalidRegionException(FBRException): ...
```
**Verificação:** `from core.exceptions import UnauthorizedException` sem erros

---

### Task 3.4 — Criar core/middleware.py (CORS + rate limiting + auth)
**Arquivo:** `backend/core/middleware.py`  
**Referência:** PRD Backend seção 6 — Auth Middleware e seção 9 — Security  
**Ação:** CORS restritivo + X-Internal-Key validation + X-User-Id injection + slowapi rate limiting  
**Verificação:** Request sem X-Internal-Key retorna 401. Request de origem não permitida retorna 403.

---

### Task 3.5 — Criar core/security.py (dependency injection de usuário)
**Arquivo:** `backend/core/security.py`  
```python
async def get_current_user(x_user_id: str = Header(...)) -> User:
    """Valida X-User-Id e retorna usuário injetado em todas as rotas protegidas"""
    user = await fetch_user_by_id(x_user_id)
    if not user:
        raise UnauthorizedException()
    return user

async def require_operator(user: User = Depends(get_current_user)) -> User:
    if user.role != "operator":
        raise UnauthorizedException()
    return user
```
**Verificação:** Rota com `Depends(require_operator)` rejeita usuário com role="user"

---

### Task 3.6 — Criar domain auth (router + service + schemas)
**Arquivos:** `backend/domains/auth/router.py`, `service.py`, `schemas.py`  
**Referência:** PRD Backend seção 4 — Endpoints AUTH  
**Ação:** POST /auth/login, POST /auth/logout, GET /auth/me  
**Verificação:** `POST /auth/login` com credenciais válidas retorna 200. Com credenciais inválidas retorna 401.

---

### Task 3.7 — Criar domain regions (router + service + schemas)
**Arquivos:** `backend/domains/regions/`  
**Referência:** PRD Backend seção 4 — Endpoints REGIONS  
**Ação:** GET /regions (tree), GET /regions/{slug}, POST /regions, PATCH /regions/{slug}  
**Verificação:** GET /regions retorna árvore hierárquica com as 4 regiões seed

---

### Task 3.8 — Criar domain agents (router + service + schemas)
**Arquivos:** `backend/domains/agents/`  
**Referência:** PRD Backend seção 4 — Endpoints AGENTS  
**Ação:** CRUD completo + /start + /stop + /logs  
**Verificação:** POST /agents cria agente. GET /agents lista com status. POST /agents/{id}/start muda status para "online".

---

### Task 3.9 — Criar domain sources (router + service + schemas)
**Arquivos:** `backend/domains/sources/`  
**Referência:** PRD Backend seção 4 — Endpoints SOURCES  
**Ação:** CRUD de fontes por região  
**Verificação:** POST /sources cria fonte vinculada a região. Soft delete funciona.

---

### Task 3.10 — Criar domain articles (router + service + schemas)
**Arquivos:** `backend/domains/articles/`  
**Referência:** PRD Backend seção 4 — Endpoints ARTICLES  
**Ação:** /pipeline, /published, /{slug}, /correct, /return, /off-air, DELETE, /versions  
**Verificação:** GET /articles/pipeline retorna apenas artigos com status != published. GET /articles/published retorna apenas published.

---

### Task 3.11 — Criar domain ugc (router + service + schemas)
**Arquivos:** `backend/domains/ugc/`  
**Referência:** PRD Backend seção 4 — Endpoints UGC e RF-13 a RF-17  
**Ação:** POST /ugc/submit com validação de magic bytes + MIME + tamanho. GET /ugc/queue. PATCH approve/reject.  
**Verificação:** Upload de arquivo .exe disfarçado de .mp4 é rejeitado. Upload válido é aceito e salvo no Storage.

---

### Task 3.12 — Criar domain credits, alerts, metrics
**Arquivos:** `backend/domains/credits/`, `backend/domains/alerts/`, `backend/domains/metrics/`  
**Referência:** PRD Backend seção 4 — Endpoints CREDITS, ALERTS, METRICS  
**Verificação:** GET /credits/balance retorna saldo correto. GET /alerts retorna apenas alertas abertos.

---

### Task 3.13 — Criar WebSocket endpoints
**Arquivo:** `backend/main.py` (adicionar WS routes)  
**Referência:** PRD Backend seção 4 — WEBSOCKET  
**Ação:** WS /ws/pipeline e WS /ws/alerts com autenticação via X-Internal-Key no handshake  
**Verificação:** Conectar via wscat — recebe eventos ao criar/atualizar artigo

---

### Task 3.14 — Criar health endpoints
**Arquivo:** `backend/domains/health/router.py`  
**Ação:** GET /health (público) e GET /health/agents (operador)  
**Verificação:** GET /health retorna 200 com status de todos os serviços dependentes

---

## Batch 4 — Backend Workers (Celery)

### Task 4.1 — Configurar Celery app
**Arquivo:** `backend/workers/celery_app.py`  
**Ação:** Configurar Celery com Redis como broker e backend. Definir filas por tipo de worker: `collector`, `journalist`, `art`, `editor`, `distribution`, `moderation`  
**Verificação:** `celery -A workers.celery_app inspect ping` retorna resposta de todos os workers

---

### Task 4.2 — Criar collector worker
**Arquivo:** `backend/workers/collector_worker.py`  
**Ação:** Task periódica que dispara Agente Coletor por região ativa. Usa beat schedule para ciclo configurável por agente.  
**Verificação:** Task executa sem erro. Logs mostram headlines coletadas e enfileiradas.

---

### Task 4.3 — Criar journalist worker
**Arquivo:** `backend/workers/journalist_worker.py`  
**Ação:** Task que recebe headline da fila e dispara Agente Jornalista. Cria artigo no banco com status "writing".  
**Verificação:** Artigo criado no banco com body em Markdown válido e seção impact_section preenchida.

---

### Task 4.4 — Criar art worker
**Arquivo:** `backend/workers/art_worker.py`  
**Ação:** Task que recebe article_id e dispara Agente Arte. Busca imagem, salva no Storage, cria registro em article_media.  
**Verificação:** Artigo tem ao menos uma imagem em article_media com is_primary=true após execução.

---

### Task 4.5 — Criar editor worker
**Arquivo:** `backend/workers/editor_worker.py`  
**Ação:** Task do Editor Regional e task do Chefe de Redação. Editor Regional publica e cria versão. Chefe monitora publicados.  
**Verificação:** Artigo muda de "art_review" para "regional_review" para "published" automaticamente.

---

### Task 4.6 — Criar distribution worker
**Arquivo:** `backend/workers/distribution_worker.py`  
**Ação:** Task que recebe article_id publicado e distribui para os canais ativos da região (web, YouTube, WhatsApp, Instagram).  
**Verificação:** Registro criado em `distributions` para cada canal com status "sent" ou "failed" com erro.

---

### Task 4.7 — Criar moderation worker
**Arquivo:** `backend/workers/moderation_worker.py`  
**Ação:** Task que recebe ugc_submission_id e dispara Agente Moderador. Atualiza status, score e moderation_notes.  
**Verificação:** UGC aprovado: status="approved", credit_amount preenchido, crédito adicionado ao usuário. UGC rejeitado: rejection_reason preenchida.

---

## Batch 5 — Backend Agentes (LangGraph)

### Task 5.1 — Criar LLM factory (local first + fallback)
**Arquivo:** `backend/agents/llm.py`  
**Referência:** PRD Backend seção 5 — LLM Factory  
**Ação:** Função `get_llm()` que testa disponibilidade do servidor local, depois Claude, depois GPT-4o. Loga fallback em agent_logs.  
**Verificação:** Com servidor local offline → Claude é usado e log registra "fallback_llm"

---

### Task 5.2 — Criar base agent e estados Pydantic
**Arquivo:** `backend/agents/base.py`  
**Ação:** Classe base com: load_prompt(), log_action(), handle_error(). Estados Pydantic para cada agente.  
**Verificação:** `from agents.base import BaseAgent` sem erros

---

### Task 5.3 — Criar prompts de todos os agentes
**Arquivos:** `backend/prompts/*.md`  
**Referência:** PRD Backend seção 5 — regras de prompt do Journalist  
**Ação:** Criar 6 arquivos de prompt. journalist_v1.md deve incluir regra explícita: "Escreva em Markdown limpo. Não use asteriscos desnecessários no meio de parágrafos. Use ## apenas para títulos de seção."  
**Verificação:** `ls backend/prompts/` retorna 6 arquivos .md

---

### Task 5.4 — Implementar Collector Graph
**Arquivos:** `backend/agents/collector/`  
**Referência:** PRD Backend seção 5 — Collector Graph  
**Nós:** fetch_sources → filter_relevance → deduplicate → score_priority → enqueue_articles  
**Verificação:** Grafo executa end-to-end. Headlines duplicadas são detectadas via Redis hash. Apenas headlines novas são enfileiradas.

---

### Task 5.5 — Implementar Journalist Graph
**Arquivos:** `backend/agents/journalist/`  
**Referência:** PRD Backend seção 5 — Journalist Graph  
**Nós:** receive_headline → research_context → translate_culturalize → write_article → validate_structure → send_to_art  
**Verificação:** Artigo gerado tem title, subtitle, body (Markdown limpo), impact_section, category e tags preenchidos.

---

### Task 5.6 — Implementar Art Graph
**Arquivos:** `backend/agents/art/`  
**Referência:** PRD Backend seção 5 — Art Graph  
**Nós:** receive_article → search_stock_images → select_best / generate_image → create_thumbnail → attach_to_article  
**Verificação:** Artigo sem imagem disponível em acervo recebe imagem gerada. Thumbnail criado com template da cidade/região.

---

### Task 5.7 — Implementar Regional Editor Graph
**Arquivos:** `backend/agents/regional_editor/`  
**Referência:** PRD Backend seção 5 — Regional Editor Graph  
**Nós:** receive_article → analyze_quality → correct_and_publish → log_corrections  
**Verificação:** Artigo com erro factual é corrigido. Versão anterior salva em article_versions. Log de correções registrado em regional_editor_notes.

---

### Task 5.8 — Implementar Chief Editor Graph
**Arquivos:** `backend/agents/chief_editor/`  
**Referência:** PRD Backend seção 5 — Chief Editor Graph  
**Nós:** monitor_published → classify_problem → act_automatically / flag_for_human  
**Verificação:** Artigo com problema grave (factual) é retirado do ar automaticamente. Problema leve gera alerta para operador humano.

---

### Task 5.9 — Implementar Moderator Graph
**Arquivos:** `backend/agents/moderator/`  
**Referência:** PRD Backend seção 5 — Moderator Graph  
**Nós:** receive_ugc → analyze_content → score_relevance → approve_and_credit / reject_with_reason  
**Verificação:** Score >= 0.8 → aprovação automática com crédito. Score < 0.8 → rejeição com motivo específico.

---

### Task 5.10 — Criar integrações externas
**Arquivos:** `backend/integrations/*.py`  
**Ação:** Clientes para NewsAPI, Unsplash, Pexels, YouTube Data API, WhatsApp Business API, Meta Graph API, Stripe (preparado). Todos com timeout de 10s e error handling individual.  
**Verificação:** `python -c "from integrations.newsapi import NewsAPIClient; print('ok')"` sem erros para todos os clientes

---

## Batch 6 — Frontend Setup

### Task 6.1 — Inicializar projeto Next.js
**Arquivo:** `frontend/`  
**Ação:**
```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false
```
**Verificação:** `npm run dev` sobe em localhost:3000 sem erros

---

### Task 6.2 — Configurar Tailwind v4 com design tokens
**Arquivos:** `frontend/app/globals.css`, `frontend/tailwind.config.ts`  
**Referência:** PRD Frontend seção 5 — Design System  
**Ação:** Aplicar todos os tokens de cor e fonte do DESIGN_STANDARDS conforme PRD Frontend.  
**Verificação:** `bg-background` aplica cor #101622. `font-heading` aplica Outfit. `font-sans` aplica Inter.

---

### Task 6.3 — Configurar fontes Outfit + Inter
**Arquivo:** `frontend/app/layout.tsx`  
**Referência:** PRD Frontend seção 5 — Fontes  
**Ação:** Importar e configurar Inter e Outfit via next/font/google. Adicionar classe `dark` fixa no html.  
**Verificação:** Inspecionar elemento no browser — html tem classe "dark". Títulos renderizam em Outfit, corpo em Inter.

---

### Task 6.4 — Instalar e configurar shadcn/ui
**Arquivo:** `frontend/components/ui/`  
**Ação:**
```bash
npx shadcn@latest init
npx shadcn@latest add button card badge drawer dialog input textarea select skeleton separator tooltip slider alert-dialog
```
**Verificação:** Componentes criados em `components/ui/`. `import { Button } from "@/components/ui/button"` funciona.

---

### Task 6.5 — Configurar iron-session
**Arquivos:** `frontend/lib/session.ts`  
**Referência:** PRD Frontend seção 6 — Auth Flow  
**Ação:** Criar sessionOptions com SESSION_SECRET, cookieName, httpOnly, secure, sameSite, maxAge 8h.  
**Verificação:** `import { sessionOptions } from "@/lib/session"` sem erros

---

### Task 6.6 — Criar middleware.ts de proteção de rotas
**Arquivo:** `frontend/middleware.ts`  
**Referência:** PRD Frontend seção 6 — Auth Flow  
**Ação:** Verificar iron-session em todas as rotas `/(redacao)/*`. Redirecionar para /login se sem sessão.  
**Verificação:** Acessar /redacao/murais/producao sem login → redirect para /login. Com login → acesso permitido.

---

### Task 6.7 — Criar proxy API route
**Arquivo:** `frontend/app/api/proxy/[...path]/route.ts`  
**Referência:** PRD Frontend seção 7 — API Integration Layer  
**Ação:** Proxy autenticado que lê iron-session, adiciona X-User-Id + X-User-Role + X-Internal-Key e repassa para o backend. NUNCA expõe user_id ao cliente.  
**Verificação:** Request para /api/proxy/auth/me retorna dados do usuário sem expor user_id na response ao cliente.

---

### Task 6.8 — Criar lib/api.ts e lib/websocket.ts
**Arquivos:** `frontend/lib/api.ts`, `frontend/lib/websocket.ts`  
**Referência:** PRD Frontend seção 7  
**Ação:** fetch wrapper com error handling. Cliente WebSocket reutilizável com reconexão automática.  
**Verificação:** `apiRequest("/health")` retorna resposta do backend. WebSocket conecta em /ws/pipeline.

---

### Task 6.9 — Criar lib/markdown.ts e lib/formatters.ts
**Arquivos:** `frontend/lib/markdown.ts`, `frontend/lib/formatters.ts`  
**Ação:** Renderer Markdown com react-markdown + remark-gfm + Tailwind Typography. Formatters: datas em PT-BR, status em labels legíveis, valores de crédito.  
**Verificação:** Markdown com `## Título` renderiza como `<h2>` estilizado. Status "regional_review" formata como "Em Revisão Regional".

---

## Batch 7 — Frontend — Autenticação

### Task 7.1 — Criar página de login
**Arquivo:** `frontend/app/(auth)/login/page.tsx`  
**Referência:** PRD Frontend seção 8 — Fluxo do Operador  
**Ação:** Formulário email + senha com validação Zod. Loading state durante autenticação. Erro tratado com toast.  
**Verificação:** Login com credenciais válidas → redirect para /redacao/murais/producao. Credenciais inválidas → toast de erro. user_id não aparece em nenhum lugar no cliente.

---

### Task 7.2 — Criar useAuth hook e layout de auth
**Arquivos:** `frontend/hooks/useAuth.ts`, `frontend/app/(auth)/layout.tsx`  
**Ação:** Hook com login(), logout(), user (sem user_id exposto). Layout sem sidebar.  
**Verificação:** `useAuth().logout()` destrói sessão e redireciona para /login.

---

## Batch 8 — Frontend — Layout Principal

### Task 8.1 — Criar layout da Redação com Sidebar
**Arquivos:** `frontend/app/(redacao)/layout.tsx`, `frontend/components/layout/Sidebar.tsx`  
**Referência:** PRD Frontend seção 3 — Mapa de Páginas  
**Ação:** Layout com sidebar fixa 240px. Sidebar com logo FBR-Redacao, itens de navegação com ícones Lucide, badge de alertas animado.  
**Verificação:** Sidebar visível em todas as páginas /(redacao)/*. Em mobile, sidebar colapsa.

---

### Task 8.2 — Criar SidebarNav com badges em tempo real
**Arquivo:** `frontend/components/layout/SidebarNav.tsx`  
**Ação:** Itens: Murais (Em Produção, Publicados), Agentes, Eu Repórter, Regiões, Analytics, Alertas. Badge numérico em Alertas e Eu Repórter com contagem de itens pendentes via WebSocket.  
**Verificação:** Badge de alertas incrementa automaticamente quando novo alerta chega via WebSocket.

---

### Task 8.3 — Criar Header com perfil do operador
**Arquivo:** `frontend/components/layout/Header.tsx`  
**Ação:** Topbar com título da página atual, botão de notificações e menu de perfil (nome do operador + logout).  
**Verificação:** Nome do operador aparece no header. Logout destrói sessão e redireciona.

---

## Batch 9 — Frontend — Murais

### Task 9.1 — Criar ArticleCard com status e presença
**Arquivo:** `frontend/components/murais/ArticleCard.tsx`  
**Referência:** PRD Frontend seção 4 — Componentes murais  
**Ação:** Card com: título, região, categoria, agente, timestamp, ArticleStatusBadge, PipelineProgress, PresenceIndicator.  
**Verificação:** Card renderiza sem erros. Badge muda de cor por status. PresenceIndicator mostra avatar do outro operador quando presente.

---

### Task 9.2 — Criar ArticleDrawer com editor Markdown
**Arquivo:** `frontend/components/murais/ArticleDrawer.tsx`  
**Ação:** Drawer lateral com artigo completo renderizado (react-markdown). Botão Editar abre react-md-editor inline. Salvar cria nova versão via PATCH /articles/{id}/correct. Histórico de versões em tab separada.  
**Verificação:** Edição salva cria nova entrada em article_versions. Markdown renderizado não mostra asteriscos desnecessários.

---

### Task 9.3 — Criar Mural Em Produção com WebSocket
**Arquivo:** `frontend/app/(redacao)/murais/producao/page.tsx`  
**Referência:** PRD Frontend seção 8  
**Ação:** Grid de ArticleCards. useMuralProducao hook com WebSocket. Filtros: região, status, agente. ArticleCardSkeleton no loading. Empty state quando sem artigos.  
**Verificação:** Novo artigo aparece no mural sem reload. Filtro por região funciona. Skeleton aparece no carregamento inicial.

---

### Task 9.4 — Criar Mural Publicados com ações e presença
**Arquivo:** `frontend/app/(redacao)/murais/publicados/page.tsx`  
**Referência:** PRD Frontend seção 8  
**Ação:** Grid de ArticleCards publicados. Ações por card: Corrigir (abre drawer), Retornar (confirm-dialog), Retirar do Ar (confirm-dialog), Excluir (confirm-dialog com texto de confirmação). Presença em tempo real.  
**Verificação:** Ação "Retirar do Ar" mostra confirm-dialog. Confirmar muda status para "off_air" e remove card. Outro operador vê PresenceIndicator no card sendo revisado.

---

### Task 9.5 — Criar usePresence hook
**Arquivo:** `frontend/hooks/usePresence.ts`  
**Referência:** PRD Frontend seção 7 — usePresence  
**Ação:** Hook que emite presence:join ao abrir drawer e presence:leave ao fechar. Recebe lista de viewers do WebSocket.  
**Verificação:** Abrir drawer em dois browsers → ambos veem o indicador de presença do outro.

---

## Batch 10 — Frontend — Agentes

### Task 10.1 — Criar Dashboard de Agentes
**Arquivo:** `frontend/app/(redacao)/agentes/page.tsx`  
**Referência:** PRD Frontend seção 8  
**Ação:** Grid de AgentCards agrupados por tipo. Filtro por status. Botões globais: Iniciar Todos / Pausar Todos.  
**Verificação:** AgentStatusDot anima corretamente por status. Métricas /24h atualizadas.

---

### Task 10.2 — Criar página de detalhes do agente
**Arquivo:** `frontend/app/(redacao)/agentes/[id]/page.tsx`  
**Ação:** Configurações JSONB editáveis via AgentConfigEditor. Feed de logs em tempo real via useAgenteLogs. Troca de prompt_version. Botões start/stop.  
**Verificação:** Editar config JSONB salva via PATCH /agents/{id}. Logs aparecem em tempo real.

---

### Task 10.3 — Criar formulário de novo agente
**Arquivo:** `frontend/app/(redacao)/agentes/novo/page.tsx`  
**Ação:** Formulário com validação Zod: nome, tipo (select), região (select com árvore), LLM provider, config JSONB inicial por tipo.  
**Verificação:** Criar agente → aparece no grid com status "offline".

---

## Batch 11 — Frontend — Eu Repórter

### Task 11.1 — Criar fila de moderação UGC
**Arquivo:** `frontend/app/(redacao)/eu-reporter/page.tsx`  
**Referência:** PRD Frontend seção 8  
**Ação:** Lista de UGCCards ordenados por data. Filtros: tipo, status, região. Contador de pendentes no topo.  
**Verificação:** Lista carrega contribuições pendentes. Filtro por tipo funciona.

---

### Task 11.2 — Criar UGCCard com player e ações
**Arquivo:** `frontend/components/eu-reporter/UGCCard.tsx`  
**Ação:** Player nativo para vídeo/áudio. Texto expansível. Score do agente moderador visível. Ações: Aprovar (slider $0,50–$2,00 + confirmar) / Rejeitar (textarea de motivo + confirmar).  
**Verificação:** Aprovar UGC com crédito de $1,50 → status muda para "approved", crédito adicionado ao usuário. Rejeitar → status "rejected" com rejection_reason.

---

## Batch 12 — Frontend — Regiões, Analytics e Alertas

### Task 12.1 — Criar árvore de regiões
**Arquivo:** `frontend/app/(redacao)/regioes/page.tsx`  
**Ação:** RegionTree com expand/collapse por nível. Cada nó mostra agentes ativos. Botão adicionar subregião.  
**Verificação:** Hierarquia EUA → Florida → Orange County → Orlando → Downtown renderiza corretamente.

---

### Task 12.2 — Criar página de analytics
**Arquivo:** `frontend/app/(redacao)/analytics/page.tsx`  
**Ação:** KPIGrid com 4 métricas principais. Gráficos Recharts: artigos/dia por região (linha), performance por agente (barras), funil UGC (barras empilhadas).  
**Verificação:** Gráficos renderizam com dados reais da API. KPIs atualizam ao mudar período.

---

### Task 12.3 — Criar central de alertas
**Arquivo:** `frontend/app/(redacao)/alertas/page.tsx`  
**Ação:** AlertFeed com updates via WebSocket. AlertCard com ícone por tipo, mensagem, agente afetado e ações. Filtros por tipo e status.  
**Verificação:** Novo alerta aparece em tempo real. Reconhecer alerta muda status para "acknowledged". Badge na sidebar zera quando todos resolvidos.

---

## Batch 13 — Integração Frontend ↔ Backend

### Task 13.1 — Testar fluxo completo de login
**Ação:** Login → sessão criada → acesso a /redacao → cookie httpOnly presente → user_id nunca visível no cliente  
**Verificação:** DevTools → Application → Cookies: cookie fbr_redacao_session presente com httpOnly=true. user_id não aparece em nenhum response body no Network tab.

---

### Task 13.2 — Testar pipeline completo de artigo
**Ação:** Ativar Agente Coletor → aguardar headline → Agente Jornalista produz artigo → Arte adiciona imagem → Editor Regional publica → artigo aparece no Mural Publicados  
**Verificação:** Artigo percorre todos os status do pipeline. Cada transição registrada em agent_logs. Versão inicial salva em article_versions.

---

### Task 13.3 — Testar presença em tempo real
**Ação:** Abrir dois browsers com operadores diferentes → ambos acessam Mural Publicados → Operador A abre drawer de um artigo  
**Verificação:** Operador B vê PresenceIndicator no card do artigo com nome/avatar do Operador A em tempo real.

---

### Task 13.4 — Testar fluxo completo do Eu Repórter
**Ação:** Upload de vídeo MP4 válido → Agente Moderador processa → operador aprova com $1,00 de crédito → artigo gerado a partir da pauta  
**Verificação:** UGC: status=approved, credit_amount=1.00. Credits: nova entrada com type=earned, amount=1.00. users: credit_balance incrementado.

---

### Task 13.5 — Testar alertas em tempo real
**Ação:** Parar um agente online → aguardar heartbeat timeout  
**Verificação:** Alerta tipo "agent_offline" aparece na Central de Alertas em tempo real. Badge na sidebar incrementa. Toast aparece no painel.

---

### Task 13.6 — Testar distribuição multicanal
**Ação:** Publicar artigo em região com YouTube e WhatsApp ativos  
**Verificação:** Registros em `distributions` para os canais ativos com status "sent". external_id preenchido para YouTube.

---

## Batch 14 — Segurança e Hardening

### Task 14.1 — Testar isolamento RLS
**Ação:** Criar 2 usuários de teste. User A tenta acessar UGC submissions do User B via Supabase client direto.  
**Verificação:** Query retorna 0 resultados. User A não vê dados do User B.

---

### Task 14.2 — Testar rate limiting
**Ação:** Enviar 6 requests de login em menos de 1 minuto do mesmo IP  
**Verificação:** 6ª request retorna 429 Too Many Requests com mensagem clara.

---

### Task 14.3 — Testar validação de upload
**Ação:** Renomear arquivo .exe para .mp4 e tentar fazer upload via POST /ugc/submit  
**Verificação:** Backend rejeita com erro 400 "Tipo de arquivo inválido". Magic bytes detectam o tipo real.

---

### Task 14.4 — Verificar que user_id nunca é exposto
**Ação:** Inspecionar todas as responses da API no browser DevTools Network tab  
**Verificação:** Nenhum campo chamado user_id, session_id ou auth_id aparece em responses ao cliente. URLs usam slugs, não UUIDs.

---

### Task 14.5 — Verificar variáveis de ambiente
**Ação:** `grep -r "NEXT_PUBLIC_SUPABASE_SERVICE" frontend/` e `grep -r "SESSION_SECRET" frontend/src/`  
**Verificação:** Nenhum resultado. Chaves sensíveis não estão acessíveis no bundle do cliente.

---

## Batch 15 — Deploy na VPS

### Task 15.1 — Configurar Nginx como reverse proxy
**Arquivo:** `nginx.conf`  
**Ação:** Nginx na porta 80/443. Proxy para frontend:3000 e backend:8000. SSL via Let's Encrypt. Headers de segurança: X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security.  
**Verificação:** https://redacao.facebrasil.com carrega o painel. https://redacao.facebrasil.com/api/proxy/health retorna 200.

---

### Task 15.2 — Configurar SSL/TLS
**Ação:** Instalar Certbot. Gerar certificado para o domínio do painel.  
**Verificação:** https funciona. HTTP redireciona para HTTPS automaticamente.

---

### Task 15.3 — Configurar backup automático do Supabase
**Ação:** Ativar Point-in-Time Recovery no Supabase Dashboard. Configurar retenção de 30 dias.  
**Verificação:** Supabase Dashboard → Backups mostra backup ativo com política de retenção configurada.

---

### Task 15.4 — Deploy e smoke test final
**Ação:**
```bash
docker-compose up -d
docker-compose ps
```
**Verificação:** 
- Todos os containers em estado "Up"
- Login funciona em produção
- Pipeline completo executa (coletor → jornalista → arte → editor → publicado)
- Mural atualiza em tempo real
- Eu Repórter aceita upload
- Alertas chegam em tempo real
- Distribuição multicanal funcionando

---

## Resumo dos Batches

| Batch | Descrição | Tasks |
|-------|-----------|-------|
| 1 | Infraestrutura e Configuração Base | 1.1 – 1.6 |
| 2 | Database (Supabase) | 2.1 – 2.8 |
| 3 | Backend Core | 3.1 – 3.14 |
| 4 | Backend Workers (Celery) | 4.1 – 4.7 |
| 5 | Backend Agentes (LangGraph) | 5.1 – 5.10 |
| 6 | Frontend Setup | 6.1 – 6.9 |
| 7 | Frontend — Autenticação | 7.1 – 7.2 |
| 8 | Frontend — Layout Principal | 8.1 – 8.3 |
| 9 | Frontend — Murais | 9.1 – 9.5 |
| 10 | Frontend — Agentes | 10.1 – 10.3 |
| 11 | Frontend — Eu Repórter | 11.1 – 11.2 |
| 12 | Frontend — Regiões, Analytics e Alertas | 12.1 – 12.3 |
| 13 | Integração Frontend ↔ Backend | 13.1 – 13.6 |
| 14 | Segurança e Hardening | 14.1 – 14.5 |
| 15 | Deploy na VPS | 15.1 – 15.4 |

**Total: 15 batches · 68 tasks · qualidade acima de velocidade**
