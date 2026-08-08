import type { Metadata } from "next";
import { comingSoonMetadata } from "@/lib/coming-soon";
import { getPublicTools, type PublicTool } from "@/lib/site-config";

export type ToolAccess =
  | { kind: "live"; tool: PublicTool }
  | { kind: "soon"; tool: PublicTool }
  | { kind: "hidden" };

export async function resolveToolAccess(toolKey: string): Promise<ToolAccess> {
  const tools = await getPublicTools();
  const tool = tools.find((t) => t.toolKey === toolKey);

  // No DB row / fallback miss — allow the coded page (local without seed).
  if (!tool) {
    return {
      kind: "live",
      tool: {
        toolKey,
        label: toolKey,
        href: `/${toolKey}`,
        status: "live",
        displayOrder: 0,
      },
    };
  }

  if (tool.status === "hidden") return { kind: "hidden" };
  if (tool.status === "coming-soon") return { kind: "soon", tool };
  return { kind: "live", tool };
}

/** Metadata: live SEO when live; noindex when coming-soon/hidden. */
export async function toolRouteMetadata(
  toolKey: string,
  liveTitle: string,
  live: () => Metadata | Promise<Metadata>
): Promise<Metadata> {
  const access = await resolveToolAccess(toolKey);
  if (access.kind !== "live") {
    return comingSoonMetadata(
      liveTitle,
      "This tool is currently unavailable."
    );
  }
  return live();
}
