import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function hasRequiredDelegates(client: PrismaClient): boolean {
  const c = client as unknown as {
    adminUser?: { findUnique?: unknown };
    pageViewDaily?: { aggregate?: unknown };
  };
  return (
    typeof c.adminUser?.findUnique === "function" &&
    typeof c.pageViewDaily?.aggregate === "function"
  );
}

export function getPrisma(): PrismaClient | null {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  // Drop stale singleton if generated client gained new models
  if (globalForPrisma.prisma && !hasRequiredDelegates(globalForPrisma.prisma)) {
    void globalForPrisma.prisma.$disconnect().catch(() => undefined);
    globalForPrisma.prisma = undefined;
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }

  return globalForPrisma.prisma;
}
