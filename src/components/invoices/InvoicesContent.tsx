"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Receipt } from "lucide-react";
import { Invoice, InvoicePaymentStatus } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PaymentStatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { createClient } from "@/lib/supabase/client";
import { useOwnerId } from "@/lib/use-owner";

const STATUS_FILTERS: { label: string; value: InvoicePaymentStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Partial", value: "partially_paid" },
  { label: "Paid", value: "paid" },
  { label: "Overdue", value: "overdue" },
];

export function InvoicesContent() {
  const userId = useOwnerId();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoicePaymentStatus | "all">("all");

  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();
    supabase
      .from("invoices")
      .select("*, customers(id, name, company_name)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => { setInvoices((data as any[]) ?? []); setLoading(false); });
  }, [userId]);

  const filtered = invoices.filter((inv) => {
    const matchSearch = search
      ? `${inv.invoice_number} ${(inv.customers as any)?.name ?? ""}`.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchStatus = statusFilter === "all" || inv.payment_status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPending = filtered.filter((i) => i.payment_status !== "paid").reduce((s, i) => s + Number(i.balance_due), 0);

  return (
    <div className="px-4 lg:px-6 py-5 max-w-4xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs w-full">
          <Search style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#9CA3AF" }} />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", height: 36, borderRadius: 8, border: "1px solid #333333", background: "#252525", paddingLeft: 32, paddingRight: 12, fontSize: 13, color: "#F5F5F5", outline: "none" }}
          />
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              style={{ padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: statusFilter === f.value ? 600 : 400, background: statusFilter === f.value ? "#DC2626" : "transparent", color: statusFilter === f.value ? "#FFFFFF" : "#6B7280", border: statusFilter === f.value ? "1px solid #DC2626" : "1px solid #333333", cursor: "pointer", transition: "all 0.1s", whiteSpace: "nowrap" }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {statusFilter !== "all" && totalPending > 0 && (
        <div style={{ marginBottom: 16, background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 8, padding: "10px 16px", fontSize: 13, color: "#FCA5A5" }}>
          Outstanding balance: <strong>{formatCurrency(totalPending)}</strong>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-sm text-brand-muted">Loading…</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Receipt className="h-6 w-6" />}
          title="No invoices yet"
          description="Create your first invoice to get started."
          action={{ label: "Create Invoice", href: "/invoices/new" }}
        />
      ) : (
        <div style={{ background: "#1A1A1A", border: "1px solid #282828", borderRadius: 12, overflow: "hidden" }}>
          {filtered.map((inv, i) => (
            <Link key={inv.id} href={`/invoices/${inv.id}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #242424" : "none", textDecoration: "none", transition: "background 0.1s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#242424")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(220,38,38,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Receipt style={{ width: 16, height: 16, color: "#DC2626" }} />
                </div>
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: "#F5F5F5", margin: 0 }}>{inv.invoice_number}</p>
                  <p style={{ fontSize: 12, color: "#6B7280", margin: 0, marginTop: 1 }}>{(inv.customers as any)?.name ?? "—"} · {formatDate(inv.date)}</p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 13.5, fontWeight: 600, color: "#F5F5F5", margin: 0 }}>{formatCurrency(Number(inv.grand_total))}</p>
                <PaymentStatusBadge status={inv.payment_status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
