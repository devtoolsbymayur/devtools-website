import { ComingSoon } from "@/components/ComingSoon";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSV to JSON",
  description: "Convert CSV to JSON online — coming soon.",
};

export default function CsvToJsonPage() {
  return (
    <ComingSoon
      title="CSV to JSON"
      description="Convert spreadsheets and CSV files to JSON locally in your browser. Coming soon."
    />
  );
}
