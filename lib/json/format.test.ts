import { describe, expect, it } from "vitest";
import { formatJson, minifyJson, validateJson, countLines } from "@/lib/json/format";

describe("formatJson", () => {
  it("formats valid JSON with 2-space indent", () => {
    const result = formatJson('{"a":1}', "2");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.result).toBe('{\n  "a": 1\n}');
    }
  });

  it("returns error for invalid JSON", () => {
    const result = formatJson("{bad", "2");
    expect(result.ok).toBe(false);
  });
});

describe("minifyJson", () => {
  it("removes whitespace", () => {
    const result = minifyJson('{\n  "a": 1\n}');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.result).toBe('{"a":1}');
  });
});

describe("validateJson", () => {
  it("accepts valid JSON", () => {
    expect(validateJson('{"ok":true}').ok).toBe(true);
  });
});

describe("countLines", () => {
  it("counts lines", () => {
    expect(countLines("a\nb\nc")).toBe(3);
    expect(countLines("")).toBe(0);
  });
});
