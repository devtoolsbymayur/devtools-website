/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import {
  formatXml,
  jsonToXml,
  minifyXml,
  validateXml,
  xmlToJson,
} from "@/lib/xml";

describe("validateXml", () => {
  it("accepts valid XML", () => {
    expect(validateXml("<user><name>John</name></user>").ok).toBe(true);
  });

  it("rejects empty input", () => {
    const result = validateXml("   ");
    expect(result.ok).toBe(false);
  });

  it("rejects malformed XML", () => {
    const result = validateXml("<user><name>John</user>");
    expect(result.ok).toBe(false);
  });
});

describe("formatXml / minifyXml", () => {
  it("formats with 2-space indentation", () => {
    const result = formatXml("<user><name>John</name></user>", "2");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.result).toContain("<?xml");
      expect(result.result).toContain("  <name>John</name>");
    }
  });

  it("formats with tabs", () => {
    const result = formatXml("<a><b>x</b></a>", "tab");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.result).toContain("\t<b>x</b>");
  });

  it("minifies whitespace between tags", () => {
    const result = minifyXml("<user>\n  <name>John</name>\n</user>");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.result).toContain("<user><name>John</name></user>");
    }
  });

  it("preserves attributes when formatting", () => {
    const result = formatXml('<item id="1"><title>Hi</title></item>', "2");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.result).toContain('id="1"');
  });
});

describe("xml ↔ json", () => {
  it("converts XML to JSON", () => {
    const result = xmlToJson("<user><name>John</name></user>");
    expect(result.ok).toBe(true);
    if (result.ok) {
      const data = JSON.parse(result.result) as { user: { name: string } };
      expect(data.user.name).toBe("John");
    }
  });

  it("maps XML attributes with @ prefix", () => {
    const result = xmlToJson('<user id="9"><name>A</name></user>');
    expect(result.ok).toBe(true);
    if (result.ok) {
      const data = JSON.parse(result.result) as {
        user: { "@id": string; name: string };
      };
      expect(data.user["@id"]).toBe("9");
    }
  });

  it("converts JSON to XML", () => {
    const result = jsonToXml('{"user":{"name":"John"}}', "2");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.result).toContain("<user>");
      expect(result.result).toContain("<name>John</name>");
    }
  });

  it("rejects invalid JSON for jsonToXml", () => {
    expect(jsonToXml("{bad").ok).toBe(false);
  });

  it("round-trips a simple document", () => {
    const xml = "<root><item>1</item><item>2</item></root>";
    const asJson = xmlToJson(xml);
    expect(asJson.ok).toBe(true);
    if (!asJson.ok) return;
    const back = jsonToXml(asJson.result, "2");
    expect(back.ok).toBe(true);
    if (back.ok) {
      expect(back.result).toContain("<root>");
      expect(back.result).toContain("<item>");
    }
  });
});
