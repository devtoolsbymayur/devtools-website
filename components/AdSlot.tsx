import { AdPlaceholder } from "@/components/AdPlaceholder";
import { AdSenseUnit } from "@/components/AdSenseUnit";
import { parseAdUnitCode, shouldServeRealAds } from "@/lib/ads";
import { getAdSlot, type AdPlacement } from "@/lib/site-config";

/**
 * Enabled admin slots:
 * - localhost / non-production → dashed placeholder (AdSense cannot serve here)
 * - production HTTPS + valid unit snippet → real AdSense <ins>
 * - production without/invalid code → placeholder
 * Disabled slots render nothing.
 */
export async function AdSlot({
  placement,
  className = "",
}: {
  placement: AdPlacement;
  className?: string;
}) {
  const slot = await getAdSlot(placement);
  if (!slot?.enabled) return null;

  const code = slot.adUnitCode.trim();
  const serveReal = shouldServeRealAds();
  const parsed = serveReal && code ? parseAdUnitCode(code) : null;
  const minHeight = placement === "sidebar" ? "250px" : "90px";

  return (
    <aside
      aria-label={`Advertisement: ${slot.label}`}
      data-ad-placement={placement}
      data-ad-enabled="true"
      data-ad-mode={parsed ? "live" : "placeholder"}
      className={className}
    >
      {parsed ? (
        <AdSenseUnit unit={parsed} label={slot.label} />
      ) : (
        <AdPlaceholder
          label={slot.label}
          minHeight={minHeight}
          note={
            !serveReal
              ? "Placeholder — real AdSense only on live HTTPS domain after approval."
              : !code
                ? "Unit code empty in admin — paste AdSense snippet when ready."
                : "Could not parse AdSense snippet (need data-ad-client + data-ad-slot)."
          }
        />
      )}
    </aside>
  );
}
