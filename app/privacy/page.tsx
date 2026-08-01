import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for json. — free browser-based developer tools.",
};

export default function PrivacyPage() {
  const siteUrl = absoluteUrl("/");

  return (
    <article className="mx-auto max-w-[700px] px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-text-muted">Last updated: August 1, 2026</p>

      <div className="mt-8 space-y-8 text-text-muted">
        <p>
          json. (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;) operates the{" "}
          <a href={siteUrl} className="text-accent hover:underline">
            {siteUrl}
          </a>{" "}
          website (the &quot;Service&quot;).
        </p>
        <p>
          This page informs you of our policies regarding the collection, use
          and disclosure of Personal Information when you use our Service.
        </p>
        <p>
          We will not use or share your information with anyone except as
          described in this Privacy Policy.
        </p>
        <p>
          We use your Personal Information for providing and improving the
          Service. By using the Service, you agree to the collection and use of
          information in accordance with this policy. Unless otherwise defined
          in this Privacy Policy, terms used in this Privacy Policy have the
          same meanings as in our{" "}
          <Link href="/terms" className="text-accent hover:underline">
            Terms &amp; Conditions
          </Link>
          .
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">
            Browser-based tools
          </h2>
          <p>
            Public JSON and encoding tools process your data locally in your
            browser. Tool input is not uploaded to our servers for formatting,
            validation, viewing, Base64, or JWT decoding.
          </p>
          <p className="font-medium text-error">
            DO NOT PASTE SECRETS, PASSWORDS, PRIVATE KEYS, OR OTHER SENSITIVE
            DATA INTO ANY TOOL OR CONTACT FORM.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">
            Open Source Libraries
          </h2>
          <p>
            json. uses open-source libraries which may have their own licenses
            and copyright policies. It is the user&apos;s responsibility to
            ensure compliance with those terms when using the Service. If you
            believe we use a library incorrectly, please contact us and we will
            review and correct or remove the related code where appropriate.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">Contact messages</h2>
          <p>
            If you submit the Contact form, we store your name, email, and
            message so we can respond. If you want a contact submission removed,
            reach out via the{" "}
            <Link href="/contact" className="text-accent hover:underline">
              Contact
            </Link>{" "}
            page with enough detail for us to find the record.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">Log Data</h2>
          <p>
            We may collect information that your browser sends whenever you
            visit our Service (&quot;Log Data&quot;). This may include your
            Internet Protocol (&quot;IP&quot;) address, browser type and
            version, pages visited, visit time/date, time spent on pages, and
            similar statistics used to operate and secure the Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">Cookies</h2>
          <p>
            Cookies are small data files that may include an anonymous unique
            identifier. We use them to enhance user experience by remembering
            preferences such as theme and cookie consent. You can instruct your
            browser to refuse cookies or to indicate when a cookie is being
            sent.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">Security</h2>
          <p>
            The security of your Personal Information is important to us, but no
            method of transmission over the Internet or electronic storage is
            100% secure. We apply reasonable safeguards such as HTTPS, security
            headers, rate limiting on sensitive endpoints, and hashed admin
            credentials.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">
            Traffic Analytics
          </h2>
          <p>
            We may use privacy-conscious or third-party analytics (and our own
            aggregated page-view counters in the admin dashboard) to understand
            traffic, plan maintenance, and improve usability. Analytics providers
            may use cookies according to their own policies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">Advertising</h2>
          <p>
            If advertising is enabled, ad slots are controlled from our admin
            panel. Third-party networks such as Google AdSense may use cookies
            and collect data under their own terms. Please review{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              className="text-accent hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              Google&apos;s Advertising Privacy &amp; Terms
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">
            Changes To This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Changes are
            effective when posted on this page. Please review it periodically.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please{" "}
            <Link href="/contact" className="text-accent hover:underline">
              Contact Us
            </Link>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
