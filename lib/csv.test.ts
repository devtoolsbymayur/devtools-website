import { describe, expect, it } from "vitest";
import {
  csvToJson,
  jsonToCsv,
  parseCsvRows,
  resolveDelimiter,
} from "@/lib/csv";

describe("parseCsvRows", () => {
  it("parses quoted fields with commas", () => {
    const rows = parseCsvRows('name,city\n"Doe, John",Delhi', ",");
    expect(rows).toEqual([
      ["name", "city"],
      ["Doe, John", "Delhi"],
    ]);
  });

  it("handles escaped quotes", () => {
    const rows = parseCsvRows('a\n"say ""hi"""', ",");
    expect(rows[1]).toEqual(['say "hi"']);
  });

  it("parses semicolon delimiter", () => {
    const rows = parseCsvRows("a;b\n1;2", ";");
    expect(rows).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });
});

describe("csvToJson / jsonToCsv", () => {
  it("converts CSV with headers and coercion", () => {
    const result = csvToJson("name,age,active\nJohn,30,true", {
      headers: true,
      coerce: true,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const data = JSON.parse(result.result) as Array<{
        name: string;
        age: number;
        active: boolean;
      }>;
      expect(data[0]).toEqual({ name: "John", age: 30, active: true });
    }
  });

  it("keeps strings when coercion is off", () => {
    const result = csvToJson("age\n30", { headers: true, coerce: false });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const data = JSON.parse(result.result) as Array<{ age: string }>;
      expect(data[0]?.age).toBe("30");
    }
  });

  it("supports rows without headers", () => {
    const result = csvToJson("a,b\n1,2", { headers: false, coerce: true });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(JSON.parse(result.result)).toEqual([
        ["a", "b"],
        [1, 2],
      ]);
    }
  });

  it("converts JSON objects back to CSV", () => {
    const result = jsonToCsv(
      JSON.stringify([{ name: "Priya", city: "Mumbai" }])
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.result).toContain("name,city");
      expect(result.result).toContain("Priya,Mumbai");
    }
  });

  it("rejects non-array JSON", () => {
    expect(jsonToCsv('{"a":1}').ok).toBe(false);
  });

  it("rejects empty CSV", () => {
    expect(csvToJson("").ok).toBe(false);
  });

  it("auto-detects tab delimiter", () => {
    expect(resolveDelimiter("a\tb\n1\t2", "auto")).toBe("\t");
  });

  it("round-trips CSV → JSON → CSV", () => {
    const csv = "name,age\nAda,36";
    const json = csvToJson(csv, { headers: true, coerce: false });
    expect(json.ok).toBe(true);
    if (!json.ok) return;
    const back = jsonToCsv(json.result);
    expect(back.ok).toBe(true);
    if (back.ok) {
      expect(back.result).toContain("name,age");
      expect(back.result).toContain("Ada,36");
    }
  });
});
