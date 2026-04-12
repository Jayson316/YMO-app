"use client";
import React, { useEffect, useState } from "react";
import { getReferrals, getChildren, getReports } from "@/lib/db";
import type { Referral, Child, Report } from "@/types";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { FileText, Users, BarChart3, Clock, ArrowRight, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getReferrals(), getChildren(), getReports()]).then(([r, c, rp]) => {
      setReferrals(r); setChildren(c); setReports(rp); setLoading(false);
    });
  }, []);

  const pending = referrals.filter(r => r.status === "pending").length;
  const active = children.filter(c => c.status === "active").length;

  const stats = [
    { label: "Total Referrals", value: referrals.length, icon: <FileText size={20} />, color: "#3b82f6", bg: "#eff6ff", href: "/admin/referrals" },
    { label: "Pending Review", value: pending, icon: <Clock size={20} />, color: "#f59e0b", bg: "#fffbeb", href: "/admin/referrals" },
    { label: "Active Children", value: active, icon: <Users size={20} />, color: "#10b981", bg: "#ecfdf5", href: "/admin/children" },
    { label: "Reports Written", value: reports.length, icon: <BarChart3 size={20} />, color: "#8b5cf6", bg: "#f5f3ff", href: "/admin/reports" },
  ];

  const statusIcon = (s: string) => {
    if (s === "approved" || s === "enrolled") return <CheckCircle size={14} color="#10b981" />;
    if (s === "rejected") return <XCircle size={14} color="#ef4444" />;
    return <AlertCircle size={14} color="#f59e0b" />;
  };
  const statusBadge = (s: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      pending: { bg: "#fffbeb", color: "#d97706" },
      approved: { bg: "#ecfdf5", color: "#059669" },
      rejected: { bg: "#fef2f2", color: "#dc2626" },
      enrolled: { bg: "#eff6ff", color: "#2563eb" },
    };
    return map[s] || { bg: "#f1f5f9", color: "#64748b" };
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
      <Loader2 size={32} className="animate-spin" style={{ color: "#C9A84C" }} />
    </div>
  );

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Welcome */}
      <div style={{
        background: "linear-gradient(135deg, #0A0F1E, #1E2A3A)",
        borderRadius: 20, padding: "2rem", marginBottom: "1.5rem",
        border: "1px solid rgba(201,168,76,0.15)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: "-20px", top: "-20px", width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)" }} />
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.8rem", fontWeight: 700, color: "#fff", marginBottom: "0.25rem" }}>
          Welcome back 👋
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>Here's what's happening at YMO today.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {stats.map(s => (
          <Link key={s.label} href={s.href} style={{
            background: "#fff", borderRadius: 16, padding: "1.5rem",
            border: "1px solid #e8e0d4", textDecoration: "none",
            display: "block", transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(0,0,0,0.08)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
            <div style={{ width: 44, height: 44, background: s.bg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, marginBottom: "1rem" }}>{s.icon}</div>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2.5rem", fontWeight: 700, color: "#0A0F1E", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.35rem" }}>{s.label}</div>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Recent Referrals */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8e0d4", overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f0ece4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "1.1rem", color: "#0A0F1E" }}>Recent Referrals</h3>
            <Link href="/admin/referrals" style={{ fontSize: "0.75rem", fontWeight: 600, color: "#C9A84C", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.25rem" }}>All <ArrowRight size={12} /></Link>
          </div>
          {referrals.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8", fontSize: "0.9rem" }}>No referrals yet</div>
          ) : (
            <div>
              {referrals.slice(0, 5).map(r => (
                <div key={r.id} style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #f9f6f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#0A0F1E" }}>{r.childName || "Unknown Child"}</div>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 2 }}>by {r.referrerName}</div>
                  </div>
                  <span style={{
                    display: "flex", alignItems: "center", gap: "0.35rem",
                    fontSize: "0.65rem", fontWeight: 700, padding: "0.3rem 0.75rem",
                    borderRadius: 100, textTransform: "uppercase", letterSpacing: "0.08em",
                    background: statusBadge(r.status).bg, color: statusBadge(r.status).color,
                  }}>
                    {statusIcon(r.status)} {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Children */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8e0d4", overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f0ece4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "1.1rem", color: "#0A0F1E" }}>Active Children</h3>
            <Link href="/admin/children" style={{ fontSize: "0.75rem", fontWeight: 600, color: "#C9A84C", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.25rem" }}>All <ArrowRight size={12} /></Link>
          </div>
          {children.filter(c => c.status === "active").length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8", fontSize: "0.9rem" }}>No active children yet</div>
          ) : (
            <div>
              {children.filter(c => c.status === "active").slice(0, 5).map(c => (
                <Link key={c.id} href={`/admin/children/${c.id}`} style={{
                  padding: "1rem 1.5rem", borderBottom: "1px solid #f9f6f0",
                  display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#fafaf8"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <div style={{
                    width: 36, height: 36,
                    background: "linear-gradient(135deg, #C9A84C, #F0D080)",
                    borderRadius: 10, display: "flex", alignItems: "center",
                    justifyContent: "center", fontWeight: 700, fontSize: "0.9rem", color: "#0A0F1E", flexShrink: 0,
                  }}>{c.name[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#0A0F1E" }}>{c.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Age {c.age} · {c.community}</div>
                  </div>
                  <ArrowRight size={14} color="#d1d5db" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pillar Progress */}
      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8e0d4", padding: "1.5rem" }}>
        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "1.1rem", color: "#0A0F1E", marginBottom: "1.5rem" }}>Pillar Progress Overview</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem" }}>
          {[
            { key: "christianLife", label: "Christian Life", color: "#3b82f6" },
            { key: "education", label: "Education", color: "#10b981" },
            { key: "personalLife", label: "Personal Life", color: "#8b5cf6" },
          ].map(p => {
            const completed = children.filter(c => (c.progress as any)?.[p.key] === "completed").length;
            const total = children.length || 1;
            const pct = Math.round((completed / total) * 100);
            return (
              <div key={p.key}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>{p.label}</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: p.color }}>{pct}%</span>
                </div>
                <div style={{ height: 6, background: "#f0ece4", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: p.color, borderRadius: 99, transition: "width 0.5s ease" }} />
                </div>
                <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "0.35rem" }}>{completed} of {children.length} completed</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
