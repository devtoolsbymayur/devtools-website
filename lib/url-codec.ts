export type UrlEncodeMode = "component" | "uri";

export type UrlResult =
  | { ok: true; result: string }
  | { ok: false; error: string };

export type QueryParam = { key: string; value: string };

export function encodeUrl(text: string, mode: UrlEncodeMode = "component"): UrlResult {
  try {
    const result =
      mode === "uri" ? encodeURI(text) : encodeURIComponent(text);
    return { ok: true, result };
  } catch {
    return { ok: false, error: "Could not encode that text." };
  }
}

export function decodeUrl(text: string, mode: UrlEncodeMode = "component"): UrlResult {
  try {
    const cleaned = text.trim();
    const result =
      mode === "uri" ? decodeURI(cleaned) : decodeURIComponent(cleaned);
    return { ok: true, result };
  } catch {
    return {
      ok: false,
      error: "Invalid percent-encoding — check % sequences and try again.",
    };
  }
}

/** Encode each non-empty line separately (keeps blank lines). */
export function encodeUrlLines(
  text: string,
  mode: UrlEncodeMode = "component"
): UrlResult {
  const lines = text.split(/\r\n|\r|\n/);
  if (lines.length <= 1) return encodeUrl(text, mode);

  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (line === "") {
      out.push("");
      continue;
    }
    const result = encodeUrl(line, mode);
    if (!result.ok) {
      return { ok: false, error: `Line ${i + 1}: ${result.error}` };
    }
    out.push(result.result);
  }
  return { ok: true, result: out.join("\n") };
}

/** Decode each non-empty line separately (keeps blank lines). */
export function decodeUrlLines(
  text: string,
  mode: UrlEncodeMode = "component"
): UrlResult {
  const lines = text.split(/\r\n|\r|\n/);
  if (lines.length <= 1) return decodeUrl(text, mode);

  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (line === "") {
      out.push("");
      continue;
    }
    const result = decodeUrl(line, mode);
    if (!result.ok) {
      return { ok: false, error: `Line ${i + 1}: ${result.error}` };
    }
    out.push(result.result);
  }
  return { ok: true, result: out.join("\n") };
}

/** Extract query key/value pairs from a URL or bare query string. */
export function parseQueryParams(input: string): QueryParam[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  let query = trimmed;
  try {
    if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("//")) {
      const url = new URL(trimmed.startsWith("//") ? `https:${trimmed}` : trimmed);
      query = url.search.startsWith("?") ? url.search.slice(1) : url.search;
    } else if (trimmed.includes("?") && !trimmed.startsWith("?")) {
      query = trimmed.slice(trimmed.indexOf("?") + 1);
    } else if (trimmed.startsWith("?")) {
      query = trimmed.slice(1);
    }
  } catch {
    const q = trimmed.indexOf("?");
    if (q >= 0) query = trimmed.slice(q + 1);
  }

  if (!query) return [];

  return query.split("&").filter(Boolean).map((part) => {
    const eq = part.indexOf("=");
    const rawKey = eq >= 0 ? part.slice(0, eq) : part;
    const rawValue = eq >= 0 ? part.slice(eq + 1) : "";
    let key = rawKey;
    let value = rawValue;
    try {
      key = decodeURIComponent(rawKey.replace(/\+/g, " "));
    } catch {
      /* keep raw */
    }
    try {
      value = decodeURIComponent(rawValue.replace(/\+/g, " "));
    } catch {
      /* keep raw */
    }
    return { key, value };
  });
}
