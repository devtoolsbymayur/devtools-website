"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ADMIN_BASE_PATH } from "@/lib/admin-path";
import { onConsentChange, readConsent } from "@/lib/consent";
import { STORAGE_KEYS } from "@/lib/constants";

function getOrCreateVisitorId(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEYS.visitorId);
    if (existing && /^[a-zA-Z0-9_-]{8,64}$/.test(existing)) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID().replaceAll("-", "")
        : `v${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(STORAGE_KEYS.visitorId, id);
    return id;
  } catch {
    return `anon${Date.now().toString(36)}`;
  }
}

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
        body: JSON.stringify({
          path: pathname,
          visitorId: getOrCreateVisitorId(),
          language:
            typeof navigator !== "undefined" ? navigator.language : undefined,
          timezone:
            typeof Intl !== "undefined"
              ? Intl.DateTimeFormat().resolvedOptions().timeZone
              : undefined,
        }),
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
