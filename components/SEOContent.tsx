import Link from "next/link";
import { FAQ_ITEMS } from "@/lib/constants";

export function SEOContent() {
  return (
    <section
      aria-labelledby="seo-heading"
      className="mt-12 space-y-10 text-text"
    >
      <div>
        <h2 id="seo-heading" className="text-2xl font-semibold tracking-tight">
          Free Online JSON Formatter
        </h2>
        <p className="mt-3 max-w-3xl text-text-muted">
          Need to <strong className="font-medium text-text">format JSON</strong>{" "}
          quickly? This free{" "}
          <strong className="font-medium text-text">JSON formatter</strong>{" "}
          (also called a JSON beautifier) turns compact or messy JSON into clean,
          readable structure with proper indentation. Use it to{" "}
          <strong className="font-medium text-text">format JSON online</strong>,
          validate syntax, minify payloads, and explore data in a tree view —
          all processed locally in your browser.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          How to Format JSON Online (Step by Step)
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-text-muted">
          <li>
            Paste JSON into the input editor, or drag &amp; drop / upload a{" "}
            <code className="text-text">.json</code> file.
          </li>
          <li>Choose indentation: 2 spaces, 4 spaces, or Tab.</li>
          <li>
            Click <strong className="font-medium text-text">Format</strong> (or
            press Ctrl+Enter) to beautify / pretty-print JSON instantly.
          </li>
          <li>
            Use <strong className="font-medium text-text">Validate</strong> if
            you only need to check whether the JSON format is valid.
          </li>
          <li>
            Switch to Tree view, search keys/values, then Copy or Download the
            result.
          </li>
        </ol>
      </div>

      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Why Use This JSON Formatter?
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-text-muted">
          <li>
            <strong className="font-medium text-text">Fast JSON format</strong>{" "}
            for API responses, config files, and logs
          </li>
          <li>
            Clear error messages with line/column when JSON is invalid
          </li>
          <li>
            Built-in{" "}
            <Link href="/json-validator" className="text-accent hover:underline">
              JSON validator
            </Link>
            ,{" "}
            <Link href="/json-minifier" className="text-accent hover:underline">
              JSON minifier
            </Link>
            , and{" "}
            <Link href="/json-viewer" className="text-accent hover:underline">
              JSON viewer
            </Link>
          </li>
          <li>Upload, drag-and-drop, copy, and download support</li>
          <li>
            Privacy-first: JSON is formatted in your browser and never uploaded
            for processing
          </li>
          <li>Works on desktop and mobile — no install required</li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Common JSON Format Use Cases
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-text-muted">
          <li>Pretty-print API JSON before debugging in Postman or code</li>
          <li>Beautify minified frontend/backend config JSON</li>
          <li>Validate JSON before sending it to an API or saving a file</li>
          <li>Minify JSON to reduce payload size for production</li>
          <li>Browse nested JSON objects and arrays in tree view</li>
        </ul>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Is this JSON format tool free?
          </h2>
          <p className="mt-2 text-text-muted">
            Yes. Format, validate, beautify, and minify JSON online for free —
            no signup and no install.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Is my JSON data safe?
          </h2>
          <p className="mt-2 text-text-muted">
            Yes. JSON formatting runs locally in your browser. We do not upload
            your JSON to our servers for the public tools.
          </p>
        </div>
      </div>
    </section>
  );
}

export function FAQ({
  items = FAQ_ITEMS,
  heading = "JSON Formatter FAQ",
}: {
  items?: readonly { question: string; answer: string }[];
  heading?: string;
}) {
  return (
    <section aria-labelledby="faq-heading" className="mt-12">
      <h2
        id="faq-heading"
        className="text-2xl font-semibold tracking-tight text-text"
      >
        {heading}
      </h2>
      <dl className="mt-6 space-y-4">
        {items.map((item) => (
          <div
            key={item.question}
            className="rounded-[var(--radius)] border border-border bg-surface p-4 shadow-[var(--shadow)]"
          >
            <dt className="font-medium text-text">{item.question}</dt>
            <dd className="mt-2 text-sm text-text-muted">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
