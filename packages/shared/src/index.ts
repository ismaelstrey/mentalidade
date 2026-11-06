// Tipos compartilhados entre a API e o frontend.

/** Perfis de acesso do usuário. */
export type UserRole = "USER" | "MODERATOR" | "ADMIN";

/** Visibilidade de listas. */
export type Visibility = "PRIVATE" | "PUBLIC" | "UNLISTED";

/** Plataformas de vídeo suportadas. */
export type Platform = "YOUTUBE" | "FACEBOOK" | "INSTAGRAM" | "TIKTOK" | "OUTRO";

/** Formato padrão de resposta de sucesso da API. */
export interface ApiResponse<T> {
  data: T;
  message: string;
}

/** Formato padrão de resposta de erro da API. */
export interface ApiErrorResponse {
  error: true;
  message: string;
  statusCode: number;
}

/** Parâmetros de paginação. */
export interface PaginationParams {
  page: number;
  perPage: number;
}

/** Resultado paginado genérico. */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
}

/** Dados públicos de um usuário, exibidos no perfil. */
export interface PublicUser {
  id: string;
  name: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
}

/** Dados do usuário autenticado (inclui informações privadas). */
export interface AuthUser extends PublicUser {
  email: string;
}

/** Estatísticas exibidas no perfil público. */
export interface ProfileStats {
  followers: number;
  following: number;
  lists: number;
}

/** Perfil público completo de um usuário. */
export interface PublicProfile {
  user: PublicUser;
  stats: ProfileStats;
}

/** Retorno dos endpoints de cadastro e login. */
export interface AuthResponse {
  token: string;
  user: AuthUser;
}

/** Dados enviados no cadastro de um usuário. */
export interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  password: string;
}

/** Dados enviados no login. */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Dados enviados na atualização de perfil. */
export interface UpdateProfileRequest {
  name?: string;
  bio?: string | null;
  avatarUrl?: string | null;
}

/* ===================== Fase 2: listas, itens, temas e tags ===================== */

/** Item de uma lista (link + metadados). */
export interface ListItemDto {
  id: string;
  order: number;
  url: string;
  title: string;
  platform: Platform;
  note: string | null;
}

/** Lista resumida, sem os itens. */
export interface ListSummary {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  theme: string | null;
  visibility: Visibility;
  likeCount: number;
  importCount: number;
  viewCount: number;
  itemCount: number;
  tags: string[];
  createdAt: string;
}

/** Lista detalhada, com dono e itens. */
export interface ListDetail extends ListSummary {
  owner: PublicUser;
  items: ListItemDto[];
  liked: boolean;
}

/** Item informado ao criar uma lista ou adicionar um item. */
export interface ListItemInput {
  url: string;
  title: string;
  platform: Platform;
  note?: string | null;
}

/** Dados enviados na criação de uma lista. */
export interface CreateListRequest {
  title: string;
  description?: string | null;
  theme?: string | null;
  visibility?: Visibility;
  tags?: string[];
  items?: ListItemInput[];
}

/** Dados enviados na edição de uma lista. */
export interface UpdateListRequest {
  title?: string;
  description?: string | null;
  theme?: string | null;
  visibility?: Visibility;
  tags?: string[];
}

/** Dados enviados ao adicionar ou editar um item. */
export interface ListItemRequest {
  url: string;
  title: string;
  platform: Platform;
  note?: string | null;
}

/** Identificadores na ordem desejada para reordenar os itens. */
export interface ReorderItemsRequest {
  itemIds: string[];
}

/** Metadados detectados a partir de um link. */
export interface LinkPreview {
  url: string;
  platform: Platform;
  title: string | null;
  authorName: string | null;
  thumbnailUrl: string | null;
}

/** Tema do catálogo fixo da plataforma. */
export interface Theme {
  slug: string;
  label: string;
  description: string;
}

/* ===================== Fase 3: coletivo ===================== */

/** Ordenação da descoberta de listas públicas. */
export type ListSort = "recent" | "popular" | "likes" | "views";

/** Lista pública resumida com o autor, usada na descoberta e em perfis. */
export interface ListCard extends ListSummary {
  owner: PublicUser;
}

/** Filtros de busca das listas públicas. */
export interface DiscoverQuery {
  q?: string;
  theme?: string;
  tag?: string;
  platform?: Platform;
  sort?: ListSort;
  page?: number;
  perPage?: number;
}

/** Comentário de uma lista. */
export interface CommentDto {
  id: string;
  content: string;
  createdAt: string;
  author: PublicUser;
}

/** Dados enviados ao comentar uma lista. */
export interface CommentRequest {
  content: string;
}

/** Estado de curtida de uma lista para o usuário atual. */
export interface LikeState {
  liked: boolean;
  likeCount: number;
}

