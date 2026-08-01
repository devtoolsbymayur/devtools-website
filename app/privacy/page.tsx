import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { absolutePublicUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles data for browser-based developer tools.`,
};

export default async function PrivacyPage() {
  const siteUrl = await absolutePublicUrl("/");

  return (
    <article className="mx-auto max-w-[700px] px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-text-muted">Last updated: August 1, 2026</p>

      <div className="mt-8 space-y-8 text-text-muted">
        <p>
          This Privacy Policy explains how {SITE_NAME} (&quot;we&quot;,
          &quot;us&quot;) handles information when you use{" "}
          <a href={siteUrl} className="text-accent hover:underline">
            {siteUrl}
          </a>{" "}
          and related pages (the &quot;Service&quot;). It applies only to this
          Service and reflects how our product actually works today.
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">
            What this Service is built for
          </h2>
          <p>
            {SITE_NAME} offers free developer utilities such as JSON formatting,
            validation, minifying, tree viewing, Base64 conversion, and JWT
            payload inspection. Most tool processing runs in your browser so
            your editor contents are not sent to our servers for those
            operations.
          </p>
          <p className="font-medium text-error">
            Do not paste passwords, API keys, private keys, tokens, or other
            secrets into any tool or form.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">
            Information we may collect
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-text">Contact form data</strong> — if you
              send a message, we store your name, email address, and message so
              we can reply.
            </li>
            <li>
              <strong className="text-text">Basic usage signals</strong> — we
              may record aggregated page-view counts (path + day) for our admin
              dashboard, and standard server or host logs such as IP address,
              user agent, and request timing for security and reliability.
            </li>
            <li>
              <strong className="text-text">Preference cookies</strong> — small
              values for theme (light/dark) and cookie-consent choice. These are
              not used to build advertising profiles by us.
            </li>
            <li>
              <strong className="text-text">Admin account data</strong> — if you
              are an authorized operator, we store your admin email and a hashed
              password for signing into the private admin area.
            </li>
          </ul>
          <p>
            Tool editor text (JSON, Base64, JWT strings, etc.) is processed
            locally in the browser for public tools and is not intentionally
            uploaded as part of those tool actions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">How we use data</h2>
          <p>We use the limited data above to:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Respond to contact requests</li>
            <li>Operate, secure, and improve the Service</li>
            <li>Understand which pages are used (aggregate counts)</li>
            <li>Remember UI preferences you choose</li>
            <li>Authenticate admin users</li>
          </ul>
          <p>
            We do not sell your personal information. We do not use public tool
            editor contents as a dataset for training models.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">
            Cookies and similar storage
          </h2>
          <p>
            We use browser storage/cookies for essential preferences (theme and
            consent). If you enable advertising later, third-party networks such
            as Google AdSense may set their own cookies under their policies. You
            can clear or block cookies in your browser; some preferences may
            reset.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">Advertising</h2>
          <p>
            Ad regions on the site are controlled from our admin panel. When an
            ad unit is enabled and a valid network snippet is configured on a
            live domain, that network may collect data according to its own
            terms. Review{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              className="text-accent hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              Google Advertising Privacy &amp; Terms
            </a>{" "}
            if Google ads are shown. On local development we only show layout
            placeholders — real ads are not served from localhost.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">
            Third-party services
          </h2>
          <p>
            Hosting, databases, and deployment providers (for example Vercel and
            Supabase, when used) may process technical data needed to run the
            Service under their own privacy terms. Open-source libraries we ship
            in the browser retain their respective licenses; using the Service
            does not transfer ownership of those libraries.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">Retention</h2>
          <p>
            Contact messages are kept until we handle them or you ask for
            removal. Aggregate page-view rows may be kept for operational
            reporting. Admin credentials remain while the account is active.
            Hosting logs follow the retention practices of our providers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">Your choices</h2>
          <p>
            To request deletion or correction of a contact submission, use the{" "}
            <Link href="/contact" className="text-accent hover:underline">
              Contact
            </Link>{" "}
            page and include enough detail for us to find the record (email used
            and approximate date). You may also clear local preferences from
            your browser.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">Security</h2>
          <p>
            We use HTTPS, security headers, rate limits on sensitive endpoints,
            sandboxed/controlled ad rendering where applicable, and hashed admin
            passwords. No online service can guarantee perfect security; please
            avoid sharing sensitive material with the tools.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">Children</h2>
          <p>
            The Service is aimed at general developer use and is not directed at
            children under 13. We do not knowingly collect personal information
            from children.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">Policy updates</h2>
          <p>
            We may revise this page when the product or our practices change.
            The &quot;Last updated&quot; date at the top will change when we do.
            Continued use after an update means you accept the revised policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">Contact</h2>
          <p>
            Questions about privacy for {SITE_NAME}? Reach us through the{" "}
            <Link href="/contact" className="text-accent hover:underline">
              Contact
            </Link>{" "}
            page. Related legal terms are in our{" "}
            <Link href="/terms" className="text-accent hover:underline">
              Terms &amp; Conditions
            </Link>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
