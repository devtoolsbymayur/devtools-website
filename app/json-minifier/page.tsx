import { ToolPage } from "@/components/ToolPage";
import { ToolSeoBlurb } from "@/components/ToolSeoBlurb";
import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "JSON Minify Online — Compress JSON Format Fast",
  description:
    "Minify JSON online to remove whitespace and shrink payloads. Free JSON minifier keeps the same data while making JSON format smaller for APIs and storage.",
  path: "/json-minifier",
  keywords: [
    "json minify",
    "minify json",
    "json compressor",
    "compress json",
    "json format minify",
  ],
});

export default function JsonMinifierPage() {
  return (
    <ToolPage
      mode="minifier"
      title="JSON Minify Online"
      subtitle="Remove unnecessary whitespace from JSON to reduce size for APIs, storage, and transfer — fully local in your browser."
    >
      <ToolSeoBlurb heading="When to minify JSON format">
        <p>
          Minified JSON is harder to read but smaller over the network. Use this
          tool after editing, then switch back to the{" "}
          <strong className="font-medium text-text">JSON formatter</strong> when
          you need pretty-printed output again.
        </p>
      </ToolSeoBlurb>
    </ToolPage>
  );
}
