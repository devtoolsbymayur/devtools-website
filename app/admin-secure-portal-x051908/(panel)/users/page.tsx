import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requirePrisma } from "@/lib/admin";
import { ADMIN_BASE_PATH, adminPath } from "@/lib/admin-path";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

function usersPath(query?: string) {
  return query ? `${adminPath("/users")}?${query}` : adminPath("/users");
}

async function createUser(formData: FormData) {
  "use server";
  await requireAdmin();
  const prisma = requirePrisma();

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!EMAIL_RE.test(email)) {
    redirect(usersPath("error=invalid-email"));
  }
  if (password.length < MIN_PASSWORD) {
    redirect(usersPath("error=weak-password"));
  }
  if (password !== confirm) {
    redirect(usersPath("error=mismatch"));
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    redirect(usersPath("error=exists"));
  }

  const passwordHash = await hash(password, 12);
  await prisma.adminUser.create({
    data: { email, passwordHash, role: "admin" },
  });

  revalidatePath(adminPath("/users"));
  redirect(usersPath("created=1"));
}

async function updatePassword(formData: FormData) {
  "use server";
  await requireAdmin();
  const prisma = requirePrisma();

  const id = String(formData.get("id") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!id) redirect(usersPath("error=missing"));
  if (password.length < MIN_PASSWORD) {
    redirect(usersPath("error=weak-password"));
  }
  if (password !== confirm) {
    redirect(usersPath("error=mismatch"));
  }

  const passwordHash = await hash(password, 12);
  await prisma.adminUser.update({
    where: { id },
    data: { passwordHash },
  });

  revalidatePath(adminPath("/users"));
  redirect(usersPath("updated=1"));
}

async function deleteUser(formData: FormData) {
  "use server";
  const session = await requireAdmin();
  const prisma = requirePrisma();

  const id = String(formData.get("id") ?? "");
  if (!id) redirect(usersPath("error=missing"));

  const user = await prisma.adminUser.findUnique({ where: { id } });
  if (!user) redirect(usersPath("error=missing"));

  if (user.email === session.user?.email?.toLowerCase()) {
    redirect(usersPath("error=self"));
  }

  const total = await prisma.adminUser.count();
  if (total <= 1) {
    redirect(usersPath("error=last"));
  }

  await prisma.adminUser.delete({ where: { id } });
  revalidatePath(adminPath("/users"));
  redirect(usersPath("deleted=1"));
}

const MESSAGES: Record<string, string> = {
  created: "Admin user created.",
  updated: "Password updated.",
  deleted: "Admin user deleted.",
  "invalid-email": "Enter a valid email address.",
  "weak-password": `Password must be at least ${MIN_PASSWORD} characters.`,
  mismatch: "Password and confirmation do not match.",
  exists: "An admin with that email already exists.",
  self: "You cannot delete your own account.",
  last: "Cannot delete the last admin user.",
  missing: "User not found.",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Auth enforced by (panel)/layout via requireAdmin (request-cached).
  const prisma = requirePrisma();
  const params = await searchParams;

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const flashKey =
    (typeof params.created === "string" && "created") ||
    (typeof params.updated === "string" && "updated") ||
    (typeof params.deleted === "string" && "deleted") ||
    (typeof params.error === "string" ? params.error : null);
  const flash = flashKey ? MESSAGES[flashKey] : null;
  const isError = typeof params.error === "string";

  return (
    <div>
      <h1 className="text-2xl font-semibold">Admin users</h1>
      <p className="mt-1 text-sm text-text-muted">
        Create and manage accounts that can sign in to{" "}
        <code className="text-xs">{ADMIN_BASE_PATH}</code>.
      </p>

      {flash && (
        <p
          role="status"
          className={`mt-4 rounded-[var(--radius)] border px-3 py-2 text-sm ${
            isError
              ? "border-error/40 bg-error/10 text-error"
              : "border-success/40 bg-success/10 text-success"
          }`}
        >
          {flash}
        </p>
      )}

      <section className="mt-8 rounded-[var(--radius)] border border-border bg-surface p-4 shadow-[var(--shadow)]">
        <h2 className="text-lg font-semibold">Create user</h2>
        <form action={createUser} className="mt-4 grid max-w-md gap-3">
          <label className="block text-sm">
            <span className="text-text-muted">Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="off"
              className="mt-1 w-full rounded-[var(--radius)] border border-border bg-bg px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="text-text-muted">Password (min {MIN_PASSWORD})</span>
            <input
              name="password"
              type="password"
              required
              minLength={MIN_PASSWORD}
              autoComplete="new-password"
              className="mt-1 w-full rounded-[var(--radius)] border border-border bg-bg px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="text-text-muted">Confirm password</span>
            <input
              name="confirm"
              type="password"
              required
              minLength={MIN_PASSWORD}
              autoComplete="new-password"
              className="mt-1 w-full rounded-[var(--radius)] border border-border bg-bg px-3 py-2"
            />
          </label>
          <button
            type="submit"
            className="mt-1 w-fit rounded-[var(--radius)] bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
          >
            Create admin
          </button>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Existing users</h2>
        <div className="mt-3 overflow-x-auto rounded-[var(--radius)] border border-border bg-surface">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-bg text-text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">Email</th>
                <th className="px-3 py-2 font-medium">Role</th>
                <th className="px-3 py-2 font-medium">Created</th>
                <th className="px-3 py-2 font-medium">Reset password</th>
                <th className="px-3 py-2 font-medium">Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-8 text-center text-text-muted"
                  >
                    No admin users yet. Create one above.
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border align-top">
                  <td className="px-3 py-3 font-medium">{user.email}</td>
                  <td className="px-3 py-3 text-text-muted">{user.role}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-text-muted">
                    {user.createdAt.toLocaleString()}
                  </td>
                  <td className="px-3 py-3">
                    <form
                      action={updatePassword}
                      className="flex flex-wrap items-end gap-2"
                    >
                      <input type="hidden" name="id" value={user.id} />
                      <input
                        name="password"
                        type="password"
                        required
                        minLength={MIN_PASSWORD}
                        placeholder="New password"
                        autoComplete="new-password"
                        className="w-36 rounded border border-border bg-bg px-2 py-1"
                      />
                      <input
                        name="confirm"
                        type="password"
                        required
                        minLength={MIN_PASSWORD}
                        placeholder="Confirm"
                        autoComplete="new-password"
                        className="w-28 rounded border border-border bg-bg px-2 py-1"
                      />
                      <button
                        type="submit"
                        className="rounded border border-border px-2 py-1 text-xs hover:border-accent"
                      >
                        Update
                      </button>
                    </form>
                  </td>
                  <td className="px-3 py-3">
                    <form action={deleteUser}>
                      <input type="hidden" name="id" value={user.id} />
                      <button
                        type="submit"
                        className="rounded border border-error/40 px-2 py-1 text-xs text-error hover:bg-error/10"
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
