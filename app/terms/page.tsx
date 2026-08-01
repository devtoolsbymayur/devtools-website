import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using json. developer tools.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-[700px] px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">
        Terms & Conditions
      </h1>
      <p className="mt-2 text-sm text-text-muted">Last updated: August 1, 2026</p>

      <section className="mt-8 space-y-3 text-text-muted">
        <h2 className="text-xl font-semibold text-text">Use of the service</h2>
        <p>
          These tools are provided free of charge for personal and professional
          use. You are responsible for the data you paste into the editors and
          for verifying results before using them in production systems.
        </p>
      </section>

      <section className="mt-8 space-y-3 text-text-muted">
        <h2 className="text-xl font-semibold text-text">No warranty</h2>
        <p>
          The site is provided &quot;as is&quot; without warranties of any kind.
          We do not guarantee uninterrupted availability or that output will be
          free of errors for every input.
        </p>
      </section>

      <section className="mt-8 space-y-3 text-text-muted">
        <h2 className="text-xl font-semibold text-text">Acceptable use</h2>
        <p>
          Do not abuse the contact form, attempt to disrupt the service, or use
          the site for unlawful purposes.
        </p>
      </section>

      <section className="mt-8 space-y-3 text-text-muted">
        <h2 className="text-xl font-semibold text-text">Changes</h2>
        <p>
          We may update these terms as the product evolves. Continued use after
          changes means you accept the updated terms.
        </p>
      </section>
    </article>
  );
}
