import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { InvoiceDetailContent } from "@/components/invoices/InvoiceDetailContent";
import { createClient } from "@/lib/supabase/server";
import { getOwnerId } from "@/lib/owner";

export const dynamic = "force-dynamic";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const userId = await getOwnerId();
    const supabase = await createClient();

    const [invRes, compRes, dsRes, paymentsRes] = await Promise.all([
      supabase.from("invoices").select("*, invoice_items(*)").eq("id", id).eq("user_id", userId).single(),
      supabase.from("company_settings").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("doc_settings").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("payments").select("*").eq("invoice_id", id).eq("user_id", userId).order("payment_date", { ascending: false }),
    ]);

    if (invRes.error || !invRes.data) notFound();

    const customerRes = await supabase.from("customers").select("*").eq("id", invRes.data.customer_id).eq("user_id", userId).maybeSingle();

    return (
      <div className="flex flex-col min-h-full">
        <Header title={`Invoice ${invRes.data.invoice_number}`} />
        <InvoiceDetailContent
          invoice={{ ...invRes.data, customers: customerRes.data } as any}
          company={compRes.data}
          docSettings={dsRes.data}
          payments={paymentsRes.data ?? []}
          userId={userId}
        />
      </div>
    );
  } catch {
    notFound();
  }
}
