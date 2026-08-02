import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/** Live, indexable routes only — no redirects or thin “coming soon” pages. */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
    priority: number;
  }[] = [
    { path: "/", changeFrequency: "daily", priority: 1 },
    { path: "/json-validator", changeFrequency: "weekly", priority: 0.9 },
    { path: "/json-minifier", changeFrequency: "weekly", priority: 0.85 },
    { path: "/json-viewer", changeFrequency: "weekly", priority: 0.85 },
    { path: "/base64-encoder", changeFrequency: "monthly", priority: 0.6 },
    { path: "/jwt-decoder", changeFrequency: "monthly", priority: 0.6 },
    { path: "/about", changeFrequency: "yearly", priority: 0.4 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.4 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  ];

  return entries.map((entry) => ({
    url: absoluteUrl(entry.path),
    lastModified: new Date(),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
