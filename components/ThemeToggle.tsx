"use client";

import { useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "@/lib/constants";

function applyTheme(next: "light" | "dark") {
  document.documentElement.classList.toggle("dark", next === "dark");
  localStorage.setItem(STORAGE_KEYS.theme, next);
  window.dispatchEvent(new Event("theme-change"));
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("theme-change", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener("theme-change", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getIsDark() {
  return document.documentElement.classList.contains("dark");
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getIsDark, () => false);

  return (
    <button
      type="button"
      title="Click here to switch between Light & Dark theme"
      aria-label="Click here to switch between Light & Dark theme"
      className="inline-flex h-9 items-center gap-1.5 rounded-[var(--radius)] border border-border bg-surface px-2.5 text-sm text-text transition-colors duration-150 hover:border-accent hover:text-accent"
      onClick={() => applyTheme(isDark ? "light" : "dark")}
    >
      <span aria-hidden="true">{isDark ? "☀️" : "🌙"}</span>
      <span className="hidden sm:inline">
        {isDark ? "Try Light Mode" : "Try Dark Mode"}
      </span>
    </button>
  );
}
