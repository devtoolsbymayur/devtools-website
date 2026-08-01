import type { Metadata } from "next";
import { headers } from "next/headers";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from "@/lib/constants";

export const PRIMARY_KEYWORDS = [
  "json format",
  "json formatter",
  "format json",
  "json beautifier",
  "json validator",
  "json minify",
  "online json formatter",
] as const;

function isLocalHost(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host.endsWith(".local")
    );
  } catch {
    return true;
  }
}

/** Sync base URL from env (sitemap/robots/metadata). */
export function siteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://jsonformatter.local"
  ).replace(/\/$/, "");
}

/**
 * Public site URL for page content.
 * Prefer the request host (so custom domains win over stale *.vercel.app env),
 * then NEXT_PUBLIC_SITE_URL, then Vercel fallbacks.
 */
export async function resolvePublicSiteUrl(): Promise<string> {
  try {
    const h = await headers();
    const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "")
      .split(",")[0]
      ?.trim();
    if (
      host &&
      !host.includes("localhost") &&
      !host.startsWith("127.") &&
      !host.endsWith(".vercel.app")
    ) {
      const proto = h.get("x-forwarded-proto") ?? "https";
      return `${proto}://${host}`.replace(/\/$/, "");
    }
  } catch {
    // headers() unavailable outside a request (e.g. some build steps)
  }

  const configured = siteBaseUrl();
  if (configured && !isLocalHost(configured) && !configured.includes(".vercel.app")) {
    return configured;
  }

  try {
    const h = await headers();
    const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "")
      .split(",")[0]
      ?.trim();
    if (host && !host.includes("localhost") && !host.startsWith("127.")) {
      const proto = h.get("x-forwarded-proto") ?? "https";
      return `${proto}://${host}`.replace(/\/$/, "");
    }
  } catch {
    // ignore
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(
      /\/$/,
      ""
    );
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "");
  }

  return configured;
}

export function absoluteUrl(path = "/"): string {
  const base = siteBaseUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function absolutePublicUrl(path = "/"): Promise<string> {
  const base = await resolvePublicSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [...PRIMARY_KEYWORDS],
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    keywords: keywords.join(", "),
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: SITE_NAME,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export const HOME_SEO = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
} as const;
