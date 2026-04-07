"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import {
  LayoutDashboard, Users, FileText, BarChart3,
  LogOut, Menu, X, Loader2, Home
} from "lucide-react";
import { useState } from "react";

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
    <div className="min-h-screen bg-ymoBlue flex items-center justify-center">
      <Loader2 size={40} className="animate-spin text-white" />
    </div>
  );
  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-ymoBlue text-white flex flex-col transform transition-transform md:relative md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center font-black italic text-lg border border-white/20">Y</div>
            <div>
              <p className="font-black text-sm tracking-tight leading-none">YOUNG IN MIND</p>
              <p className="text-blue-400 text-[9px] uppercase tracking-widest">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${active ? "bg-white text-ymoBlue shadow-lg" : "text-blue-300 hover:bg-white/10 hover:text-white"}`}>
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/10 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-blue-300 hover:bg-white/10 hover:text-white transition-all">
            <Home size={18} /> View Website
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setMobileOpen(true)} className="md:hidden text-gray-500 hover:text-ymoBlue">
            <Menu size={24} />
          </button>
          <div className="hidden md:block">
            <h1 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              {navItems.find(n => n.href === pathname)?.label ?? "Admin"}
            </h1>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gray-700">{user.email}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Administrator</p>
            </div>
            <div className="w-9 h-9 bg-ymoBlue rounded-xl flex items-center justify-center text-white font-black text-sm">
              {user.email?.[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
