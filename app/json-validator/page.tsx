import { ToolPage } from "@/components/ToolPage";
import { ToolSeoBlurb } from "@/components/ToolSeoBlurb";
import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "JSON Validator Online — Check & Fix Invalid JSON Format",
  description:
    "Validate JSON online instantly. Free JSON validator finds syntax errors with line and column so you can fix invalid JSON format fast — processed locally in your browser.",
  path: "/json-validator",
  keywords: [
    "json validator",
    "validate json",
    "json format checker",
    "invalid json",
    "json syntax error",
  ],
});

export default function JsonValidatorPage() {
  return (
    <ToolPage
      mode="validator"
      title="JSON Validator Online"
      subtitle="Check whether your JSON format is valid. Get clear error messages with approximate line and column — no upload required."
    >
      <ToolSeoBlurb heading="Free JSON format checker">
        <p>
          A JSON validator helps you confirm that a string follows correct JSON
          format rules (quotes, commas, brackets, and structure). Paste JSON,
          click Validate, and jump to the problem line when something is wrong.
        </p>
      </ToolSeoBlurb>
    </ToolPage>
  );
}
