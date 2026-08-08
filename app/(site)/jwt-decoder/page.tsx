import { SimpleToolPage } from "@/components/SimpleToolPage";
import { JwtTool } from "@/components/tools/JwtTool";
import { buildPageMetadata } from "@/lib/seo";
import { ManagedToolPage } from "@/components/ManagedToolPage";
import { toolRouteMetadata } from "@/lib/tool-access";
import type { Metadata } from "next";

const TOOL_KEY = "jwt-decoder";

export async function generateMetadata(): Promise<Metadata> {
  return toolRouteMetadata(TOOL_KEY, "JWT Decoder", () =>
    buildPageMetadata({
      title: "JWT Decoder Online — Inspect Header & Payload",
      description:
        "Decode JWT header and payload locally in your browser. Signature is not verified. Nothing is uploaded.",
      path: "/jwt-decoder",
      keywords: ["jwt decoder", "decode jwt", "jwt online"],
    })
  );
}

export default async function JwtDecoderPage() {
  return (
    <ManagedToolPage
    toolKey={TOOL_KEY}
    soonDescription="JWT decoder is on the roadmap. Check back soon."
    >
      <SimpleToolPage
        title="JWT Decoder"
        subtitle="Inspect JWT headers and payloads locally. This tool does not verify signatures."
        currentPath="/jwt-decoder"
      >
        <JwtTool />
      </SimpleToolPage>
    </ManagedToolPage>
  );
}
