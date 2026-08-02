"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ADMIN_BASE_PATH } from "@/lib/admin-path";
import { readConsent, writeConsent, type ConsentValue } from "@/lib/consent";

export function ConsentBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pathname.startsWith(ADMIN_BASE_PATH)) return;
    const id = window.requestAnimationFrame(() => {
      setVisible(readConsent() === null);
    });
    return () => window.cancelAnimationFrame(id);
  }, [pathname]);

  if (pathname.startsWith(ADMIN_BASE_PATH) || !visible) return null;

  function decide(value: ConsentValue) {
    writeConsent(value);
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface p-4 shadow-[var(--shadow)]"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-muted">
          We use cookies for essential preferences (theme, consent) and, if you
          accept, analytics and ads. Your JSON is never uploaded.{" "}
          <a
            href="/privacy"
            className="text-accent underline-offset-2 hover:underline"
          >
            Privacy Policy
          </a>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide("rejected")}
            className="rounded-[var(--radius)] border border-border px-3 py-2 text-sm text-text transition-colors duration-150 hover:border-accent"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="rounded-[var(--radius)] bg-accent px-3 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-hover"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
