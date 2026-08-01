"use client";

export function FullscreenButton({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={active ? "Exit fullscreen" : "Fullscreen"}
      aria-label={active ? "Exit fullscreen" : "Enter fullscreen"}
      className="inline-flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md border border-border bg-surface text-xs text-text-muted transition-colors hover:border-accent hover:text-accent"
    >
      {active ? "✕" : "⤢"}
    </button>
  );
}
