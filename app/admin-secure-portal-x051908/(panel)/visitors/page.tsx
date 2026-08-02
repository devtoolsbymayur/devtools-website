import { requirePrisma } from "@/lib/admin";
import { utcDayStart } from "@/lib/analytics";

export default async function AdminVisitorsPage() {
  const prisma = requirePrisma();
  const today = utcDayStart();
  const weekAgo = new Date(today);
  weekAgo.setUTCDate(weekAgo.getUTCDate() - 6);
  const activeSince = new Date(Date.now() - 15 * 60 * 1000);

  let todayUnique = 0;
  let weekUnique = 0;
  let activeNow = 0;
  let todayHits = 0;
  let countries: { country: string; count: number }[] = [];
  let daily: { date: string; visitors: number; hits: number }[] = [];
  let recent: {
    ipMasked: string;
    country: string;
    region: string;
    city: string;
    path: string;
    browser: string;
    device: string;
    language: string;
    timezone: string;
    hits: number;
    lastSeenAt: Date;
  }[] = [];
  let loadError: string | null = null;

  try {
    const [todayCount, weekCount, activeCount, todayAgg, countryGroups, weekRows, recentRows] =
      await Promise.all([
        prisma.siteVisitor.count({ where: { date: today } }),
        prisma.siteVisitor.count({ where: { date: { gte: weekAgo } } }),
        prisma.siteVisitor.count({
          where: { lastSeenAt: { gte: activeSince } },
        }),
        prisma.siteVisitor.aggregate({
          where: { date: today },
          _sum: { hits: true },
        }),
        prisma.siteVisitor.groupBy({
          by: ["country"],
          where: { date: { gte: weekAgo }, country: { not: "" } },
          _count: { _all: true },
          orderBy: { _count: { country: "desc" } },
          take: 12,
        }),
        prisma.siteVisitor.findMany({
          where: { date: { gte: weekAgo } },
          select: { date: true, hits: true },
        }),
        prisma.siteVisitor.findMany({
          where: { date: { gte: weekAgo } },
          orderBy: { lastSeenAt: "desc" },
          take: 80,
          select: {
            ipMasked: true,
            country: true,
            region: true,
            city: true,
            path: true,
            browser: true,
            device: true,
            language: true,
            timezone: true,
            hits: true,
            lastSeenAt: true,
          },
        }),
      ]);

    todayUnique = todayCount;
    weekUnique = weekCount;
    activeNow = activeCount;
    todayHits = todayAgg._sum.hits ?? 0;
    countries = countryGroups.map((row) => ({
      country: row.country || "Unknown",
      count: row._count._all,
    }));
    recent = recentRows;

    const byDay = new Map<string, { visitors: number; hits: number }>();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setUTCDate(today.getUTCDate() - (6 - i));
      byDay.set(d.toISOString().slice(0, 10), { visitors: 0, hits: 0 });
    }
    for (const row of weekRows) {
      const key = row.date.toISOString().slice(0, 10);
      const bucket = byDay.get(key);
      if (!bucket) continue;
      bucket.visitors += 1;
      bucket.hits += row.hits;
    }
    daily = [...byDay.entries()].map(([date, stats]) => ({
      date,
      visitors: stats.visitors,
      hits: stats.hits,
    }));
  } catch (err) {
    loadError =
      err instanceof Error
        ? err.message
        : "Could not load visitor analytics from the database.";
  }

  const cards = [
    { label: "Active now (15 min)", value: activeNow },
    { label: "Unique visitors today", value: todayUnique },
    { label: "Hits today", value: todayHits },
    { label: "Unique visitors (7 days)", value: weekUnique },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Visitors</h1>
      <p className="mt-1 text-sm text-text-muted">
        Consent-gated usage analytics: unique visitors, masked IP, location
        (from CDN headers), browser/device, and daily activity. JSON tool content
        is never tracked.
      </p>

      {loadError && (
        <p
          role="alert"
          className="mt-4 rounded-[var(--radius)] border border-error/40 bg-error/10 px-3 py-2 text-sm text-error"
        >
          Analytics temporarily unavailable.
          <span className="mt-1 block text-xs opacity-80">{loadError}</span>
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-[var(--radius)] border border-border bg-surface p-4 shadow-[var(--shadow)]"
          >
            <p className="text-3xl font-semibold text-accent">{card.value}</p>
            <p className="mt-1 text-sm text-text-muted">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold">Daily usage (UTC)</h2>
          <div className="mt-3 overflow-x-auto rounded-[var(--radius)] border border-border bg-surface">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border bg-bg text-text-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Visitors</th>
                  <th className="px-3 py-2 font-medium">Hits</th>
                </tr>
              </thead>
              <tbody>
                {daily.map((row) => (
                  <tr key={row.date} className="border-b border-border">
                    <td className="px-3 py-2 font-mono text-xs">{row.date}</td>
                    <td className="px-3 py-2">{row.visitors}</td>
                    <td className="px-3 py-2">{row.hits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Top countries (7 days)</h2>
          <div className="mt-3 overflow-x-auto rounded-[var(--radius)] border border-border bg-surface">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border bg-bg text-text-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">Country</th>
                  <th className="px-3 py-2 font-medium">Visitors</th>
                </tr>
              </thead>
              <tbody>
                {countries.length === 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-3 py-6 text-center text-text-muted"
                    >
                      No location data yet. Accept consent on the public site
                      and browse a few pages (Vercel provides country/city).
                    </td>
                  </tr>
                )}
                {countries.map((row) => (
                  <tr key={row.country} className="border-b border-border">
                    <td className="px-3 py-2">{row.country}</td>
                    <td className="px-3 py-2">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Recent visitors</h2>
        <p className="mt-1 text-xs text-text-muted">
          IP shown masked (last part hidden). Full JSON editor contents are never
          stored.
        </p>
        <div className="mt-3 overflow-x-auto rounded-[var(--radius)] border border-border bg-surface">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-bg text-text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">Last seen</th>
                <th className="px-3 py-2 font-medium">IP</th>
                <th className="px-3 py-2 font-medium">Location</th>
                <th className="px-3 py-2 font-medium">Path</th>
                <th className="px-3 py-2 font-medium">Device</th>
                <th className="px-3 py-2 font-medium">Browser</th>
                <th className="px-3 py-2 font-medium">Lang / TZ</th>
                <th className="px-3 py-2 font-medium">Hits</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-3 py-6 text-center text-text-muted"
                  >
                    No visitors recorded yet.
                  </td>
                </tr>
              )}
              {recent.map((row, index) => {
                const location = [row.city, row.region, row.country]
                  .filter(Boolean)
                  .join(", ");
                return (
                  <tr
                    key={`${row.ipMasked}-${row.lastSeenAt.toISOString()}-${index}`}
                    className="border-b border-border"
                  >
                    <td className="whitespace-nowrap px-3 py-2 text-xs text-text-muted">
                      {row.lastSeenAt.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {row.ipMasked || "—"}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      {location || "—"}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">{row.path}</td>
                    <td className="px-3 py-2 text-xs">{row.device || "—"}</td>
                    <td className="px-3 py-2 text-xs">{row.browser || "—"}</td>
                    <td className="px-3 py-2 text-xs text-text-muted">
                      {[row.language, row.timezone].filter(Boolean).join(" · ") ||
                        "—"}
                    </td>
                    <td className="px-3 py-2">{row.hits}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
