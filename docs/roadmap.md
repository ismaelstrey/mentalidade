# Roadmap e progresso — Mentalidade

Acompanhamento das entregas por fase. Marque os itens conforme concluídos.

## Fase 0 — Setup ✅

- [x] Monorepo pnpm (`apps/api`, `apps/web`, `packages/shared`)
- [x] ESLint + configuração TypeScript
- [x] `.env` por ambiente (dotenv)
- [x] Prisma + PostgreSQL (schema + client gerado; migração inicial pendente de banco)
- [x] Swagger em `/api-docs`
- [x] Estrutura de camadas do backend
- [x] Cliente HTTP + estrutura de hooks no frontend

## Fase 1 — Autenticação e perfis ✅

- [x] Registro e login (JWT + bcrypt)
- [x] Middleware de autenticação
- [x] Perfil público `@username`
- [x] Proteção de rotas no frontend (react-router-dom)

> Rotas web: `/entrar`, `/cadastro`, `/conta` (protegida) e `/u/:username` (perfil público).
> Endpoints: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `PUT /users/me`, `GET /users/:username`.

## Fase 2 — Vídeos, temas e listas ✅

- [x] CRUD de links/vídeos com metadados
- [x] Detecção de plataforma (oEmbed)
- [x] Catálogo de temas
- [x] CRUD de listas/trilhas
- [x] Adicionar/reordenar/remover itens
- [x] Visibilidade (privada/pública/não-listada)

> Endpoints: `GET/POST /lists`, `GET/PUT/DELETE /lists/:id`, `POST /lists/:id/items`,
> `PUT/DELETE /lists/:id/items/:itemId`, `PUT /lists/:id/reorder`, `POST /links/preview`,
> `GET /themes`, `GET /tags`.
> Rotas web: `/listas` (minha biblioteca), `/listas/nova`, `/listas/:id`, `/listas/:id/editar`.

## Fase 3 — Coletivo ✅

- [x] Perfil público com listas
- [x] Importar lista (fork)
- [x] Top Lists (imports/curtidas/views)
- [x] Curtir e comentar
- [x] Busca e filtros (tema, tag, plataforma)

> Endpoints: `GET /lists/discover`, `POST /lists/:id/fork`, `POST /lists/:id/like`,
> `GET/POST /lists/:id/comments`, `DELETE /lists/:id/comments/:commentId`,
> `GET /users/:username/lists`.
> Rotas web: `/descobrir` (busca, filtros e ordenação), perfil público com listas
> (`/u/:username`), curtir/importar e comentários no detalhe da lista (`/listas/:id`).

## Fase 4 — Hábitos e metas ✅

- [x] CRUD de hábitos vinculados a tema/trilha
- [x] Check-in diário, streak e heatmap
- [x] CRUD de metas com progresso e marcos

> Endpoints: `GET/POST /habits`, `GET/PUT/DELETE /habits/:id`,
> `POST/DELETE /habits/:id/checkin`, `GET/POST /goals`, `GET/PUT/DELETE /goals/:id`,
> `POST /goals/:id/milestones`, `PUT/DELETE /goals/:id/milestones/:milestoneId`.
> Rotas web: `/habitos` (check-in do dia, streak e heatmap de 30 dias) e
> `/metas` (progresso por marcos, concluir/reativar/arquivar).

## Fase 5 — Diário ✅

- [x] CRUD de entradas de reflexão
- [x] Vínculo com vídeo/tema
- [x] Visibilidade privada/pública

> Endpoints: `GET/POST /journal`, `GET/PUT/DELETE /journal/:id`,
> `GET /users/:username/journal` (público — apenas reflexões marcadas como públicas,
> todas quando é o próprio dono).
> Rotas web: `/diario` (registro, humor, visibilidade e vínculo com trilha, com edição
> inline) e seção "Diário público" no perfil (`/u/:username`).

## Fase 6 — Gamificação e feed ✅

- [x] Sistema de pontos/XP
- [x] Badges e níveis
- [x] Ranking de contribuição
- [x] Feed social e seguir usuários

> Endpoints: `GET /gamification` (XP, nível e conquistas), `GET /gamification/ranking`,
> `GET /gamification/feed` e `GET`/`POST /users/:username/follow`.
> Pontos por ação: criar trilha (+20), importar trilha (+10), check-in de hábito (+5),
> concluir meta (+50) e registrar reflexão (+10). Níveis por faixas de XP e 6 conquistas.
> Rotas web: `/evolucao` (nível/XP, conquistas, ranking e feed) e botão Seguir/Deixar de
> seguir no perfil (`/u/:username`).

## Fase 7 — Deploy

- [x] PM2 de produção (`ecosystem.config.cjs` com logs, limites e modo fork)
- [x] Variáveis de produção (`.env.example` da API e Web; API na porta 3344)
- [x] PWA (manifest, service worker, ícone e registro no `main.tsx`)
- [x] Página interna de progresso (`/progresso`)
- [ ] VPS + Nginx + HTTPS (arquivo `deploy/nginx.conf` preparado; publicação pendente)

> Preparação de produção concluída **sem publicar**: `deploy/nginx.conf` (proxy de `/api` e
> `/api-docs` para a porta 3344, SPA estática, cache de assets e redirecionamento HTTPS) e
> `ecosystem.config.cjs` prontos para `pm2 startOrReload`.
> Pendente: provisionar a VPS, gerar certificados (Certbot), apontar o domínio e ajustar os
> `.env` de produção.

