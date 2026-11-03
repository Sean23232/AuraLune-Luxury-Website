import type { Metadata } from "next";
import { AdminClient } from "@/components/admin/AdminClient";
import { adminRequiresPassword } from "@/lib/admin-auth";
export const metadata: Metadata = { title: "Store Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <AdminClient requiresPassword={adminRequiresPassword()} />;
}
