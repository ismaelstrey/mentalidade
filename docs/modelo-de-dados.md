# Modelo de dados — Mentalidade

Modelo conceitual (Prisma / PostgreSQL). Os nomes de modelos seguem PascalCase e campos em camelCase, conforme as regras do projeto.

## Diagrama resumido

```
User ──1:N── List ──1:N── ListItem
User ──N:N── List (Like / Follow)
List ──1:N── Comment
List ──1:N── Fork (origem → cópia)
User ──1:N── Habit ──1:N── HabitLog
User ──1:N── Goal ──1:N── GoalMilestone
User ──1:N── JournalEntry
User ──N:N── Badge
Tag ──N:N── List
```

## Schema conceitual

```prisma
model User {
  id           String   @id @default(cuid())
  name         String
  username     String   @unique
  email        String   @unique
  passwordHash String
  bio          String?
  avatarUrl    String?
  role         String   @default("USER") // USER | MODERATOR | ADMIN
  createdAt    DateTime @default(now())

  lists        List[]
  comments     Comment[]
  likes        Like[]
  habits       Habit[]
  goals        Goal[]
  journal      JournalEntry[]
  badges       UserBadge[]
  pointEvents  PointEvent[]
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  lists List[] @relation("ListTags")
}

model List {
  id          String   @id @default(cuid())
  ownerId     String
  title       String
  slug        String   @unique
  description String?
  theme       String?  // tema principal (catálogo de temas)
  visibility  String   @default("PUBLIC") // PRIVATE | PUBLIC | UNLISTED
  likeCount   Int      @default(0)
  importCount Int      @default(0)
  viewCount   Int      @default(0)
  createdAt   DateTime @default(now())

  owner       User          @relation(fields: [ownerId], references: [id])
  items       ListItem[]
  comments    Comment[]
  forks       Fork[]        @relation("SourceList")
  tags        Tag[]         @relation("ListTags")
  habits      Habit[]
  journal     JournalEntry[]
}

model ListItem {
  id       String @id @default(cuid())
  listId   String
  order    Int
  url      String
  title    String
  platform String // YOUTUBE | FACEBOOK | INSTAGRAM | TIKTOK | OUTRO
  note     String?

  list     List   @relation(fields: [listId], references: [id], onDelete: Cascade)
}

model Fork {
  id             String   @id @default(cuid())
  sourceListId   String
  newListId      String
  userId         String
  createdAt      DateTime @default(now())

  sourceList     List     @relation("SourceList", fields: [sourceListId], references: [id])
}

model Like {
  id         String   @id @default(cuid())
  userId     String
  targetType String   // LIST | COMMENT
  targetId   String
  createdAt  DateTime @default(now())

  @@unique([userId, targetType, targetId])
}

model Comment {
  id        String   @id @default(cuid())
  userId    String
  listId    String
  content   String
  createdAt DateTime @default(now())

  user      User @relation(fields: [userId], references: [id])
  list      List @relation(fields: [listId], references: [id], onDelete: Cascade)
}

model Follow {
  id          String @id @default(cuid())
  followerId  String
  followingId String

  @@unique([followerId, followingId])
}

model Habit {
  id           String   @id @default(cuid())
  userId       String
  name         String
  listId       String?
  frequency    String   @default("DAILY") // DAILY | WEEKLY
  reminderTime String?
  createdAt    DateTime @default(now())

  user         User       @relation(fields: [userId], references: [id])
  list         List?      @relation(fields: [listId], references: [id])
  logs         HabitLog[]
}

model HabitLog {
  id      String   @id @default(cuid())
  habitId String
  date    DateTime
  status  String   @default("DONE") // DONE | SKIPPED
  habit   Habit    @relation(fields: [habitId], references: [id], onDelete: Cascade)

  @@unique([habitId, date])
}

model Goal {
  id          String   @id @default(cuid())
  userId      String
  title       String
  description String?
  targetDate  DateTime?
  status      String   @default("ACTIVE") // ACTIVE | DONE | ARCHIVED
  progress    Int      @default(0) // 0..100
  user        User     @relation(fields: [userId], references: [id])
  milestones  GoalMilestone[]
}

model GoalMilestone {
  id     String  @id @default(cuid())
  goalId String
  title  String
  done   Boolean @default(false)
  order  Int
  goal   Goal    @relation(fields: [goalId], references: [id], onDelete: Cascade)
}

model JournalEntry {
  id        String   @id @default(cuid())
  userId    String
  listId    String?
  title     String?
  content   String
  mood      String?  // 1..5 ou enum
  visibility String  @default("PRIVATE") // PRIVATE | PUBLIC
  createdAt DateTime @default(now())

  user      User @relation(fields: [userId], references: [id])
  list      List? @relation(fields: [listId], references: [id])
}

model Badge {
  id          String @id @default(cuid())
  code        String @unique
  name        String
  description String
  icon        String?
}

model UserBadge {
  id       String   @id @default(cuid())
  userId   String
  badgeId  String
  earnedAt DateTime @default(now())

  user     User  @relation(fields: [userId], references: [id])
  badge    Badge @relation(fields: [badgeId], references: [id])

  @@unique([userId, badgeId])
}

model PointEvent {
  id        String   @id @default(cuid())
  userId    String
  type      String   // CREATE_LIST | IMPORT_LIST | HABIT_CHECKIN | GOAL_DONE ...
  points    Int
  refId     String?
  createdAt DateTime @default(now())

  user      User @relation(fields: [userId], references: [id])
}
```

## Temas iniciais sugeridos

`mentalidade-forte`, `controle-emocional`, `boas-escolhas`, `disciplina`, `foco`,
`produtividade`, `financas`, `saude`, `relacionamentos`, `espiritualidade`.
