/** Publisher client from AdSense (ca-pub-…). Empty = script not injected. */
export function getAdSenseClient(): string | null {
  const client = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "").trim();
  if (!client) return null;
  if (!/^ca-pub-\d+$/.test(client)) return null;
  return client;
}

export function getAdSensePublisherId(): string | null {
  const client = getAdSenseClient();
  if (!client) return null;
  return client.replace(/^ca-/, "");
}
