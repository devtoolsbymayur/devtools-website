import Link from "next/link";
import { getPublicTools, splitTools } from "@/lib/site-config";

export async function RelatedTools({
  currentPath,
}: {
  currentPath?: string;
}) {
  const tools = await getPublicTools();
  const { related } = splitTools(tools);
  const items = related
    .filter((tool) => tool.href !== currentPath)
    .sort((a, b) => {
      const aLive = a.status === "live" ? 0 : 1;
      const bLive = b.status === "live" ? 0 : 1;
      return aLive - bLive || a.displayOrder - b.displayOrder;
    });

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="related-tools-heading" className="mt-12">
      <h2
        id="related-tools-heading"
        className="mb-4 text-xl font-semibold tracking-tight text-text"
      >
        Related Developer Tools
      </h2>
      <ul className="flex flex-wrap gap-2">
        {items.map((tool) => (
          <li key={tool.toolKey}>
            <Link
              href={tool.href}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius)] border border-border bg-surface px-3 py-1.5 text-sm text-text-muted transition-colors duration-150 hover:border-accent hover:text-accent"
            >
              {tool.label}
              {tool.status === "coming-soon" && (
                <span className="text-[10px] uppercase tracking-wide text-text-muted/80">
                  soon
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
