import { ComingSoon } from "@/components/ComingSoon";
import { comingSoonMetadata } from "@/lib/coming-soon";

export const metadata = comingSoonMetadata(
  "Timestamp Converter",
  "Convert Unix timestamps online — coming soon."
);

export default function TimestampConverterPage() {
  return (
    <ComingSoon
      title="Timestamp Converter"
      description="Convert between Unix timestamps and human-readable dates. Coming soon."
    />
  );
}
