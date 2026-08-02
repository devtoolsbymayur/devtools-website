import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { cache } from "react";
import { ADMIN_BASE_PATH } from "@/lib/admin-path";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

/** Deduped per request — panel layout + pages share one session lookup. */
export const requireAdmin = cache(async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect(`${ADMIN_BASE_PATH}/login`);
  }
  return session;
});

export function requirePrisma() {
  const prisma = getPrisma();
  if (!prisma) {
    throw new Error("DATABASE_URL is not configured");
  }
  return prisma;
}
