import { getAdSenseClient } from "@/lib/adsense";

/**
 * Site-wide AdSense loader for ownership / Auto ads (always in HTML head).
 * Individual ad units still respect cookie consent via AdSenseUnit.
 * @see https://support.google.com/adsense/answer/7584263
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
