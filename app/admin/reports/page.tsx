"use client";
import React, { useEffect, useState } from "react";
import { getReports, deleteReport } from "@/lib/db";
import type { Report } from "@/types";
import Link from "next/link";
import { BarChart3, Star, Trash2, ArrowRight, Loader2, Search, Shield, BookOpen, Heart, TrendingUp, FileText } from "lucide-react";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { getReports().then(r => { setReports(r); setLoading(false); }); }, []);

  const filtered = reports.filter(r =>
    r.childName.toLowerCase().includes(search.toLowerCase()) ||
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  const avgRating = reports.length ? (reports.reduce((a, r) => a + r.overallRating, 0) / reports.length).toFixed(1) : "—";
  const thisMonth = reports.filter(r => r.date?.startsWith(new Date().toISOString().slice(0, 7))).length;

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <Loader2 size={28} style={{ color: "#8b5cf6", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #4c1d95, #7c3aed, #8b5cf6)", borderRadius: 24, padding: "2rem 2.5rem", marginBottom: "1.5rem", position: "relative", overflow: "hidden", boxShadow: "0 20px 60px rgba(124,58,237,0.3)" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: 40, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BarChart3 size={20} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontFamily: "Playfair Display,serif", fontSize: "1.6rem", fontWeight: 700, color: "#fff", lineHeight: 1 }}>Progress Reports</h1>
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", marginTop: 3 }}>Track child development across all three pillars</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "2rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
            {[{ label: "Total Reports", value: reports.length }, { label: "Avg Rating", value: avgRating + " ★" }, { label: "This Month", value: thisMonth }].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff" }}>{s.value}</div>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.55)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total Reports", value: reports.length, color: "#8b5cf6", bg: "#ede9fe", icon: BarChart3 },
          { label: "Avg Rating", value: avgRating + " ★", color: "#f59e0b", bg: "#fef3c7", icon: Star },
          { label: "This Month", value: thisMonth, color: "#10b981", bg: "#d1fae5", icon: TrendingUp },
          { label: "Children", value: new Set(reports.map(r => r.childId)).size, color: "#3b82f6", bg: "#dbeafe", icon: FileText },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 18, padding: "1.25rem", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", transition: "all .25s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 25px rgba(0,0,0,0.08)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, marginBottom: "0.75rem" }}>
              <s.icon size={18} />
            </div>
            <div style={{ fontFamily: "Playfair Display,serif", fontSize: "2rem", fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.35rem" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "1.25rem" }}>
        <Search size={15} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by child name or report title..."
          style={{ width: "100%", paddingLeft: "2.5rem", paddingRight: "1rem", paddingTop: "0.8rem", paddingBottom: "0.8rem", background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, fontSize: "0.9rem", outline: "none", fontFamily: "inherit", transition: "border-color .2s" }}
          onFocus={e => e.currentTarget.style.borderColor = "#8b5cf6"}
          onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"} />
      </div>

      {/* Reports List */}
      {filtered.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", padding: "5rem", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
            <BarChart3 size={28} style={{ color: "#8b5cf6" }} />
          </div>
          <p style={{ fontWeight: 700, color: "#64748b", fontSize: "1rem" }}>No reports found</p>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "0.35rem" }}>Add reports from individual child profiles.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filtered.map(r => (
            <div key={r.id} style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", padding: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", transition: "all .25s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 30px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
                <div>
                  <div style={{ fontFamily: "Playfair Display,serif", fontSize: "1.2rem", fontWeight: 700, color: "#0f172a" }}>{r.title}</div>
                  <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.75rem", color: "#94a3b8", marginTop: 4, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, color: "#8b5cf6" }}>{r.childName}</span>
                    <span>·</span><span>{r.date}</span>
                    <span>·</span><span>By {r.writtenBy}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ display: "flex", gap: "3px" }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <Star key={n} size={15} style={{ color: n <= r.overallRating ? "#f59e0b" : "#e2e8f0", fill: n <= r.overallRating ? "#f59e0b" : "none" }} />
                    ))}
                  </div>
                  <Link href={"/admin/children/" + r.childId} style={{ width: 32, height: 32, background: "#f0fdf4", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#40916C" }}>
                    <ArrowRight size={14} />
                  </Link>
                  <button onClick={() => deleteReport(r.id).then(() => setReports(p => p.filter(x => x.id !== r.id)))}
                    style={{ width: 32, height: 32, background: "#fef2f2", border: "none", borderRadius: 8, cursor: "pointer", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "0.75rem" }}>
                {[
                  { label: "Christian Life", note: r.christianLifeNote, color: "#40916C", bg: "#f0fdf4", icon: Shield },
                  { label: "Education", note: r.educationNote, color: "#3b82f6", bg: "#eff6ff", icon: BookOpen },
                  { label: "Personal Life", note: r.personalLifeNote, color: "#ec4899", bg: "#fdf2f8", icon: Heart },
                ].map(pillar => (
                  <div key={pillar.label} style={{ background: pillar.bg, padding: "0.875rem", borderRadius: 12, border: "1px solid " + pillar.bg }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                      <pillar.icon size={13} style={{ color: pillar.color }} />
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: pillar.color }}>{pillar.label}</span>
                    </div>
                    <p style={{ fontSize: "0.82rem", color: "#475569", lineHeight: 1.5 }}>{pillar.note || "No notes."}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
