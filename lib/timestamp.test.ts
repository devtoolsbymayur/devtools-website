import { describe, expect, it } from "vitest";
import {
  convertBatchLines,
  detectUnixUnit,
  formatPartsOutput,
  fromDateInput,
  fromUnixInput,
  relativeFromNow,
} from "@/lib/timestamp";

describe("detectUnixUnit", () => {
  it("detects seconds vs milliseconds", () => {
    expect(detectUnixUnit(1754074800)).toBe("seconds");
    expect(detectUnixUnit(1754074800000)).toBe("milliseconds");
  });
});

describe("fromUnixInput", () => {
  it("converts seconds timestamp", () => {
    const result = fromUnixInput("1754074800", "utc");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.parts.unixSeconds).toBe(1754074800);
      expect(result.parts.iso).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(result.parts.unit).toBe("seconds");
    }
  });

  it("converts millisecond timestamps", () => {
    const result = fromUnixInput("1754074800000", "utc");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.parts.unit).toBe("milliseconds");
      expect(result.parts.unixSeconds).toBe(1754074800);
    }
  });

  it("formats IST zone label", () => {
    const result = fromUnixInput("1754074800", "Asia/Kolkata");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.parts.zonedString).toContain("IST");
  });

  it("rejects non-numeric input", () => {
    expect(fromUnixInput("not-a-date").ok).toBe(false);
  });

  it("rejects empty input", () => {
    expect(fromUnixInput("").ok).toBe(false);
  });
});

describe("fromDateInput", () => {
  it("parses ISO date", () => {
    const result = fromDateInput("2026-08-08T12:00:00Z", "utc");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.parts.iso).toBe("2026-08-08T12:00:00.000Z");
    }
  });

  it("rejects unparseable dates", () => {
    expect(fromDateInput("not-a-real-date").ok).toBe(false);
  });
});

describe("relativeFromNow / formatPartsOutput", () => {
  it("formats past differences", () => {
    const now = Date.parse("2026-08-08T12:00:00Z");
    expect(relativeFromNow(now - 3 * 3600 * 1000, now)).toBe("3 hours ago");
  });

  it("includes key fields in formatted output", () => {
    const result = fromUnixInput("1754074800", "utc");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const text = formatPartsOutput(result.parts);
    expect(text).toContain("Unix (seconds):");
    expect(text).toContain("ISO 8601:");
    expect(text).toContain("Relative:");
  });
});

describe("convertBatchLines", () => {
  it("converts multiple unix lines to TSV", () => {
    const result = convertBatchLines("1754074800\n1754074801", "utc");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.count).toBe(2);
      expect(result.result).toContain("unix_seconds");
      expect(result.result).toContain("1754074800");
    }
  });

  it("accepts ISO dates in batch", () => {
    const result = convertBatchLines("2026-08-08T12:00:00Z", "utc");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.count).toBe(1);
  });

  it("reports line errors", () => {
    const result = convertBatchLines("1754074800\nbad", "utc");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/Line 2/);
  });

  it("rejects empty batch", () => {
    expect(convertBatchLines("\n\n", "utc").ok).toBe(false);
  });
});
