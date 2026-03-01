# Smoke Test Checklist — FBR-Redacao em Produção

Execute este checklist **após o deploy no Easypanel** com as variáveis de ambiente reais preenchidas.

---

## ✅ 1. Infraestrutura

- [ ] Todos os 3 containers estão `Running` no Easypanel: `backend`, `frontend`, `redis`
- [ ] `GET https://api.redacao.facebrasil.com.br/health` retorna `{"status":"ok","environment":"production"}`
- [ ] `GET https://redacao.facebrasil.com.br/` carrega o painel (sem erro 502/504)
- [ ] Certificado SSL válido (cadeado verde no browser)

## ✅ 2. Autenticação

- [ ] Acessar `https://redacao.facebrasil.com.br/login`
- [ ] Fazer login com usuário real do Supabase → deve redirecionar para `/murais/producao`
- [ ] Acessar `/murais/producao` sem login → deve redirecionar para `/login`
- [ ] Cookie `fbr_redacao_session` criado (httpOnly, secure, sameSite=lax) — verificar em DevTools → Application → Cookies
- [ ] **user_id, token ou session_id NÃO aparecem no console do browser**

## ✅ 3. Supabase (Banco + RLS)

- [ ] Artigos aparecem no Mural "Publicados" (confirma leitura do Supabase)
- [ ] Criar dois usuários diferentes: User A **não consegue** ver dados do User B
- [ ] Storage bucket de UGC acessível apenas por service_role (testar URL direta — deve retornar 403)

## ✅ 4. Webhooks FBR

- [ ] Disparar webhook simulado do n8n:
  ```bash
  curl -X POST https://api.redacao.facebrasil.com.br/api/v1/webhooks/openclaw/article-produced \
    -H "X-OpenClaw-Webhook-Key: <sua_chave>" \
    -H "Content-Type: application/json" \
    -d '{"title":"Teste Smoke","content":"Conteúdo de teste","region":"BR-SP","agent_id":"editor-regional"}'
  ```
  → Esperado: HTTP 200 `{"status":"success","message":"Article ingested locally"}`

- [ ] Artigo aparece no Mural "Em Produção" em tempo real (WebSocket ativo)

## ✅ 5. Rate Limiting

- [ ] Disparar 35 requests seguidos para `/api/v1/auth/login` → a partir do 31º deve retornar **HTTP 429** com `Retry-After: 60`

## ✅ 6. Upload UGC

- [ ] Enviar arquivo `.mp4` válido ≤ 50MB → retorna `{"status":"received"}`
- [ ] Enviar arquivo `.exe` → retorna **HTTP 415** (tipo rejeitado)
- [ ] Enviar arquivo > 50MB → retorna **HTTP 415** (tamanho excedido)

## ✅ 7. CORS

- [ ] Request da origem `https://redacao.facebrasil.com.br` → aceito
- [ ] Request de origem não configurada (ex: `https://evil.com`) → bloqueado (sem header `Access-Control-Allow-Origin`)

## ✅ 8. Backup do Supabase

- [ ] Backup automático ativado no painel do Supabase (Pro: point-in-time recovery)
- [ ] Ou configurar **pg_dump** agendado via cron na VPS para bucket externo

---

## Contatos de Emergência

| Serviço | Painel |
|---|---|
| Easypanel (VPS) | https://easypanel.facebrasil.com.br |
| Supabase | https://supabase.com/dashboard |
| n8n | http://\<ip-vps\>:5678 (atrás do Tailscale) |
| OpenClaw | Conforme instância configurada |
