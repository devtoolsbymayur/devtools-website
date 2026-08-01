"use client";

import { EditorView } from "@codemirror/view";
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { useEffect, useRef, useState } from "react";
import { ErrorMessage } from "@/components/json/ErrorMessage";
import { FullscreenButton } from "@/components/json/FullscreenButton";
import { JsonEditor } from "@/components/json/JsonEditor";
import { JsonErrorBoundary } from "@/components/json/ErrorBoundary";
import { JsonOutput } from "@/components/json/JsonOutput";
import { ToolBar } from "@/components/json/ToolBar";
import {
  AUTO_FORMAT_DEBOUNCE_MS,
  EXAMPLE_JSON,
  MAX_UPLOAD_BYTES,
  STORAGE_KEYS,
} from "@/lib/constants";
import {
  countLines,
  downloadText,
  readFileAsText,
} from "@/lib/json/format";
import type { JsonToolMode } from "@/lib/json/modes";
import { TOOL_MODE_CONFIG } from "@/lib/json/modes";
import type { IndentStyle, JsonErrorInfo } from "@/lib/json/types";
import { processJson } from "@/lib/json/worker-client";

type Status = "idle" | "valid" | "invalid";

function storageKeyForMode(mode: JsonToolMode): string {
  return `${STORAGE_KEYS.input}-${TOOL_MODE_CONFIG[mode].storageSuffix}`;
}

