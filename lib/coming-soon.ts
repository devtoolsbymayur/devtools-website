import type { Metadata } from "next";

/** Thin roadmap pages — keep out of Google/AdSense index. */
export function comingSoonMetadata(
  title: string,
  description: string
): Metadata {
  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
  };
}
