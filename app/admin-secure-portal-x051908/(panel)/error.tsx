"use client";

export default function AdminPanelError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="text-xl font-semibold">Admin page failed to load</h1>
      <p className="mt-2 text-sm text-text-muted">
        Usually a brief database timeout. Wait a second and try again.
      </p>
      {error.message && (
        <p className="mt-3 break-words font-mono text-xs text-error">
          {error.message}
        </p>
      )}
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-[var(--radius)] bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
      >
        Retry
      </button>
    </div>
  );
}
