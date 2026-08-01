import { getAdSenseClient } from "@/lib/adsense";

/**
 * Site-wide AdSense code for Auto ads / account verification.
 * Uses a raw script src in head — next/script rewrites into a loader queue
 * that AdSense's HTML crawler often does not treat as the snippet.
 * @see https://support.google.com/adsense/answer/9274634
 */
export function AdSenseScript() {
  const client = getAdSenseClient();
  if (!client) return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`}
      crossOrigin="anonymous"
    />
  );
}
