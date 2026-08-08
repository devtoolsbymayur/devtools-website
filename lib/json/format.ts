import { normalizeJsonError } from "@/lib/json/errors";
import type { IndentStyle, JsonErrorInfo } from "@/lib/json/types";

export function indentUnit(indent: IndentStyle): string | number {
  if (indent === "tab") return "\t";
  return Number(indent);
}

export function formatJson(
  text: string,
  indent: IndentStyle
): { ok: true; result: string; parsed: unknown } | { ok: false; error: JsonErrorInfo } {
  try {
    const parsed = JSON.parse(text) as unknown;
    return {
      ok: true,
      result: JSON.stringify(parsed, null, indentUnit(indent)),
      parsed,
    };
  } catch (error) {
    return { ok: false, error: normalizeJsonError(error, text) };
  }
}

export function minifyJson(
  text: string
): { ok: true; result: string; parsed: unknown } | { ok: false; error: JsonErrorInfo } {
  try {
    const parsed = JSON.parse(text) as unknown;
    return { ok: true, result: JSON.stringify(parsed), parsed };
  } catch (error) {
    return { ok: false, error: normalizeJsonError(error, text) };
  }
}

export function validateJson(
  text: string
): { ok: true; parsed: unknown } | { ok: false; error: JsonErrorInfo } {
  try {
    const parsed = JSON.parse(text) as unknown;
    return { ok: true, parsed };
  } catch (error) {
    return { ok: false, error: normalizeJsonError(error, text) };
  }
}

export function countLines(text: string): number {
  if (!text) return 0;
  return text.split(/\r\n|\r|\n/).length;
}

export function downloadText(
  filename: string,
  content: string,
  mimeType = "application/json;charset=utf-8"
) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
