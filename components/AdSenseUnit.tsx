"use client";

import Script from "next/script";
import { useEffect, useId, useRef } from "react";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import type { ParsedAdUnit } from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSenseUnit({
  unit,
  label,
  className = "",
}: {
  unit: ParsedAdUnit;
  label: string;
  className?: string;
}) {
  const pushed = useRef(false);
  const reactId = useId();

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense may throw if blocked / unavailable — leave empty slot
    }
  }, [unit.client, unit.slot, reactId]);

  if (!unit.client.startsWith("ca-pub-") || !/^\d+$/.test(unit.slot)) {
    return (
      <AdPlaceholder
        label={label}
        note="Invalid AdSense unit snippet (need data-ad-client + data-ad-slot)."
        className={className}
      />
    );
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <Script
        id={`adsbygoogle-${unit.client}`}
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(unit.client)}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          minHeight: 90,
          ...(unit.style
            ? undefined
            : { width: "100%" }),
        }}
        data-ad-client={unit.client}
        data-ad-slot={unit.slot}
        data-ad-format={unit.format ?? "auto"}
        data-full-width-responsive={unit.fullWidthResponsive ?? "true"}
      />
    </div>
  );
}
