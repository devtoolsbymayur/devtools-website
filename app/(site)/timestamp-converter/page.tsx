import { ComingSoon } from "@/components/ComingSoon";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timestamp Converter",
  description: "Convert Unix timestamps online — coming soon.",
};

export default function TimestampConverterPage() {
  return (
    <ComingSoon
      title="Timestamp Converter"
      description="Convert between Unix timestamps and human-readable dates. Coming soon."
    />
  );
}
