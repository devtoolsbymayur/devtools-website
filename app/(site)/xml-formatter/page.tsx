import { SimpleToolPage } from "@/components/SimpleToolPage";
import { ToolFaqLd } from "@/components/ToolFaqLd";
import { ToolSeoBlurb } from "@/components/ToolSeoBlurb";
import { XmlTool } from "@/components/tools/XmlTool";
import { buildPageMetadata } from "@/lib/seo";
import { ManagedToolPage } from "@/components/ManagedToolPage";
import { toolRouteMetadata } from "@/lib/tool-access";
import { XML_FAQ } from "@/lib/tool-faq";
import type { Metadata } from "next";

const TOOL_KEY = "xml-formatter";

export async function generateMetadata(): Promise<Metadata> {
  return toolRouteMetadata(TOOL_KEY, "XML Formatter", () =>
    buildPageMetadata({
      title: "XML Formatter Online — Beautify, Validate & Convert XML",
      description:
        "Free online XML formatter and validator. Beautify, minify, and convert XML ↔ JSON locally in your browser — no upload required for processing.",
      path: "/xml-formatter",
      keywords: [
        "xml formatter",
        "xml beautifier",
        "xml validator",
        "format xml online",
        "xml to json",
        "json to xml",
      ],
    })
  );
}

export default async function XmlFormatterPage() {
  return (
    <ManagedToolPage
    toolKey={TOOL_KEY}
    soonDescription={
      "XML format, validate, and XML ↔ JSON conversion is on the roadmap. Check back soon."
      }
    >
      <SimpleToolPage
        title="XML Formatter Online"
        subtitle="Format, validate, minify, and convert XML ↔ JSON — processed locally in your browser."
        currentPath="/xml-formatter"
        below={
          <>
            <ToolSeoBlurb heading="What is an XML Formatter?">
              <p>
                An XML formatter takes compact or minified XML and rewrites it
                with proper indentation and line breaks, making nested tags and
                attributes easy to read and debug — all without leaving your
                browser.
              </p>
              <p>
                Use Validate for parse errors, Minify for compact payloads, and
                XML ↔ JSON when you need to bridge APIs that mix both formats.
              </p>
            </ToolSeoBlurb>
            <ToolFaqLd heading="XML Formatter FAQ" items={XML_FAQ} />
          </>
        }
      >
        <XmlTool />
      </SimpleToolPage>
    </ManagedToolPage>
  );
}
