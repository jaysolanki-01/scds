import { Header } from "@/components/layout/Header";
import { ReportsContent } from "@/components/reports/ReportsContent";
import { createClient } from "@/lib/supabase/server";
import { getOwnerId } from "@/lib/owner";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  let invoices: any[] = [];

  try {
    const userId = await getOwnerId();
    const supabase = await createClient();
    const { data } = await supabase
      .from("invoices")
      .select("id, invoice_number, date, payment_status, grand_total, amount_paid, balance_due, customers(name, company_name)")
      .eq("user_id", userId)
      .order("date", { ascending: false });
    invoices = data ?? [];
  } catch {}

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Reports" />
      <ReportsContent invoices={invoices} />
    </div>
  );
}
