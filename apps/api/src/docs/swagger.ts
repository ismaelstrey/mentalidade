// Parâmetro de caminho reutilizado na documentação.
function pathParam(name: string) {
  return { name, in: "path", required: true, schema: { type: "string" } };
}

// Documento OpenAPI servido pelo Swagger UI.
export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Mentalidade API",
    version: "0.1.0",
    description:
      "API da plataforma coletiva de biblioteca de vídeos e ferramentas de desenvolvimento de comportamento.",
  },
  servers: [{ url: "http://localhost:3344" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      PublicUser: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          username: { type: "string" },
          bio: { type: "string", nullable: true },
          avatarUrl: { type: "string", nullable: true },
          role: { type: "string", enum: ["USER", "MODERATOR", "ADMIN"] },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      AuthUser: {
        allOf: [
          { $ref: "#/components/schemas/PublicUser" },
          {
            type: "object",
            properties: { email: { type: "string", format: "email" } },
          },
        ],
      },
      AuthResponse: {
        type: "object",
        properties: {
          token: { type: "string" },
          user: { $ref: "#/components/schemas/AuthUser" },
        },
      },
      PublicProfile: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/PublicUser" },
          stats: {
            type: "object",
            properties: {
              followers: { type: "integer" },
              following: { type: "integer" },
              lists: { type: "integer" },
            },
          },
        },
      },
      ListItem: {
        type: "object",
        properties: {
          id: { type: "string" },
          order: { type: "integer" },
          url: { type: "string" },
          title: { type: "string" },
          platform: { type: "string", enum: ["YOUTUBE", "FACEBOOK", "INSTAGRAM", "TIKTOK", "OUTRO"] },
          note: { type: "string", nullable: true },
        },
      },
      ListSummary: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          slug: { type: "string" },
          description: { type: "string", nullable: true },
          theme: { type: "string", nullable: true },
          visibility: { type: "string", enum: ["PRIVATE", "PUBLIC", "UNLISTED"] },
          likeCount: { type: "integer" },
          importCount: { type: "integer" },
          viewCount: { type: "integer" },
          itemCount: { type: "integer" },
          tags: { type: "array", items: { type: "string" } },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      ListDetail: {
        allOf: [
          { $ref: "#/components/schemas/ListSummary" },
          {
            type: "object",
            properties: {
              owner: { $ref: "#/components/schemas/PublicUser" },
              items: { type: "array", items: { $ref: "#/components/schemas/ListItem" } },
              liked: { type: "boolean" },
            },
          },
        ],
      },
      ListCard: {
        allOf: [
          { $ref: "#/components/schemas/ListSummary" },
          {
            type: "object",
            properties: { owner: { $ref: "#/components/schemas/PublicUser" } },
          },
        ],
      },
      DiscoverResult: {
        type: "object",
        properties: {
          items: { type: "array", items: { $ref: "#/components/schemas/ListCard" } },
          total: { type: "integer" },
          page: { type: "integer" },
          perPage: { type: "integer" },
        },
      },
      Comment: {
        type: "object",
        properties: {
          id: { type: "string" },
          content: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          author: { $ref: "#/components/schemas/PublicUser" },
        },
      },
      LikeState: {
        type: "object",
        properties: {
          liked: { type: "boolean" },
          likeCount: { type: "integer" },
        },
      },
      HabitLog: {
        type: "object",
        properties: {
          date: { type: "string", example: "2026-01-31" },
          status: { type: "string", enum: ["DONE", "SKIPPED"] },
        },
      },
      Habit: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          frequency: { type: "string", enum: ["DAILY", "WEEKLY"] },
          reminderTime: { type: "string", nullable: true, example: "07:30" },
          listId: { type: "string", nullable: true },
          listTitle: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          streak: { type: "integer" },
          doneInPeriod: { type: "integer" },
          todayStatus: { type: "string", enum: ["DONE", "SKIPPED"], nullable: true },
          logs: { type: "array", items: { $ref: "#/components/schemas/HabitLog" } },
        },
      },
      GoalMilestone: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          done: { type: "boolean" },
          order: { type: "integer" },
        },
      },
      Goal: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string", nullable: true },
          targetDate: { type: "string", format: "date-time", nullable: true },
          status: { type: "string", enum: ["ACTIVE", "DONE", "ARCHIVED"] },
          progress: { type: "integer" },
          milestones: { type: "array", items: { $ref: "#/components/schemas/GoalMilestone" } },
        },
      },
      Theme: {
        type: "object",
        properties: {
          slug: { type: "string" },
          label: { type: "string" },
          description: { type: "string" },
        },
      },
      JournalEntry: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string", nullable: true },
          content: { type: "string" },
          mood: { type: "string", nullable: true },
          visibility: { type: "string", enum: ["PRIVATE", "PUBLIC"] },
          listId: { type: "string", nullable: true },
          listTitle: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      JournalFeedItem: {
        allOf: [
          { $ref: "#/components/schemas/JournalEntry" },
          {
            type: "object",
            properties: { author: { $ref: "#/components/schemas/PublicUser" } },
          },
        ],
      },
      Badge: {
        type: "object",
        properties: {
          code: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          icon: { type: "string" },
          earned: { type: "boolean" },
          current: { type: "integer" },
          target: { type: "integer" },
          progress: { type: "integer" },
        },
      },
      GamificationStats: {
        type: "object",
        properties: {
          xp: { type: "integer" },
          level: { type: "integer" },
          levelName: { type: "string" },
          xpIntoLevel: { type: "integer" },
          xpForNextLevel: { type: "integer" },
          badges: { type: "array", items: { $ref: "#/components/schemas/Badge" } },
        },
      },
      RankingEntry: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/PublicUser" },
          xp: { type: "integer" },
          level: { type: "integer" },
          levelName: { type: "string" },
        },
      },
      FeedItem: {
        type: "object",
        properties: {
          id: { type: "string" },
          type: {
            type: "string",
            enum: ["CREATE_LIST", "IMPORT_LIST", "HABIT_CHECKIN", "GOAL_DONE", "JOURNAL_ENTRY"],
          },
          points: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
          actor: { $ref: "#/components/schemas/PublicUser" },
        },
      },
      FollowState: {
        type: "object",
        properties: {
          following: { type: "boolean" },
          followers: { type: "integer" },
        },
      },
    },
  },
  paths: {
    "/api/health": {
      get: {
        tags: ["Sistema"],
        summary: "Verifica o status da API",
        responses: {
          "200": { description: "API operante" },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Autenticação"],
        summary: "Cadastra um novo usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "username", "email", "password"],
                properties: {
                  name: { type: "string" },
                  username: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Usuário cadastrado",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } },
            },
          },
          "409": { description: "E-mail ou usuário já cadastrado" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Autenticação"],
        summary: "Autentica um usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login realizado",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } },
            },
          },
          "401": { description: "Credenciais inválidas" },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Autenticação"],
        summary: "Retorna os dados do usuário autenticado",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Dados do usuário",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/AuthUser" } },
            },
          },
          "401": { description: "Não autenticado" },
        },
      },
    },
    "/api/users/me": {
      put: {
        tags: ["Usuários"],
        summary: "Atualiza o perfil do usuário autenticado",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  bio: { type: "string", nullable: true },
                  avatarUrl: { type: "string", nullable: true },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Perfil atualizado" },
          "401": { description: "Não autenticado" },
        },
      },
    },
    "/api/users/{username}": {
      get: {
        tags: ["Usuários"],
        summary: "Retorna o perfil público de um usuário",
        parameters: [
          {
            name: "username",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Perfil público",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/PublicProfile" } },
            },
          },
          "404": { description: "Perfil não encontrado" },
        },
      },
    },
    "/api/users/{username}/lists": {
      get: {
        tags: ["Coletivo"],
        summary: "Lista as listas públicas de um usuário",
        parameters: [pathParam("username")],
        responses: {
          "200": {
            description: "Listas públicas do usuário",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/ListCard" } },
              },
            },
          },
          "404": { description: "Perfil não encontrado" },
        },
      },
    },
    "/api/users/{username}/journal": {
      get: {
        tags: ["Diário"],
        summary: "Lista as reflexões públicas de um usuário",
        parameters: [pathParam("username")],
        responses: {
          "200": {
            description: "Reflexões públicas do usuário",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/JournalFeedItem" } },
              },
            },
          },
          "404": { description: "Perfil não encontrado" },
        },
      },
    },
    "/api/users/{username}/follow": {
      get: {
        tags: ["Gamificação"],
        summary: "Retorna o estado de seguimento do usuário atual sobre um perfil",
        parameters: [pathParam("username")],
        responses: {
          "200": {
            description: "Estado de seguimento",
            content: { "application/json": { schema: { $ref: "#/components/schemas/FollowState" } } },
          },
          "404": { description: "Perfil não encontrado" },
        },
      },
      post: {
        tags: ["Gamificação"],
        summary: "Alterna o seguimento do usuário autenticado sobre um perfil",
        security: [{ bearerAuth: [] }],
        parameters: [pathParam("username")],
        responses: {
          "200": {
            description: "Estado de seguimento",
            content: { "application/json": { schema: { $ref: "#/components/schemas/FollowState" } } },
          },
          "400": { description: "Não é possível seguir a si mesmo" },
          "404": { description: "Perfil não encontrado" },
        },
      },
    },
    "/api/lists": {
      get: {
        tags: ["Listas"],
        summary: "Lista as listas do usuário autenticado",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Listas do usuário" },
          "401": { description: "Não autenticado" },
        },
      },
      post: {
        tags: ["Listas"],
        summary: "Cria uma nova lista",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string", nullable: true },
                  theme: { type: "string", nullable: true },
                  visibility: { type: "string", enum: ["PRIVATE", "PUBLIC", "UNLISTED"] },
                  tags: { type: "array", items: { type: "string" } },
                  items: { type: "array", items: { $ref: "#/components/schemas/ListItem" } },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Lista criada",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/ListDetail" } },
            },
          },
          "400": { description: "Dados inválidos" },
          "401": { description: "Não autenticado" },
        },
      },
    },
    "/api/lists/discover": {
      get: {
        tags: ["Coletivo"],
        summary: "Busca listas públicas com filtros e ordenação",
        parameters: [
          { name: "q", in: "query", schema: { type: "string" } },
          { name: "theme", in: "query", schema: { type: "string" } },
          { name: "tag", in: "query", schema: { type: "string" } },
          {
            name: "platform",
            in: "query",
            schema: { type: "string", enum: ["YOUTUBE", "FACEBOOK", "INSTAGRAM", "TIKTOK", "OUTRO"] },
          },
          {
            name: "sort",
            in: "query",
            schema: { type: "string", enum: ["recent", "popular", "likes", "views"] },
          },
          { name: "page", in: "query", schema: { type: "integer", minimum: 1 } },
          { name: "perPage", in: "query", schema: { type: "integer", minimum: 1, maximum: 50 } },
        ],
        responses: {
          "200": {
            description: "Listas encontradas",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/DiscoverResult" } },
            },
          },
        },
      },
    },
    "/api/lists/{id}": {
      get: {
        tags: ["Listas"],
        summary: "Retorna o detalhe de uma lista",
        parameters: [pathParam("id")],
        responses: {
          "200": {
            description: "Detalhe da lista",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/ListDetail" } },
            },
          },
          "403": { description: "Lista privada" },
          "404": { description: "Lista não encontrada" },
        },
      },
      put: {
        tags: ["Listas"],
        summary: "Atualiza uma lista",
        security: [{ bearerAuth: [] }],
        parameters: [pathParam("id")],
        responses: {
          "200": { description: "Lista atualizada" },
          "403": { description: "Sem permissão" },
          "404": { description: "Lista não encontrada" },
        },
      },
      delete: {
        tags: ["Listas"],
        summary: "Remove uma lista",
        security: [{ bearerAuth: [] }],
        parameters: [pathParam("id")],
        responses: {
          "200": { description: "Lista removida" },
          "403": { description: "Sem permissão" },
          "404": { description: "Lista não encontrada" },
        },
      },
    },
    "/api/lists/{id}/fork": {
      post: {
        tags: ["Coletivo"],
        summary: "Importa (fork) uma lista para o acervo do usuário",
        security: [{ bearerAuth: [] }],
        parameters: [pathParam("id")],
        responses: {
          "201": {
            description: "Lista importada",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ListDetail" } } },
          },
          "403": { description: "Lista privada" },
          "404": { description: "Lista não encontrada" },
        },
      },
    },
    "/api/lists/{id}/like": {
      post: {
        tags: ["Coletivo"],
        summary: "Alterna a curtida do usuário em uma lista",
        security: [{ bearerAuth: [] }],
        parameters: [pathParam("id")],
        responses: {
          "200": {
            description: "Estado da curtida",
            content: { "application/json": { schema: { $ref: "#/components/schemas/LikeState" } } },
          },
          "404": { description: "Lista não encontrada" },
        },
      },
    },
    "/api/lists/{id}/comments": {
      get: {
        tags: ["Coletivo"],
        summary: "Lista os comentários de uma lista",
        parameters: [pathParam("id")],
        responses: {
          "200": {
            description: "Comentários da lista",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Comment" } },
              },
            },
          },
          "404": { description: "Lista não encontrada" },
        },
      },
      post: {
        tags: ["Coletivo"],
        summary: "Adiciona um comentário à lista",
        security: [{ bearerAuth: [] }],
        parameters: [pathParam("id")],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["content"],
                properties: { content: { type: "string" } },
              },
            },
          },
        },
        responses: {
          "201": { description: "Comentário publicado" },
          "401": { description: "Não autenticado" },
        },
      },
    },
    "/api/lists/{id}/comments/{commentId}": {
      delete: {
        tags: ["Coletivo"],
        summary: "Remove um comentário (autor ou dono da lista)",
        security: [{ bearerAuth: [] }],
        parameters: [pathParam("id"), pathParam("commentId")],
        responses: {
          "200": { description: "Comentário removido" },
          "403": { description: "Sem permissão" },
          "404": { description: "Comentário não encontrado" },
        },
      },
    },
    "/api/lists/{id}/items": {
      post: {
        tags: ["Listas"],
        summary: "Adiciona um item à lista",
        security: [{ bearerAuth: [] }],
        parameters: [pathParam("id")],
        responses: {
          "201": { description: "Item adicionado" },
          "403": { description: "Sem permissão" },
          "404": { description: "Lista não encontrada" },
        },
      },
    },
    "/api/lists/{id}/items/{itemId}": {
      put: {
        tags: ["Listas"],
        summary: "Edita um item da lista",
        security: [{ bearerAuth: [] }],
        parameters: [pathParam("id"), pathParam("itemId")],
        responses: {
          "200": { description: "Item atualizado" },
          "404": { description: "Item não encontrado" },
        },
      },
      delete: {
        tags: ["Listas"],
        summary: "Remove um item da lista",
        security: [{ bearerAuth: [] }],
        parameters: [pathParam("id"), pathParam("itemId")],
        responses: {
          "200": { description: "Item removido" },
          "404": { description: "Item não encontrado" },
        },
      },
    },
    "/api/lists/{id}/reorder": {
      put: {
        tags: ["Listas"],
        summary: "Reordena os itens da lista",
        security: [{ bearerAuth: [] }],
        parameters: [pathParam("id")],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["itemIds"],
                properties: {
                  itemIds: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Itens reordenados" },
          "400": { description: "Ordem inválida" },
          "404": { description: "Lista não encontrada" },
        },
      },
    },
    "/api/habits": {
      get: {
        tags: ["Hábitos"],
        summary: "Lista os hábitos do usuário com estatísticas",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Hábitos do usuário",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Habit" } },
              },
            },
          },
          "401": { description: "Não autenticado" },
        },
      },
      post: {
        tags: ["Hábitos"],
        summary: "Cria um hábito",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string" },
                  frequency: { type: "string", enum: ["DAILY", "WEEKLY"] },
                  reminderTime: { type: "string", nullable: true, example: "07:30" },
                  listId: { type: "string", nullable: true },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Hábito criado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Habit" } } },
          },
          "400": { description: "Dados inválidos" },
          "401": { description: "Não autenticado" },
        },
      },
    },
    "/api/habits/{id}": {
      get: {
        tags: ["Hábitos"],
        summary: "Retorna um hábito",
        security: [{ bearerAuth: [] }],
        parameters: [pathParam("id")],
        responses: {
          "200": {
            description: "Hábito",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Habit" } } },
          },
          "404": { description: "Hábito não encontrado" },
        },
      },
      put: {
        tags: ["Hábitos"],
        summary: "Atualiza um hábito",
        security: [{ bearerAuth: [] }],
        parameters: [pathParam("id")],
        responses: {
          "200": { description: "Hábito atualizado" },
          "403": { description: "Sem permissão" },
          "404": { description: "Hábito não encontrado" },
        },
      },
      delete: {
        tags: ["Hábitos"],
        summary: "Remove um hábito",
        security: [{ bearerAuth: [] }],
        parameters: [pathParam("id")],
        responses: {
          "200": { description: "Hábito removido" },
          "403": { description: "Sem permissão" },
          "404": { description: "Hábito não encontrado" },
        },
      },
    },
    "/api/habits/{id}/checkin": {
      post: {
        tags: ["Hábitos"],
        summary: "Registra o check-in do hábito em uma data",
        security: [{ bearerAuth: [] }],
        parameters: [pathParam("id")],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  date: { type: "string", example: "2026-01-31" },
                  status: { type: "string", enum: ["DONE", "SKIPPED"] },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Check-in registrado" },
          "403": { description: "Sem permissão" },
          "404": { description: "Hábito não encontrado" },
        },
      },
      delete: {
        tags: ["Hábitos"],
        summary: "Remove o check-in do hábito em uma data",
        security: [{ bearerAuth: [] }],
        parameters: [pathParam("id")],
        responses: {
          "200": { description: "Check-in removido" },
          "404": { description: "Hábito não encontrado" },
        },
      },
    },
    "/api/goals": {
      get: {
        tags: ["Metas"],
        summary: "Lista as metas do usuário",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Metas do usuário",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Goal" } },
              },
            },
          },
          "401": { description: "Não autenticado" },
        },
      },
      post: {
        tags: ["Metas"],
        summary: "Cria uma meta com marcos opcionais",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string", nullable: true },
                  targetDate: { type: "string", nullable: true, example: "2026-06-30" },
                  milestones: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Meta criada",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Goal" } } },
          },
          "400": { description: "Dados inválidos" },
          "401": { description: "Não autenticado" },
        },
      },
    },
    "/api/goals/{id}": {
      get: {
        tags: ["Metas"],
        summary: "Retorna uma meta",
        security: [{ bearerAuth: [] }],
        parameters: [pathParam("id")],
        responses: {
          "200": {
            description: "Meta",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Goal" } } },
          },
          "404": { description: "Meta não encontrada" },
        },
      },
      put: {
        tags: ["Metas"],
        summary: "Atualiza uma meta",
        security: [{ bearerAuth: [] }],
        parameters: [pathParam("id")],
        responses: {
          "200": { description: "Meta atualizada" },
          "403": { description: "Sem permissão" },
          "404": { description: "Meta não encontrada" },
        },
      },
      delete: {
        tags: ["Metas"],
        summary: "Remove uma meta",
        security: [{ bearerAuth: [] }],
        parameters: [pathParam("id")],
        responses: {
          "200": { description: "Meta removida" },
          "403": { description: "Sem permissão" },
          "404": { description: "Meta não encontrada" },
        },
      },
    },
    "/api/goals/{id}/milestones": {
      post: {
        tags: ["Metas"],
        summary: "Adiciona um marco à meta",
        security: [{ bearerAuth: [] }],
        parameters: [pathParam("id")],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: { title: { type: "string" } },
              },
            },
          },
        },
        responses: {
          "201": { description: "Marco adicionado" },
          "404": { description: "Meta não encontrada" },
        },
      },
    },
    "/api/goals/{id}/milestones/{milestoneId}": {
      put: {
        tags: ["Metas"],
        summary: "Atualiza um marco da meta",
        security: [{ bearerAuth: [] }],
        parameters: [pathParam("id"), pathParam("milestoneId")],
        responses: {
          "200": { description: "Marco atualizado" },
          "404": { description: "Marco não encontrado" },
        },
      },
      delete: {
        tags: ["Metas"],
        summary: "Remove um marco da meta",
        security: [{ bearerAuth: [] }],
        parameters: [pathParam("id"), pathParam("milestoneId")],
        responses: {
          "200": { description: "Marco removido" },
          "404": { description: "Marco não encontrado" },
        },
      },
    },
    "/api/journal": {
      get: {
        tags: ["Diário"],
        summary: "Lista as reflexões do usuário",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Reflexões do usuário",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/JournalEntry" } },
              },
            },
          },
          "401": { description: "Não autenticado" },
        },
      },
      post: {
        tags: ["Diário"],
        summary: "Cria uma reflexão",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["content"],
                properties: {
                  title: { type: "string", nullable: true },
                  content: { type: "string" },
                  mood: { type: "string", nullable: true },
                  visibility: { type: "string", enum: ["PRIVATE", "PUBLIC"] },
                  listId: { type: "string", nullable: true },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Reflexão registrada",
            content: { "application/json": { schema: { $ref: "#/components/schemas/JournalEntry" } } },
          },
          "400": { description: "Dados inválidos" },
          "401": { description: "Não autenticado" },
        },
      },
    },
    "/api/journal/{id}": {
      get: {
        tags: ["Diário"],
        summary: "Retorna uma reflexão",
        security: [{ bearerAuth: [] }],
        parameters: [pathParam("id")],
        responses: {
          "200": {
            description: "Reflexão",
            content: { "application/json": { schema: { $ref: "#/components/schemas/JournalEntry" } } },
          },
          "404": { description: "Reflexão não encontrada" },
        },
      },
      put: {
        tags: ["Diário"],
        summary: "Atualiza uma reflexão",
        security: [{ bearerAuth: [] }],
        parameters: [pathParam("id")],
        responses: {
          "200": { description: "Reflexão atualizada" },
          "403": { description: "Sem permissão" },
          "404": { description: "Reflexão não encontrada" },
        },
      },
      delete: {
        tags: ["Diário"],
        summary: "Remove uma reflexão",
        security: [{ bearerAuth: [] }],
        parameters: [pathParam("id")],
        responses: {
          "200": { description: "Reflexão removida" },
          "403": { description: "Sem permissão" },
          "404": { description: "Reflexão não encontrada" },
        },
      },
    },
    "/api/gamification": {
      get: {
        tags: ["Gamificação"],
        summary: "Retorna as estatísticas de gamificação do usuário (XP, nível e conquistas)",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Estatísticas de gamificação",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/GamificationStats" } },
            },
          },
          "401": { description: "Não autenticado" },
        },
      },
    },
    "/api/gamification/ranking": {
      get: {
        tags: ["Gamificação"],
        summary: "Retorna o ranking de contribuição da comunidade",
        responses: {
          "200": {
            description: "Ranking por pontuação",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/RankingEntry" } },
              },
            },
          },
        },
      },
    },
    "/api/gamification/feed": {
      get: {
        tags: ["Gamificação"],
        summary: "Retorna o feed de atividades recentes",
        responses: {
          "200": {
            description: "Feed de atividades",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/FeedItem" } },
              },
            },
          },
        },
      },
    },
    "/api/links/preview": {
      post: {
        tags: ["Metadados de link"],
        summary: "Detecta plataforma e metadados de um link (oEmbed)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["url"],
                properties: { url: { type: "string", format: "uri" } },
              },
            },
          },
        },
        responses: {
          "200": { description: "Metadados detectados" },
          "401": { description: "Não autenticado" },
        },
      },
    },
    "/api/themes": {
      get: {
        tags: ["Catálogo"],
        summary: "Lista o catálogo de temas",
        responses: {
          "200": {
            description: "Temas disponíveis",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Theme" } },
              },
            },
          },
        },
      },
    },
    "/api/tags": {
      get: {
        tags: ["Catálogo"],
        summary: "Lista as tags cadastradas",
        responses: {
          "200": { description: "Tags com contagem de listas" },
        },
      },
    },
  },
};
