"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ADMIN_BASE_PATH } from "@/lib/admin-path";
import { NAV_LINKS } from "@/lib/constants";

type NavItem = { href: string; label: string };

export function Header({ navItems }: { navItems?: NavItem[] }) {
  const pathname = usePathname();
  const items = navItems && navItems.length > 0 ? navItems : [...NAV_LINKS];

  if (pathname.startsWith(ADMIN_BASE_PATH)) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-[var(--header-h)] max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
        <BrandLogo />

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 md:flex"
        >
          {items.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-[var(--radius)] px-3 py-1.5 text-sm transition-colors duration-150 ${
                  active
                    ? "bg-accent-soft font-medium text-accent"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
