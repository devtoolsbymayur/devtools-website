import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const DEFAULT_ADS = [
  { placement: "below-header", label: "Below Header" },
  { placement: "between-tool-seo", label: "Between Tool & SEO Content" },
  { placement: "sidebar", label: "Sidebar" },
  { placement: "before-faq", label: "Before FAQ" },
];

const DEFAULT_TOOLS = [
  { toolKey: "json-formatter", label: "JSON Formatter", href: "/", status: "live", displayOrder: 1 },
  { toolKey: "json-validator", label: "JSON Validator", href: "/json-validator", status: "live", displayOrder: 2 },
  { toolKey: "json-minifier", label: "JSON Minifier", href: "/json-minifier", status: "live", displayOrder: 3 },
  { toolKey: "json-viewer", label: "JSON Viewer", href: "/json-viewer", status: "live", displayOrder: 4 },
  { toolKey: "xml-formatter", label: "XML Formatter", href: "/xml-formatter", status: "coming-soon", displayOrder: 5 },
  { toolKey: "csv-to-json", label: "CSV to JSON", href: "/csv-to-json", status: "coming-soon", displayOrder: 6 },
  { toolKey: "base64-encoder", label: "Base64 Encoder", href: "/base64-encoder", status: "live", displayOrder: 7 },
  { toolKey: "jwt-decoder", label: "JWT Decoder", href: "/jwt-decoder", status: "live", displayOrder: 8 },
  { toolKey: "url-encoder", label: "URL Encoder", href: "/url-encoder", status: "coming-soon", displayOrder: 9 },
  { toolKey: "timestamp-converter", label: "Timestamp Converter", href: "/timestamp-converter", status: "coming-soon", displayOrder: 10 },
];

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Admin@123";
  const passwordHash = await hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, role: "admin" },
  });

  for (const ad of DEFAULT_ADS) {
    await prisma.adSlot.upsert({
      where: { placement: ad.placement },
      update: { label: ad.label },
      create: { ...ad, enabled: false, adUnitCode: "" },
    });
  }

  for (const tool of DEFAULT_TOOLS) {
    await prisma.toolConfig.upsert({
      where: { toolKey: tool.toolKey },
      update: {
        label: tool.label,
        href: tool.href,
        status: tool.status,
        displayOrder: tool.displayOrder,
      },
      create: tool,
    });
  }

  await prisma.seoContent.upsert({
    where: { pageKey: "home" },
    update: {
      metaTitle:
        "JSON Formatter Online — Beautify, Validate & Minify JSON",
      metaDescription:
        "Free online JSON formatter & validator. Paste or upload JSON, beautify, minify, and fix errors by line — processed locally in your browser. No signup required.",
    },
    create: {
      pageKey: "home",
      metaTitle:
        "JSON Formatter Online — Beautify, Validate & Minify JSON",
      metaDescription:
        "Free online JSON formatter & validator. Paste or upload JSON, beautify, minify, and fix errors by line — processed locally in your browser. No signup required.",
      faqItems: [],
    },
  });

  console.log(`Seeded admin: ${email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
