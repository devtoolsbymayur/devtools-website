"use client";

import { FullscreenButton } from "@/components/json/FullscreenButton";

export function ToolTextPanel({
  panelId,
  title,
  value,
  onChange,
  readOnly,
  stats,
  fullscreen,
  onToggleFullscreen,
  placeholder,
  breakAll,
  onDropFile,
}: {
  panelId: string;
  title: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  stats?: string;
  fullscreen: string | null;
  onToggleFullscreen: () => void;
  placeholder?: string;
  breakAll?: boolean;
  /** Drag & drop file onto this panel (JSON formatter style). */
  onDropFile?: (file: File) => void;
}) {
  const active = fullscreen === panelId;

  return (
    <section
      className={`overflow-hidden rounded-[var(--radius)] border border-border bg-surface shadow-[var(--shadow)] ${
        active ? "panel-fullscreen" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <h2 className="text-sm font-medium text-text">{title}</h2>
        <div className="flex items-center gap-3 text-xs text-text-muted">
          {stats ? <span className="hidden sm:inline">{stats}</span> : null}
          <FullscreenButton active={active} onToggle={onToggleFullscreen} />
        </div>
      </div>
      <div
        className={`json-panel-body${active ? " panel-fullscreen-body" : ""}`}
        onDragOver={(e) => {
          if (!onDropFile) return;
          e.preventDefault();
        }}
        onDrop={(e) => {
          if (!onDropFile) return;
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) onDropFile(file);
        }}
      >
        <textarea
          aria-label={title}
          value={value}
          onChange={
            onChange && !readOnly
              ? (e) => onChange(e.target.value)
              : undefined
          }
          readOnly={readOnly}
          placeholder={placeholder}
          spellCheck={false}
          className={`h-full w-full resize-none border-0 bg-transparent p-3 font-mono text-sm text-text outline-none ${
            breakAll ? "break-all" : ""
          }`}
        />
      </div>
    </section>
  );
}
