import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { getPublicTools } from "@/lib/site-config";

const ALWAYS: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/about", changeFrequency: "yearly", priority: 0.4 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.4 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

const TOOL_META: Record<
  string,
  {
    changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
    priority: number;
  }
> = {
  "/": { changeFrequency: "daily", priority: 1 },
  "/json-validator": { changeFrequency: "weekly", priority: 0.9 },
  "/json-minifier": { changeFrequency: "weekly", priority: 0.85 },
  "/json-viewer": { changeFrequency: "weekly", priority: 0.85 },
  "/xml-formatter": { changeFrequency: "weekly", priority: 0.75 },
  "/csv-to-json": { changeFrequency: "weekly", priority: 0.75 },
  "/base64-encoder": { changeFrequency: "monthly", priority: 0.6 },
  "/jwt-decoder": { changeFrequency: "monthly", priority: 0.6 },
  "/url-encoder": { changeFrequency: "monthly", priority: 0.6 },
  "/timestamp-converter": { changeFrequency: "monthly", priority: 0.6 },
};

/** Live tools from Admin + static company pages. Hidden/coming-soon excluded. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tools = await getPublicTools();
  const liveToolPaths = tools
    .filter((t) => t.status === "live" && t.href !== "/")
    .map((t) => t.href);

  const seen = new Set<string>(["/"]);
  const entries = [...ALWAYS];

  for (const path of liveToolPaths) {
    if (seen.has(path)) continue;
    seen.add(path);
    const meta = TOOL_META[path] ?? {
      changeFrequency: "monthly" as const,
      priority: 0.5,
    };
    entries.push({ path, ...meta });
  }

  return entries.map((entry) => ({
    url: absoluteUrl(entry.path),
    lastModified: new Date(),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
