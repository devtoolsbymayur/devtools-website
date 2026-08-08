import Link from "next/link";

const QUICK_LINKS = [
  { href: "/json-validator", label: "JSON Validator" },
  { href: "/json-minifier", label: "JSON Minifier" },
  { href: "/json-viewer", label: "JSON Viewer" },
  { href: "/base64-encoder", label: "Base64 Encoder" },
  { href: "/jwt-decoder", label: "JWT Decoder" },
] as const;

export function NotFoundView() {
  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col items-center px-4 py-12 text-center sm:px-6 sm:py-16">
      <div className="mb-7 inline-block rounded-[var(--radius)] border border-border bg-surface p-5 text-left shadow-[var(--shadow)] sm:px-6">
        <pre className="font-mono text-[12.5px] leading-[1.7] sm:text-sm">
          <div>
            <span className="text-text-muted">{"{"}</span>
          </div>
          <div>
            {"  "}
            <span className="text-accent">&quot;status&quot;</span>
            <span className="text-text-muted">: </span>
            <span className="text-orange-600 dark:text-orange-400">404</span>
            <span className="text-text-muted">,</span>
          </div>
          <div>
            {"  "}
            <span className="text-accent">&quot;error&quot;</span>
            <span className="text-text-muted">: </span>
            <span className="text-green-600 dark:text-green-400">
              &quot;page_not_found&quot;
            </span>
            <span className="text-text-muted">,</span>
          </div>
          <div>
            {"  "}
            <span className="text-accent">&quot;path&quot;</span>
            <span className="text-text-muted">: </span>
            <span className="font-bold text-error">&quot;undefined&quot;</span>
          </div>
          <div>
            <span className="text-text-muted">{"}"}</span>
          </div>
        </pre>
      </div>

      <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-error-soft px-3 py-1 text-xs font-bold text-red-700 dark:text-red-300">
        <span aria-hidden="true">⚠</span>
        404 — Unexpected Token
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-[26px]">
        This page couldn&apos;t be parsed
      </h1>
      <p className="mt-2.5 max-w-md text-sm text-text-muted sm:text-[15px]">
        The page you&apos;re looking for doesn&apos;t exist, moved, or the URL
        has a typo. Let&apos;s get you back to something that works.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-[var(--radius)] bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          ← Back to JSON Formatter
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 rounded-[var(--radius)] border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text transition-colors hover:border-accent hover:text-accent"
        >
          Contact Us
        </Link>
      </div>

      <nav
        aria-label="Popular tools"
        className="mt-9 flex flex-wrap justify-center gap-2"
      >
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-border px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-accent hover:text-accent"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
