"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ParsedAdUnit } from "@/lib/ads";
import { onConsentChange, readConsent } from "@/lib/consent";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSenseUnit({
  unit,
  className = "",
}: {
  unit: ParsedAdUnit;
  label: string;
  className?: string;
}) {
  const pushed = useRef(false);
  const reactId = useId();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(readConsent() === "accepted");
    return onConsentChange((value) => setAllowed(value === "accepted"));
  }, []);

  useEffect(() => {
    if (!allowed || pushed.current) return;
    if (!unit.client.startsWith("ca-pub-") || !/^\d+$/.test(unit.slot)) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense may throw if blocked / unavailable
    }
  }, [allowed, unit.client, unit.slot, reactId]);

  if (!allowed) return null;
  if (!unit.client.startsWith("ca-pub-") || !/^\d+$/.test(unit.slot)) {
    return null;
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          minHeight: 90,
          ...(unit.style ? undefined : { width: "100%" }),
        }}
        data-ad-client={unit.client}
        data-ad-slot={unit.slot}
        data-ad-format={unit.format ?? "auto"}
        data-full-width-responsive={unit.fullWidthResponsive ?? "true"}
      />
    </div>
  );
}
