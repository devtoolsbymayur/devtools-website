"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { ADMIN_BASE_PATH } from "@/lib/admin-path";
import {
  FOOTER_COMPANY,
  FOOTER_MORE_TOOLS,
  FOOTER_TOOLS,
  SITE_NAME,
} from "@/lib/constants";

type NavItem = { href: string; label: string };

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly NavItem[];
}) {
  if (links.length === 0) return null;
  return (
    <div>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
        {title}
      </h2>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-text-muted transition-colors duration-150 hover:text-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({
  tools,
  moreTools,
}: {
  tools?: NavItem[];
  moreTools?: NavItem[];
}) {
  const pathname = usePathname();
  const year = new Date().getFullYear();
  const toolLinks = tools && tools.length > 0 ? tools : [...FOOTER_TOOLS];
  const moreLinks =
    moreTools && moreTools.length > 0 ? moreTools : [...FOOTER_MORE_TOOLS];

  if (pathname.startsWith(ADMIN_BASE_PATH)) {
    return null;
  }

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div>
          <BrandLogo size="sm" />
          <p className="mt-3 max-w-[220px] text-sm text-text-muted">
            Free online developer tools. Format, validate, and explore JSON
            entirely in your browser.
          </p>
        </div>
        <FooterColumn title="Tools" links={toolLinks} />
        <FooterColumn title="More Tools" links={moreLinks} />
        <FooterColumn title="Company" links={FOOTER_COMPANY} />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-4 py-4 text-center text-xs text-text-muted sm:px-6">
          <p>
            © {year} {SITE_NAME} — Free online developer tools. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
