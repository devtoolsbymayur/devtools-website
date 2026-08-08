import { AnalyticsBeacon } from "@/components/AnalyticsBeacon";
import { ConsentBanner } from "@/components/ConsentBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { NotFoundView } from "@/components/NotFoundView";
import { getPublicTools, splitTools } from "@/lib/site-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  robots: { index: false, follow: true },
};

/** Global 404 — same Header/Footer as the rest of the site. */
export default async function GlobalNotFound() {
  const tools = await getPublicTools();
  const { nav, more, footerTools } = splitTools(tools);

  return (
    <>
      <Header navItems={nav.map((t) => ({ href: t.href, label: t.label }))} />
      <main className="hero-glow flex flex-1 items-center justify-center">
        <NotFoundView />
      </main>
      <Footer
        tools={footerTools.map((t) => ({ href: t.href, label: t.label }))}
        moreTools={more.map((t) => ({
          href: t.href,
          label: t.label,
          soon: t.status === "coming-soon",
        }))}
      />
      <ConsentBanner />
      <AnalyticsBeacon />
    </>
  );
}
