"use client";

import type { IndentStyle } from "@/lib/json/types";
import type { JsonToolMode, ToolAction } from "@/lib/json/modes";
import { TOOL_MODE_CONFIG } from "@/lib/json/modes";

type Props = {
  mode: JsonToolMode;
  indent: IndentStyle;
  autoFormat: boolean;
  busy: boolean;
  onIndentChange: (value: IndentStyle) => void;
  onAutoFormatChange: (value: boolean) => void;
  onFormat: () => void;
  onMinify: () => void;
  onValidate: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onClear: () => void;
  onUpload: () => void;
};

function ToolButton({
  children,
  onClick,
  primary,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-[var(--radius)] px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
        primary
          ? "bg-accent text-white hover:bg-accent-hover"
          : "border border-border bg-surface text-text hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}

const ACTION_META: Record<
  ToolAction,
  { label: string; icon: React.ReactNode }
> = {
  format: { label: "Format", icon: <IconWand /> },
  minify: { label: "Minify", icon: <IconCompress /> },
  validate: { label: "Validate", icon: <IconCheck /> },
  copy: { label: "Copy", icon: <IconCopy /> },
  download: { label: "Download", icon: <IconDownload /> },
  upload: { label: "Upload file", icon: <IconUpload /> },
  clear: { label: "Clear", icon: <IconTrash /> },
};

export function ToolBar(props: Props) {
  const config = TOOL_MODE_CONFIG[props.mode];
  const handlers: Record<ToolAction, () => void> = {
    format: props.onFormat,
    minify: props.onMinify,
    validate: props.onValidate,
    copy: props.onCopy,
    download: props.onDownload,
    upload: props.onUpload,
    clear: props.onClear,
  };

  return (
    <div className="flex flex-col gap-2 rounded-[var(--radius)] border border-border bg-surface p-2 shadow-[var(--shadow)]">
      <div className="flex flex-wrap items-center gap-1.5">
        {config.actions.map((action) => {
          const meta = ACTION_META[action];
          const isPrimary = action === config.primaryAction;
          const needsBusy =
            action === "format" ||
            action === "minify" ||
            action === "validate";
          return (
            <ToolButton
              key={action}
              label={meta.label}
              primary={isPrimary}
              disabled={needsBusy ? props.busy : false}
              onClick={handlers[action]}
            >
              {meta.icon} {meta.label.replace(" file", "")}
            </ToolButton>
          );
        })}
      </div>
      {(config.showIndent || config.showAutoFormat) && (
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {config.showIndent && (
            <label className="flex items-center gap-1.5 text-text-muted">
              <span>Indent</span>
              <select
                value={props.indent}
                onChange={(e) =>
                  props.onIndentChange(e.target.value as IndentStyle)
                }
                className="rounded-[var(--radius)] border border-border bg-bg px-1.5 py-1 text-xs text-text"
              >
                <option value="2">2 spaces</option>
                <option value="4">4 spaces</option>
                <option value="tab">Tab</option>
              </select>
            </label>
          )}
          {config.showAutoFormat && (
            <label className="flex items-center gap-1.5 text-text-muted">
              <input
                type="checkbox"
                checked={props.autoFormat}
                onChange={(e) => props.onAutoFormatChange(e.target.checked)}
                className="accent-[var(--accent)]"
              />
              Auto-format while typing
            </label>
          )}
        </div>
      )}
    </div>
  );
}

function IconWand() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" d="M15 4V2M15 16v-2M8 9H6M22 9h-2M18.36 5.64l1.42-1.42M8.22 15.78l-1.42 1.42M18.36 12.36l1.42 1.42M4 9l8 8 8-16z" />
    </svg>
  );
}
function IconCompress() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function IconCopy() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}
function IconDownload() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" d="M12 3v12M7 11l5 5 5-5M5 21h14" />
    </svg>
  );
}
function IconUpload() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" d="M12 21V9M7 13l5-5 5 5M5 21h14" />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
    </svg>
  );
}
