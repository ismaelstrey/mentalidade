# Endpoints da API — Mentalidade

Base: `/api`. Documentação interativa em `/api-docs` (Swagger). Todas as rotas protegidas exigem `Authorization: Bearer <token>`.

## Autenticação

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/auth/register` | Cadastro de usuário |
| POST | `/auth/login` | Login (retorna JWT) |
| GET | `/auth/me` | Dados do usuário autenticado |

## Usuários e social

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/users/:username` | Perfil público |
| PUT | `/users/me` | Atualizar perfil |
| POST | `/users/:id/follow` | Seguir usuário |
| DELETE | `/users/:id/follow` | Deixar de seguir |

## Listas / Trilhas

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/lists` | Listas do usuário autenticado |
| POST | `/lists` | Criar lista |
| GET | `/lists/:id` | Detalhe da lista |
| PUT | `/lists/:id` | Editar lista |
| DELETE | `/lists/:id` | Excluir lista |
| GET | `/lists/public` | Listas públicas (busca/filtro) |
| GET | `/lists/top` | Top Lists (imports, curtidas, views) |
| POST | `/lists/:id/items` | Adicionar item |
| PUT | `/lists/:id/items/:itemId` | Editar item |
| DELETE | `/lists/:id/items/:itemId` | Remover item |
| PUT | `/lists/:id/reorder` | Reordenar itens |
| POST | `/lists/:id/import` | Importar (fork) lista |
| POST | `/lists/:id/like` | Curtir/descurtir |
| GET | `/lists/:id/comments` | Comentários |
| POST | `/lists/:id/comments` | Comentar |

## Metadados de link

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/links/preview` | Detecta plataforma e metadados do link (oEmbed) |

## Tags e temas

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/tags` | Listar tags |
| GET | `/themes` | Catálogo de temas |

## Hábitos

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/habits` | Listar hábitos |
| POST | `/habits` | Criar hábito |
| PUT | `/habits/:id` | Editar hábito |
| DELETE | `/habits/:id` | Excluir hábito |
| POST | `/habits/:id/check-in` | Check-in do dia |
| GET | `/habits/:id/logs` | Histórico (heatmap/streak) |

## Metas

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/goals` | Listar metas |
| POST | `/goals` | Criar meta |
| PUT | `/goals/:id` | Editar meta |
| DELETE | `/goals/:id` | Excluir meta |
| POST | `/goals/:id/milestones` | Adicionar marco |
| PUT | `/goals/:id/milestones/:milestoneId` | Concluir/editar marco |

## Diário

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/journal` | Listar entradas |
| POST | `/journal` | Criar entrada |
| PUT | `/journal/:id` | Editar entrada |
| DELETE | `/journal/:id` | Excluir entrada |

## Gamificação

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/me/points` | Pontos/XP do usuário |
| GET | `/me/badges` | Badges conquistadas |
| GET | `/ranking` | Ranking de contribuição |

## Padrões de resposta

```json
{ "data": {}, "message": "ok" }
```

Erros seguem o formato:

```json
{ "error": true, "message": "Descrição do erro", "statusCode": 400 }
```
