import { Header } from "@/components/layout/Header";
import { QuotationForm } from "@/components/quotations/QuotationForm";
import { createClient } from "@/lib/supabase/server";
import { getOwnerId } from "@/lib/owner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewQuotationPage({ searchParams }: { searchParams: Promise<{ customer?: string }> }) {
  const { customer } = await searchParams;

  let customers: any[] = [];
  let defaultSettings = null;
  let userId = "";

  try {
    userId = await getOwnerId();
    const supabase = await createClient();

    const [cust, ds] = await Promise.all([
      supabase.from("customers").select("id, name, company_name, address, ship_to_address, gstin").eq("user_id", userId).order("name"),
      supabase.from("doc_settings").select("*").eq("user_id", userId).maybeSingle(),
    ]);

    customers = cust.data ?? [];
    defaultSettings = ds.data;
  } catch {}

  return (
    <div className="flex flex-col min-h-full">
      <Header
        title="New Quotation"
        actions={
          <Link href="/quotations">
            <Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4" />Back</Button>
          </Link>
        }
      />
      <QuotationForm customers={customers} defaultSettings={defaultSettings} userId={userId} preselectedCustomerId={customer} />
    </div>
  );
}
