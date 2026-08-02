import { ComingSoon } from "@/components/ComingSoon";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Encoder",
  description: "Encode and decode URLs online — coming soon.",
};

export default function UrlEncoderPage() {
  return (
    <ComingSoon
      title="URL Encoder / Decoder"
      description="Encode and decode URL components in your browser. Coming soon."
    />
  );
}
