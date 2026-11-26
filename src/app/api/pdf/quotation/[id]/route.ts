import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOwnerId } from "@/lib/owner";
import { QuotationPDF } from "@/components/documents/QuotationPDF";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import fs from "fs";
import path from "path";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const userId = await getOwnerId();
    const admin = createAdminClient();

    const [qtnRes, compRes, dsRes] = await Promise.all([
      admin.from("quotations").select("*, quotation_items(*)").eq("id", id).eq("user_id", userId).single(),
      admin.from("company_settings").select("*").eq("user_id", userId).maybeSingle(),
      admin.from("doc_settings").select("*").eq("user_id", userId).maybeSingle(),
    ]);

    if (qtnRes.error || !qtnRes.data) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }

    const customerRes = await admin.from("customers").select("*").eq("id", qtnRes.data.customer_id).eq("user_id", userId).maybeSingle();

    const logoPath = path.join(process.cwd(), "public", "logo.png");
    const logoBase64 = fs.existsSync(logoPath)
      ? `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`
      : null;

    const buffer = await renderToBuffer(
      React.createElement(QuotationPDF, {
        quotation: { ...qtnRes.data, customers: customerRes.data } as any,
        company: compRes.data,
        docSettings: dsRes.data,
        logoBase64,
      })
    );

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${qtnRes.data.quotation_number}.pdf"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "PDF generation failed" }, { status: 500 });
  }
}
