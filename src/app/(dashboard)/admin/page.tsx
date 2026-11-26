export const dynamic = "force-dynamic";

import { Header } from "@/components/layout/Header";
import { AdminContent } from "@/components/admin/AdminContent";

export default async function AdminPage() {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Header title="Admin" subtitle="Access & Devices" />
      <div className="flex-1 overflow-y-auto">
        <AdminContent currentUserId="stub-owner-id" />
      </div>
    </div>
  );
}
