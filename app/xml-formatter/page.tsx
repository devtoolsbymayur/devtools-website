import { ComingSoon } from "@/components/ComingSoon";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "XML Formatter",
  description: "Format XML online — coming soon.",
};

export default function XmlFormatterPage() {
  return (
    <ComingSoon
      title="XML Formatter"
      description="Beautify and validate XML in your browser. This tool is on the roadmap."
    />
  );
}
