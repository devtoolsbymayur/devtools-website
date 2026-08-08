"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  IconCheck,
  IconCompress,
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
  formatXml,
  jsonToXml,
  minifyXml,
  validateXml,
  xmlToJson,
  type XmlIndent,
} from "@/lib/xml";

const SAMPLE = `<user><name>John</name><city>Delhi</city></user>`;

export function XmlTool() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState<XmlIndent>("2");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = usePanelFullscreen<"input" | "output">();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1600);
  }, []);

  const format = useCallback(() => {
    const result = formatXml(input, indent);
    if (!result.ok) {
      setError(result.error);
      setStatus(null);
      return;
    }
    setOutput(result.result);
    setError(null);
    setStatus("Valid XML");
    showToast("Formatted");
  }, [indent, input, showToast]);

  function validate() {
    const result = validateXml(input);
    if (!result.ok) {
      setError(result.error);
      setStatus(null);
      return;
    }
    setError(null);
    setStatus("Valid XML");
    showToast("Valid");
  }

  function minify() {
    const result = minifyXml(input);
    if (!result.ok) {
      setError(result.error);
      setStatus(null);
      return;
    }
    setOutput(result.result);
    setError(null);
    setStatus("Valid XML");
    showToast("Minified");
  }

  function toJson() {
    const result = xmlToJson(input);
    if (!result.ok) {
      setError(result.error);
      setStatus(null);
      return;
    }
    setOutput(result.result);
    setError(null);
    setStatus("Converted to JSON");
    showToast("XML → JSON");
  }

  function fromJson() {
    const result = jsonToXml(input, indent);
    if (!result.ok) {
      setError(result.error);
      setStatus(null);
      return;
    }
    setOutput(result.result);
    setError(null);
    setStatus("Converted to XML");
    showToast("JSON → XML");
  }

  function swap() {
    setInput(output);
    setOutput(input);
    setError(null);
    setStatus(null);
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
      text.trimStart().startsWith("{") || text.trimStart().startsWith("[");
    downloadText(
      isJson ? "converted.json" : "formatted.xml",
      text,
      isJson
        ? "application/json;charset=utf-8"
        : "application/xml;charset=utf-8"
    );
    showToast("Downloaded");
  }

  async function handleFile(file: File) {
    const loaded = await loadToolFile(file, [".xml", ".txt", ".json"]);
    if (!loaded.ok) {
      setError(loaded.error);
      setStatus(null);
      return;
    }
    setInput(loaded.text);
    setError(null);
    const lower = loaded.name.toLowerCase();
    if (lower.endsWith(".json")) {
      const result = jsonToXml(loaded.text, indent);
      if (result.ok) {
        setOutput(result.result);
        setStatus("Converted to XML");
        showToast(`Loaded ${loaded.name}`);
        return;
      }
      setError(result.error);
      setStatus(null);
      return;
    }
    const result = formatXml(loaded.text, indent);
    if (result.ok) {
      setOutput(result.result);
      setStatus("Valid XML");
      showToast(`Loaded ${loaded.name}`);
    } else {
      setOutput("");
      setStatus(null);
      showToast(`Loaded ${loaded.name}`);
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        format();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [format]);

  const outStats = output
    ? `${countLines(output)} lines · ${output.length} chars`
    : "—";

  return (
    <div className="space-y-4">
      <p className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success-soft px-3 py-1 text-xs font-medium text-success">
        Processed locally in your browser — never uploaded.
      </p>
      <ToolActionBar
        actions={[
          {
            id: "format",
            label: "Format",
            primary: true,
            icon: <IconWand />,
            onClick: format,
          },
          {
            id: "validate",
            label: "Validate",
            icon: <IconCheck />,
            onClick: validate,
          },
          {
            id: "minify",
            label: "Minify",
            icon: <IconCompress />,
            onClick: minify,
          },
          {
            id: "to-json",
            label: "XML → JSON",
            icon: <IconConvert />,
            onClick: toJson,
          },
          {
            id: "from-json",
            label: "JSON → XML",
            icon: <IconConvert />,
            onClick: fromJson,
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
              setStatus(null);
            },
          },
        ]}
        extras={
          <label className="flex items-center gap-1.5">
            <span>Indent</span>
            <select
              value={indent}
              onChange={(e) => setIndent(e.target.value as XmlIndent)}
              className="rounded-[var(--radius)] border border-border bg-bg px-1.5 py-1 text-xs text-text"
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="tab">Tab</option>
            </select>
          </label>
        }
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".xml,.txt,.json,text/xml,application/xml,application/json,text/plain"
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
      {status && !error && (
        <p className="text-sm font-medium text-success">● {status}</p>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolTextPanel
          panelId="input"
          title="Input"
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
          stats={outStats}
          fullscreen={fullscreen}
          onToggleFullscreen={() =>
            setFullscreen((v) => (v === "output" ? null : "output"))
          }
        />
      </div>
      <p className="text-xs text-text-muted">
        Ctrl+Enter to format · Upload or drop .xml / .json / .txt on the input
        panel
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
