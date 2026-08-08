"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { countLines, downloadText } from "@/lib/json/format";
import {
  decodeUrlLines,
  encodeUrlLines,
  parseQueryParams,
  type UrlEncodeMode,
} from "@/lib/url-codec";

const SAMPLE = "https://example.com/search?q=hello world&sort=price";

export function UrlTool() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<UrlEncodeMode>("component");
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = usePanelFullscreen<"input" | "output">();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1600);
  }, []);

  const params = useMemo(
    () => parseQueryParams(output || input),
    [input, output]
  );

  const encode = useCallback(() => {
    const result = encodeUrlLines(input, mode);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setOutput(result.result);
    setError(null);
    showToast("Encoded");
  }, [input, mode, showToast]);

  function decode() {
    const result = decodeUrlLines(input, mode);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setOutput(result.result);
    setError(null);
    showToast("Decoded");
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
    downloadText("url-encoded.txt", text, "text/plain;charset=utf-8");
    showToast("Downloaded");
  }

  async function handleFile(file: File) {
    const loaded = await loadToolFile(file, [".txt", ".csv"]);
    if (!loaded.ok) {
      setError(loaded.error);
      return;
    }
    setInput(loaded.text);
    setError(null);
    const result = encodeUrlLines(loaded.text, mode);
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
        encode();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [encode]);

  return (
    <div className="space-y-4">
      <p className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success-soft px-3 py-1 text-xs font-medium text-success">
        Processed locally in your browser — never uploaded.
      </p>
      <ToolActionBar
        actions={[
          {
            id: "encode",
            label: "Encode",
            primary: true,
            icon: <IconWand />,
            onClick: encode,
          },
          {
            id: "decode",
            label: "Decode",
            icon: <IconConvert />,
            onClick: decode,
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
          <label className="flex items-center gap-1.5">
            <span>Mode</span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as UrlEncodeMode)}
              className="rounded-[var(--radius)] border border-border bg-bg px-1.5 py-1 text-xs text-text"
            >
              <option value="component">encodeURIComponent</option>
              <option value="uri">encodeURI</option>
            </select>
          </label>
        }
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.csv,text/plain,text/csv"
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
          title="Plain text / URL"
          value={input}
          onChange={setInput}
          stats={`${countLines(input)} lines · ${input.length} chars`}
          fullscreen={fullscreen}
          onToggleFullscreen={() =>
            setFullscreen((v) => (v === "input" ? null : "input"))
          }
          breakAll
          onDropFile={(file) => void handleFile(file)}
        />
        <ToolTextPanel
          panelId="output"
          title="Encoded / decoded"
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
          breakAll
        />
      </div>
      {params.length > 0 && (
        <div className="overflow-x-auto rounded-[var(--radius)] border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <caption className="border-b border-border px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
              Query breakdown
            </caption>
            <thead>
              <tr className="border-b border-border text-text-muted">
                <th className="px-3 py-2 font-medium">Key</th>
                <th className="px-3 py-2 font-medium">Value</th>
              </tr>
            </thead>
            <tbody>
              {params.map((param, i) => (
                <tr
                  key={`${param.key}-${i}`}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-3 py-2 font-mono text-accent">{param.key}</td>
                  <td className="break-all px-3 py-2 font-mono">{param.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-text-muted">
        Ctrl+Enter to encode · multi-line encodes each line · Upload or drop
        .txt on the input panel
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
