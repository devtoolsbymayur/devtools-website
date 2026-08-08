/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { decodeBase64, encodeBase64 } from "@/lib/base64";

describe("base64", () => {
  it("round-trips ASCII text", () => {
    const encoded = encodeBase64("Hello, json.");
    expect(encoded).toBe("SGVsbG8sIGpzb24u");
    expect(decodeBase64(encoded)).toBe("Hello, json.");
  });

  it("round-trips unicode", () => {
    const text = "नमस्ते ✓";
    expect(decodeBase64(encodeBase64(text))).toBe(text);
  });

  it("ignores whitespace when decoding", () => {
    expect(decodeBase64("SGVs\nbG8=")).toBe("Hello");
  });

  it("throws on invalid base64", () => {
    expect(() => decodeBase64("!!!")).toThrow();
  });
});
