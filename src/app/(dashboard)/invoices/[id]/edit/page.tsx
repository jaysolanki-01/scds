import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { createClient } from "@/lib/supabase/server";
import { getOwnerId } from "@/lib/owner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const userId = await getOwnerId();
    const supabase = await createClient();

    const [invRes, custRes, dsRes] = await Promise.all([
      supabase.from("invoices").select("*, invoice_items(*)").eq("id", id).eq("user_id", userId).single(),
      supabase.from("customers").select("id, name, company_name, address, ship_to_address, gstin").eq("user_id", userId).order("name"),
      supabase.from("doc_settings").select("*").eq("user_id", userId).maybeSingle(),
    ]);

    if (invRes.error || !invRes.data) notFound();

    return (
      <div className="flex flex-col min-h-full">
        <Header
          title="Edit Invoice"
          actions={
            <Link href={`/invoices/${id}`}>
              <Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4" />Back</Button>
            </Link>
          }
        />
        <InvoiceForm
          customers={custRes.data ?? []}
          defaultSettings={dsRes.data}
          userId={userId}
          existingInvoice={invRes.data as any}
        />
      </div>
    );
  } catch {
    notFound();
  }
}
