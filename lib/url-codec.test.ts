import { describe, expect, it } from "vitest";
import {
  decodeUrl,
  decodeUrlLines,
  encodeUrl,
  encodeUrlLines,
  parseQueryParams,
} from "@/lib/url-codec";

describe("encodeUrl / decodeUrl", () => {
  it("encodes component mode", () => {
    const result = encodeUrl("hello world", "component");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.result).toBe("hello%20world");
  });

  it("keeps URL structure in uri mode", () => {
    const result = encodeUrl("https://example.com/a b", "uri");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.result).toContain("https://");
      expect(result.result).toContain("%20");
    }
  });

  it("round-trips component encoding", () => {
    const original = "q=hello world&x=1";
    const encoded = encodeUrl(original, "component");
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;
    const decoded = decodeUrl(encoded.result, "component");
    expect(decoded.ok).toBe(true);
    if (decoded.ok) expect(decoded.result).toBe(original);
  });

  it("flags bad percent sequences", () => {
    expect(decodeUrl("%E0%A4%A", "component").ok).toBe(false);
  });
});

describe("encodeUrlLines / decodeUrlLines", () => {
  it("encodes each line", () => {
    const result = encodeUrlLines("a b\nc d", "component");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.result).toBe("a%20b\nc%20d");
  });

  it("decodes each line", () => {
    const result = decodeUrlLines("a%20b\nc%20d", "component");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.result).toBe("a b\nc d");
  });

  it("reports which line failed", () => {
    const result = decodeUrlLines("ok\n%E0%A4%A", "component");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/Line 2/);
  });
});

describe("parseQueryParams", () => {
  it("parses full URL query", () => {
    const params = parseQueryParams(
      "https://example.com/search?q=hello%20world&sort=price"
    );
    expect(params).toEqual([
      { key: "q", value: "hello world" },
      { key: "sort", value: "price" },
    ]);
  });

  it("parses bare query strings", () => {
    expect(parseQueryParams("?a=1&b=2")).toEqual([
      { key: "a", value: "1" },
      { key: "b", value: "2" },
    ]);
  });

  it("returns empty for input without query", () => {
    expect(parseQueryParams("https://example.com/path")).toEqual([]);
  });
});
