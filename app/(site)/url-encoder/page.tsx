import { ComingSoon } from "@/components/ComingSoon";
import { comingSoonMetadata } from "@/lib/coming-soon";

export const metadata = comingSoonMetadata(
  "URL Encoder",
  "Encode and decode URLs online — coming soon."
);

export default function UrlEncoderPage() {
  return (
    <ComingSoon
      title="URL Encoder / Decoder"
      description="Encode and decode URL components in your browser. Coming soon."
    />
  );
}
