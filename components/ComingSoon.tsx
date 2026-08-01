import Link from "next/link";

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-16 text-center sm:px-6">
      <p className="mb-3 text-sm font-medium text-accent">Coming soon</p>
      <h1 className="text-3xl font-semibold tracking-tight text-text">
        {title}
      </h1>
      <p className="mt-3 text-text-muted">{description}</p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-[var(--radius)] bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-hover"
      >
        Open JSON Formatter
      </Link>
    </div>
  );
}