/* ===================== Fase 4: hábitos e metas ===================== */

/** Frequência de acompanhamento de um hábito. */
export type HabitFrequency = "DAILY" | "WEEKLY";

/** Status de um registro (check-in) de hábito. */
export type HabitLogStatus = "DONE" | "SKIPPED";

/** Registro de um hábito em um dia (data no formato AAAA-MM-DD). */
export interface HabitLogDto {
  date: string;
  status: HabitLogStatus;
}

/** Hábito com estatísticas de acompanhamento. */
export interface HabitDto {
  id: string;
  name: string;
  frequency: HabitFrequency;
  reminderTime: string | null;
  listId: string | null;
  listTitle: string | null;
  createdAt: string;
  streak: number;
  doneInPeriod: number;
  todayStatus: HabitLogStatus | null;
  logs: HabitLogDto[];
}

/** Dados enviados ao criar um hábito. */
export interface CreateHabitRequest {
  name: string;
  frequency?: HabitFrequency;
  reminderTime?: string | null;
  listId?: string | null;
}

/** Dados enviados ao editar um hábito. */
export interface UpdateHabitRequest {
  name?: string;
  frequency?: HabitFrequency;
  reminderTime?: string | null;
  listId?: string | null;
}

/** Dados enviados no check-in de um hábito. */
export interface HabitCheckinRequest {
  date?: string;
  status?: HabitLogStatus;
}

/** Situação de uma meta. */
export type GoalStatus = "ACTIVE" | "DONE" | "ARCHIVED";

/** Marco de uma meta. */
export interface GoalMilestoneDto {
  id: string;
  title: string;
  done: boolean;
  order: number;
}

/** Meta com progresso e marcos. */
export interface GoalDto {
  id: string;
  title: string;
  description: string | null;
  targetDate: string | null;
  status: GoalStatus;
  progress: number;
  milestones: GoalMilestoneDto[];
}

/** Dados enviados ao criar uma meta. */
export interface CreateGoalRequest {
  title: string;
  description?: string | null;
  targetDate?: string | null;
  milestones?: string[];
}

/** Dados enviados ao editar uma meta. */
export interface UpdateGoalRequest {
  title?: string;
  description?: string | null;
  targetDate?: string | null;
  status?: GoalStatus;
  progress?: number;
}

/** Dados enviados ao criar um marco de meta. */
export interface CreateMilestoneRequest {
  title: string;
}

/** Dados enviados ao editar um marco de meta. */
export interface UpdateMilestoneRequest {
  title?: string;
  done?: boolean;
}

/* ===================== Fase 5: diário ===================== */

/** Visibilidade de uma entrada do diário. */
export type JournalVisibility = "PRIVATE" | "PUBLIC";

/** Entrada de reflexão do diário. */
export interface JournalEntryDto {
  id: string;
  title: string | null;
  content: string;
  mood: string | null;
  visibility: JournalVisibility;
  listId: string | null;
  listTitle: string | null;
  createdAt: string;
}

/** Entrada pública do diário com o autor, usada nos perfis. */
export interface JournalFeedItem extends JournalEntryDto {
  author: PublicUser;
}

/** Dados enviados ao criar uma entrada do diário. */
export interface CreateJournalEntryRequest {
  title?: string | null;
  content: string;
  mood?: string | null;
  visibility?: JournalVisibility;
  listId?: string | null;
}

/** Dados enviados ao editar uma entrada do diário. */
export interface UpdateJournalEntryRequest {
  title?: string | null;
  content?: string;
  mood?: string | null;
  visibility?: JournalVisibility;
  listId?: string | null;
}

/* ===================== Fase 6: gamificação e feed ===================== */

/** Tipos de ação que geram pontos. */
export type PointEventType =
  | "CREATE_LIST"
  | "IMPORT_LIST"
  | "HABIT_CHECKIN"
  | "GOAL_DONE"
  | "JOURNAL_ENTRY";

/** Conquista (badge) com o progresso atual do usuário. */
export interface BadgeDto {
  code: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  current: number;
  target: number;
  progress: number;
}

/** Estatísticas de gamificação do usuário. */
export interface GamificationStats {
  xp: number;
  level: number;
  levelName: string;
  xpIntoLevel: number;
  xpForNextLevel: number;
  badges: BadgeDto[];
}

/** Posição de um usuário no ranking de contribuição. */
export interface RankingEntry {
  user: PublicUser;
  xp: number;
  level: number;
  levelName: string;
}

/** Item do feed de atividades. */
export interface FeedItem {
  id: string;
  type: PointEventType;
  points: number;
  createdAt: string;
  actor: PublicUser;
}

/** Estado de seguimento entre o usuário atual e outro perfil. */
export interface FollowState {
  following: boolean;
  followers: number;
}
