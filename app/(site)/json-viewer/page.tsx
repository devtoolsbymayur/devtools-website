import { ToolFaqLd } from "@/components/ToolFaqLd";
import { ToolPage } from "@/components/ToolPage";
import { ToolSeoBlurb } from "@/components/ToolSeoBlurb";
import { buildPageMetadata } from "@/lib/seo";
import { VIEWER_FAQ } from "@/lib/tool-faq";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "JSON Viewer Online — Explore JSON Format as a Tree",
  description:
    "Free JSON viewer with collapsible tree, search, and expand/collapse. Explore nested JSON format locally in your browser without uploading data.",
  path: "/json-viewer",
  keywords: [
    "json viewer",
    "json tree viewer",
    "view json online",
    "json explorer",
    "json format viewer",
  ],
});

export default function JsonViewerPage() {
  return (
    <ToolPage
      mode="viewer"
      title="JSON Viewer Online"
      subtitle="Browse nested objects and arrays in a collapsible tree. Search keys and values while keeping JSON format processing local."
      currentPath="/json-viewer"
    >
      <ToolSeoBlurb heading="Inspect JSON structure visually">
        <p>
          Tree view is ideal when formatted text is still hard to scan. Expand
          nodes, search for keys, and understand complex JSON format without
          sending data to a server.
        </p>
        <p>
          Paste large API responses or config files, then expand only the
          branches you care about. Virtualized rendering keeps big trees
          responsive.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Collapsible objects and arrays</li>
          <li>Search across keys and values</li>
          <li>Expand all / collapse all controls</li>
        </ul>
      </ToolSeoBlurb>
      <ToolFaqLd heading="JSON Viewer FAQ" items={VIEWER_FAQ} />
    </ToolPage>
  );
}