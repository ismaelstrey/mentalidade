# Mentalidade

Plataforma pública de **biblioteca coletiva de vídeos** e **ferramentas de mudança de comportamento**, criada para apoiar o crescimento pessoal e profissional.

> Status: **Em desenvolvimento** — Fases 0 a 6 concluídas. Fase 7 (deploy) em preparação: PWA, variáveis de produção, configuração de produção do PM2, imagem Docker compatível com Fly.io e página interna de progresso prontos, com a publicação na VPS pendente.

## Visão

Permitir que qualquer pessoa salve vídeos que a inspiram, organize-os em **listas/trilhas por tema** (mentalidade forte, controle emocional, boas escolhas, disciplina, foco…) e compartilhe publicamente. Outros usuários podem **ver, importar e personalizar** essas listas, criando um acervo coletivo que evolui com a comunidade. Ao redor do conteúdo, a aplicação oferece ferramentas práticas de mudança de comportamento: **trilhas, metas, hábitos, diário e gamificação**.

## Stack

Conforme as regras do projeto:

| Camada | Tecnologia |
| --- | --- |
| Linguagem | TypeScript |
| Frontend | React + Vite |
| Estilização | Tailwind v4 |
| Animação | framer-motion |
| Rotas/proteção | react-router-dom |
| Backend | Node.js + Express (arquitetura em camadas) |
| ORM | Prisma |
| Banco | PostgreSQL |
| Autenticação | JWT + bcrypt |
| Validação | zod |
| Documentação | Swagger (swagger-ui-express) |
| Lint | ESLint |
| Ambiente | dotenv |
| Processos | PM2 |
| Pacotes | pnpm |

## Estrutura do monorepo

```
mentalidade/
├─ apps/
│  ├─ api/            # backend em camadas (src/routes, controllers, services, repositories,
│  │                  #  middlewares, validators, utils, docs, server.ts) + prisma/
│  └─ web/            # React + Vite (src/components, pages, hooks, services, contexts, types)
├─ packages/
│  └─ shared/         # tipos TypeScript compartilhados entre api e web
├─ deploy/            # arquivos de infraestrutura (nginx.conf)
├─ docs/              # documentação de planejamento
├─ ecosystem.config.cjs  # configuração de produção do PM2
├─ Dockerfile         # imagem de produção (API + SPA) para contêiner
├─ fly.toml           # configuração de deploy no Fly.io
├─ .dockerignore      # arquivos ignorados no build da imagem
├─ pnpm-workspace.yaml
└─ README.md
```

## Documentação

- [PRD — Product Requirements Document](docs/prd.md)
- [Modelo de dados](docs/modelo-de-dados.md)
- [Endpoints da API](docs/api-endpoints.md)
- [Roadmap e progresso](docs/roadmap.md)

## Roadmap (resumo)

- **Fase 0** — Setup do monorepo, ESLint, .env, Prisma, Swagger.
- **Fase 1** — Autenticação e perfis públicos.
- **Fase 2** — Vídeos/links, temas e listas/trilhas.
- **Fase 3** — Coletivo: importar listas, top lists, curtir e comentar.
- **Fase 4** — Hábitos e metas.
- **Fase 5** — Diário/reflexões.
- **Fase 6** — Gamificação e feed social.
- **Fase 7** — Deploy: PWA, variáveis de produção, PM2 de produção, imagem Docker/Fly.io e página de progresso concluídos; VPS + Nginx + HTTPS pendentes.

Detalhes em [docs/roadmap.md](docs/roadmap.md).

## Alterações recentes

### Deploy em contêiner (Docker + Fly.io)

- **Imagem única:** `Dockerfile` multi-stage (`node:24-bookworm-slim`) que instala o monorepo com pnpm, gera o Prisma Client, compila API e frontend e produz uma imagem final enxuta executando a API como usuário `node`. A mesma imagem serve o frontend compilado (SPA) na porta `8080`, mantendo API e Web na mesma origem.
- **API servindo a SPA:** `server.ts` entrega os arquivos de `WEB_DIST_DIR` (definido como `/app/apps/web/dist` no contêiner) com fallback de SPA, sem interferir nas rotas `/api`. O `helmet` foi ajustado com `Content-Security-Policy` liberando os players e capas oficiais de vídeo (`frame-src`/`img-src`) e desativando o `Cross-Origin-Embedder-Policy`, necessário para o embed de vídeos de terceiros.
- **Configuração de deploy:** `.dockerignore` (exclui `node_modules`, `dist`, `.env`, logs e docs do contexto de build) e `fly.toml` (região `gru`, `internal_port` 8080, health check em `/api/health`, `release_command` executando `prisma migrate deploy` e HTTPS forçado). Variáveis sensíveis (`DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`) devem ser definidas via `fly secrets set`.
- **Build do frontend:** o endereço da API é injetado no build via `ARG VITE_API_URL` (padrão `/api`), mantendo as chamadas na mesma origem em produção.

