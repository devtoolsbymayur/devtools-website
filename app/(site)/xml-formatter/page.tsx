import { ComingSoon } from "@/components/ComingSoon";
import { comingSoonMetadata } from "@/lib/coming-soon";

export const metadata = comingSoonMetadata(
  "XML Formatter",
  "Format XML online — coming soon."
);

export default function XmlFormatterPage() {
  return (
    <ComingSoon
      title="XML Formatter"
      description="Beautify and validate XML in your browser. This tool is on the roadmap."
    />
  );
}