function JsonToolInner({ mode }: { mode: JsonToolMode }) {
  const config = TOOL_MODE_CONFIG[mode];
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState(EXAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [parsed, setParsed] = useState<unknown | null>(null);
  const [indent, setIndent] = useState<IndentStyle>("2");
  const [autoFormat, setAutoFormat] = useState(false);
  const [error, setError] = useState<JsonErrorInfo | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState<"input" | "output" | null>(
    null
  );
  const skipAutoRef = useRef(true);
  const persistReadyRef = useRef(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      let nextInput = EXAMPLE_JSON;
      try {
        const saved =
          localStorage.getItem(storageKeyForMode(mode)) ??
          (mode === "formatter"
            ? localStorage.getItem(STORAGE_KEYS.input)
            : null);
        const savedAuto = localStorage.getItem(STORAGE_KEYS.autoFormat);
        if (saved !== null) {
          nextInput = saved;
          setInput(saved);
        }
        if (mode === "formatter" && savedAuto === "1") setAutoFormat(true);
      } catch {
        /* ignore */
      }
      persistReadyRef.current = true;
      void processJson("validate", nextInput, "2").then((result) => {
        if (result.ok) {
          setParsed(result.parsed ?? null);
          setOutput(
            mode === "minifier"
              ? JSON.stringify(result.parsed)
              : nextInput
          );
          setStatus("valid");
          if (mode === "minifier" && result.parsed !== undefined) {
            setOutput(JSON.stringify(result.parsed));
          }
        }
      });
      window.setTimeout(() => {
        skipAutoRef.current = false;
      }, AUTO_FORMAT_DEBOUNCE_MS + 50);
    });
    return () => window.cancelAnimationFrame(id);
  }, [mode]);

  useEffect(() => {
    if (!persistReadyRef.current) return;
    try {
      localStorage.setItem(storageKeyForMode(mode), input);
    } catch {
      /* ignore */
    }
  }, [input, mode]);

  useEffect(() => {
    if (!persistReadyRef.current || mode !== "formatter") return;
    try {
      localStorage.setItem(STORAGE_KEYS.autoFormat, autoFormat ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [autoFormat, mode]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2000);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    document.body.classList.toggle("panel-open", fullscreen !== null);
    return () => document.body.classList.remove("panel-open");
  }, [fullscreen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && fullscreen) {
        e.preventDefault();
        setFullscreen(null);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (config.primaryAction === "format") void runFormat();
        else if (config.primaryAction === "minify") void runMinify();
        else void runValidate();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        clearAll();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, indent, mode, fullscreen]);

  useEffect(() => {
    if (mode !== "formatter" || !autoFormat || skipAutoRef.current) {
      return;
    }
    const handle = window.setTimeout(() => {
      void runFormat({ silent: true });
    }, AUTO_FORMAT_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, indent, autoFormat, mode]);

  async function runFormat(opts?: { silent?: boolean }) {
    if (!input.trim()) {
      setError({ message: "Paste or type JSON to format." });
      setStatus("invalid");
      return;
    }
    setBusy(true);
    const result = await processJson("format", input, indent);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      setStatus("invalid");
      setParsed(null);
      return;
    }
    skipAutoRef.current = true;
    setInput(result.result);
    setOutput(result.result);
    setParsed(result.parsed ?? null);
    setError(null);
    setStatus("valid");
    if (!opts?.silent) setToast("Formatted");
  }

  async function runMinify() {
    if (!input.trim()) {
      setError({ message: "Paste or type JSON to minify." });
      setStatus("invalid");
      return;
    }
    setBusy(true);
    const result = await processJson("minify", input, indent);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      setStatus("invalid");
      setParsed(null);
      return;
    }
    skipAutoRef.current = true;
    if (mode === "minifier") {
      setOutput(result.result);
    } else {
      setInput(result.result);
      setOutput(result.result);
    }
    setParsed(result.parsed ?? null);
    setError(null);
    setStatus("valid");
    setToast("Minified");
  }

  async function runValidate() {
    if (!input.trim()) {
      setError({ message: "Paste or type JSON to validate." });
      setStatus("invalid");
      return;
    }
    setBusy(true);
    const result = await processJson("validate", input, indent);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      setStatus("invalid");
      setParsed(null);
      return;
    }
    setParsed(result.parsed ?? null);
    setOutput(input);
    setError(null);
    setStatus("valid");
    setToast("Valid JSON");
  }

  async function copyOutput() {
    const text = output || input;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setToast("Copied");
    } catch {
      setToast("Copy failed");
    }
  }

  function downloadOutput() {
    const text = output || input;
    if (!text) return;
    downloadText(
      mode === "minifier" ? "minified.json" : "formatted.json",
      text
    );
    setToast("Downloaded");
  }

  function clearAll() {
    skipAutoRef.current = true;
    setInput("");
    setOutput("");
    setParsed(null);
    setError(null);
    setStatus("idle");
  }

  async function handleFile(file: File) {
    const name = file.name.toLowerCase();
    if (!name.endsWith(".json") && !name.endsWith(".txt")) {
      setError({ message: "Only .json or .txt files are allowed." });
      setStatus("invalid");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError({ message: "File is too large. Maximum size is 10MB." });
      setStatus("invalid");
      return;
    }
    try {
      const text = await readFileAsText(file);
      skipAutoRef.current = true;
      setInput(text);
      setOutput("");
      setParsed(null);
      setError(null);
      setStatus("idle");
      setToast(`Loaded ${file.name}`);
      const result = await processJson("validate", text, indent);
      if (result.ok) {
        setParsed(result.parsed ?? null);
        setOutput(
          mode === "minifier" ? JSON.stringify(result.parsed) : text
        );
        setStatus("valid");
      }
    } catch {
      setError({ message: "Could not read that file." });
      setStatus("invalid");
    }
  }

  function jumpToLine(line: number) {
    const view = editorRef.current?.view;
    if (!view) return;
    const doc = view.state.doc;
    const safeLine = Math.min(Math.max(line, 1), doc.lines);
    const lineObj = doc.line(safeLine);
    view.dispatch({
      selection: { anchor: lineObj.from },
      effects: EditorView.scrollIntoView(lineObj.from, { y: "center" }),
    });
    view.focus();
  }

  const charCount = input.length;
  const lineCount = countLines(input);
  const outText = output || input;
  const treeOnly = mode === "viewer";
  const showOutput = config.showOutputPanel;

  return (
    <div className="space-y-4">
      <p className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success-soft px-3 py-1 text-xs font-medium text-success">
        <span aria-hidden="true">●</span>
        Your JSON is processed locally in your browser and is never uploaded to
        our server.
      </p>

      <ToolBar
        mode={mode}
        indent={indent}
        autoFormat={autoFormat}
        busy={busy}
        onIndentChange={setIndent}
        onAutoFormatChange={setAutoFormat}
        onFormat={() => void runFormat()}
        onMinify={() => void runMinify()}
        onValidate={() => void runValidate()}
        onCopy={() => void copyOutput()}
        onDownload={downloadOutput}
        onClear={clearAll}
        onUpload={() => fileInputRef.current?.click()}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.txt,application/json,text/plain"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />

      {error && <ErrorMessage error={error} onJump={jumpToLine} />}

      {mode === "validator" && status === "valid" && !error && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-[var(--radius)] border border-success bg-success-soft px-3 py-2.5 text-sm"
        >
          <span className="font-medium text-success">Valid JSON</span>
          <span className="text-text-muted">
            {charCount.toLocaleString()} characters · {lineCount} lines — no
            syntax errors found.
          </span>
        </div>
      )}

      <div
        className={`grid gap-4 ${
          showOutput ? "lg:grid-cols-2" : "grid-cols-1"
        }`}
      >
        <section
          className={`overflow-hidden rounded-[var(--radius)] border border-border bg-surface shadow-[var(--shadow)] ${
            fullscreen === "input" ? "panel-fullscreen" : ""
          }`}
        >
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <h2 className="text-sm font-medium text-text">Input</h2>
            <div className="flex items-center gap-3 text-xs text-text-muted">
              <span>
                {charCount.toLocaleString()} chars · {lineCount} lines
              </span>
              <StatusBadge status={status} />
              <span className="hidden sm:inline">{config.shortcutHint}</span>
              <FullscreenButton
                active={fullscreen === "input"}
                onToggle={() =>
                  setFullscreen((v) => (v === "input" ? null : "input"))
                }
              />
            </div>
          </div>
          <div className={fullscreen === "input" ? "panel-fullscreen-body" : ""}>
            <JsonEditor
              ref={editorRef}
              value={input}
              onChange={setInput}
              onDropFile={(file) => void handleFile(file)}
            />
          </div>
        </section>

        {showOutput && (
          <section
            className={`overflow-hidden rounded-[var(--radius)] border border-border bg-surface shadow-[var(--shadow)] ${
              fullscreen === "output" ? "panel-fullscreen" : ""
            }`}
          >
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <h2 className="text-sm font-medium text-text">
                {treeOnly
                  ? "Tree view"
                  : mode === "minifier"
                    ? "Minified"
                    : "Output"}
              </h2>
              <div className="flex items-center gap-3 text-xs text-text-muted">
                <span>
                  {mode === "minifier"
                    ? `${outText.length.toLocaleString()} chars (was ${charCount.toLocaleString()})`
                    : `${outText.length.toLocaleString()} chars`}
                </span>
                <FullscreenButton
                  active={fullscreen === "output"}
                  onToggle={() =>
                    setFullscreen((v) => (v === "output" ? null : "output"))
                  }
                />
              </div>
            </div>
            <div
              className={
                fullscreen === "output" ? "panel-fullscreen-body" : ""
              }
            >
              <JsonOutput
                text={outText}
                parsed={parsed}
                defaultView={config.defaultOutputView}
                treeOnly={treeOnly}
              />
            </div>
          </section>
        )}
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 rounded-full bg-text px-4 py-2 text-sm text-bg shadow-[var(--shadow)]"
        >
          {toast}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  if (status === "valid") {
    return (
      <span className="inline-flex items-center gap-1 font-medium text-success">
        <span aria-hidden="true">✓</span> Valid JSON
      </span>
    );
  }
  if (status === "invalid") {
    return (
      <span className="inline-flex items-center gap-1 font-medium text-error">
        <span aria-hidden="true">!</span> Invalid
      </span>
    );
  }
  return <span>Ready</span>;
}

export function JsonTool({ mode = "formatter" }: { mode?: JsonToolMode }) {
  return (
    <JsonErrorBoundary>
      <JsonToolInner mode={mode} />
    </JsonErrorBoundary>
  );
}
