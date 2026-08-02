import { SimpleToolPage } from "@/components/SimpleToolPage";
import { JwtTool } from "@/components/tools/JwtTool";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Decoder",
  description:
    "Decode JWT header and payload locally in your browser. Signature is not verified.",
  alternates: { canonical: "/jwt-decoder" },
};

export default function JwtDecoderPage() {
  return (
    <SimpleToolPage
      title="JWT Decoder"
      subtitle="Inspect JWT headers and payloads locally. This tool does not verify signatures."
    >
      <JwtTool />
    </SimpleToolPage>
  );
}