### Reprodução de vídeos (embed sob demanda)

- **Web:** player sob demanda nos itens das trilhas (`/listas/:id`). Ao clicar, cada vídeo carrega o player oficial incorporado: YouTube em modo de privacidade avançada (`youtube-nocookie.com`, com capa oficial de `img.youtube.com`), Instagram (`instagram.com/p/{shortcode}/embed`), TikTok (player oficial `tiktok.com/player/v1/{id}`) e Facebook (`facebook.com/plugins/video.php`). Links sem identificador válido continuam usando o link externo, evitando problemas de política de uso.
- Detalhes de conformidade: a reprodução usa exclusivamente o player oficial (o vídeo não é baixado nem rehospedado, controles/anúncios/marca são preservados) e a capa do YouTube é hospedada pela própria plataforma. Quando o autor desativa a incorporação, o embed é bloqueado pela plataforma e o link externo permanece como alternativa.
- **Web:** utilitário `videoEmbed.ts` (extração do ID e montagem das URLs) e componente `VideoPlayer.tsx`.

### Fase 7 — Deploy (preparação)

- **PWA:** manifest (`apps/web/public/manifest.webmanifest`), service worker com cache de recursos e funcionamento offline (`apps/web/public/sw.js`), ícone da aplicação (`apps/web/public/icons/icon.jpg`) e metadados no `index.html` (`theme-color`, manifest, Apple touch icon). O service worker é registrado em `main.tsx` apenas em produção.
- **Variáveis de produção:** `.env.example` da API e do Web atualizados com valores de produção documentados (API na porta 3344, `CORS_ORIGIN` e `VITE_API_URL` apontando para o domínio publicado). Ajuste dos padrões em `env.ts` (porta 3344 e CORS em `http://localhost:5180`).
- **PM2 de produção:** `ecosystem.config.cjs` com modo fork, `autorestart`, limites de memória (`max_memory_restart`), `restart_delay` e logs dedicados em `logs/`. Execução via `pm2 startOrReload ecosystem.config.cjs`.
- **Infraestrutura:** `deploy/nginx.conf` com proxy reverso de `/api` e `/api-docs` para a porta 3344, entrega da SPA estática, cache de assets (imutável) e redirecionamento HTTP → HTTPS com Certbot. **Preparado, sem publicação na VPS.**
- **Web:** página interna de progresso em `/progresso` (percentual concluído e acompanhamento das fases 0 a 7 do roadmap), acessível pela navegação da página inicial.

### Fase 6 — Gamificação e feed

- **API:** sistema de pontos/XP com eventos (`PointEvent`) concedidos ao criar trilha (+20), importar trilha (+10), fazer check-in de hábito (+5, sem duplicar no mesmo dia), concluir meta (+50) e registrar reflexão (+10). Estatísticas do usuário com XP, nível e progresso (`GET /gamification`), ranking de contribuição por pontuação (`GET /gamification/ranking`) e feed de atividades recentes (`GET /gamification/feed`). Seguir/deixar de seguir usuários (`GET`/`POST /users/:username/follow`, sem auto-seguir). Níveis calculados por faixas de XP e 6 conquistas (badges) avaliadas a partir das métricas de uso. Endpoints documentados no Swagger (tag "Gamificação").
- **Web:** página `/evolucao` com nível e barra de XP, grade de conquistas (com progresso), ranking de contribuição e atividade da comunidade. Botão Seguir/Deixar de seguir no perfil público. Hooks react-query (`useGamification`, `useRanking`, `useFeed`, `useFollowState`, `useToggleFollow`) com invalidação de cache.
- **Compartilhado:** tipos `PointEventType`, `BadgeDto`, `GamificationStats`, `RankingEntry`, `FeedItem` e `FollowState`.

### Fase 5 — Diário

- **API:** CRUD de entradas de reflexão (`GET/POST /journal`, `GET/PUT/DELETE /journal/:id`) com título opcional, conteúdo, humor, visibilidade (privada/pública) e vínculo opcional a uma trilha (validando que a lista pertence ao usuário). Listagem pública do diário por perfil (`GET /users/:username/journal`, apenas reflexões públicas — todas quando é o próprio dono). Endpoints documentados no Swagger (tag "Diário").
- **Web:** página `/diario` (registro com humor, visibilidade e vínculo a trilha, além de edição inline e remoção) e seção "Diário público" no perfil. Hooks react-query (`useJournal`, `useJournalMutations`, `useUserJournal`) com invalidação de cache.
- **Compartilhado:** tipos `JournalEntryDto`, `JournalFeedItem`, `JournalVisibility` e respectivas requisições.

### Fase 4 — Hábitos e metas

