import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "About json. — free, privacy-first developer tools that run entirely in your browser.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-[700px] px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">About json.</h1>
      <p className="mt-4 text-text-muted">
        json. is a small collection of free developer utilities focused on JSON
        and everyday encoding tasks. The goal is simple: fast tools, clean UX,
        and strong privacy defaults.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Client-side", value: "100%" },
          { label: "Server storage of JSON", value: "0" },
          { label: "Price", value: "Free" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-[var(--radius)] border border-border bg-surface p-4 text-center shadow-[var(--shadow)]"
          >
            <p className="text-2xl font-semibold text-accent">{stat.value}</p>
            <p className="mt-1 text-xs text-text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-semibold">Privacy-first by design</h2>
      <p className="mt-3 text-text-muted">
        Public tools process data in your browser with native APIs. We do not
        upload your JSON to our servers. Contact form messages are the only
        content intentionally sent to the backend.
      </p>

      <p className="mt-8">
        <Link href="/contact" className="text-accent hover:underline">
          Get in touch →
        </Link>
      </p>
    </article>
  );
}
