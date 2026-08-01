/** Real AdSense only on a public HTTPS production host — not localhost. */
export function shouldServeRealAds(): boolean {
  if (process.env.NODE_ENV !== "production") return false;
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "").toLowerCase();
  if (!base.startsWith("https://")) return false;
  if (
    base.includes("localhost") ||
    base.includes("127.0.0.1") ||
    base.includes("0.0.0.0") ||
    base.endsWith(".local")
  ) {
    return false;
  }
  return true;
}

export type ParsedAdUnit = {
  client: string;
  slot: string;
  format?: string;
  fullWidthResponsive?: string;
  style?: string;
};

/** Pull AdSense client/slot from a pasted unit snippet. */
export function parseAdUnitCode(code: string): ParsedAdUnit | null {
  const html = code.trim();
  if (!html) return null;

  const client =
    html.match(/data-ad-client=["']([^"']+)["']/i)?.[1] ||
    html.match(/client=(ca-pub-\d+)/i)?.[1];
  const slot = html.match(/data-ad-slot=["']([^"']+)["']/i)?.[1];
  if (!client || !slot) return null;

  return {
    client,
    slot,
    format: html.match(/data-ad-format=["']([^"']+)["']/i)?.[1],
    fullWidthResponsive: html.match(
      /data-full-width-responsive=["']([^"']+)["']/i
    )?.[1],
    style: html.match(/style=["']([^"']+)["']/i)?.[1],
  };
}
