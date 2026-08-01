"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ADMIN_BASE_PATH } from "@/lib/admin-path";

export function AnalyticsBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith(ADMIN_BASE_PATH)) return;
    const controller = new AbortController();
    void fetch("/api/analytics/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      signal: controller.signal,
      keepalive: true,
    }).catch(() => undefined);
    return () => controller.abort();
  }, [pathname]);

  return null;
}
