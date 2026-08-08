"use client";

import type { ReactNode } from "react";

export type ToolBarAction = {
  id: string;
  label: string;
  onClick: () => void;
  primary?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
};

/** Same button chrome as JSON formatter ToolBar. */
export function ToolActionBar({
  actions,
  extras,
}: {
  actions: ToolBarAction[];
  extras?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-[var(--radius)] border border-border bg-surface p-2 shadow-[var(--shadow)]">
      <div className="flex flex-wrap items-center gap-1.5">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            aria-label={action.label}
            title={action.label}
            disabled={action.disabled}
            onClick={action.onClick}
            className={`inline-flex items-center gap-1 rounded-[var(--radius)] px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
              action.primary
                ? "bg-accent text-white hover:bg-accent-hover"
                : "border border-border bg-surface text-text hover:border-accent hover:text-accent"
            }`}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
      {extras ? (
        <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
          {extras}
        </div>
      ) : null}
    </div>
  );
}

export function IconWand() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" d="M15 4V2M15 16v-2M8 9H6M22 9h-2M18.36 5.64l1.42-1.42M8.22 15.78l-1.42 1.42M18.36 12.36l1.42 1.42M4 9l8 8 8-16z" />
    </svg>
  );
}
export function IconCompress() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" />
    </svg>
  );
}
export function IconCheck() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" />
    </svg>
  );
}
export function IconCopy() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}
export function IconDownload() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" d="M12 3v12M7 11l5 5 5-5M5 21h14" />
    </svg>
  );
}
export function IconUpload() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" d="M12 21V9M7 13l5-5 5 5M5 21h14" />
    </svg>
  );
}
export function IconTrash() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
    </svg>
  );
}
export function IconSwap() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h11l-3-3M17 17H6l3 3" />
    </svg>
  );
}
export function IconConvert() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M17 8l-3-3M17 8l-3 3M17 16H7M7 16l3-3M7 16l3 3" />
    </svg>
  );
}