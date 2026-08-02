import { AdSlot } from "@/components/AdSlot";
import { JsonTool } from "@/components/json/JsonTool";
import { RelatedTools } from "@/components/RelatedTools";
import type { JsonToolMode } from "@/lib/json/modes";

export function ToolPage({
  mode,
  title,
  subtitle,
  currentPath,
  children,
}: {
  mode: JsonToolMode;
  title: string;
  subtitle: string;
  currentPath?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="hero-glow">
      <div className="mx-auto max-w-[1200px] px-4 py-4 sm:px-6 sm:py-6">
        <AdSlot placement="below-header" className="mb-4" />

        <header className="mb-4 max-w-3xl">
          <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
            {title}
          </h1>
          <p className="mt-1.5 text-sm text-text-muted">{subtitle}</p>
        </header>

        <JsonTool mode={mode} />

        <AdSlot placement="between-tool-seo" className="mt-10" />
        {children}
        <RelatedTools currentPath={currentPath} />
      </div>
    </div>
  );
}
