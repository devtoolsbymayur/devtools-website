import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return <AdminShell>{children}</AdminShell>;
}
