"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { LayoutDashboard, Users, FileText, BarChart3, LogOut, Menu, X, Globe, Loader2 } from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/referrals", label: "Referrals", icon: FileText },
  { href: "/admin/children", label: "Children", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/admin/login");
  }, [user, loading, router]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0A0F1E", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Loader2 size={32} className="animate-spin" style={{ color: "#C9A84C" }} />
    </div>
  );
  if (!user) return null;

  const currentLabel = navItems.find(n => n.href === pathname)?.label ?? "Admin";

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#F9F6F0" }}>
      {/* Sidebar */}
      <aside style={{
        position: "fixed", inset: "0 auto 0 0", width: 240, zIndex: 50,
        background: "#0A0F1E", display: "flex", flexDirection: "column",
        borderRight: "1px solid rgba(201,168,76,0.15)",
        transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease",
      }} className="md:translate-x-0">
        {/* Logo */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: 36, height: 36,
              background: "linear-gradient(135deg, #C9A84C, #F0D080)",
              borderRadius: 8, display: "flex", alignItems: "center",
              justifyContent: "center", fontFamily: "Cormorant Garamond, serif",
              fontWeight: 700, fontSize: "1.1rem", color: "#0A0F1E", flexShrink: 0,
            }}>Y</div>
            <div>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "0.9rem", color: "#fff", lineHeight: 1 }}>YOUNG IN MIND</div>
              <div style={{ fontSize: "0.55rem", fontWeight: 700, color: "#C9A84C", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 3 }}>Admin Portal</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {navItems.map(item => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.75rem 1rem", borderRadius: 10, textDecoration: "none",
                background: active ? "rgba(201,168,76,0.12)" : "transparent",
                color: active ? "#C9A84C" : "rgba(255,255,255,0.45)",
                fontWeight: 600, fontSize: "0.85rem",
                borderLeft: active ? "3px solid #C9A84C" : "3px solid transparent",
                transition: "all 0.2s",
              }}>
                <item.icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: "0.75rem", borderTop: "1px solid rgba(201,168,76,0.1)", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <Link href="/" style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            padding: "0.75rem 1rem", borderRadius: 10, textDecoration: "none",
            color: "rgba(255,255,255,0.35)", fontWeight: 600, fontSize: "0.85rem",
            transition: "color 0.2s",
          }}>
            <Globe size={17} /> View Website
          </Link>
          <button onClick={logout} style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            padding: "0.75rem 1rem", borderRadius: 10,
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(239,68,68,0.6)", fontWeight: 600, fontSize: "0.85rem",
            width: "100%", textAlign: "left",
            transition: "color 0.2s",
          }}>
            <LogOut size={17} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 40 }} className="md:hidden" />}

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", marginLeft: 0 }} className="md:ml-60">
        {/* Header */}
        <header style={{
          background: "#fff", borderBottom: "1px solid #e8e0d4",
          padding: "0 1.5rem", height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button onClick={() => setMobileOpen(true)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#64748b", padding: "0.25rem",
            }} className="md:hidden">
              <Menu size={22} />
            </button>
            <div>
              <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem", fontWeight: 700, color: "#0A0F1E" }}>{currentLabel}</h1>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ textAlign: "right", display: "none" }} className="sm:block">
              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#0A0F1E" }}>{user.email}</div>
              <div style={{ fontSize: "0.65rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Administrator</div>
            </div>
            <div style={{
              width: 36, height: 36,
              background: "linear-gradient(135deg, #C9A84C, #F0D080)",
              borderRadius: 10, display: "flex", alignItems: "center",
              justifyContent: "center", fontWeight: 700, fontSize: "0.9rem", color: "#0A0F1E",
            }}>
              {user.email?.[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>{children}</main>
      </div>
    </div>
  );
}
