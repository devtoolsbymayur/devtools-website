import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { JsonTool } from "@/components/json/JsonTool";
import { RelatedTools } from "@/components/RelatedTools";
import { FAQ, SEOContent } from "@/components/SEOContent";
import { getAdSlot, getHomeSeo } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getHomeSeo();
  return buildPageMetadata({
    title: seo.metaTitle,
    description: seo.metaDescription,
    path: "/",
  });
}

export default async function HomePage() {
  const seo = await getHomeSeo();
  const sidebarAd = await getAdSlot("sidebar");
  const showSidebar = Boolean(sidebarAd?.enabled);

  return (
    <>
      <JsonLd
        title={seo.metaTitle}
        description={seo.metaDescription}
        faqItems={seo.faqItems}
      />
      <div className="hero-glow">
        <div className="mx-auto max-w-[1200px] px-4 py-4 sm:px-6 sm:py-6">
          <AdSlot placement="below-header" className="mb-4" />

          <header className="mb-4 max-w-3xl">
            <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
              JSON Format Online — Formatter, Beautifier &amp; Validator
            </h1>
            <p className="mt-1.5 text-sm text-text-muted">
              Beautify, validate, and minify JSON in your browser — free &amp;
              private.
            </p>
          </header>

          <JsonTool mode="formatter" />

          <AdSlot placement="between-tool-seo" className="mt-10" />

          <div
            className={`mt-4 grid gap-8 ${
              showSidebar ? "lg:grid-cols-[minmax(0,1fr)_220px]" : "grid-cols-1"
            }`}
          >
            <div>
              <SEOContent />
              <AdSlot placement="before-faq" className="mt-10" />
              <FAQ items={seo.faqItems} />
              <RelatedTools />
            </div>
            {showSidebar ? (
              <div className="hidden lg:block">
                <div className="sticky top-24">
                  <AdSlot placement="sidebar" className="min-h-[250px]" />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
