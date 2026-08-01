import { SimpleToolPage } from "@/components/SimpleToolPage";
import { Base64Tool } from "@/components/tools/Base64Tool";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 Encoder / Decoder",
  description:
    "Encode and decode Base64 strings online in your browser. Nothing is uploaded.",
  alternates: { canonical: "/base64-encoder" },
};

export default function Base64EncoderPage() {
  return (
    <SimpleToolPage
      title="Base64 Encoder / Decoder"
      subtitle="Encode text to Base64 or decode Base64 back to text — entirely in your browser."
    >
      <Base64Tool />
    </SimpleToolPage>
  );
}
