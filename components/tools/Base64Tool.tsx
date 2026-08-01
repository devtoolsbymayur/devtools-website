"use client";

import { useState } from "react";

function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function decodeBase64(text: string): string {
  const cleaned = text.replace(/\s+/g, "");
  const binary = atob(cleaned);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function Base64Tool() {
  const [input, setInput] = useState("Hello, json.");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

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
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Input</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={12}
            className="w-full rounded-[var(--radius)] border border-border bg-surface p-3 font-mono text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Output</span>
          <textarea
            value={output}
            readOnly
            rows={12}
            className="w-full rounded-[var(--radius)] border border-border bg-surface p-3 font-mono text-sm"
          />
        </label>
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
