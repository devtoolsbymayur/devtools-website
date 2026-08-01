import Script from "next/script";
import { getAdSenseClient } from "@/lib/adsense";

/**
 * Site-wide AdSense code for Auto ads / account verification.
 * Injected into the document head so AdSense ownership checks can find it
 * without waiting for client hydration.
 * @see https://support.google.com/adsense/answer/9274634
 */
export function AdSenseScript() {
  const client = getAdSenseClient();
  if (!client) return null;

  return (
    <Script
      id="adsense-init"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`}
      crossOrigin="anonymous"
      strategy="beforeInteractive"
    />
  );
}
