import { permanentRedirect } from "next/navigation";

/** Exact-match URL for “json format” searches — consolidates SEO to homepage. */
export default function JsonFormatAliasPage() {
  permanentRedirect("/");
}
