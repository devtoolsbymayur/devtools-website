import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ComingSoon } from "@/components/ComingSoon";
import { resolveToolAccess } from "@/lib/tool-access";

/**
 * Live → children. Coming soon → placeholder (no tool). Hidden → 404.
 */
export async function ManagedToolPage({
  toolKey,
  soonDescription,
  children,
}: {
  toolKey: string;
  soonDescription: string;
  children: ReactNode;
}) {
  const access = await resolveToolAccess(toolKey);
  if (access.kind === "hidden") notFound();
  if (access.kind === "soon") {
    return (
      <ComingSoon title={access.tool.label} description={soonDescription} />
    );
  }
  return children;
}
