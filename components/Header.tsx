"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NAV_LINKS } from "@/lib/constants";

type NavItem = { href: string; label: string };

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Header({ navItems }: { navItems?: NavItem[] }) {
  const pathname = usePathname();
  const items = navItems && navItems.length > 0 ? navItems : [...NAV_LINKS];
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-[var(--header-h)] max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
        <BrandLogo />

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 md:flex"
        >
          {items.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-[var(--radius)] px-3 py-1.5 text-sm transition-colors duration-150 ${
                isActive(pathname, link.href)
                  ? "bg-accent-soft font-medium text-accent"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius)] border border-border bg-surface text-text md:hidden"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" className="text-lg leading-none">
              {open ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div
          id={panelId}
          className="border-t border-border bg-bg md:hidden"
        >
          <nav aria-label="Mobile" className="mx-auto max-w-[1200px] px-4 py-3">
            <ul className="flex flex-col gap-1">
              {items.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block rounded-[var(--radius)] px-3 py-2.5 text-sm transition-colors duration-150 ${
                      isActive(pathname, link.href)
                        ? "bg-accent-soft font-medium text-accent"
                        : "text-text-muted hover:bg-surface hover:text-text"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
