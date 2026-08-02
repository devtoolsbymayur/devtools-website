"use client";

import { useEffect, useState } from "react";
import { getAdSenseClient } from "@/lib/adsense";
import { onConsentChange, readConsent } from "@/lib/consent";

const SCRIPT_ID = "adsense-init";

/**
 * Loads AdSense only after the user accepts cookies/ads.
 * Ownership still uses the google-adsense-account meta in root layout + ads.txt.
 */
export function ConsentAdSense() {
  const client = getAdSenseClient();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(readConsent() === "accepted");
    return onConsentChange((value) => setAllowed(value === "accepted"));
  }, []);

  useEffect(() => {
    if (!client || !allowed) return;
    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }, [client, allowed]);

  return null;
}
