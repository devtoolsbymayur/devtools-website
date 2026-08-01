import { AdSlot } from "@/components/AdSlot";
import { RelatedTools } from "@/components/RelatedTools";

export function SimpleToolPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="hero-glow">
      <div className="mx-auto max-w-[1200px] px-4 py-4 sm:px-6 sm:py-6">
        <AdSlot placement="below-header" className="mb-4" />
        <header className="mb-4 max-w-3xl">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-text-muted">{subtitle}</p>
        </header>
        {children}
        <AdSlot placement="between-tool-seo" className="mt-10" />
        <RelatedTools />
      </div>
    </div>
  );
}
