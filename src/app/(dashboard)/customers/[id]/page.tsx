import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { CustomerProfileContent } from "@/components/customers/CustomerProfileContent";
import { createClient } from "@/lib/supabase/server";
import { getOwnerId } from "@/lib/owner";

export const dynamic = "force-dynamic";

export default async function CustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const userId = await getOwnerId();
    const supabase = await createClient();

    const [custRes, qtnRes, invRes] = await Promise.all([
      supabase.from("customers").select("*").eq("id", id).eq("user_id", userId).single(),
      supabase.from("quotations").select("id, quotation_number, date, status, grand_total").eq("customer_id", id).eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("invoices").select("id, invoice_number, date, payment_status, grand_total, amount_paid, balance_due").eq("customer_id", id).eq("user_id", userId).order("created_at", { ascending: false }),
    ]);

    if (custRes.error || !custRes.data) notFound();

    return (
      <div className="flex flex-col min-h-full">
        <Header title={custRes.data.name} />
        <CustomerProfileContent
          customer={custRes.data}
          quotations={(qtnRes.data ?? []) as any[]}
          invoices={(invRes.data ?? []) as any[]}
          userId={userId}
        />
      </div>
    );
  } catch {
    notFound();
  }
}
