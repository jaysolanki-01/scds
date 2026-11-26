import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { QuotationForm } from "@/components/quotations/QuotationForm";
import { createClient } from "@/lib/supabase/server";
import { getOwnerId } from "@/lib/owner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EditQuotationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const userId = await getOwnerId();
    const supabase = await createClient();

    const [qtnRes, custRes, dsRes] = await Promise.all([
      supabase.from("quotations").select("*, quotation_items(*)").eq("id", id).eq("user_id", userId).single(),
      supabase.from("customers").select("id, name, company_name, address, ship_to_address, gstin").eq("user_id", userId).order("name"),
      supabase.from("doc_settings").select("*").eq("user_id", userId).maybeSingle(),
    ]);

    if (qtnRes.error || !qtnRes.data) notFound();

    return (
      <div className="flex flex-col min-h-full">
        <Header
          title="Edit Quotation"
          actions={
            <Link href={`/quotations/${id}`}>
              <Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4" />Back</Button>
            </Link>
          }
        />
        <QuotationForm
          customers={custRes.data ?? []}
          defaultSettings={dsRes.data}
          userId={userId}
          existingQuotation={qtnRes.data as any}
        />
      </div>
    );
  } catch {
    notFound();
  }
}
