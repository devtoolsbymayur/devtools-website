"use client";

import { useState } from "react";

function decodePart(part: string): unknown {
  const padded = part.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const json = atob(padded + pad);
  return JSON.parse(json) as unknown;
}

export function JwtTool() {
  const [token, setToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  );
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [error, setError] = useState<string | null>(null);

  function decode() {
    try {
      const parts = token.trim().split(".");
      if (parts.length < 2) {
        throw new Error("JWT must have at least header and payload parts.");
      }
      setHeader(JSON.stringify(decodePart(parts[0]), null, 2));
      setPayload(JSON.stringify(decodePart(parts[1]), null, 2));
      setError(null);
    } catch (e) {
      setHeader("");
      setPayload("");
      setError(e instanceof Error ? e.message : "Could not decode JWT.");
    }
  }

  return (
    <div className="space-y-4">
      <p className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success-soft px-3 py-1 text-xs font-medium text-success">
        Decoded locally — signature is not verified.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={decode}
          className="rounded-[var(--radius)] bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Decode
        </button>
        <button
          type="button"
          onClick={() => {
            setToken("");
            setHeader("");
            setPayload("");
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
      <label className="block">
        <span className="mb-2 block text-sm font-medium">JWT</span>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={5}
          className="w-full rounded-[var(--radius)] border border-border bg-surface p-3 font-mono text-sm"
        />
      </label>
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Header</span>
          <textarea
            value={header}
            readOnly
            rows={10}
            className="w-full rounded-[var(--radius)] border border-border bg-surface p-3 font-mono text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Payload</span>
          <textarea
            value={payload}
            readOnly
            rows={10}
            className="w-full rounded-[var(--radius)] border border-border bg-surface p-3 font-mono text-sm"
          />
        </label>
      </div>
    </div>
  );
}
