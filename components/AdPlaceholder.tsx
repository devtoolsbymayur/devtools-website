/** Dashed layout box used locally / when ads are not served. */
export function AdPlaceholder({
  label,
  note,
  className = "",
  minHeight = "90px",
}: {
  label: string;
  note?: string;
  className?: string;
  minHeight?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-[var(--radius)] border border-dashed border-border px-4 py-6 text-center text-xs text-text-muted ${className}`}
      style={{
        minHeight,
        background:
          "repeating-linear-gradient(45deg, transparent, transparent 10px, color-mix(in oklab, var(--border) 55%, transparent) 10px, color-mix(in oklab, var(--border) 55%, transparent) 20px)",
      }}
    >
      <span>
        Ad Space — {label}
        {note ? (
          <span className="mt-1 block opacity-70">{note}</span>
        ) : null}
      </span>
    </div>
  );
}
