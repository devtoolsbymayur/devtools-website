import { NotFoundView } from "@/components/NotFoundView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  robots: { index: false, follow: true },
};

/** 404 inside site routes (e.g. hidden tools) — Header/Footer from site layout. */
export default function SiteNotFound() {
  return (
    <div className="hero-glow flex min-h-[60vh] items-center justify-center">
      <NotFoundView />
    </div>
  );
}
