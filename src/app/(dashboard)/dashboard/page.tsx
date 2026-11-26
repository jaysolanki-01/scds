import { Header } from "@/components/layout/Header";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { createClient } from "@/lib/supabase/server";
import { getOwnerId } from "@/lib/owner";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

  let stats = { total_quotations: 0, total_invoices: 0, month_billing: 0, pending_payments: 0 };
  let userId = "";

  try {
    userId = await getOwnerId();
    const supabase = await createClient();

    const [qCount, invCount, monthInv, pending] = await Promise.all([
      supabase.from("quotations").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("invoices").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("invoices").select("grand_total").eq("user_id", userId).gte("date", monthStart).lte("date", monthEnd),
      supabase.from("invoices").select("balance_due").eq("user_id", userId).neq("payment_status", "paid"),
    ]);

    stats = {
      total_quotations: qCount.count ?? 0,
      total_invoices: invCount.count ?? 0,
      month_billing: (monthInv.data ?? []).reduce((s, i) => s + Number(i.grand_total), 0),
      pending_payments: (pending.data ?? []).reduce((s, i) => s + Number(i.balance_due), 0),
    };
  } catch {}

  return (
    <div className="flex flex-col min-h-full">
      <Header
        title="Dashboard"
        subtitle={`${now.toLocaleString("en-IN", { month: "long" })} ${now.getFullYear()}`}
      />
      <DashboardContent stats={stats} userId={userId} />
    </div>
  );
}