- **API:** CRUD de hábitos vinculados opcionalmente a uma trilha (`GET/POST /habits`, `GET/PUT/DELETE /habits/:id`), check-in diário com idempotência e remoção (`POST/DELETE /habits/:id/checkin`) e cálculo de sequência atual (streak) e heatmap de 30 dias. CRUD de metas com marcos e progresso automático (`GET/POST /goals`, `GET/PUT/DELETE /goals/:id`, `POST /goals/:id/milestones`, `PUT/DELETE /goals/:id/milestones/:milestoneId`): o progresso reflete os marcos concluídos, ir a "concluída" força 100% e reativar/arquivar recalcula. Endpoints documentados no Swagger (tags "Hábitos" e "Metas").
- **Web:** página `/habitos` (criação de hábito com frequência e horário, check-in do dia togglável, streak 🔥 e heatmap de 30 dias) e página `/metas` (criação com marcos, barra de progresso, marcar/remover marcos e concluir/reativar/arquivar). Hooks react-query (`useHabits`, `useHabitMutations`, `useGoals`, `useGoalMutations`) com invalidação de cache.
- **Compartilhado:** tipos `HabitDto`, `HabitLogDto`, `HabitFrequency`, `HabitLogStatus`, `GoalDto`, `GoalMilestoneDto`, `GoalStatus` e respectivas requisições.

### Fase 3 — Coletivo

- **API:** descoberta pública com busca, filtros e ordenação (`GET /lists/discover` — termo, tema, tag, plataforma e `sort` por recentes/populares/curtidas/views, com paginação); importação de listas como cópia própria (`POST /lists/:id/fork`, incrementa `importCount` na origem); curtir/descurtir (`POST /lists/:id/like`, alterna e mantém `likeCount`); comentários (`GET/POST /lists/:id/comments`, `DELETE /lists/:id/comments/:commentId`, com permissão para o autor ou dono da lista); listas públicas no perfil (`GET /users/:username/lists`, respeitando visibilidade). Detalhe da lista agora retorna `liked` e incrementa `viewCount` para visitantes. Endpoints documentados no Swagger (tag "Coletivo").
- **Web:** página `/descobrir` (busca por termo, filtros de tema/tag/plataforma, ordenação e paginação em cards com autor e contadores ♥ ⤓ 👁); botões Curtir e Importar no detalhe da lista (com fallback para `/entrar` quando não autenticado) e seção de comentários; seção "Listas públicas" no perfil. Novos hooks react-query (`useDiscover`, `useUserLists`, `useCollectiveMutations`, `useComments`, `useCommentMutations`) com invalidação de cache.
- **Compartilhado:** tipos `ListCard`, `DiscoverQuery`, `ListSort`, `CommentDto`, `CommentRequest` e `LikeState`.

### Fase 2 — Vídeos, temas e listas

- **API:** CRUD de listas/trilhas (`GET/POST /lists`, `GET/PUT/DELETE /lists/:id`), gestão de itens (adicionar, atualizar, remover e reordenar em `POST/PUT/DELETE /lists/:id/items` e `PUT /lists/:id/reorder`), prévia de link com metadados via oEmbed do YouTube (`POST /links/preview`) e catálogo de temas e tags (`GET /themes`, `GET /tags`). Detecção de plataforma (YouTube, Facebook, Instagram, TikTok, outro), geração de slug e contagem de itens. Endpoints documentados no Swagger.
- **Web:** páginas de biblioteca (`/listas`), criação/edição (`/listas/nova`, `/listas/:id/editar`) e detalhe público (`/listas/:id`), com adicionar/remover/reordenar itens e botão "Detectar" para prévia do link. Hooks react-query (`useLists`, `useList`, `useListMutations`, `useListItemMutations`, `useLinkPreview`, `useThemes`) com invalidação de cache.
- **Compartilhado:** tipos de lista, item, prévia de link e tema em `packages/shared`.
- **Banco:** migração para **Neon** (PostgreSQL serverless) com Prisma e driver adapter `@prisma/adapter-pg`; API na porta `3344`.

### Fase 1 — Autenticação e perfis

- **API:** cadastro e login com JWT + bcrypt (`POST /auth/register`, `POST /auth/login`), middleware de autenticação, `GET /auth/me`, atualização de perfil (`PUT /users/me`) e perfil público (`GET /users/:username`). Endpoints documentados no Swagger.
- **Web:** contexto de autenticação (`AuthContext` + `useAuth`), hooks de API (`useLogin`, `useRegister`, `useCurrentUser`, `useProfile`), interceptor do axios para envio do token e rotas `/entrar`, `/cadastro`, `/conta` (protegida) e `/u/:username`.
- **Compartilhado:** tipos de autenticação e perfil em `packages/shared`.

### Fase 0 — Setup

- Monorepo pnpm (`apps/api`, `apps/web`, `packages/shared`), ESLint + TypeScript, `.env` por ambiente, Prisma + PostgreSQL, Swagger em `/api-docs` e estrutura em camadas do backend.
