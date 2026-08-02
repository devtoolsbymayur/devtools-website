import { AnalyticsBeacon } from "@/components/AnalyticsBeacon";
import { ConsentBanner } from "@/components/ConsentBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getPublicTools, splitTools } from "@/lib/site-config";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tools = await getPublicTools();
  const { nav, more, footerTools } = splitTools(tools);

  return (
    <>
      <Header navItems={nav.map((t) => ({ href: t.href, label: t.label }))} />
      <main className="flex-1">{children}</main>
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
