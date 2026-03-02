# ============================================================
# Dockerfile raiz — Easypanel App Service (Frontend Next.js)
#
# O Easypanel procura por "Dockerfile" na raiz do repositório.
# Este arquivo replica o build do frontend/Dockerfile mas com
# o contexto correto quando chamado a partir da raiz.
# ============================================================

# ---- Build ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .
RUN npm run build

# ---- Runner (imagem mínima) ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
