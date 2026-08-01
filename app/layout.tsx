import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, JetBrains_Mono } from "next/font/google";
import { AdSenseScript } from "@/components/AdSenseScript";
import { AnalyticsBeacon } from "@/components/AnalyticsBeacon";
import { ConsentBanner } from "@/components/ConsentBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ThemeScript } from "@/components/ThemeScript";
import { ADMIN_BASE_PATH } from "@/lib/admin-path";
import { getAdSenseClient } from "@/lib/adsense";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from "@/lib/constants";
import { PRIMARY_KEYWORDS } from "@/lib/seo";
import { getPublicTools, splitTools } from "@/lib/site-config";
import "./globals.css";

const adsenseClient = getAdSenseClient();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://jsonformatter.local"
  ),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [...PRIMARY_KEYWORDS],
  applicationName: "json. JSON Format",
  category: "technology",
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: SITE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  // AdSense site ownership (HTML meta — works even if script is deferred)
  ...(adsenseClient
    ? { other: { "google-adsense-account": adsenseClient } }
    : {}),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isAdmin =
    pathname === ADMIN_BASE_PATH || pathname.startsWith(`${ADMIN_BASE_PATH}/`);

  // Admin shell has its own chrome — skip public nav DB fetch there.
  if (isAdmin) {
    return (
      <html
        lang="en"
        suppressHydrationWarning
        className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
      >
        <body className="flex min-h-full flex-col bg-bg text-text">
          <ThemeScript />
          <main className="flex-1">{children}</main>
        </body>
      </html>
    );
  }

  const tools = await getPublicTools();
  const { nav, more, footerTools } = splitTools(tools);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      {/* Real script tag in head — required for AdSense site ownership crawl */}
      <head>
        <AdSenseScript />
      </head>
      <body className="flex min-h-full flex-col bg-bg text-text">
        <ThemeScript />
        <Header navItems={nav.map((t) => ({ href: t.href, label: t.label }))} />
        <main className="flex-1">{children}</main>
        <Footer
          tools={footerTools.map((t) => ({ href: t.href, label: t.label }))}
          moreTools={more.map((t) => ({ href: t.href, label: t.label }))}
        />
        <ConsentBanner />
        <AnalyticsBeacon />
      </body>
    </html>
  );
}
