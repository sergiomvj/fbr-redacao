# PRD Frontend — FBR-Redacao
> Documento gerado pelo workflow /build-saas · Fevereiro 2026  
> Versão 1.0 · Confidencial — Uso Interno Facebrasil

---

## 1. Resumo do Produto

**Nome:** FBR-Redacao — Painel da Redação  
**Escopo:** Interface interna exclusiva para os 2 operadores humanos da Redação Facebrasil  
**Portal público:** A revista Facebrasil já existe e receberá o conteúdo via API — fora do escopo deste documento  
**Plataforma:** Web responsivo (mobile first) — app nativo em fase futura

---

## 2. Requisitos Funcionais (Frontend/UX)

- **RF-F01:** Painel protegido por autenticação — operadores acessam via login email + senha
- **RF-F02:** Sidebar fixa com navegação principal e badges de contagem em tempo real (alertas, UGC pendente)
- **RF-F03:** Mural "Em Produção" com cards de artigos em pipeline atualizados via WebSocket
- **RF-F04:** Mural "Publicados Recentemente" com ações por card: corrigir, retornar, retirar, excluir
- **RF-F05:** Indicador de presença em tempo real — "João está revisando este artigo"
- **RF-F06:** Dashboard de Agentes com grid de status online/offline e métricas/24h
- **RF-F07:** Fila do Eu Repórter com player inline de vídeo/áudio e ações de moderação
- **RF-F08:** Árvore hierárquica de regiões: País → Estado → Condado → Cidade → Bairro
- **RF-F09:** Analytics com KPIs e gráficos de performance por região e agente
- **RF-F10:** Central de alertas com feed em tempo real e ações de reconhecimento
- **RF-F11:** Todos os estados de loading, erro e vazio explicitamente tratados
- **RF-F12:** Ações destrutivas sempre com confirm-dialog antes de executar
- **RF-F13:** Editor Markdown inline para correções de artigos pelo operador
- **RF-F14:** Histórico de versões de cada artigo acessível via drawer lateral

---

## 3. Mapa de Páginas (App Router)

```
/login                                    ← única página pública
  └── autenticado → /redacao/murais/producao

/(redacao)/                               ← grupo com sidebar fixa
  ├── murais/
  │   ├── producao/         page.tsx      ← landing principal do operador
  │   └── publicados/       page.tsx      ← mural de revisão pós-publicação
  ├── agentes/
  │   ├── page.tsx                        ← grid de todos os agentes
  │   ├── [id]/page.tsx                   ← detalhes + logs do agente
  │   └── novo/page.tsx                   ← formulário criar agente
  ├── eu-reporter/
  │   └── page.tsx                        ← fila de moderação UGC
  ├── regioes/
  │   ├── page.tsx                        ← árvore de regiões
  │   └── [slug]/page.tsx                 ← detalhes + fontes da região
  ├── analytics/
  │   └── page.tsx                        ← KPIs e gráficos
  └── alertas/
      └── page.tsx                        ← central de alertas
```

---

## 4. Árvore de Componentes

