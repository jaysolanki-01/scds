import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { QuotationDetailContent } from "@/components/quotations/QuotationDetailContent";
import { createClient } from "@/lib/supabase/server";
import { getOwnerId } from "@/lib/owner";

export const dynamic = "force-dynamic";

export default async function QuotationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const userId = await getOwnerId();
    const supabase = await createClient();

    const [qtnRes, compRes, dsRes] = await Promise.all([
      supabase.from("quotations").select("*, quotation_items(*)").eq("id", id).eq("user_id", userId).single(),
      supabase.from("company_settings").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("doc_settings").select("*").eq("user_id", userId).maybeSingle(),
    ]);

    if (qtnRes.error || !qtnRes.data) notFound();

    const customerRes = await supabase.from("customers").select("*").eq("id", qtnRes.data.customer_id).eq("user_id", userId).maybeSingle();

    return (
      <div className="flex flex-col min-h-full">
        <Header title={`Quotation ${qtnRes.data.quotation_number}`} />
        <QuotationDetailContent
          quotation={{ ...qtnRes.data, customers: customerRes.data } as any}
          company={compRes.data}
          docSettings={dsRes.data}
          userId={userId}
        />
      </div>
    );
  } catch {
    notFound();
  }
}
