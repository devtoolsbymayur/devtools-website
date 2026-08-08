"use client";

import { useCallback, useEffect, useState } from "react";
import { ToolTextPanel } from "@/components/tools/ToolTextPanel";
import { usePanelFullscreen } from "@/components/tools/usePanelFullscreen";
import { downloadText } from "@/lib/json/format";
import {
  convertBatchLines,
  formatPartsOutput,
  fromDateInput,
  fromUnixInput,
  type TimestampZone,
} from "@/lib/timestamp";

export function TimestampTool() {
  const [unix, setUnix] = useState("1754074800");
  const [dateInput, setDateInput] = useState("");
  const [output, setOutput] = useState("");
  const [zone, setZone] = useState<TimestampZone>("utc");
  const [nowLabel, setNowLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = usePanelFullscreen<
    "unix" | "date" | "output"
  >();

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1600);
  }, []);

  useEffect(() => {
    function tick() {
      const n = new Date();
      setNowLabel(
        `${n.toISOString()} · Unix ${Math.floor(n.getTime() / 1000)}`
      );
    }
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const convertFromUnix = useCallback(() => {
    const lines = unix
      .split(/\r\n|\r|\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length > 1) {
      const batch = convertBatchLines(unix, zone);
      if (!batch.ok) {
        setError(batch.error);
        return;
      }
      setOutput(batch.result);
      setError(null);
      showToast(`Converted ${batch.count} rows`);
      return;
    }
    const result = fromUnixInput(unix, zone);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDateInput(result.parts.iso.slice(0, 19));
    setOutput(formatPartsOutput(result.parts));
    setError(null);
    showToast("Converted");
  }, [showToast, unix, zone]);

  function convertFromDate() {
    const result = fromDateInput(dateInput || unix, zone);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setUnix(String(result.parts.unixSeconds));
    setOutput(formatPartsOutput(result.parts));
    setError(null);
    showToast("Converted");
  }

  function useNow() {
    const sec = Math.floor(Date.now() / 1000);
    setUnix(String(sec));
    const result = fromUnixInput(String(sec), zone);
    if (result.ok) {
      setDateInput(result.parts.iso.slice(0, 19));
      setOutput(formatPartsOutput(result.parts));
      setError(null);
    }
    showToast("Current time");
  }

  async function copy() {
    const text = output || unix;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied");
    } catch {
      showToast("Copy failed");
    }
  }

  function download() {
    const text = output || unix;
    if (!text) return;
    downloadText("timestamps.txt", text, "text/plain;charset=utf-8");
    showToast("Downloaded");
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        convertFromUnix();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [convertFromUnix]);

  return (
    <div className="space-y-4">
      <p className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success-soft px-3 py-1 text-xs font-medium text-success">
        Processed locally in your browser — never uploaded.
      </p>
      <p className="text-xs text-text-muted">
        Live now: <span className="font-mono text-text">{nowLabel}</span>
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={convertFromUnix}
          className="rounded-[var(--radius)] bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Timestamp → Date
        </button>
        <button
          type="button"
          onClick={convertFromDate}
          className="rounded-[var(--radius)] border border-border px-3 py-2 text-sm hover:border-accent"
        >
          Date → Timestamp
        </button>
        <button
          type="button"
          onClick={useNow}
          className="rounded-[var(--radius)] border border-border px-3 py-2 text-sm hover:border-accent"
        >
          Use current time
        </button>
        <button
          type="button"
          onClick={() => void copy()}
          className="rounded-[var(--radius)] border border-border px-3 py-2 text-sm hover:border-accent"
        >
          Copy
        </button>
        <button
          type="button"
          onClick={download}
          className="rounded-[var(--radius)] border border-border px-3 py-2 text-sm hover:border-accent"
        >
          Download
        </button>
        <button
          type="button"
          onClick={() => {
            setUnix("");
            setDateInput("");
            setOutput("");
            setError(null);
          }}
          className="rounded-[var(--radius)] border border-border px-3 py-2 text-sm hover:border-accent"
        >
          Clear
        </button>
        <label className="ml-auto flex items-center gap-2 text-sm text-text-muted">
          Timezone
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value as TimestampZone)}
            className="rounded-[var(--radius)] border border-border bg-surface px-2 py-1.5 text-text"
          >
            <option value="utc">UTC</option>
            <option value="local">Local</option>
            <option value="Asia/Kolkata">IST (India)</option>
          </select>
        </label>
      </div>
      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolTextPanel
          panelId="unix"
          title="Unix timestamp (one per line for batch)"
          value={unix}
          onChange={setUnix}
          fullscreen={fullscreen}
          onToggleFullscreen={() =>
            setFullscreen((v) => (v === "unix" ? null : "unix"))
          }
        />
        <ToolTextPanel
          panelId="date"
          title="Human-readable / ISO date"
          value={dateInput}
          onChange={setDateInput}
          placeholder="2026-08-08T12:00:00"
          fullscreen={fullscreen}
          onToggleFullscreen={() =>
            setFullscreen((v) => (v === "date" ? null : "date"))
          }
        />
      </div>
      <ToolTextPanel
        panelId="output"
        title="All formats / batch TSV"
        value={output}
        readOnly
        fullscreen={fullscreen}
        onToggleFullscreen={() =>
          setFullscreen((v) => (v === "output" ? null : "output"))
        }
      />
      <p className="text-xs text-text-muted">
        Ctrl+Enter to convert · multi-line Unix input runs batch mode
      </p>
      {toast && (
        <div
          role="status"
          className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 rounded-full bg-text px-4 py-2 text-sm text-bg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
