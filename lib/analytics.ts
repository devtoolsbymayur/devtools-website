import { createHash } from "crypto";

export function utcDayStart(d = new Date()): Date {
  const day = new Date(d);
  day.setUTCHours(0, 0, 0, 0);
  return day;
}

export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    forwarded ||
    headers.get("x-real-ip")?.trim() ||
    headers.get("cf-connecting-ip")?.trim() ||
    "unknown"
  );
}

/** Display-safe IP (last octet / trailing IPv6 hidden). */
export function maskIp(ip: string): string {
  if (!ip || ip === "unknown") return "unknown";
  if (ip.includes(":")) {
    const parts = ip.split(":").filter(Boolean);
    return `${parts.slice(0, 3).join(":")}:****`;
  }
  const parts = ip.split(".");
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.***`;
  }
  return "unknown";
}

export function hashVisitorFallback(ip: string, ua: string): string {
  const salt = process.env.NEXTAUTH_SECRET ?? "json-formatter";
  return createHash("sha256")
    .update(`${salt}|${ip}|${ua.slice(0, 80)}`)
    .digest("hex")
    .slice(0, 32);
}

export function geoFromHeaders(headers: Headers): {
  country: string;
  region: string;
  city: string;
} {
  const decode = (value: string | null) => {
    if (!value) return "";
    try {
      return decodeURIComponent(value).slice(0, 80);
    } catch {
      return value.slice(0, 80);
    }
  };

  return {
    country: (
      headers.get("x-vercel-ip-country") ||
      headers.get("cf-ipcountry") ||
      ""
    )
      .toUpperCase()
      .slice(0, 8),
    region: decode(
      headers.get("x-vercel-ip-country-region") ||
        headers.get("x-vercel-ip-region")
    ),
    city: decode(headers.get("x-vercel-ip-city")),
  };
}

export function parseUserAgent(ua: string): {
  browser: string;
  device: string;
} {
  const value = ua.slice(0, 300);
  const lower = value.toLowerCase();

  let device = "desktop";
  if (/bot|crawl|spider|slurp|facebookexternalhit/i.test(value)) {
    device = "bot";
  } else if (/ipad|tablet|kindle/i.test(value)) {
    device = "tablet";
  } else if (/mobi|iphone|android.+mobile/i.test(value)) {
    device = "mobile";
  }

  let browser = "Other";
  if (/edg\//i.test(value)) browser = "Edge";
  else if (/chrome|crios/i.test(value) && !/edg\//i.test(value))
    browser = "Chrome";
  else if (/firefox|fxios/i.test(value)) browser = "Firefox";
  else if (/safari/i.test(value) && !/chrome|crios|android/i.test(lower))
    browser = "Safari";
  else if (/opr\//i.test(value) || /opera/i.test(value)) browser = "Opera";

  return { browser, device };
}

export function normalizeVisitorKey(raw: unknown, fallback: string): string {
  if (typeof raw !== "string") return fallback;
  const cleaned = raw.trim().slice(0, 64);
  if (!/^[a-zA-Z0-9_-]{8,64}$/.test(cleaned)) return fallback;
  return cleaned;
}

export function sanitizeShort(raw: unknown, max = 64): string {
  if (typeof raw !== "string") return "";
  return raw.trim().slice(0, max);
}
