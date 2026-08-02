import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { absolutePublicUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms for using ${SITE_NAME} free browser-based developer tools.`,
};

export default async function TermsPage() {
  const siteUrl = await absolutePublicUrl("/");

  return (
    <article className="mx-auto max-w-[700px] px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">
        Terms &amp; Conditions
      </h1>
      <p className="mt-2 text-sm text-text-muted">Last updated: August 1, 2026</p>

      <div className="mt-8 space-y-8 text-text-muted">
        <p>
          These Terms govern your use of {SITE_NAME} at{" "}
          <a href={siteUrl} className="text-accent hover:underline">
            {siteUrl}
          </a>
          . By using the Service you agree to these Terms and our{" "}
          <Link href="/privacy" className="text-accent hover:underline">
            Privacy Policy
          </Link>
          .
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">License to use</h2>
          <p>
            We grant you a limited, non-exclusive, revocable license to use the
            public tools for personal or professional work. You may not copy the
            site&apos;s branding, scrape the Service in a way that harms
            availability, or present the Service as your own product.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">Your responsibilities</h2>
          <p>
            You are responsible for any content you paste into the editors or
            submit through forms. Verify tool output before relying on it in
            production systems. Do not use the Service to process unlawful
            content or to attack other systems.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">No warranty</h2>
          <p>
            The Service is provided free of charge on an &quot;as is&quot; and
            &quot;as available&quot; basis. We do not warrant that results will
            be error-free, complete, or suitable for a particular purpose, or
            that the site will always be online.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, {SITE_NAME} and its
            operators are not liable for indirect, incidental, or consequential
            damages arising from use of the tools or inability to use them,
            including data loss or business interruption.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">Admin access</h2>
          <p>
            Private admin routes are for authorized operators only. Attempts to
            access them without permission, or to abuse authentication, are
            prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">Changes</h2>
          <p>
            We may update these Terms as the product evolves. The date at the
            top will change when we do. Continued use after updates constitutes
            acceptance.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">Contact</h2>
          <p>
            Questions? Use the{" "}
            <Link href="/contact" className="text-accent hover:underline">
              Contact
            </Link>{" "}
            page.
          </p>
        </section>
      </div>
    </article>
  );
}
