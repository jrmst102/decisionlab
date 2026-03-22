import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function stripSslMode(url: string): string {
  const u = new URL(url);
  u.searchParams.delete("sslmode");
  return u.toString();
}

function createPrismaClient() {
  // Strip sslmode from URL — pg library maps sslmode=require to verify-full,
  // which rejects DigitalOcean's self-signed cert. We handle SSL via the ssl option instead.
  const pool = new pg.Pool({
    connectionString: stripSslMode(process.env.DATABASE_URL!),
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
  });
  const adapter = new PrismaPg(pool as unknown as ConstructorParameters<typeof PrismaPg>[0]);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
