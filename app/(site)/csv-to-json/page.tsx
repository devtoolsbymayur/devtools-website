import { ComingSoon } from "@/components/ComingSoon";
import { comingSoonMetadata } from "@/lib/coming-soon";

export const metadata = comingSoonMetadata(
  "CSV to JSON",
  "Convert CSV to JSON online — coming soon."
);

export default function CsvToJsonPage() {
  return (
    <ComingSoon
      title="CSV to JSON"
      description="Convert spreadsheets and CSV files to JSON locally in your browser. Coming soon."
    />
  );
}
