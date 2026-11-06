import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { env } from "../utils/env";

// Adaptador de conexão com o PostgreSQL.
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

// Instância única do Prisma Client reutilizada em toda a aplicação.
export const prisma = new PrismaClient({ adapter });
