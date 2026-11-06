# =============================================================================
# Dockerfile de produção — Mentalidade (compatível com Fly.io)
#
# Gera uma única imagem que executa a API (Express) e também serve o frontend
# compilado (SPA) na mesma porta, simplificando o deploy em contêiner.
#
# Build local:  docker build -t mentalidade .
# Execução:     docker run -p 8080:8080 --env-file apps/api/.env mentalidade
# =============================================================================

# ---- Estágio de build -------------------------------------------------------
FROM node:24-bookworm-slim AS build

# Ferramentas para compilar módulos nativos (ex.: bcrypt) quando não houver
# binário pré-compilado disponível para a plataforma.
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Versão do pnpm usada no build (pode ser sobrescrita com --build-arg).
ARG PNPM_VERSION=latest
RUN npm install -g pnpm@${PNPM_VERSION}

# URL fictícia: o prisma.config.ts exige a presença da variável em tempo de build
# (a conexão real com o banco só acontece em execução, via secrets do Fly.io).
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"

WORKDIR /app

# Copia apenas os manifestos para aproveitar o cache de camadas do Docker.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/

# Instala todas as dependências do workspace.
RUN pnpm install --frozen-lockfile

# Endereço da API usado pelo frontend no build. Como a própria API serve a SPA,
# o caminho relativo "/api" mantém as chamadas na mesma origem.
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

# Copia o restante do código-fonte e compila API e frontend.
COPY . .

RUN pnpm --filter @mentalidade/api prisma:generate \
  && pnpm --filter @mentalidade/api build \
  && pnpm --filter @mentalidade/web build

# ---- Estágio de runtime -----------------------------------------------------
FROM node:24-bookworm-slim AS runtime

ENV NODE_ENV=production \
    PORT=8080 \
    WEB_DIST_DIR=/app/apps/web/dist

WORKDIR /app/apps/api

# Copia o workspace já compilado (código, dependências de produção e o
# Prisma Client gerado no estágio de build).
COPY --from=build /app /app

# Executa como usuário sem privilégios.
USER node

EXPOSE 8080

# Verificação de saúde do contêiner (o Fly.io usa a checagem definida no fly.toml,
# mas isto também ajuda na execução local via Docker).
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/api/health').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/server.js"]
