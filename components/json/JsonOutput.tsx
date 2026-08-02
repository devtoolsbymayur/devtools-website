"use client";

import { useState } from "react";
import { JsonEditor } from "@/components/json/JsonEditor";
import { JsonTree } from "@/components/json/JsonTree";
import { countKeys } from "@/lib/json/tree";

type ViewMode = "text" | "tree";

export function JsonOutput({
  text,
  parsed,
  defaultView = "text",
  treeOnly = false,
}: {
  text: string;
  parsed: unknown | null;
  defaultView?: ViewMode;
  treeOnly?: boolean;
}) {
  const [mode, setMode] = useState<ViewMode>(
    treeOnly ? "tree" : defaultView
  );
  const [search, setSearch] = useState("");
  const stats = parsed != null ? countKeys(parsed) : null;
  const activeMode = treeOnly ? "tree" : mode;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2">
        {!treeOnly && (
          <div
            role="tablist"
            aria-label="Output view"
            className="inline-flex rounded-[var(--radius)] border border-border p-0.5"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeMode === "text"}
              onClick={() => setMode("text")}
              className={`rounded-[calc(var(--radius)-2px)] px-3 py-1 text-xs font-medium transition-colors ${
                activeMode === "text"
                  ? "bg-accent text-white"
                  : "text-text-muted hover:text-text"
              }`}
            >
              Text view
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeMode === "tree"}
              onClick={() => setMode("tree")}
              disabled={parsed == null}
              className={`rounded-[calc(var(--radius)-2px)] px-3 py-1 text-xs font-medium transition-colors disabled:opacity-40 ${
                activeMode === "tree"
                  ? "bg-accent text-white"
                  : "text-text-muted hover:text-text"
              }`}
            >
              Tree view
            </button>
          </div>
        )}
        {activeMode === "tree" && (
          <label className="ml-auto flex min-w-[160px] flex-1 items-center gap-2 text-xs text-text-muted sm:max-w-xs">
            <span className="sr-only">Search JSON</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search JSON…"
              className="w-full rounded-[var(--radius)] border border-border bg-bg px-2 py-1.5 text-sm text-text"
            />
          </label>
        )}
        {stats && activeMode === "text" && (
          <span className="ml-auto text-xs text-text-muted">
            {stats.keys} keys · {stats.arrays} arrays
          </span>
        )}
        {stats && treeOnly && (
          <span className="text-xs text-text-muted">
            {stats.keys} keys · {stats.arrays} arrays
          </span>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        {activeMode === "text" || parsed == null ? (
          treeOnly && parsed == null ? (
            <p className="p-6 text-sm text-text-muted">
              Paste or upload valid JSON to explore the tree.
            </p>
          ) : (
            <JsonEditor value={text} onChange={() => {}} readOnly />
          )
        ) : (
          <JsonTree data={parsed} search={search} />
        )}
      </div>
    </div>
  );
}
