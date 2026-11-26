import { Header } from "@/components/layout/Header";
import { PaymentsContent } from "@/components/payments/PaymentsContent";
import { createClient } from "@/lib/supabase/server";
import { getOwnerId } from "@/lib/owner";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  let payments: any[] = [];
  let pendingInvoices: any[] = [];

  try {
    const userId = await getOwnerId();
    const supabase = await createClient();

    const [pRes, invRes] = await Promise.all([
      supabase.from("payments").select("*, invoices(invoice_number, grand_total, customers(name))").eq("user_id", userId).order("payment_date", { ascending: false }),
      supabase.from("invoices").select("id, invoice_number, date, grand_total, balance_due, payment_status, customers(name)").eq("user_id", userId).neq("payment_status", "paid").order("date", { ascending: false }),
    ]);

    payments = pRes.data ?? [];
    pendingInvoices = invRes.data ?? [];
  } catch {}

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Payments" />
      <PaymentsContent payments={payments} pendingInvoices={pendingInvoices} />
    </div>
  );
}
