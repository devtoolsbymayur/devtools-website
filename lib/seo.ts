import type { Metadata } from "next";
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

export function absoluteUrl(path = "/"): string {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://jsonformatter.local"
  ).replace(/\/$/, "");
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
