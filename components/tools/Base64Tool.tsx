"use client";

import { useState } from "react";
import { ToolTextPanel } from "@/components/tools/ToolTextPanel";
import { usePanelFullscreen } from "@/components/tools/usePanelFullscreen";
import { decodeBase64, encodeBase64 } from "@/lib/base64";
import { countLines } from "@/lib/json/format";

export function Base64Tool() {
  const [input, setInput] = useState("Hello, json.");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = usePanelFullscreen<"input" | "output">();

  function encode() {
    try {
      setOutput(encodeBase64(input));
      setError(null);
      setToast("Encoded");
    } catch {
      setError("Could not encode that text.");
    }
  }

  function decode() {
    try {
      setOutput(decodeBase64(input));
      setError(null);
      setToast("Decoded");
    } catch {
      setError("Invalid Base64 input.");
    }
  }

  async function copy() {
    const text = output || input;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setToast("Copied");
    } catch {
      setToast("Copy failed");
    }
  }

  return (
    <div className="space-y-4">
      <p className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success-soft px-3 py-1 text-xs font-medium text-success">
        Processed locally in your browser — never uploaded.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={encode}
          className="rounded-[var(--radius)] bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Encode
        </button>
        <button
          type="button"
          onClick={decode}
          className="rounded-[var(--radius)] border border-border px-3 py-2 text-sm hover:border-accent"
        >
          Decode
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
          onClick={() => {
            setInput("");
            setOutput("");
            setError(null);
          }}
          className="rounded-[var(--radius)] border border-border px-3 py-2 text-sm hover:border-accent"
        >
          Clear
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
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
