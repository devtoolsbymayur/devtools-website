"use client";

import type { JsonErrorInfo } from "@/lib/json/types";

export function ErrorMessage({
  error,
  onJump,
}: {
  error: JsonErrorInfo;
  onJump?: (line: number) => void;
}) {
  const canJump = Boolean(error.line && onJump);

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-[var(--radius)] border border-error bg-error-soft px-3 py-2.5 text-sm"
    >
      <svg
        className="mt-0.5 h-4 w-4 shrink-0 text-error"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
      </svg>
      <div className="min-w-0">
        <p className="font-medium text-error">Invalid JSON</p>
        <p className="mt-0.5 text-text">{error.message}</p>
        {(error.line || error.column) && (
          <p className="mt-1 text-text-muted">
            {error.line ? `Line ${error.line}` : null}
            {error.line && error.column ? ", " : null}
            {error.column ? `column ${error.column}` : null}
            {canJump ? (
              <>
                {" · "}
                <button
                  type="button"
                  className="font-medium text-accent underline-offset-2 hover:underline"
                  onClick={() => error.line && onJump?.(error.line)}
                >
                  Jump to line
                </button>
              </>
            ) : null}
          </p>
        )}
      </div>
    </div>
  );
}
