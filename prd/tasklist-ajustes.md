# Tasklist - Ajustes de Arquitetura (Limpeza FBR)

Este documento centraliza as ações de **Limpeza (Cleanup)** e **Remoção de Código Morto** decorrentes da mudança arquitetural para o padrão FBR (remoção de LangGraph e Celery).

---

## 1. Limpeza do Backend (FastAPI / Celery)

- [x] **Task 1.1** — **Remover dependências no `requirements.txt`**
  - Remover `langgraph`, `langchain-anthropic`, `langchain-openai`, `celery`, `redis` (se Redis não for usado para cache do FastAPI).
  - Atualizar dependências com a nova stack (ex: `httpx` garantido para client, JWT, etc.).
- [x] **Task 1.2** — **Apagar as pastas e arquivos de Workers / Celery**
  - Excluir pasta `backend/workers` inteira (se existir).
  - Remover configurações do Celery em `core/config.py`.
- [x] **Task 1.3** — **Apagar pastas e arquivos do LangGraph**
  - Excluir pasta `backend/agents` ou `backend/grafos`.
  - Excluir implementações da `LLM Factory` do Python.
- [x] **Task 1.4** — **Apagar a pasta `prompts` do Backend**
  - Apagar os arquivos de prompt (`collector_v1.md`, etc.), pois os `SOUL.md` viverão nos repositórios do OpenClaw.

## 2. Refatoração de Banco de Dados / Supabase (se necessário)

- [x] **Task 2.1** — **Ajustar tabelas de Logs de Agentes**
  - Supabase Database foi ajustado e validado.
- [x] **Task 2.2** — **Validar FKs e Enums**
  - Supabase Database enum validations conferidas no schema root.

## 3. Adequação da Autenticação / Security

- [x] **Task 3.1** — **Atualizar validação de Webhooks**
  - Segurança configurada para depender via `OPENCLAW_WEBHOOK_KEY`, `N8N_WEBHOOK_KEY`.

## 4. Atualização de Arquivos Locais (.env)

- [x] **Task 4.1** — **Implementar novo `.env`**
  - Foi criado o blueprint fornecido com as chaves do OPENCLAW, N8N, FBR-CLICK.
