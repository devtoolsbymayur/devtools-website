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

/** Fail fast when Supabase/pooler is unreachable (avoids infinite local loading). */
function databaseUrlWithTimeouts(): string | null {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (!url.searchParams.has("connect_timeout")) {
      url.searchParams.set("connect_timeout", "5");
    }
    if (!url.searchParams.has("pool_timeout")) {
      url.searchParams.set("pool_timeout", "5");
    }
    return url.toString();
  } catch {
    return raw;
  }
}

export function getPrisma(): PrismaClient | null {
  const datasourceUrl = databaseUrlWithTimeouts();
  if (!datasourceUrl) {
    return null;
  }

  // Drop stale singleton if generated client gained new models
  if (globalForPrisma.prisma && !hasRequiredDelegates(globalForPrisma.prisma)) {
    void globalForPrisma.prisma.$disconnect().catch(() => undefined);
    globalForPrisma.prisma = undefined;
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      datasources: { db: { url: datasourceUrl } },
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  return globalForPrisma.prisma;
}

/** Race a DB call so a hung pooler cannot freeze page renders. */
export async function withDbTimeout<T>(
  work: Promise<T>,
  fallback: T,
  ms = 6000
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      work,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error("DB timeout")), ms);
      }),
    ]);
  } catch {
    return fallback;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
