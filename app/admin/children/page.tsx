"use client";
import React, { useEffect, useState } from "react";
import { getChildren } from "@/lib/db";
import type { Child } from "@/types";
import Link from "next/link";
import { Users, Search, ArrowRight, Loader2, Shield, BookOpen, Heart, UserCheck, UserX, GraduationCap } from "lucide-react";

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => { getChildren().then(c => { setChildren(c); setLoading(false); }); }, []);

  const filtered = children.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.community?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all: children.length,
    active: children.filter(c => c.status === "active").length,
    graduated: children.filter(c => c.status === "graduated").length,
    inactive: children.filter(c => c.status === "inactive").length,
  };

  const pillarColor = (val: string | undefined) => {
    if (!val || val === "not_started") return "#e2e8f0";
    if (val === "in_progress") return "#f59e0b";
    if (val === "progressing") return "#3b82f6";
    if (val === "completed") return "#40916C";
    return "#e2e8f0";
  };

  const statusConfig: Record<string, { color: string; bg: string; icon: any }> = {
    active: { color: "#065f46", bg: "#d1fae5", icon: UserCheck },
    graduated: { color: "#1e40af", bg: "#dbeafe", icon: GraduationCap },
    inactive: { color: "#6b7280", bg: "#f3f4f6", icon: UserX },
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <Loader2 size={28} style={{ color: "#3b82f6", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f, #1d4ed8, #3b82f6)", borderRadius: 24, padding: "2rem 2.5rem", marginBottom: "1.5rem", position: "relative", overflow: "hidden", boxShadow: "0 20px 60px rgba(29,78,216,0.3)" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={20} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontFamily: "Playfair Display,serif", fontSize: "1.6rem", fontWeight: 700, color: "#fff", lineHeight: 1 }}>Children</h1>
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", marginTop: 3 }}>Manage enrolled children and track their progress</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "2rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
            {[{ label: "Total", value: counts.all }, { label: "Active", value: counts.active }, { label: "Graduated", value: counts.graduated }].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff" }}>{s.value}</div>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.55)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pillar legend */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "1rem 1.5rem", marginBottom: "1.25rem", border: "1px solid #f1f5f9", display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Pillar Status:</span>
        {[{ color: "#e2e8f0", label: "Not started" }, { color: "#f59e0b", label: "In progress" }, { color: "#3b82f6", label: "Progressing" }, { color: "#40916C", label: "Completed" }].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: l.color }} />
            <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or community..."
            style={{ width: "100%", paddingLeft: "2.5rem", paddingRight: "1rem", paddingTop: "0.8rem", paddingBottom: "0.8rem", background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }}
            onFocus={e => e.currentTarget.style.borderColor = "#3b82f6"}
            onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"} />
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["all", "active", "graduated", "inactive"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "0.5rem 1rem", borderRadius: 100, fontWeight: 700, fontSize: "0.8rem",
              border: "none", cursor: "pointer", fontFamily: "inherit", transition: "all .2s",
              background: filter === f ? "#3b82f6" : "#fff",
              color: filter === f ? "#fff" : "#64748b",
              boxShadow: filter === f ? "0 4px 12px rgba(59,130,246,0.3)" : "0 1px 4px rgba(0,0,0,0.06)",
            }}>
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f as keyof typeof counts]})
            </button>
          ))}
        </div>
      </div>

      {/* Children Grid */}
      {filtered.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", padding: "5rem", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
            <Users size={28} style={{ color: "#3b82f6" }} />
          </div>
          <p style={{ fontWeight: 700, color: "#64748b" }}>No children found</p>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "0.35rem" }}>Enroll children from the Referrals page</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1rem" }}>
          {filtered.map(c => {
            const sc = statusConfig[c.status] || statusConfig.active;
            return (
              <Link key={c.id} href={"/admin/children/" + c.id} style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", padding: "1.5rem", textDecoration: "none", display: "block", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", transition: "all .25s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Playfair Display,serif", fontWeight: 700, fontSize: "1.2rem", color: "#1d4ed8", flexShrink: 0 }}>
                      {c.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "1rem" }}>{c.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Age {c.age} · {c.gender}</div>
                    </div>
                  </div>
                  <span style={{ padding: "0.25rem 0.65rem", borderRadius: 100, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", background: sc.bg, color: sc.color }}>{c.status}</span>
                </div>

                {c.community && <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "1rem", background: "#f8fafc", padding: "0.5rem 0.75rem", borderRadius: 8 }}>📍 {c.community}</div>}

                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                  {[
                    { label: "CL", value: c.progress?.christianLife, icon: Shield, color: "#40916C" },
                    { label: "ED", value: c.progress?.education, icon: BookOpen, color: "#3b82f6" },
                    { label: "PL", value: c.progress?.personalLife, icon: Heart, color: "#ec4899" },
                  ].map(p => (
                    <div key={p.label} style={{ flex: 1, background: "#f8fafc", borderRadius: 10, padding: "0.6rem 0.5rem", textAlign: "center", border: "1.5px solid " + pillarColor(p.value) }}>
                      <p.icon size={14} style={{ color: pillarColor(p.value), display: "block", margin: "0 auto 3px" }} />
                      <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>{p.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{c.concern || "No concern noted"}</span>
                  <ArrowRight size={15} style={{ color: "#94a3b8" }} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
