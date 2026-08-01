import Script from "next/script";
import { STORAGE_KEYS } from "@/lib/constants";

/** Inline script to apply theme before paint and avoid FOUC. */
export function ThemeScript() {
  const code = `(function(){try{var k=${JSON.stringify(STORAGE_KEYS.theme)};var t=localStorage.getItem(k);var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

  return (
    <Script id="theme-init" strategy="beforeInteractive">
      {code}
    </Script>
  );
}
