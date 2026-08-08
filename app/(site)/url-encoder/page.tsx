import { SimpleToolPage } from "@/components/SimpleToolPage";
import { ToolFaqLd } from "@/components/ToolFaqLd";
import { ToolSeoBlurb } from "@/components/ToolSeoBlurb";
import { UrlTool } from "@/components/tools/UrlTool";
import { buildPageMetadata } from "@/lib/seo";
import { ManagedToolPage } from "@/components/ManagedToolPage";
import { toolRouteMetadata } from "@/lib/tool-access";
import { URL_FAQ } from "@/lib/tool-faq";
import type { Metadata } from "next";

const TOOL_KEY = "url-encoder";

export async function generateMetadata(): Promise<Metadata> {
  return toolRouteMetadata(TOOL_KEY, "URL Encoder", () =>
    buildPageMetadata({
      title: "URL Encoder / Decoder Online — Percent-Encode Safely",
      description:
        "Encode and decode URL strings online. Switch encodeURI vs encodeURIComponent and inspect query parameters — all locally in your browser.",
      path: "/url-encoder",
      keywords: [
        "url encoder",
        "url decoder",
        "percent encoding",
        "encodeuricomponent",
        "query string decoder",
      ],
    })
  );
}

export default async function UrlEncoderPage() {
  return (
    <ManagedToolPage
    toolKey={TOOL_KEY}
    soonDescription={
      "URL encode / decode is on the roadmap. Check back soon."
      }
    >
      <SimpleToolPage
        title="URL Encoder / Decoder"
        subtitle="Encode text for safe use in URLs, decode percent-encoded strings, and inspect query params."
        currentPath="/url-encoder"
        below={
          <>
            <ToolSeoBlurb heading="What is URL encoding?">
              <p>
                URL encoding (percent-encoding) converts characters like spaces,
                &amp;, and ? into a safe format so URLs and query strings
                transmit correctly across browsers and servers.
              </p>
              <p>
                Choose encodeURIComponent for query values or encodeURI for
                whole URLs, then use the query breakdown table to debug
                parameters.
              </p>
            </ToolSeoBlurb>
            <ToolFaqLd heading="URL Encoder FAQ" items={URL_FAQ} />
          </>
        }
      >
        <UrlTool />
      </SimpleToolPage>
    </ManagedToolPage>
  );
}
