import { revalidatePath } from "next/cache";
import { requirePrisma } from "@/lib/admin";

async function updateStatus(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["new", "read", "replied"].includes(status)) return;
  const prisma = requirePrisma();
  await prisma.contactMessage.update({ where: { id }, data: { status } });
  revalidatePath("/admin-secure-portal-x051908/contacts");
  revalidatePath("/admin-secure-portal-x051908");
}

export default async function AdminContactsPage() {
  const prisma = requirePrisma();
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Contact messages</h1>
      <p className="mt-1 text-sm text-text-muted">
        Submissions from the public Contact form.
      </p>

      <div className="mt-6 overflow-x-auto rounded-[var(--radius)] border border-border bg-surface">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-bg text-text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">When</th>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Message</th>
              <th className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-text-muted">
                  No messages yet.
                </td>
              </tr>
            )}
            {messages.map((msg) => (
              <tr key={msg.id} className="border-b border-border align-top">
                <td className="whitespace-nowrap px-3 py-3 text-text-muted">
                  {msg.createdAt.toLocaleString()}
                </td>
                <td className="px-3 py-3 font-medium">{msg.name}</td>
                <td className="px-3 py-3">
                  <a href={`mailto:${msg.email}`} className="text-accent hover:underline">
                    {msg.email}
                  </a>
                </td>
                <td className="max-w-md px-3 py-3 text-text-muted">{msg.message}</td>
                <td className="px-3 py-3">
                  <form action={updateStatus} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={msg.id} />
                    <select
                      name="status"
                      defaultValue={msg.status}
                      className="rounded border border-border bg-bg px-2 py-1"
                    >
                      <option value="new">new</option>
                      <option value="read">read</option>
                      <option value="replied">replied</option>
                    </select>
                    <button
                      type="submit"
                      className="rounded border border-border px-2 py-1 text-xs hover:border-accent"
                    >
                      Save
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
