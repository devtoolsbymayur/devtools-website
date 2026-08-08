"use client";

import { useEffect, useState } from "react";

/** Panel fullscreen state + Escape / body scroll lock (matches JsonTool). */
export function usePanelFullscreen<T extends string>() {
  const [fullscreen, setFullscreen] = useState<T | null>(null);

  useEffect(() => {
    document.body.classList.toggle("panel-open", fullscreen !== null);
    return () => {
      document.body.classList.remove("panel-open");
    };
  }, [fullscreen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setFullscreen(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return [fullscreen, setFullscreen] as const;
}