```
components/
│
├── layout/
│   ├── Sidebar.tsx                 sidebar fixa 240px, colapsável em mobile
│   ├── SidebarNav.tsx              itens com ícone, label e badge de contagem
│   ├── Header.tsx                  topbar: título da página + alertas + perfil
│   └── AlertBadge.tsx              contador animado de alertas abertos
│
├── murais/
│   ├── MuralProducao.tsx           container com filtros + grid de cards
│   ├── MuralPublicados.tsx         container com filtros + grid de cards
│   ├── ArticleCard.tsx             card reutilizável — usa em ambos os murais
│   │   ├── ArticleStatusBadge      badge colorido por status do pipeline
│   │   ├── PipelineProgress        barra de progresso das etapas
│   │   ├── PresenceIndicator       avatar + nome do operador que está revisando
│   │   └── ArticleActions          botões contextuais por status
│   ├── ArticleCardSkeleton.tsx     loading state animado
│   ├── ArticleDrawer.tsx           drawer lateral com artigo completo
│   │   ├── ArticleEditor           editor Markdown inline (react-md-editor)
│   │   ├── ArticleVersionHistory   timeline de versões com diff
│   │   └── ArticleMediaGallery     imagens do artigo + thumbnail
│   └── ArticleConfirmDialog.tsx    confirmação para ações destrutivas
│
├── agentes/
│   ├── AgentGrid.tsx               grid responsivo de cards por tipo
│   ├── AgentCard.tsx               card: nome, tipo, região, status, métricas
│   │   ├── AgentStatusDot          dot animado: verde/cinza/vermelho/amarelo
│   │   └── AgentMetrics            artigos/24h, erros/24h, último heartbeat
│   ├── AgentLogFeed.tsx            feed de logs em tempo real com filtros
│   ├── AgentForm.tsx               formulário criar/editar com validação Zod
│   └── AgentConfigEditor.tsx       editor JSON para config JSONB do agente
│
├── eu-reporter/
│   ├── UGCQueue.tsx                lista de contribuições pendentes
│   ├── UGCCard.tsx                 card: tipo, região, usuário, score, data
│   ├── UGCMediaPlayer.tsx          player vídeo/áudio nativo + texto expandível
│   ├── UGCModerationActions.tsx    aprovar (+ slider crédito) / rejeitar (+ motivo)
│   └── UGCStatusBadge.tsx          badge: pending/approved/rejected
│
├── regioes/
│   ├── RegionTree.tsx              árvore com expand/collapse por nível
│   ├── RegionNode.tsx              nó: ícone de tipo + nome + agentes ativos
│   ├── RegionForm.tsx              formulário criar/editar região
│   └── SourceList.tsx              lista de fontes com toggle ativo/inativo
│
├── analytics/
│   ├── KPIGrid.tsx                 grid 4 colunas de métricas principais
│   ├── KPICard.tsx                 valor + label + variação percentual
│   ├── ArticlesChart.tsx           linha: artigos/dia por região (Recharts)
│   ├── AgentPerformanceChart.tsx   barras: artigos produzidos por agente
│   └── UGCFunnelChart.tsx          funil: recebido → aprovado → publicado
│
├── alertas/
│   ├── AlertFeed.tsx               lista ordenada por data, mais recente primeiro
│   ├── AlertCard.tsx               tipo + mensagem + agente + ações
│   └── AlertFilters.tsx            filtros: tipo, status, região
│
└── ui/                             shadcn/ui components
    ├── button.tsx
    ├── card.tsx
    ├── badge.tsx
    ├── drawer.tsx
    ├── dialog.tsx
    ├── input.tsx
    ├── textarea.tsx
    ├── select.tsx
    ├── toast.tsx
    ├── skeleton.tsx
    ├── separator.tsx
    ├── tooltip.tsx
    ├── slider.tsx                  para definir valor de crédito UGC
    └── confirm-dialog.tsx          wrapper com AlertDialog do shadcn
```

---

## 5. Design System

### Fontes — DESIGN_STANDARDS

```tsx
// app/layout.tsx
import { Inter, Outfit } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${outfit.variable} dark`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
```

### Tokens de Design

```css
/* app/globals.css */
@import "tailwindcss";

@theme inline {
  /* Fontes */
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-heading: var(--font-outfit), ui-sans-serif, system-ui, sans-serif;

  /* Backgrounds — Dark Mode Fixo */
  --color-background: #101622;
  --color-surface: #1a2332;
  --color-surface-2: #1e2a3a;
  --color-border: #2a3a4a;
  --color-border-subtle: #1e2a3a;

  /* Brand */
  --color-primary: #F97316;
  --color-primary-hover: #EA580C;
  --color-primary-subtle: rgba(249, 115, 22, 0.1);

  /* Status dos Agentes */
  --color-online: #22C55E;
  --color-offline: #6B7280;
  --color-error: #EF4444;
  --color-paused: #EAB308;

  /* Status dos Artigos */
  --color-collecting: #3B82F6;
  --color-writing: #8B5CF6;
  --color-art-review: #F59E0B;
  --color-regional-review: #F97316;
  --color-published: #22C55E;
  --color-returned: #EF4444;
  --color-off-air: #6B7280;

  /* Texto */
  --color-text-primary: #F1F5F9;
  --color-text-secondary: #94A3B8;
  --color-text-muted: #475569;
}
```

### Tipografia — Uso Correto

```tsx
// Títulos de página — Outfit Bold
<h1 className="font-heading text-2xl font-bold text-white">
  Mural Em Produção
</h1>

// Títulos de seção — Outfit SemiBold
<h2 className="font-heading text-lg font-semibold text-white">
  Agentes Online
</h2>

// Corpo de texto — Inter Regular
<p className="font-sans text-sm text-text-secondary">
  Última atualização há 2 minutos
</p>

// Labels e badges — Inter Medium
<span className="font-sans text-xs font-medium">
  PUBLICADO
