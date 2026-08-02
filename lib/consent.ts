import { STORAGE_KEYS } from "@/lib/constants";

export type ConsentValue = "accepted" | "rejected";

export const CONSENT_EVENT = "json-formatter-consent";

export function readConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(STORAGE_KEYS.consent);
    if (value === "accepted" || value === "rejected") return value;
  } catch {
    /* private mode */
  }
  return null;
}

export function writeConsent(value: ConsentValue): void {
  try {
    localStorage.setItem(STORAGE_KEYS.consent, value);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(
    new CustomEvent(CONSENT_EVENT, { detail: { value } })
  );
}

export function onConsentChange(
  callback: (value: ConsentValue | null) => void
): () => void {
  const handler = (event: Event) => {
    const detail = (event as CustomEvent<{ value: ConsentValue }>).detail;
    callback(detail?.value ?? readConsent());
  };
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}
