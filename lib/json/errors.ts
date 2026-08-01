import type { JsonErrorInfo } from "@/lib/json/types";

export function normalizeJsonError(error: unknown, source: string): JsonErrorInfo {
  const message =
    error instanceof Error ? error.message : "Invalid JSON";

  const positionMatch = /position\s+(\d+)/i.exec(message);
  const position = positionMatch
    ? Number.parseInt(positionMatch[1], 10)
    : undefined;

  if (position === undefined || Number.isNaN(position)) {
    return { message: humanizeMessage(message) };
  }

  const { line, column } = positionToLineColumn(source, position);
  return {
    message: humanizeMessage(message),
    position,
    line,
    column,
  };
}

function positionToLineColumn(source: string, position: number) {
  const safe = Math.max(0, Math.min(position, source.length));
  let line = 1;
  let column = 1;
  for (let i = 0; i < safe; i += 1) {
    if (source[i] === "\n") {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
  }
  return { line, column };
}

function humanizeMessage(message: string): string {
  if (/unexpected end/i.test(message)) {
    return "Unexpected end of JSON input — check for missing brackets or quotes.";
  }
  if (/unexpected token/i.test(message)) {
    return message.replace(/^JSON\.parse:\s*/i, "").replace(/^Unexpected token/i, "Unexpected token");
  }
  return message.replace(/^JSON\.parse:\s*/i, "");
}
