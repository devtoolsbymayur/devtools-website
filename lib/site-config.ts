import {
  FAQ_ITEMS,
  FOOTER_MORE_TOOLS,
  FOOTER_TOOLS,
  NAV_LINKS,
  RELATED_TOOLS,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from "@/lib/constants";
import { getPrisma } from "@/lib/prisma";

export type AdPlacement =
  | "below-header"
  | "between-tool-seo"
  | "sidebar"
  | "before-faq";

export type PublicTool = {
  toolKey: string;
  label: string;
  href: string;
  status: string;
  displayOrder: number;
};

export type PublicAdSlot = {
  placement: string;
  label: string;
  enabled: boolean;
  adUnitCode: string;
};

export type PublicSeo = {
  metaTitle: string;
  metaDescription: string;
  faqItems: { question: string; answer: string }[];
};

const NAV_KEYS = new Set([
  "json-formatter",
  "json-validator",
  "json-minifier",
  "json-viewer",
]);

const MORE_KEYS = new Set([
  "xml-formatter",
  "csv-to-json",
  "base64-encoder",
  "jwt-decoder",
  "url-encoder",
  "timestamp-converter",
]);

export async function getAdSlots(): Promise<PublicAdSlot[]> {
  const prisma = getPrisma();
  if (!prisma) return [];
  try {
    return await prisma.adSlot.findMany({
      select: {
        placement: true,
        label: true,
        enabled: true,
        adUnitCode: true,
      },
    });
  } catch {
    return [];
  }
}

export async function getAdSlot(
  placement: AdPlacement
): Promise<PublicAdSlot | null> {
  const slots = await getAdSlots();
  return slots.find((s) => s.placement === placement) ?? null;
}

export async function getPublicTools(): Promise<PublicTool[]> {
  const prisma = getPrisma();
  if (!prisma) {
    return fallbackTools();
  }
  try {
    const tools = await prisma.toolConfig.findMany({
      orderBy: { displayOrder: "asc" },
    });
    if (tools.length === 0) return fallbackTools();
    return tools;
  } catch {
    return fallbackTools();
  }
}

function fallbackTools(): PublicTool[] {
  return [
    ...NAV_LINKS.map((t, i) => ({
      toolKey: t.href === "/" ? "json-formatter" : t.href.slice(1),
      label: t.label,
      href: t.href,
      status: "live",
      displayOrder: i + 1,
    })),
    ...FOOTER_MORE_TOOLS.map((t, i) => ({
      toolKey: t.href.slice(1),
      label: t.label,
      href: t.href,
      status: "coming-soon",
      displayOrder: 10 + i,
    })),
    ...RELATED_TOOLS.filter(
      (t) =>
        !NAV_LINKS.some((n) => n.href === t.href) &&
        !FOOTER_MORE_TOOLS.some((n) => n.href === t.href)
    ).map((t, i) => ({
      toolKey: t.href.slice(1),
      label: t.label,
      href: t.href,
      status: "coming-soon",
      displayOrder: 20 + i,
    })),
  ];
}

export function splitTools(tools: PublicTool[]) {
  const visible = tools.filter((t) => t.status !== "hidden");
  const nav = visible.filter((t) => NAV_KEYS.has(t.toolKey));
  const more = visible.filter((t) => MORE_KEYS.has(t.toolKey));
  const related = visible;
  const footerTools =
    nav.length > 0
      ? nav
      : FOOTER_TOOLS.map((t, i) => ({
          toolKey: String(i),
          label: t.label,
          href: t.href,
          status: "live",
          displayOrder: i,
        }));
  return { nav, more, related, footerTools };
}

export async function getHomeSeo(): Promise<PublicSeo> {
  const prisma = getPrisma();
  const fallback: PublicSeo = {
    metaTitle: SITE_TITLE,
    metaDescription: SITE_DESCRIPTION,
    faqItems: FAQ_ITEMS.map((f) => ({
      question: f.question,
      answer: f.answer,
    })),
  };

  if (!prisma) return fallback;

  try {
    const row = await prisma.seoContent.findUnique({
      where: { pageKey: "home" },
    });
    if (!row) return fallback;

    const faqItems = Array.isArray(row.faqItems)
      ? (row.faqItems as { question?: string; answer?: string }[])
          .filter((i) => i?.question && i?.answer)
          .map((i) => ({
            question: String(i.question),
            answer: String(i.answer),
          }))
      : [];

    return {
      metaTitle: row.metaTitle || fallback.metaTitle,
      metaDescription: row.metaDescription || fallback.metaDescription,
      faqItems: faqItems.length > 0 ? faqItems : fallback.faqItems,
    };
  } catch {
    return fallback;
  }
}
