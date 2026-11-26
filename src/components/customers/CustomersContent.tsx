"use client";

import { useState, useEffect } from "react";
import { Plus, Search, User, Phone, Mail, ChevronRight, Edit2, Trash2 } from "lucide-react";
import { Customer } from "@/types";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { CustomerFormDialog } from "./CustomerFormDialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useOwnerId } from "@/lib/use-owner";

export function CustomersContent() {
  const userId = useOwnerId();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;
    loadCustomers();
  }, [userId]);

  async function loadCustomers() {
    const supabase = createClient();
    const { data } = await supabase.from("customers").select("*").eq("user_id", userId).order("name");
    setCustomers(data ?? []);
    setLoading(false);
  }

  const filtered = customers.filter((c) =>
    `${c.name} ${c.company_name} ${c.phone} ${c.email}`.toLowerCase().includes(search.toLowerCase())
  );

  async function handleSave(data: Omit<Customer, "id" | "user_id" | "created_at" | "updated_at">) {
    const supabase = createClient();
    if (editCustomer) {
      const { error } = await supabase.from("customers").update({ ...data, updated_at: new Date().toISOString() }).eq("id", editCustomer.id).eq("user_id", userId);
      if (error) { toast.error("Failed to update customer"); return; }
      toast.success("Customer updated");
    } else {
      const { error } = await supabase.from("customers").insert({ ...data, user_id: userId });
      if (error) { toast.error("Failed to add customer"); return; }
      toast.success("Customer added");
    }
    setDialogOpen(false);
    setEditCustomer(null);
    loadCustomers();
  }

  async function handleDelete(customer: Customer) {
    if (!confirm(`Delete ${customer.name}? This cannot be undone.`)) return;
    const supabase = createClient();
    const { error } = await supabase.from("customers").delete().eq("id", customer.id).eq("user_id", userId);
    if (error) { toast.error("Failed to delete customer"); return; }
    toast.success("Customer deleted");
    loadCustomers();
  }

  return (
    <div className="px-4 lg:px-8 py-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 rounded-md border border-brand-border bg-surface pl-9 pr-3 py-2 text-sm text-brand-dark placeholder:text-brand-placeholder focus:outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown"
          />
        </div>
        <Button variant="primary" onClick={() => { setEditCustomer(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4" />Add Customer
        </Button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-brand-muted">Loading…</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<User className="h-6 w-6" />}
          title={search ? "No customers match your search" : "No customers yet"}
          description={search ? "Try a different name or phone number" : "Add your first customer to get started"}
          action={!search ? { label: "Add Customer", onClick: () => setDialogOpen(true) } : undefined}
        />
      ) : (
        <div style={{ background: "#1A1A1A", border: "1px solid #282828", borderRadius: 12, overflow: "hidden" }}>
          {filtered.map((c, i) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #242424" : "none" }}>
              <Link href={`/customers/${c.id}`} style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, textDecoration: "none", minWidth: 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(220,38,38,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <User style={{ width: 16, height: 16, color: "#DC2626" }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: "#F5F5F5", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}{c.company_name ? ` — ${c.company_name}` : ""}</p>
                  <p style={{ fontSize: 12, color: "#6B7280", margin: 0, marginTop: 1 }}>{c.phone || c.email || "No contact"}</p>
                </div>
              </Link>
              <div style={{ display: "flex", gap: 4, marginLeft: 12 }}>
                <Button variant="ghost" size="icon-sm" onClick={() => { setEditCustomer(c); setDialogOpen(true); }}><Edit2 className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(c)} style={{ color: "#EF4444" }}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CustomerFormDialog
        open={dialogOpen}
        onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditCustomer(null); }}
        onSave={handleSave}
        customer={editCustomer}
      />
    </div>
  );
}
