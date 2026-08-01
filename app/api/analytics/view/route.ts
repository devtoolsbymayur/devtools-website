import { ADMIN_BASE_PATH } from "@/lib/admin-path";
import { getPrisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

const ALLOWED = new Set([
  "/",
  "/json-validator",
  "/json-minifier",
  "/json-viewer",
  "/base64-encoder",
  "/jwt-decoder",
  "/xml-formatter",
  "/csv-to-json",
  "/url-encoder",
  "/timestamp-converter",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
]);

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const limited = rateLimit(`analytics:${ip}`, 60, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ ok: true });
  }

  let path = "/";
  try {
    const body = (await request.json()) as { path?: unknown };
    if (typeof body.path === "string") {
      path = body.path.split("?")[0]?.slice(0, 200) || "/";
    }
  } catch {
    return NextResponse.json({ ok: true });
  }

  if (
    path.startsWith(ADMIN_BASE_PATH) ||
    path.startsWith("/api") ||
    !ALLOWED.has(path)
  ) {
    return NextResponse.json({ ok: true });
  }

  const prisma = getPrisma();
  if (!prisma) return NextResponse.json({ ok: true });

  const day = new Date();
  day.setUTCHours(0, 0, 0, 0);

  try {
    await prisma.pageViewDaily.upsert({
      where: {
        date_path: { date: day, path },
      },
      create: { date: day, path, views: 1 },
      update: { views: { increment: 1 } },
    });
  } catch (error) {
    console.error("analytics upsert failed", error);
  }

  return NextResponse.json({ ok: true });
}
