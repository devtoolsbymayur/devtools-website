import Link from "next/link";
import { requirePrisma } from "@/lib/admin";
import { adminPath } from "@/lib/admin-path";

export default async function AdminDashboardPage() {
  const prisma = requirePrisma();
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const weekAgo = new Date(today);
  weekAgo.setUTCDate(weekAgo.getUTCDate() - 6);

  let newContacts = 0;
  let totalContacts = 0;
  let liveTools = 0;
  let enabledAds = 0;
  let todayViews = 0;
  let weekViews = 0;
  let topPaths: { path: string; views: number }[] = [];
  let loadError: string | null = null;

  try {
    // Two small batches — Supabase transaction pooler handles concurrency poorly.
    const [contactStats, toolCount] = await Promise.all([
      prisma.contactMessage.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      prisma.toolConfig.count({ where: { status: "live" } }),
    ]);
    const [adCount, viewRows] = await Promise.all([
      prisma.adSlot.count({ where: { enabled: true } }),
      prisma.pageViewDaily.findMany({
        where: { date: { gte: weekAgo } },
        select: { date: true, path: true, views: true },
        orderBy: { views: "desc" },
        take: 200,
      }),
    ]);

    for (const row of contactStats) {
      totalContacts += row._count._all;
      if (row.status === "new") newContacts = row._count._all;
    }
    liveTools = toolCount;
    enabledAds = adCount;

    const pathTotals = new Map<string, number>();
    for (const row of viewRows) {
      weekViews += row.views;
      if (row.date.getTime() >= today.getTime()) {
        todayViews += row.views;
      }
      pathTotals.set(row.path, (pathTotals.get(row.path) ?? 0) + row.views);
    }

    topPaths = [...pathTotals.entries()]
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);
  } catch (err) {
    loadError =
      err instanceof Error
        ? err.message
        : "Could not load dashboard stats from the database.";
  }

  const cards = [
    {
      label: "Page views today",
      value: todayViews,
      href: adminPath(),
    },
    {
      label: "Page views (7 days)",
      value: weekViews,
      href: adminPath(),
    },
    {
      label: "New contact messages",
      value: newContacts,
      href: adminPath("/contacts"),
    },
    {
      label: "Total contacts",
      value: totalContacts,
      href: adminPath("/contacts"),
    },
    {
      label: "Live tools",
      value: liveTools,
      href: adminPath("/tools"),
    },
    {
      label: "Enabled ad slots",
      value: enabledAds,
      href: adminPath("/ads"),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-text-muted">
        Usage, contacts, tools, and ad configuration overview.
      </p>

      {loadError && (
        <p
          role="alert"
          className="mt-4 rounded-[var(--radius)] border border-error/40 bg-error/10 px-3 py-2 text-sm text-error"
        >
          Dashboard stats temporarily unavailable. Reload in a moment.
          <span className="mt-1 block text-xs opacity-80">{loadError}</span>
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-[var(--radius)] border border-border bg-surface p-4 shadow-[var(--shadow)] transition-colors hover:border-accent"
          >
            <p className="text-3xl font-semibold text-accent">{card.value}</p>
            <p className="mt-1 text-sm text-text-muted">{card.label}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Top pages (7 days)</h2>
        <div className="mt-3 overflow-x-auto rounded-[var(--radius)] border border-border bg-surface">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-bg text-text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">Path</th>
                <th className="px-3 py-2 font-medium">Views</th>
              </tr>
            </thead>
            <tbody>
              {topPaths.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="px-3 py-6 text-center text-text-muted"
                  >
                    No page views recorded yet. Browse the public site to
                    generate data.
                  </td>
                </tr>
              )}
              {topPaths.map((row) => (
                <tr key={row.path} className="border-b border-border">
                  <td className="px-3 py-2 font-mono text-xs">{row.path}</td>
                  <td className="px-3 py-2">{row.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
