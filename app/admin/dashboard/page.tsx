"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getReferrals, getChildren, getReports } from "@/lib/db";
import type { Referral, Child, Report } from "@/types";
import {
  FileText, Users, BarChart3, Clock, TrendingUp,
  ArrowRight, CheckCircle, AlertCircle, UserPlus,
  Shield, BookOpen, Heart, Activity
} from "lucide-react";

const G = "#40916C", GD = "#2D6A4F", GL = "#74C69D", GP = "#D8F3DC", BG = "#F0FAF4";

export default function DashboardPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [now] = useState(new Date());

  useEffect(() => {
    Promise.all([getReferrals(), getChildren(), getReports()])
      .then(([r, c, rep]) => { setReferrals(r); setChildren(c); setReports(rep); })
      .finally(() => setLoading(false));
  }, []);

  const pending = referrals.filter(r => r.status === "pending").length;
  const active = children.filter(c => c.status === "active").length;
  const thisMonth = referrals.filter(r => r.createdAt?.toDate?.()?.getMonth?.() === now.getMonth()).length;

  const stats = [
    { label: "Total Referrals", value: referrals.length, icon: FileText, color: G, bg: GP, trend: "+12%" },
    { label: "Pending Review", value: pending, icon: Clock, color: "#f59e0b", bg: "#fef3c7", trend: "Needs action" },
    { label: "Active Children", value: active, icon: Users, color: "#3b82f6", bg: "#dbeafe", trend: "+3 this month" },
    { label: "Reports Written", value: reports.length, icon: BarChart3, color: "#8b5cf6", bg: "#ede9fe", trend: "All pillars" },
  ];

  const pillars = [
    { label: "Christian Life", icon: Shield, color: G, bg: GP, count: children.filter(c => (c.christianLifeProgress ?? 0) > 0).length },
    { label: "Education", icon: BookOpen, color: "#3b82f6", bg: "#dbeafe", count: children.filter(c => (c.educationProgress ?? 0) > 0).length },
    { label: "Personal Life", icon: Heart, color: "#ec4899", bg: "#fce7f3", count: children.filter(c => (c.personalLifeProgress ?? 0) > 0).length },
  ];

  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 48, height: 48, border: `3px solid ${GP}`, borderTopColor: G, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }} />
        <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Loading dashboard...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${GD} 0%, ${G} 60%, #52b788 100%)`,
        borderRadius: 24, padding: "2rem 2.5rem", marginBottom: "2rem",
        position: "relative", overflow: "hidden",
        boxShadow: `0 20px 60px rgba(45,106,79,0.3)`,
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, right: 80, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                {now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
              <h1 style={{ fontFamily: "Playfair Display,serif", fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
                {greeting} 👋
              </h1>
              <p style={{ color: "rgba(255,255,255,0.7)", marginTop: "0.4rem", fontSize: "0.95rem" }}>
                Here's what's happening at YMO today.
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link href="/admin/referrals" style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.25)", color: "#fff",
                padding: "0.65rem 1.25rem", borderRadius: 100,
                fontWeight: 700, fontSize: "0.8rem", textDecoration: "none",
                transition: "all .2s",
              }}>
                <UserPlus size={15} /> New Referral
              </Link>
              {pending > 0 && (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  background: "#fef3c7", color: "#92400e",
                  padding: "0.65rem 1.25rem", borderRadius: 100,
                  fontWeight: 700, fontSize: "0.8rem",
                }}>
                  <AlertCircle size={15} /> {pending} pending
                </div>
              )}
            </div>
          </div>

          {/* Quick stats inline */}
          <div style={{ display: "flex", gap: "2rem", marginTop: "1.75rem", flexWrap: "wrap" }}>
            {[
              { label: "This month", value: thisMonth + " referrals" },
              { label: "Active children", value: active + " enrolled" },
              { label: "Completion rate", value: reports.length > 0 ? Math.round((reports.length / Math.max(children.length, 1)) * 100) + "%" : "0%" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>{s.value}</div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.55)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: "#fff", borderRadius: 20, padding: "1.5rem",
            border: "1px solid #f1f5f9",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            transition: "all .25s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 30px rgba(0,0,0,0.1)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>
                <s.icon size={20} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8" }}>
                <TrendingUp size={12} /> {s.trend}
              </div>
            </div>
            <div style={{ fontFamily: "Playfair Display,serif", fontSize: "2.5rem", fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: "0.4rem" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>

        {/* Recent Referrals */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: G }} />
              <h3 style={{ fontFamily: "Playfair Display,serif", fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>Recent Referrals</h3>
            </div>
            <Link href="/admin/referrals" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", fontWeight: 700, color: G, textDecoration: "none" }}>
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ padding: "0.5rem 0" }}>
            {referrals.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: BG, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", color: G }}>
                  <FileText size={24} />
                </div>
                <p style={{ fontWeight: 600, color: "#64748b", fontSize: "0.9rem" }}>No referrals yet</p>
                <p style={{ color: "#94a3b8", fontSize: "0.8rem", marginTop: "0.25rem" }}>Referrals from the public form will appear here</p>
              </div>
            ) : referrals.slice(0, 5).map(r => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.85rem 1.5rem", borderBottom: "1px solid #f8fafc", transition: "background .2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = BG}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: GP, display: "flex", alignItems: "center", justifyContent: "center", color: G, flexShrink: 0, fontFamily: "Playfair Display,serif", fontWeight: 700, fontSize: "0.9rem" }}>
                  {(r.childName || r.referrerName || "?")[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.875rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {r.childName || "Unknown child"}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>By {r.referrerName}</div>
                </div>
                <div style={{
                  padding: "0.25rem 0.65rem", borderRadius: 100, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
                  background: r.status === "pending" ? "#fef3c7" : r.status === "approved" ? GP : "#fee2e2",
                  color: r.status === "pending" ? "#92400e" : r.status === "approved" ? GD : "#dc2626",
                }}>
                  {r.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Children */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6" }} />
              <h3 style={{ fontFamily: "Playfair Display,serif", fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>Active Children</h3>
            </div>
            <Link href="/admin/children" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", fontWeight: 700, color: G, textDecoration: "none" }}>
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ padding: "0.5rem 0" }}>
            {children.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", color: "#3b82f6" }}>
                  <Users size={24} />
                </div>
                <p style={{ fontWeight: 600, color: "#64748b", fontSize: "0.9rem" }}>No active children yet</p>
                <p style={{ color: "#94a3b8", fontSize: "0.8rem", marginTop: "0.25rem" }}>Enroll children from the Referrals page</p>
              </div>
            ) : children.filter(c => c.status === "active").slice(0, 5).map(c => (
              <Link key={c.id} href={`/admin/children/${c.id}`} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.85rem 1.5rem", borderBottom: "1px solid #f8fafc", textDecoration: "none", transition: "background .2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = BG}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", flexShrink: 0, fontFamily: "Playfair Display,serif", fontWeight: 700, fontSize: "0.9rem" }}>
                  {c.name[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.875rem" }}>{c.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Age {c.age} · {c.community || "YMO"}</div>
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                  {[c.christianLifeProgress, c.educationProgress, c.personalLifeProgress].map((p, i) => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: (p ?? 0) > 0 ? G : "#e2e8f0" }} />
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Pillar Progress */}
      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", padding: "1.5rem", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#8b5cf6" }} />
          <h3 style={{ fontFamily: "Playfair Display,serif", fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>Pillar Progress Overview</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1.25rem" }}>
          {pillars.map(p => {
            const pct = children.length > 0 ? Math.round((p.count / children.length) * 100) : 0;
            return (
              <div key={p.label} style={{ background: BG, borderRadius: 16, padding: "1.25rem", border: `1px solid rgba(64,145,108,0.1)` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", color: p.color }}>
                    <p.icon size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0f172a" }}>{p.label}</div>
                    <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{p.count} of {children.length} active</div>
                  </div>
                </div>
                <div style={{ height: 6, borderRadius: 100, background: "#e2e8f0", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 100, background: `linear-gradient(90deg, ${p.color}, ${p.color}cc)`, width: `${pct}%`, transition: "width 1s ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
                  <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Progress</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: p.color }}>{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem" }}>
        {[
          { label: "Review Referrals", desc: `${pending} pending`, href: "/admin/referrals", icon: FileText, color: G, bg: GP },
          { label: "View Children", desc: `${active} active`, href: "/admin/children", icon: Users, color: "#3b82f6", bg: "#dbeafe" },
          { label: "Write Reports", desc: `${reports.length} written`, href: "/admin/reports", icon: BarChart3, color: "#8b5cf6", bg: "#ede9fe" },
          { label: "Track Activity", desc: "All activity", href: "/admin/referrals", icon: Activity, color: "#ec4899", bg: "#fce7f3" },
        ].map(a => (
          <Link key={a.label} href={a.href} style={{
            background: "#fff", borderRadius: 18, padding: "1.25rem",
            border: "1px solid #f1f5f9", textDecoration: "none",
            display: "flex", alignItems: "center", gap: "0.875rem",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            transition: "all .25s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 25px rgba(0,0,0,0.09)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", color: a.color, flexShrink: 0 }}>
              <a.icon size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.875rem" }}>{a.label}</div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{a.desc}</div>
            </div>
            <ArrowRight size={15} style={{ color: "#cbd5e1", marginLeft: "auto" }} />
          </Link>
        ))}
      </div>
    </div>
  );
}
