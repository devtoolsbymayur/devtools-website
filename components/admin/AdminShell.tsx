import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ADMIN_BASE_PATH, adminPath } from "@/lib/admin-path";

const NAV = [
  { href: adminPath(), label: "Dashboard" },
  { href: adminPath("/visitors"), label: "Visitors" },
  { href: adminPath("/contacts"), label: "Contacts" },
  { href: adminPath("/ads"), label: "Ads" },
  { href: adminPath("/tools"), label: "Tools" },
  { href: adminPath("/seo"), label: "SEO" },
  { href: adminPath("/users"), label: "Users" },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <div className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center gap-4">
            <BrandLogo href={ADMIN_BASE_PATH} size="sm" />
            <span className="rounded bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
              Admin
            </span>
            <nav className="flex flex-wrap items-center gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-[var(--radius)] px-2.5 py-1.5 text-sm text-text-muted hover:bg-accent-soft hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <ThemeToggle />
            <Link href="/" className="text-text-muted hover:text-accent">
              View site
            </Link>
            <Link
              href="/api/auth/signout"
              className="rounded-[var(--radius)] border border-border px-3 py-1.5 text-text hover:border-accent"
            >
              Sign out
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
