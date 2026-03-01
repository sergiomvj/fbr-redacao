# Tasklist - Conclusão do Projeto (Arquitetura FBR)

Este documento centraliza as tarefas **novas e remanescentes** para levar o projeto à conclusão com a arquitetura final (n8n + OpenClaw + FBR-Click + Next.js).

---

## 1. Camada de Integração (Webhooks)

- [x] **Task 1.1** — **Criar router `/webhooks/n8n`**
  - Responder a eventos gerais de orquestração do n8n (Mural Atualizado, Fechamento de Ciclo).
  - Segurança: Exigir `X-n8n-Webhook-Key` definida no `.env`.
- [x] **Task 1.2** — **Criar router `/webhooks/openclaw`**
  - Receber os POSTs de conclusão de artigos via Agentes OpenClaw. O FastAPI será o responsável por persistir o Artigo recebido no Supabase via Service Role e disparar updates Websocket para o front em Next.js.
  - Segurança: Exigir `X-OpenClaw-Webhook-Key`.
- [x] **Task 1.3** — **Criar router `/webhooks/fbr-click`**
  - Tratar chamadas vindas do canal Slack/Discord/FBR-Click (ex: aprovar artigo, retirar do ar).

## 2. Repositórios e Agentes OpenClaw (Isolamento)

> IMPORTANTE: Cada agente abaixo deve viver em seu **próprio repositório Git** isolado. Nenhum agente deve residir no monorepo do FastAPI/Next.js atual.
> TODOS ELES devem possuir os 7 Markdowns canônicos: `SOUL.md`, `IDENTITY.md`, `TASKS.md`, `AGENTS.md`, `MEMORY.md`, `TOOLS.md`, `USER.md`.

- [x] **Task 2.1** — Estruturar repo isolado do **Agente Coletor**
  - Criar e preencher a configuração dos 7 Markdowns (SOUL, IDENTITY, TASKS, AGENTS, MEMORY, TOOLS, USER).
- [x] **Task 2.2** — Estruturar repo isolado do **Agente Jornalista**
  - Criar e preencher a configuração dos 7 Markdowns estritamente.
- [x] **Task 2.3** — Estruturar repo isolado do **Agente Arte**
  - Criar e preencher a configuração dos 7 Markdowns estritamente.
- [x] **Task 2.4** — Estruturar repo isolado do **Agente Editor Regional**
  - Criar e preencher a configuração dos 7 Markdowns estritamente.
- [x] **Task 2.5** — Estruturar repo isolado do **Agente Chefe de Redação**
  - Criar e preencher a configuração dos 7 Markdowns estritamente.
- [x] **Task 2.6** — Estruturar repo isolado do **Agente Moderador de UGC**
  - Criar e preencher a configuração dos 7 Markdowns estritamente.

## 3. Orquestração (n8n)

- [x] **Task 3.1** — **Criar Fluxo de Coleta**
  - Trigger periódico (Cron) → Aciona OpenClaw(Coletor) → Valida → Envia ao FastAPI.
- [x] **Task 3.2** — **Criar Fluxo de Produção**
  - Reage ao FastAPI → Aciona OpenClaw(Jornalista) → Aciona OpenClaw(Arte) → Aciona OpenClaw(Editor Regional).
- [x] **Task 3.3** — **Criar Fluxo de UGC**
  - Recebe submissão do FastAPI → Aciona OpenClaw(Moderador).
- [x] **Task 3.4** — **Integrar fluxos com o FBR-Click**
  - Enviar aprovações e painéis de revisão para operadores humanos pelo Chat, ao invés de forçá-los a entrar sempre no painel.

## 4. Testes e Deploy E2E

- [x] **Task 4.1** — **Flow Test do Pipeline Completo**
  - Acompanhar visualmente um Artigo do Crawler até o Mural de Publicados, monitorando a rede n8n -> OpenClaw -> FastAPI -> Frontend Next.js.
- [x] **Task 4.2** — **Implantação na Hostinger (VPS FBR)**
  - Backend (FastAPI + Redis) via Docker Compose + frontend Next.js via PM2 modo cluster + nginx + HTTPS.
- [ ] **Task 4.3** — **Smoke Test Produtivo**
  - Realizar postagem via n8n real em ambiente externo para validar firewalls e comunicação Supabase.
