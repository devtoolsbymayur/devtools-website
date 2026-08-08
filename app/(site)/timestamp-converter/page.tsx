import { SimpleToolPage } from "@/components/SimpleToolPage";
import { ToolFaqLd } from "@/components/ToolFaqLd";
import { ToolSeoBlurb } from "@/components/ToolSeoBlurb";
import { TimestampTool } from "@/components/tools/TimestampTool";
import { buildPageMetadata } from "@/lib/seo";
import { ManagedToolPage } from "@/components/ManagedToolPage";
import { toolRouteMetadata } from "@/lib/tool-access";
import { TIMESTAMP_FAQ } from "@/lib/tool-faq";
import type { Metadata } from "next";

const TOOL_KEY = "timestamp-converter";

export async function generateMetadata(): Promise<Metadata> {
  return toolRouteMetadata(TOOL_KEY, "Timestamp Converter", () =>
    buildPageMetadata({
      title: "Unix Timestamp Converter Online — Epoch to Date",
      description:
        "Convert Unix timestamps to human-readable dates and back. Auto-detect seconds/ms, UTC/local/IST zones, and live current time — in your browser.",
      path: "/timestamp-converter",
      keywords: [
        "unix timestamp converter",
        "epoch converter",
        "timestamp to date",
        "unix time",
        "epoch to datetime",
      ],
    })
  );
}

export default async function TimestampConverterPage() {
  return (
    <ManagedToolPage
    toolKey={TOOL_KEY}
    soonDescription={
      "Unix timestamp conversion is on the roadmap. Check back soon."
      }
    >
      <SimpleToolPage
        title="Timestamp Converter"
        subtitle="Convert between Unix timestamps and human-readable dates in UTC, local time, or IST."
        currentPath="/timestamp-converter"
        below={
          <>
            <ToolSeoBlurb heading="What is a Unix timestamp?">
              <p>
                A Unix timestamp counts the seconds (or milliseconds) elapsed
                since January 1, 1970 UTC — a compact, timezone-independent way
                computers store and exchange date/time values.
              </p>
              <p>
                This converter auto-detects seconds vs milliseconds, shows ISO /
                UTC / relative formats, and includes a live “now” clock for
                quick checks.
              </p>
            </ToolSeoBlurb>
            <ToolFaqLd
              heading="Timestamp Converter FAQ"
              items={TIMESTAMP_FAQ}
            />
          </>
        }
      >
        <TimestampTool />
      </SimpleToolPage>
    </ManagedToolPage>
  );
}
