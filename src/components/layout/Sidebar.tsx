"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Receipt, Users,
  CreditCard, BarChart2, Settings, LogOut, ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard",  href: "/dashboard",  icon: LayoutDashboard },
  { label: "Quotations", href: "/quotations",  icon: FileText },
  { label: "Invoices",   href: "/invoices",    icon: Receipt },
  { label: "Customers",  href: "/customers",   icon: Users },
  { label: "Payments",   href: "/payments",    icon: CreditCard },
  { label: "Reports",    href: "/reports",     icon: BarChart2 },
  { label: "Settings",   href: "/settings",    icon: Settings },
  { label: "Admin",      href: "/admin",       icon: ShieldCheck },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    router.push("/dashboard");
  }

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className="hidden lg:flex w-52 flex-shrink-0 flex-col h-screen sticky top-0"
      style={{ background: "#111111", borderRight: "1px solid #242424" }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 flex items-center gap-2.5">
        <img
          src="/logo.png"
          alt="Shiv Car Detailing Studio"
          className="flex-shrink-0 object-contain"
          style={{ width: 36, height: 36 }}
        />
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#F5F5F5", lineHeight: 1.2, letterSpacing: "-0.02em" }}>Shiv Car</p>
          <p style={{ fontSize: 10, fontWeight: 500, color: "#6B7280", letterSpacing: "0.04em", lineHeight: 1.4, textTransform: "uppercase" }}>Detailing Studio</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                background: active ? "rgba(220,38,38,0.12)" : "transparent",
                color: active ? "#F5F5F5" : "#9CA3AF",
                textDecoration: "none",
                transition: "background 0.1s, color 0.1s",
              }}
              onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "#1A1A1A"; (e.currentTarget as HTMLElement).style.color = "#E5E7EB"; } }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#9CA3AF"; } }}
            >
              <Icon style={{ width: 16, height: 16, flexShrink: 0, color: active ? "#DC2626" : "#4B5563" }} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5" style={{ borderTop: "1px solid #242424" }}>
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            padding: "8px 10px",
            marginTop: 8,
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 400,
            color: "#9CA3AF",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            transition: "background 0.1s, color 0.1s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(220,38,38,0.1)"; (e.currentTarget as HTMLElement).style.color = "#DC2626"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#9CA3AF"; }}
        >
          <LogOut style={{ width: 16, height: 16, flexShrink: 0 }} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
