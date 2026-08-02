import type { MetadataRoute } from "next";
import { ADMIN_BASE_PATH } from "@/lib/admin-path";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jsonformatter.local";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          `${ADMIN_BASE_PATH}`,
          `${ADMIN_BASE_PATH}/`,
          "/api/",
        ],
      },
      // AdSense crawlers — keep public pages crawlable
      {
        userAgent: "Mediapartners-Google",
        allow: "/",
      },
      {
        userAgent: "AdsBot-Google",
        allow: "/",
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
