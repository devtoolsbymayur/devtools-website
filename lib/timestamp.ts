export type TimestampZone = "utc" | "local" | "Asia/Kolkata";

export type TimestampParts = {
  unixSeconds: number;
  unixMillis: number;
  iso: string;
  utcString: string;
  zonedString: string;
  relative: string;
  unit: "seconds" | "milliseconds";
};

export type TimestampResult =
  | { ok: true; parts: TimestampParts }
  | { ok: false; error: string };

function zoneLabel(zone: TimestampZone): string {
  if (zone === "utc") return "UTC";
  if (zone === "Asia/Kolkata") return "IST";
  return "Local";
}

export function detectUnixUnit(value: number): "seconds" | "milliseconds" {
  const abs = Math.abs(value);
  // 1e12 ≈ Sep 2001 in ms; below that treat as seconds for common range
  return abs >= 1e12 ? "milliseconds" : "seconds";
}

export function relativeFromNow(ms: number, now = Date.now()): string {
  const diff = ms - now;
  const abs = Math.abs(diff);
  const past = diff < 0;
  const suffix = past ? "ago" : "from now";

  const sec = Math.round(abs / 1000);
  if (sec < 60) return `${sec} second${sec === 1 ? "" : "s"} ${suffix}`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min} minute${min === 1 ? "" : "s"} ${suffix}`;
  const hr = Math.round(min / 60);
  if (hr < 48) return `${hr} hour${hr === 1 ? "" : "s"} ${suffix}`;
  const day = Math.round(hr / 24);
  if (day < 60) return `${day} day${day === 1 ? "" : "s"} ${suffix}`;
  const month = Math.round(day / 30);
  if (month < 24) return `${month} month${month === 1 ? "" : "s"} ${suffix}`;
  const year = Math.round(day / 365);
  return `${year} year${year === 1 ? "" : "s"} ${suffix}`;
}

function formatInZone(date: Date, zone: TimestampZone): string {
  if (zone === "utc") {
    return date.toUTCString();
  }
  if (zone === "local") {
    return date.toString();
  }
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: zone,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short",
  }).format(date);
}

export function fromUnixInput(
  raw: string,
  zone: TimestampZone = "utc"
): TimestampResult {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, error: "Timestamp is empty." };
  if (!/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return { ok: false, error: "Enter a numeric Unix timestamp." };
  }

  const num = Number(trimmed);
  if (!Number.isFinite(num)) {
    return { ok: false, error: "Invalid timestamp number." };
  }

  const unit = detectUnixUnit(num);
  const ms = unit === "seconds" ? Math.round(num * 1000) : Math.round(num);
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) {
    return { ok: false, error: "Timestamp is out of range." };
  }

  return {
    ok: true,
    parts: {
      unixSeconds: Math.floor(ms / 1000),
      unixMillis: ms,
      iso: date.toISOString(),
      utcString: date.toUTCString(),
      zonedString: `${formatInZone(date, zone)} (${zoneLabel(zone)})`,
      relative: relativeFromNow(ms),
      unit,
    },
  };
}

export function fromDateInput(
  raw: string,
  zone: TimestampZone = "utc"
): TimestampResult {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, error: "Date input is empty." };

  let date: Date;
  // datetime-local style without timezone
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(trimmed) && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(trimmed)) {
    if (zone === "utc") {
      date = new Date(`${trimmed}${trimmed.length === 16 ? ":00" : ""}Z`);
    } else if (zone === "Asia/Kolkata") {
      date = new Date(`${trimmed}${trimmed.length === 16 ? ":00" : ""}+05:30`);
    } else {
      date = new Date(trimmed);
    }
  } else {
    date = new Date(trimmed);
  }

  if (Number.isNaN(date.getTime())) {
    return { ok: false, error: "Could not parse that date. Try ISO 8601." };
  }

  const ms = date.getTime();
  return {
    ok: true,
    parts: {
      unixSeconds: Math.floor(ms / 1000),
      unixMillis: ms,
      iso: date.toISOString(),
      utcString: date.toUTCString(),
      zonedString: `${formatInZone(date, zone)} (${zoneLabel(zone)})`,
      relative: relativeFromNow(ms),
      unit: "seconds",
    },
  };
}

export function formatPartsOutput(parts: TimestampParts): string {
  return [
    `Unix (seconds): ${parts.unixSeconds}`,
    `Unix (milliseconds): ${parts.unixMillis}`,
    `Detected input unit: ${parts.unit}`,
    `ISO 8601: ${parts.iso}`,
    `UTC: ${parts.utcString}`,
    `Selected zone: ${parts.zonedString}`,
    `Relative: ${parts.relative}`,
  ].join("\n");
}

export type BatchTimestampResult =
  | { ok: true; result: string; count: number }
  | { ok: false; error: string };

/** Convert one Unix timestamp (or ISO date) per non-empty line → TSV. */
export function convertBatchLines(
  text: string,
  zone: TimestampZone = "utc"
): BatchTimestampResult {
  const lines = text.split(/\r\n|\r|\n/);
  const rows: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!.trim();
    if (!line) continue;
    const asUnix = fromUnixInput(line, zone);
    const result = asUnix.ok ? asUnix : fromDateInput(line, zone);
    if (!result.ok) {
      return { ok: false, error: `Line ${i + 1}: ${result.error}` };
    }
    rows.push(
      `${line}\t${result.parts.unixSeconds}\t${result.parts.iso}\t${result.parts.relative}`
    );
  }

  if (rows.length === 0) {
    return { ok: false, error: "No timestamps found in the file." };
  }

  return {
    ok: true,
    count: rows.length,
    result: ["input\tunix_seconds\tiso\trelative", ...rows].join("\n"),
  };
}
