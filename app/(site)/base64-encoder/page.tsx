import { SimpleToolPage } from "@/components/SimpleToolPage";
import { Base64Tool } from "@/components/tools/Base64Tool";
import { buildPageMetadata } from "@/lib/seo";
import { ManagedToolPage } from "@/components/ManagedToolPage";
import { toolRouteMetadata } from "@/lib/tool-access";
import type { Metadata } from "next";

const TOOL_KEY = "base64-encoder";

export async function generateMetadata(): Promise<Metadata> {
  return toolRouteMetadata(TOOL_KEY, "Base64 Encoder", () =>
    buildPageMetadata({
      title: "Base64 Encoder / Decoder Online — Free & Private",
      description:
        "Encode and decode Base64 strings online in your browser. Nothing is uploaded to a server.",
      path: "/base64-encoder",
      keywords: ["base64 encoder", "base64 decoder", "base64 online"],
    })
  );
}

export default async function Base64EncoderPage() {
  return (
    <ManagedToolPage
    toolKey={TOOL_KEY}
    soonDescription="Base64 encode / decode is on the roadmap. Check back soon."
    >
      <SimpleToolPage
        title="Base64 Encoder / Decoder"
        subtitle="Encode text to Base64 or decode Base64 back to text — entirely in your browser."
        currentPath="/base64-encoder"
      >
        <Base64Tool />
      </SimpleToolPage>
    </ManagedToolPage>
  );
}
