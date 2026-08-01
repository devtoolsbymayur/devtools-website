import { describe, expect, it } from "vitest";
import { isValidEmail, sanitizeText } from "@/lib/sanitize";

describe("sanitizeText", () => {
  it("trims and removes control chars", () => {
    expect(sanitizeText("  hi\u0000there  ", 100)).toBe("hithere");
  });

  it("enforces max length", () => {
    expect(sanitizeText("abcdef", 3)).toBe("abc");
  });
});

describe("isValidEmail", () => {
  it("accepts normal emails", () => {
    expect(isValidEmail("a@b.com")).toBe(true);
  });

  it("rejects invalid emails", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
  });
});