</span>
```

### Status Badge — Cores por Status

```tsx
const STATUS_STYLES = {
  collecting:      "bg-blue-500/10 text-blue-400 border-blue-500/20",
  writing:         "bg-purple-500/10 text-purple-400 border-purple-500/20",
  art_review:      "bg-amber-500/10 text-amber-400 border-amber-500/20",
  regional_review: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  published:       "bg-green-500/10 text-green-400 border-green-500/20",
  returned:        "bg-red-500/10 text-red-400 border-red-500/20",
  off_air:         "bg-gray-500/10 text-gray-400 border-gray-500/20",
};
```

---

## 6. Auth Flow — iron-session no Next.js

```typescript
// middleware.ts — protege todas as rotas /(redacao)/*
import { getIronSession } from "iron-session";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await getIronSession(request, response, sessionOptions);
  
  if (!session.isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/(redacao)/:path*"],
};

// app/api/proxy/auth/login/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  // valida input com Zod
  // chama backend FastAPI /auth/login com X-Internal-Key
  // recebe { user_id, role }
  // salva iron-session
  // NUNCA retorna user_id para o cliente
}
```

---

## 7. API Integration Layer

```typescript
// lib/api.ts — fetch wrapper autenticado via proxy
export async function apiRequest<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`/api/proxy${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    // NUNCA expõe stack trace — apenas mensagem de erro tratada
    const error = await response.json();
    throw new AppError(error.message, response.status);
  }

  return response.json();
}

// hooks/useMuralProducao.ts — exemplo de hook com WebSocket
export function useMuralProducao() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // fetch inicial
    apiRequest<Article[]>("/articles/pipeline").then(setArticles);
    setIsLoading(false);

    // WebSocket para updates em tempo real
    const ws = createWebSocketClient("/ws/pipeline");
    
    ws.on("article:created", (article) => {
      setArticles(prev => [article, ...prev]);
    });
    
    ws.on("article:updated", (updated) => {
      setArticles(prev => prev.map(a => a.id === updated.id ? updated : a));
    });

    return () => ws.close();
  }, []);

  return { articles, isLoading };
}

// hooks/usePresence.ts — presença em tempo real por artigo
export function usePresence(articleId: string) {
  const [viewers, setViewers] = useState<Operator[]>([]);

  useEffect(() => {
    const ws = createWebSocketClient("/ws/pipeline");
    ws.emit("presence:join", { articleId });
    ws.on("presence:update", ({ articleId: id, viewers: v }) => {
      if (id === articleId) setViewers(v);
    });
    return () => {
      ws.emit("presence:leave", { articleId });
      ws.close();
    };
  }, [articleId]);

  return { viewers };
}
```

---

## 8. Fluxo do Operador — Tela a Tela

```
LOGIN (/login)
  → email + senha
  → sessão criada → redirect para /redacao/murais/producao

MURAL EM PRODUÇÃO (/redacao/murais/producao)
  → cards de artigos chegando em tempo real via WebSocket
  → filtros: região, status, agente, categoria
  → click em card → ArticleDrawer abre à direita
    → lê artigo completo com Markdown renderizado
    → vê histórico de versões
    → vê qual agente produziu e quando
    → se quiser intervir: botão "Editar" abre editor Markdown inline
    → salva → cria nova versão registrada
  → indicador de presença: se outro operador estiver no mesmo artigo

MURAL PUBLICADOS (/redacao/murais/publicados)
  → cards dos últimos artigos publicados (últimas 24h)
  → cada card tem ações visíveis:
    → ✅ Manter — nenhuma ação necessária
    → ✏️ Corrigir — abre editor inline
    → ↩️ Retornar à Redação — confirm-dialog → artigo volta ao pipeline
    → 📵 Retirar do Ar — confirm-dialog → artigo sai dos canais
    → 🗑️ Excluir — confirm-dialog com texto de confirmação → soft delete
  → presença em tempo real por card

DASHBOARD DE AGENTES (/redacao/agentes)
  → grid de cards por tipo de agente
  → dot de status animado: verde (online), cinza (offline), vermelho (erro), amarelo (pausado)
  → métricas: artigos/24h, erros/24h, último heartbeat
  → botões: Iniciar / Pausar / Editar
  → click em card → página detalhes do agente
    → configurações JSONB editáveis
    → feed de logs em tempo real
    → botão trocar prompt version

FILA EU REPÓRTER (/redacao/eu-reporter)
  → lista de contribuições pendentes ordenadas por data
  → cada item:
    → vídeo: player inline
    → áudio: player inline
    → texto: expandível
  → score de moderação do Agente Moderador (0.00–1.00)
  → ações:
    → Aprovar: slider para definir crédito ($0,50–$2,00) → confirmar
    → Rejeitar: campo de motivo obrigatório → confirmar

ANALYTICS (/redacao/analytics)
  → KPIs: artigos produzidos hoje, agentes online, UGC aprovado/semana, taxa de correção
  → gráfico: artigos por dia (últimos 30 dias) por região
  → gráfico: performance por agente
  → funil UGC

ALERTAS (/redacao/alertas)
  → feed em tempo real de alertas abertos
  → tipos: agente offline, alta taxa de rejeição, fila UGC cheia, fallback LLM ativado
  → ações: Reconhecer / Resolver
  → badge na sidebar incrementa automaticamente via WebSocket
```

