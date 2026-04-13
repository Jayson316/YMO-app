"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, AuthProvider } from "@/lib/AuthContext";
import { LayoutDashboard, Users, FileText, BarChart3, LogOut, Menu, Globe, Loader2 } from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/referrals", label: "Referrals", icon: FileText },
  { href: "/admin/children", label: "Children", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/admin/login");
  }, [user, loading, router]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0f1f17", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Loader2 size={32} className="animate-spin" style={{ color: "#40916C" }} />
    </div>
  );
  if (!user) return null;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#F0FAF4" }}>
      <aside style={{ position: "fixed", inset: "0 auto 0 0", width: 240, zIndex: 50, background: "#0f1f17", display: "flex", flexDirection: "column", borderRight: "1px solid rgba(64,145,108,0.2)", transform: mobileOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.3s ease" }} className="md:translate-x-0">
        <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(64,145,108,0.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 36, height: 36, background: "#40916C", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Playfair Display,serif", fontWeight: 900, fontSize: "1.1rem", color: "#fff", fontStyle: "italic" }}>Y</div>
            <div>
              <div style={{ fontFamily: "Playfair Display,serif", fontWeight: 700, fontSize: "0.9rem", color: "#fff", lineHeight: 1 }}>YOUNG IN MIND</div>
              <div style={{ fontSize: "0.55rem", fontWeight: 700, color: "#40916C", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 3 }}>Admin Portal</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {navItems.map(item => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", borderRadius: 10, textDecoration: "none", background: active ? "rgba(64,145,108,0.15)" : "transparent", color: active ? "#40916C" : "rgba(255,255,255,0.45)", fontWeight: 600, fontSize: "0.85rem", borderLeft: active ? "3px solid #40916C" : "3px solid transparent", transition: "all 0.2s" }}>
                <item.icon size={17} />{item.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: "0.75rem", borderTop: "1px solid rgba(64,145,108,0.15)", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", borderRadius: 10, textDecoration: "none", color: "rgba(255,255,255,0.35)", fontWeight: 600, fontSize: "0.85rem" }}>
            <Globe size={17} /> View Website
          </Link>
          <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", borderRadius: 10, background: "none", border: "none", cursor: "pointer", color: "rgba(239,68,68,0.6)", fontWeight: 600, fontSize: "0.85rem", width: "100%", textAlign: "left", fontFamily: "inherit" }}>
            <LogOut size={17} /> Sign Out
          </button>
        </div>
      </aside>
      {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 40 }} className="md:hidden" />}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }} className="md:ml-60">
        <header style={{ background: "#fff", borderBottom: "1px solid rgba(64,145,108,0.1)", padding: "0 1.5rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }} className="md:hidden"><Menu size={22} /></button>
            <h1 style={{ fontFamily: "Playfair Display,serif", fontSize: "1.2rem", fontWeight: 700, color: "#1a1a2e" }}>{navItems.find(n => n.href === pathname)?.label ?? "Admin"}</h1>
          </div>
          <div style={{ width: 36, height: 36, background: "#40916C", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>
            {user.email?.[0].toUpperCase()}
          </div>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AuthProvider>
  );
}
