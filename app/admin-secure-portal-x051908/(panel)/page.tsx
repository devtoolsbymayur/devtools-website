import Link from "next/link";
import { requirePrisma } from "@/lib/admin";
import { adminPath } from "@/lib/admin-path";

export default async function AdminDashboardPage() {
  const prisma = requirePrisma();
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const weekAgo = new Date(today);
  weekAgo.setUTCDate(weekAgo.getUTCDate() - 6);

  const [
    newContacts,
    totalContacts,
    liveTools,
    enabledAds,
    todayViews,
    weekRows,
    topPaths,
  ] = await Promise.all([
    prisma.contactMessage.count({ where: { status: "new" } }),
    prisma.contactMessage.count(),
    prisma.toolConfig.count({ where: { status: "live" } }),
    prisma.adSlot.count({ where: { enabled: true } }),
    prisma.pageViewDaily.aggregate({
      where: { date: today },
      _sum: { views: true },
    }),
    prisma.pageViewDaily.findMany({
      where: { date: { gte: weekAgo } },
      select: { views: true },
    }),
    prisma.pageViewDaily.groupBy({
      by: ["path"],
      _sum: { views: true },
      orderBy: { _sum: { views: "desc" } },
      take: 8,
    }),
  ]);

  const weekViews = weekRows.reduce((sum, row) => sum + row.views, 0);

  const cards = [
    {
      label: "Page views today",
      value: todayViews._sum.views ?? 0,
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
        <h2 className="text-lg font-semibold">Top pages (all time)</h2>
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
                  <td className="px-3 py-2">{row._sum.views ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
