import { SimpleToolPage } from "@/components/SimpleToolPage";
import { ToolFaqLd } from "@/components/ToolFaqLd";
import { ToolSeoBlurb } from "@/components/ToolSeoBlurb";
import { CsvTool } from "@/components/tools/CsvTool";
import { buildPageMetadata } from "@/lib/seo";
import { ManagedToolPage } from "@/components/ManagedToolPage";
import { toolRouteMetadata } from "@/lib/tool-access";
import { CSV_FAQ } from "@/lib/tool-faq";
import type { Metadata } from "next";

const TOOL_KEY = "csv-to-json";

export async function generateMetadata(): Promise<Metadata> {
  return toolRouteMetadata(TOOL_KEY, "CSV to JSON", () =>
    buildPageMetadata({
      title: "CSV to JSON Converter Online — Free CSV ↔ JSON Tool",
      description:
        "Convert CSV to JSON online instantly. Bidirectional CSV ↔ JSON with headers, delimiter detection, and type coercion — processed locally in your browser.",
      path: "/csv-to-json",
      keywords: [
        "csv to json",
        "json to csv",
        "csv converter",
        "convert csv to json online",
        "csv json converter",
      ],
    })
  );
}

export default async function CsvToJsonPage() {
  return (
    <ManagedToolPage
    toolKey={TOOL_KEY}
    soonDescription={
      "CSV ↔ JSON conversion is on the roadmap. Check back soon."
      }
    >
      <SimpleToolPage
        title="CSV to JSON Converter"
        subtitle="Convert CSV or spreadsheet exports into clean JSON — and JSON arrays back to CSV."
        currentPath="/csv-to-json"
        below={
          <>
            <ToolSeoBlurb heading="What is CSV to JSON conversion?">
              <p>
                CSV to JSON conversion turns spreadsheet-style rows and columns
                into structured JSON objects — useful for feeding spreadsheet
                exports into APIs, scripts, or JavaScript applications.
              </p>
              <p>
                This tool also supports JSON → CSV, auto delimiter detection
                (comma, tab, semicolon), optional type coercion, and local .csv
                file upload.
              </p>
            </ToolSeoBlurb>
            <ToolFaqLd heading="CSV to JSON FAQ" items={CSV_FAQ} />
          </>
        }
      >
        <CsvTool />
      </SimpleToolPage>
    </ManagedToolPage>
  );
}
