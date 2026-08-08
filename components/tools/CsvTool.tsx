"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  IconConvert,
  IconCopy,
  IconDownload,
  IconSwap,
  IconTrash,
  IconUpload,
  IconWand,
  ToolActionBar,
} from "@/components/tools/ToolActionBar";
import { loadToolFile } from "@/components/tools/loadToolFile";
import { ToolTextPanel } from "@/components/tools/ToolTextPanel";
import { usePanelFullscreen } from "@/components/tools/usePanelFullscreen";
import { csvToJson, jsonToCsv, type CsvDelimiter } from "@/lib/csv";
import { countLines, downloadText } from "@/lib/json/format";

const SAMPLE = `name,age,city
John,30,Delhi
Priya,27,Mumbai`;

export function CsvTool() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [delimiter, setDelimiter] = useState<CsvDelimiter>("auto");
  const [headers, setHeaders] = useState(true);
  const [coerce, setCoerce] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = usePanelFullscreen<"input" | "output">();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1600);
  }, []);

  const toJson = useCallback(() => {
    const result = csvToJson(input, { delimiter, headers, coerce });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setOutput(result.result);
    setError(null);
    showToast("CSV → JSON");
  }, [coerce, delimiter, headers, input, showToast]);

  function toCsv() {
    const delim = delimiter === "auto" ? "," : delimiter;
    const result = jsonToCsv(input, { delimiter: delim });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setOutput(result.result);
    setError(null);
    showToast("JSON → CSV");
  }

  function swap() {
    setInput(output);
    setOutput(input);
    setError(null);
    showToast("Swapped");
  }

  async function copy() {
    const text = output || input;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied");
    } catch {
      showToast("Copy failed");
    }
  }

  function download() {
    const text = output || input;
    if (!text) return;
    const isJson =
      text.trimStart().startsWith("[") || text.trimStart().startsWith("{");
    downloadText(
      isJson ? "converted.json" : "converted.csv",
      text,
      isJson
        ? "application/json;charset=utf-8"
        : "text/csv;charset=utf-8"
    );
    showToast("Downloaded");
  }

  async function handleFile(file: File) {
    const loaded = await loadToolFile(file, [".csv", ".tsv", ".json", ".txt"]);
    if (!loaded.ok) {
      setError(loaded.error);
      return;
    }
    setInput(loaded.text);
    setError(null);
    const lower = loaded.name.toLowerCase();
    if (lower.endsWith(".json")) {
      const delim = delimiter === "auto" ? "," : delimiter;
      const result = jsonToCsv(loaded.text, { delimiter: delim });
      if (result.ok) {
        setOutput(result.result);
        showToast(`Loaded ${loaded.name}`);
      } else {
        setOutput("");
        setError(result.error);
      }
      return;
    }
    const result = csvToJson(loaded.text, { delimiter, headers, coerce });
    if (result.ok) {
      setOutput(result.result);
      showToast(`Loaded ${loaded.name}`);
    } else {
      setOutput("");
      showToast(`Loaded ${loaded.name}`);
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        toJson();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toJson]);

  return (
    <div className="space-y-4">
      <p className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success-soft px-3 py-1 text-xs font-medium text-success">
        Processed locally in your browser — never uploaded.
      </p>
      <ToolActionBar
        actions={[
          {
            id: "to-json",
            label: "CSV → JSON",
            primary: true,
            icon: <IconWand />,
            onClick: toJson,
          },
          {
            id: "to-csv",
            label: "JSON → CSV",
            icon: <IconConvert />,
            onClick: toCsv,
          },
          {
            id: "swap",
            label: "Swap",
            icon: <IconSwap />,
            disabled: !output,
            onClick: swap,
          },
          {
            id: "copy",
            label: "Copy",
            icon: <IconCopy />,
            onClick: () => void copy(),
          },
          {
            id: "download",
            label: "Download",
            icon: <IconDownload />,
            onClick: download,
          },
          {
            id: "upload",
            label: "Upload",
            icon: <IconUpload />,
            onClick: () => fileInputRef.current?.click(),
          },
          {
            id: "clear",
            label: "Clear",
            icon: <IconTrash />,
            onClick: () => {
              setInput("");
              setOutput("");
              setError(null);
            },
          },
        ]}
        extras={
          <>
            <label className="flex items-center gap-1.5">
              <span>Delimiter</span>
              <select
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value as CsvDelimiter)}
                className="rounded-[var(--radius)] border border-border bg-bg px-1.5 py-1 text-xs text-text"
              >
                <option value="auto">Auto</option>
                <option value=",">Comma</option>
                <option value={"\t"}>Tab</option>
                <option value=";">Semicolon</option>
              </select>
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={headers}
                onChange={(e) => setHeaders(e.target.checked)}
                className="accent-[var(--accent)]"
              />
              First row = headers
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={coerce}
                onChange={(e) => setCoerce(e.target.checked)}
                className="accent-[var(--accent)]"
              />
              Coerce types
            </label>
          </>
        }
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.tsv,.json,.txt,text/csv,text/tab-separated-values,application/json,text/plain"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolTextPanel
          panelId="input"
          title="CSV / JSON Input"
          value={input}
          onChange={setInput}
          stats={`${countLines(input)} lines · ${input.length} chars`}
          fullscreen={fullscreen}
          onToggleFullscreen={() =>
            setFullscreen((v) => (v === "input" ? null : "input"))
          }
          onDropFile={(file) => void handleFile(file)}
        />
        <ToolTextPanel
          panelId="output"
          title="Output"
          value={output}
          readOnly
          stats={
            output
              ? `${countLines(output)} lines · ${output.length} chars`
              : "—"
          }
          fullscreen={fullscreen}
          onToggleFullscreen={() =>
            setFullscreen((v) => (v === "output" ? null : "output"))
          }
        />
      </div>
      <p className="text-xs text-text-muted">
        Ctrl+Enter for CSV → JSON · Upload or drop .csv / .tsv / .json on the
        input panel
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
