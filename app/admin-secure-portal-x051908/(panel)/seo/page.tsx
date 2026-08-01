import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requirePrisma } from "@/lib/admin";

async function saveSeo(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const metaTitle = String(formData.get("metaTitle") ?? "");
  const metaDescription = String(formData.get("metaDescription") ?? "");
  const faqRaw = String(formData.get("faqItems") ?? "[]");
  if (!id) return;

  let faqItems: Prisma.InputJsonValue;
  try {
    faqItems = JSON.parse(faqRaw) as Prisma.InputJsonValue;
  } catch {
    return;
  }

  const prisma = requirePrisma();
  await prisma.seoContent.update({
    where: { id },
    data: { metaTitle, metaDescription, faqItems },
  });
  revalidatePath("/admin-secure-portal-x051908/seo");
  revalidatePath("/");
}

export default async function AdminSeoPage() {
  const prisma = requirePrisma();
  const pages = await prisma.seoContent.findMany({
    orderBy: { pageKey: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">SEO content</h1>
      <p className="mt-1 text-sm text-text-muted">
        Edit meta titles/descriptions and FAQ JSON per page without a deploy.
      </p>

      <div className="mt-6 space-y-4">
        {pages.map((page) => (
          <form
            key={page.id}
            action={saveSeo}
            className="rounded-[var(--radius)] border border-border bg-surface p-4 shadow-[var(--shadow)]"
          >
            <input type="hidden" name="id" value={page.id} />
            <h2 className="font-medium">Page: {page.pageKey}</h2>
            <label className="mt-3 block text-sm">
              <span className="text-text-muted">Meta title</span>
              <input
                name="metaTitle"
                defaultValue={page.metaTitle}
                className="mt-1 w-full rounded-[var(--radius)] border border-border bg-bg px-3 py-2"
              />
            </label>
            <label className="mt-3 block text-sm">
              <span className="text-text-muted">Meta description</span>
              <textarea
                name="metaDescription"
                rows={3}
                defaultValue={page.metaDescription}
                className="mt-1 w-full rounded-[var(--radius)] border border-border bg-bg px-3 py-2"
              />
            </label>
            <label className="mt-3 block text-sm">
              <span className="text-text-muted">
                FAQ items (JSON array of {"{ question, answer }"})
              </span>
              <textarea
                name="faqItems"
                rows={8}
                defaultValue={JSON.stringify(page.faqItems, null, 2)}
                className="mt-1 w-full rounded-[var(--radius)] border border-border bg-bg px-3 py-2 font-mono text-xs"
              />
            </label>
            <button
              type="submit"
              className="mt-3 rounded-[var(--radius)] bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-hover"
            >
              Save SEO
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
