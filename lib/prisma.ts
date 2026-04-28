import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined;
}

function buildClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

// Lazy singleton — only instantiated when first accessed
export function getPrisma(): PrismaClient {
  if (!global._prisma) global._prisma = buildClient();
  return global._prisma;
}

// Proxy so callers can use `prisma.lead.findMany()` directly
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string) {
    return (getPrisma() as unknown as Record<string, unknown>)[prop];
  },
});
