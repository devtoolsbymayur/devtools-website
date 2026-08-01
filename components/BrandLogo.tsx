import Link from "next/link";

function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-[9px] shadow-[0_2px_6px_rgba(99,102,241,0.35)]"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
      }}
      aria-hidden="true"
    >
      <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
        <rect
          x="9"
          y="6"
          width="16"
          height="4"
          rx="1.5"
          fill="white"
          opacity="0.5"
        />
        <rect
          x="7"
          y="12"
          width="18"
          height="5"
          rx="1.5"
          fill="white"
          opacity="0.85"
        />
        <rect x="9" y="19" width="16" height="6" rx="1.5" fill="#FBBF24" />
      </svg>
    </span>
  );
}

export function BrandLogo({
  href = "/",
  size = "md",
}: {
  href?: string;
  size?: "sm" | "md";
}) {
  const mark = size === "sm" ? 26 : 30;
  const text = size === "sm" ? "text-[15px]" : "text-[17px]";

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2.5 font-extrabold tracking-tight text-accent ${text}`}
    >
      <LogoMark size={mark} />
      <span>
        json<span className="text-[#F59E0B]">.</span>
      </span>
    </Link>
  );
}
