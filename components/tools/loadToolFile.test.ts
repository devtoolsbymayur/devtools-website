/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { MAX_UPLOAD_BYTES } from "@/lib/constants";
import { loadToolFile } from "@/components/tools/loadToolFile";

describe("loadToolFile", () => {
  it("loads allowed text files", async () => {
    const file = new File(["<a/>"], "sample.xml", { type: "text/xml" });
    const result = await loadToolFile(file, [".xml", ".txt"]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.text).toBe("<a/>");
      expect(result.name).toBe("sample.xml");
    }
  });

  it("rejects disallowed extensions", async () => {
    const file = new File(["x"], "photo.png", { type: "image/png" });
    const result = await loadToolFile(file, [".xml", ".txt"]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/Only/);
    }
  });

  it("rejects files over the size limit", async () => {
    const big = new File([new Uint8Array(MAX_UPLOAD_BYTES + 1)], "huge.txt", {
      type: "text/plain",
    });
    Object.defineProperty(big, "size", { value: MAX_UPLOAD_BYTES + 1 });
    const result = await loadToolFile(big, [".txt"]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/too large/i);
    }
  });
});