---

## 9. Requisitos Não-Funcionais

- **Dark mode fixo** — painel sempre escuro (#101622), sem toggle
- **Mobile first** — responsivo com breakpoints sm/md/lg/xl do Tailwind
- **Loading states** — Skeleton em todos os componentes que fazem fetch
- **Empty states** — mensagem + ação sugerida quando lista está vazia
- **Error states** — toast de erro com mensagem clara, nunca tela em branco
- **Confirmação destrutiva** — confirm-dialog em todas as ações irreversíveis
- **Acessibilidade** — contraste mínimo 4.5:1, navegação por teclado nos murais
- **Performance** — cursor-based pagination nos murais (nunca carregar tudo)
- **Renderização Markdown** — react-markdown + remark-gfm + Tailwind Typography

---

## 10. Security Checklist (Frontend)

```
✅ iron-session com httpOnly + secure + sameSite=lax
✅ SESSION_SECRET 32+ chars — nunca no cliente
✅ user_id nunca exposto no cliente (console, URL, localStorage)
✅ Todas as chamadas via /api/proxy — nunca direto ao backend
✅ Middleware.ts protege todas as rotas /(redacao)/*
✅ Variáveis sensíveis sem prefixo NEXT_PUBLIC_
✅ Inputs validados com Zod antes de enviar ao proxy
✅ Error messages do backend nunca exibem stack trace no frontend
✅ Ações destrutivas sempre com confirm-dialog
✅ IDs internos nunca em URLs — slugs ou UUIDs curtos
```

---

## 11. Stack e Dependências

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "typescript": "^5.4.0",
    "tailwindcss": "^4.0.0",
    "iron-session": "^8.0.0",
    "zod": "^3.23.0",
    "@supabase/supabase-js": "^2.43.0",
    "react-markdown": "^9.0.0",
    "remark-gfm": "^4.0.0",
    "@tailwindcss/typography": "^0.5.13",
    "recharts": "^2.12.0",
    "react-md-editor": "^4.0.0",
    "lucide-react": "^0.400.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.3.0",
    "sonner": "^1.5.0"
  },
  "shadcn-components": [
    "button", "card", "badge", "drawer", "dialog",
    "input", "textarea", "select", "skeleton",
    "separator", "tooltip", "slider", "alert-dialog"
  ]
}
```

---

## 12. Estrutura de Pastas

```
frontend/
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.example
├── Dockerfile
├── middleware.ts
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── (auth)/
│   │   └── login/page.tsx
│   └── (redacao)/
│       ├── layout.tsx
│       ├── murais/producao/page.tsx
│       ├── murais/publicados/page.tsx
│       ├── agentes/page.tsx
│       ├── agentes/[id]/page.tsx
│       ├── agentes/novo/page.tsx
│       ├── eu-reporter/page.tsx
│       ├── regioes/page.tsx
│       ├── regioes/[slug]/page.tsx
│       ├── analytics/page.tsx
│       └── alertas/page.tsx
├── components/
│   ├── layout/
│   ├── murais/
│   ├── agentes/
│   ├── eu-reporter/
│   ├── regioes/
│   ├── analytics/
│   ├── alertas/
│   └── ui/
├── hooks/
│   ├── useAuth.ts
│   ├── useMuralProducao.ts
│   ├── useMuralPublicados.ts
│   ├── useAgentes.ts
│   ├── useAgenteLogs.ts
│   ├── useUGCQueue.ts
│   ├── useAlertas.ts
│   ├── usePresence.ts
│   ├── useAnalytics.ts
│   └── useConfirm.ts
├── lib/
│   ├── api.ts
│   ├── websocket.ts
│   ├── markdown.ts
│   ├── formatters.ts
│   └── constants.ts
└── app/
    └── api/
        └── proxy/
            └── [...path]/
                └── route.ts
```

---

## 13. .env.example

```bash
# SESSION
SESSION_SECRET=                    # 32+ caracteres obrigatório

# SUPABASE (nunca com NEXT_PUBLIC_ para chaves sensíveis)
NEXT_PUBLIC_SUPABASE_URL=          # único caso NEXT_PUBLIC_ permitido
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # apenas anon key pode ser pública

# INTERNAL
INTERNAL_API_KEY=                  # chave compartilhada com o backend
BACKEND_URL=                       # URL interna do FastAPI — nunca NEXT_PUBLIC_

# APP
NEXT_PUBLIC_APP_URL=               # URL pública do painel
NODE_ENV=development
```
