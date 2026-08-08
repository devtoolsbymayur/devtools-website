export type CsvDelimiter = "," | "\t" | ";" | "auto";

export type CsvResult =
  | { ok: true; result: string }
  | { ok: false; error: string };

function detectDelimiter(text: string): "," | "\t" | ";" {
  const sample = text.split(/\r\n|\r|\n/).slice(0, 5).join("\n");
  const counts: Array<{ d: "," | "\t" | ";"; n: number }> = [
    { d: ",", n: (sample.match(/,/g) ?? []).length },
    { d: "\t", n: (sample.match(/\t/g) ?? []).length },
    { d: ";", n: (sample.match(/;/g) ?? []).length },
  ];
  counts.sort((a, b) => b.n - a.n);
  return counts[0]!.n > 0 ? counts[0]!.d : ",";
}

export function resolveDelimiter(
  text: string,
  delimiter: CsvDelimiter
): "," | "\t" | ";" {
  return delimiter === "auto" ? detectDelimiter(text) : delimiter;
}

/** RFC4180-style row parser (quoted fields, escaped quotes). */
export function parseCsvRows(text: string, delimiter: "," | "\t" | ";"): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === delimiter) {
      row.push(field);
      field = "";
      continue;
    }
    if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }
    if (ch === "\r") {
      if (next === "\n") continue;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }
    field += ch;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

function coerceValue(raw: string, coerce: boolean): unknown {
  if (!coerce) return raw;
  const trimmed = raw.trim();
  if (trimmed === "") return "";
  if (trimmed === "null") return null;
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(trimmed)) {
    const n = Number(trimmed);
    if (!Number.isNaN(n) && Number.isFinite(n)) return n;
  }
  return raw;
}

export function csvToJson(
  text: string,
  options: {
    delimiter?: CsvDelimiter;
    headers?: boolean;
    coerce?: boolean;
    pretty?: boolean;
  } = {}
): CsvResult {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false, error: "CSV input is empty." };

  const delimiter = resolveDelimiter(trimmed, options.delimiter ?? "auto");
  const rows = parseCsvRows(trimmed, delimiter);
  if (rows.length === 0) return { ok: false, error: "No CSV rows found." };

  const useHeaders = options.headers !== false;
  const coerce = options.coerce !== false;
  const pretty = options.pretty !== false;

  let data: unknown[];
  if (useHeaders) {
    const headers = rows[0]!.map((h, i) => h.trim() || `column_${i + 1}`);
    data = rows.slice(1).map((row) => {
      const obj: Record<string, unknown> = {};
      headers.forEach((header, i) => {
        obj[header] = coerceValue(row[i] ?? "", coerce);
      });
      return obj;
    });
  } else {
    data = rows.map((row) => row.map((cell) => coerceValue(cell, coerce)));
  }

  return {
    ok: true,
    result: pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data),
  };
}

function escapeCsvField(value: string, delimiter: "," | "\t" | ";"): string {
  const needsQuotes =
    value.includes(delimiter) ||
    value.includes('"') ||
    value.includes("\n") ||
    value.includes("\r");
  const escaped = value.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

export function jsonToCsv(
  text: string,
  options: { delimiter?: "," | "\t" | ";" } = {}
): CsvResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch {
    return { ok: false, error: "Invalid JSON input." };
  }

  if (!Array.isArray(parsed)) {
    return { ok: false, error: "JSON must be an array of objects (or arrays)." };
  }
  if (parsed.length === 0) {
    return { ok: true, result: "" };
  }

  const delimiter = options.delimiter ?? ",";

  if (Array.isArray(parsed[0])) {
    const lines = (parsed as unknown[][]).map((row) =>
      row.map((cell) => escapeCsvField(String(cell ?? ""), delimiter)).join(delimiter)
    );
    return { ok: true, result: lines.join("\n") };
  }

  if (typeof parsed[0] !== "object" || parsed[0] === null) {
    return {
      ok: false,
      error: "JSON array items must be objects or arrays.",
    };
  }

  const keys = Array.from(
    (parsed as Record<string, unknown>[]).reduce((set, row) => {
      Object.keys(row).forEach((k) => set.add(k));
      return set;
    }, new Set<string>())
  );

  const header = keys.map((k) => escapeCsvField(k, delimiter)).join(delimiter);
  const lines = (parsed as Record<string, unknown>[]).map((row) =>
    keys
      .map((key) => {
        const value = row[key];
        if (value === null || value === undefined) return "";
        if (typeof value === "object") {
          return escapeCsvField(JSON.stringify(value), delimiter);
        }
        return escapeCsvField(String(value), delimiter);
      })
      .join(delimiter)
  );

  return { ok: true, result: [header, ...lines].join("\n") };
}
