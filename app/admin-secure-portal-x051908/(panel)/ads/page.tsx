import { revalidatePath, revalidateTag } from "next/cache";
import { requirePrisma } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/site-config";

async function saveAd(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const enabled = formData.get("enabled") === "yes";
  const adUnitCode = String(formData.get("adUnitCode") ?? "");
  if (!id) return;
  const prisma = requirePrisma();
  await prisma.adSlot.update({
    where: { id },
    data: { enabled, adUnitCode },
  });
  revalidateTag(CACHE_TAGS.ads, "max");
  revalidatePath("/admin-secure-portal-x051908/ads");
  revalidatePath("/admin-secure-portal-x051908");
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/json-validator");
  revalidatePath("/json-minifier");
  revalidatePath("/json-viewer");
}

export default async function AdminAdsPage() {
  const prisma = requirePrisma();
  const slots = await prisma.adSlot.findMany({ orderBy: { label: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Ad management</h1>
      <p className="mt-1 text-sm text-text-muted">
        Set each slot to <strong>Yes</strong> to show it on the public site, or{" "}
        <strong>No</strong> to hide it completely.
      </p>
      <p className="mt-2 rounded-[var(--radius)] border border-border bg-bg px-3 py-2 text-xs text-text-muted">
        <strong className="text-text">Site ownership / head script</strong> is
        NOT pasted here — it comes from env{" "}
        <code>NEXT_PUBLIC_ADSENSE_CLIENT</code> + <code>public/ads.txt</code>{" "}
        (already on the live site). This page is only for{" "}
        <strong>ad unit</strong> snippets that include{" "}
        <code>data-ad-client</code> + <code>data-ad-slot</code>. Pasting only
        the <code>adsbygoogle.js?client=…</code> script here will show “Could
        not parse” and will not verify ownership.
      </p>

      <div className="mt-6 space-y-4">
        {slots.map((slot) => (
          <form
            key={slot.id}
            action={saveAd}
            className="rounded-[var(--radius)] border border-border bg-surface p-4 shadow-[var(--shadow)]"
          >
            <input type="hidden" name="id" value={slot.id} />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-medium">{slot.label}</h2>
                <p className="text-xs text-text-muted">{slot.placement}</p>
                <p className="mt-1 text-xs">
                  Public site:{" "}
                  <span
                    className={
                      slot.enabled
                        ? "font-medium text-success"
                        : "font-medium text-text-muted"
                    }
                  >
                    {slot.enabled ? "Visible (Yes)" : "Hidden (No)"}
                  </span>
                </p>
              </div>
              <label className="text-sm">
                <span className="mb-1 block text-text-muted">
                  Show on website
                </span>
                <select
                  name="enabled"
                  defaultValue={slot.enabled ? "yes" : "no"}
                  className="rounded-[var(--radius)] border border-border bg-bg px-3 py-2"
                >
                  <option value="yes">Yes — show section</option>
                  <option value="no">No — hide section</option>
                </select>
              </label>
            </div>
            <label className="mt-3 block text-sm">
              <span className="text-text-muted">
                AdSense unit snippet (needs data-ad-client + data-ad-slot)
              </span>
              <textarea
                name="adUnitCode"
                rows={5}
                defaultValue={slot.adUnitCode}
                placeholder={`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX" crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXX"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`}
                className="mt-1 w-full rounded-[var(--radius)] border border-border bg-bg px-3 py-2 font-mono text-xs"
              />
            </label>
            <button
              type="submit"
              className="mt-3 rounded-[var(--radius)] bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-hover"
            >
              Save slot
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
