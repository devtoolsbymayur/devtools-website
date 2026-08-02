"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ADMIN_BASE_PATH } from "@/lib/admin-path";
import { onConsentChange, readConsent } from "@/lib/consent";

export function AnalyticsBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith(ADMIN_BASE_PATH)) return;

    let controller: AbortController | undefined;

    function track() {
      if (readConsent() !== "accepted") return;
      controller?.abort();
      controller = new AbortController();
      void fetch("/api/analytics/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathname }),
        signal: controller.signal,
        keepalive: true,
      }).catch(() => undefined);
    }

    if (readConsent() === "accepted") track();
    const unsubscribe = onConsentChange((value) => {
      if (value === "accepted") track();
    });

    return () => {
      unsubscribe();
      controller?.abort();
    };
  }, [pathname]);

  return null;
}
