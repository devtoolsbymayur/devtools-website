import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ADMIN_BASE_PATH } from "@/lib/admin-path";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect(`${ADMIN_BASE_PATH}/login`);
  }
  return session;
}

export function requirePrisma() {
  const prisma = getPrisma();
  if (!prisma) {
    throw new Error("DATABASE_URL is not configured");
  }
  return prisma;
}
