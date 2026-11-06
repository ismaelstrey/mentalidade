import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Configuração utilizada pelo Prisma CLI (migrações, introspecção e studio).
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
