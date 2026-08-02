import {
  clientIp,
  geoFromHeaders,
  hashVisitorFallback,
  maskIp,
  normalizeVisitorKey,
  parseUserAgent,
  sanitizeShort,
  utcDayStart,
} from "@/lib/analytics";
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

type Body = {
  path?: unknown;
  visitorId?: unknown;
  language?: unknown;
  timezone?: unknown;
};

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limited = rateLimit(`analytics:${ip}`, 60, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ ok: true });
  }

  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: true });
  }

  let path = "/";
  if (typeof body.path === "string") {
    path = body.path.split("?")[0]?.slice(0, 200) || "/";
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

  const ua = (request.headers.get("user-agent") ?? "").slice(0, 240);
  const { browser, device } = parseUserAgent(ua);
  const geo = geoFromHeaders(request.headers);
  const visitorKey = normalizeVisitorKey(
    body.visitorId,
    hashVisitorFallback(ip, ua)
  );
  const language = sanitizeShort(body.language, 32);
  const timezone = sanitizeShort(body.timezone, 64);
  const day = utcDayStart();
  const now = new Date();

  try {
    await Promise.all([
      prisma.pageViewDaily.upsert({
        where: { date_path: { date: day, path } },
        create: { date: day, path, views: 1 },
        update: { views: { increment: 1 } },
      }),
      prisma.siteVisitor.upsert({
        where: {
          date_visitorKey: { date: day, visitorKey },
        },
        create: {
          date: day,
          visitorKey,
          ipMasked: maskIp(ip),
          country: geo.country,
          region: geo.region,
          city: geo.city,
          path,
          userAgent: ua,
          browser,
          device,
          language,
          timezone,
          hits: 1,
          firstSeenAt: now,
          lastSeenAt: now,
        },
        update: {
          hits: { increment: 1 },
          lastSeenAt: now,
          path,
          ipMasked: maskIp(ip),
          country: geo.country || undefined,
          region: geo.region || undefined,
          city: geo.city || undefined,
          language: language || undefined,
          timezone: timezone || undefined,
          browser: browser || undefined,
          device: device || undefined,
          userAgent: ua || undefined,
        },
      }),
    ]);
  } catch (error) {
    console.error("analytics upsert failed", error);
  }

  return NextResponse.json({ ok: true });
}
