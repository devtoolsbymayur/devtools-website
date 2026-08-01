import { ToolPage } from "@/components/ToolPage";
import { ToolSeoBlurb } from "@/components/ToolSeoBlurb";
import { buildPageMetadata } from "@/lib/seo";
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
    >
      <ToolSeoBlurb heading="Inspect JSON structure visually">
        <p>
          Tree view is ideal when formatted text is still hard to scan. Expand
          nodes, search for keys, and understand complex JSON format without
          sending data to a server.
        </p>
      </ToolSeoBlurb>
    </ToolPage>
  );
}
