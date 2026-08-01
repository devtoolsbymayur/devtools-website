import Link from "next/link";

export function ToolSeoBlurb({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 max-w-3xl space-y-3 text-text">
      <h2 className="text-2xl font-semibold tracking-tight">{heading}</h2>
      <div className="space-y-3 text-text-muted">{children}</div>
      <p className="text-sm">
        Also try the{" "}
        <Link href="/" className="text-accent hover:underline">
          JSON formatter
        </Link>
        ,{" "}
        <Link href="/json-validator" className="text-accent hover:underline">
          JSON validator
        </Link>
        ,{" "}
        <Link href="/json-minifier" className="text-accent hover:underline">
          JSON minifier
        </Link>
        , or{" "}
        <Link href="/json-viewer" className="text-accent hover:underline">
          JSON viewer
        </Link>
        .
      </p>
    </section>
  );
}
