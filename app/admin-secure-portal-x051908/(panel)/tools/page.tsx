import { revalidatePath, revalidateTag } from "next/cache";
import { requirePrisma } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/site-config";

async function saveTool(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const displayOrder = Number(formData.get("displayOrder") ?? 0);
  if (!id || !["live", "coming-soon", "hidden"].includes(status)) return;
  const prisma = requirePrisma();
  await prisma.toolConfig.update({
    where: { id },
    data: {
      status,
      displayOrder: Number.isFinite(displayOrder) ? displayOrder : 0,
    },
  });
  revalidateTag(CACHE_TAGS.tools, "max");
  revalidatePath("/admin-secure-portal-x051908/tools");
  revalidatePath("/admin-secure-portal-x051908");
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
}

export default async function AdminToolsPage() {
  const prisma = requirePrisma();
  const tools = await prisma.toolConfig.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Tool management</h1>
      <p className="mt-1 text-sm text-text-muted">
        Control footer / nav visibility and whether a tool URL works.
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-text-muted">
        <li>
          <strong className="font-medium text-text">Live</strong> — shown in
          footer/related with a working link; page is usable and in sitemap.
        </li>
        <li>
          <strong className="font-medium text-text">Coming soon</strong> — listed
          in footer as “soon” but <em>not clickable</em>; direct URL shows a
          coming-soon page (no tool).
        </li>
        <li>
          <strong className="font-medium text-text">Hidden</strong> — removed from
          footer/nav/related/sitemap; direct URL returns 404 (no redirect to
          the tool).
        </li>
      </ul>

      <div className="mt-6 space-y-3">
        {tools.map((tool) => (
          <form
            key={tool.id}
            action={saveTool}
            className="flex flex-wrap items-end gap-3 rounded-[var(--radius)] border border-border bg-surface p-4"
          >
            <input type="hidden" name="id" value={tool.id} />
            <div className="min-w-[160px] flex-1">
              <p className="font-medium">{tool.label}</p>
              <p className="text-xs text-text-muted">{tool.href}</p>
            </div>
            <label className="text-sm">
              <span className="text-text-muted">Status</span>
              <select
                name="status"
                defaultValue={tool.status}
                className="mt-1 block rounded border border-border bg-bg px-2 py-1.5"
              >
                <option value="live">Live</option>
                <option value="coming-soon">Coming soon</option>
                <option value="hidden">Hidden</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="text-text-muted">Order</span>
              <input
                name="displayOrder"
                type="number"
                defaultValue={tool.displayOrder}
                className="mt-1 block w-20 rounded border border-border bg-bg px-2 py-1.5"
              />
            </label>
            <button
              type="submit"
              className="rounded-[var(--radius)] bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-hover"
            >
              Save
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
