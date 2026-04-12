"use client";
import React, { useEffect, useState } from "react";
import { getReports, deleteReport } from "@/lib/db";
import type { Report } from "@/types";
import Link from "next/link";
import { BarChart3, Star, Trash2, ArrowRight, Loader2, Search } from "lucide-react";

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

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}><Loader2 size={28} className="animate-spin" style={{ color: "#C9A84C" }} /></div>;

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.8rem", fontWeight: 700, color: "#0A0F1E" }}>Progress Reports</h2>
        <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>{reports.length} total · Avg rating: {avgRating}/5</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total Reports", value: reports.length },
          { label: "Avg Rating", value: `${avgRating} ★` },
          { label: "This Month", value: reports.filter(r => r.date.startsWith(new Date().toISOString().slice(0,7))).length },
          { label: "Children Covered", value: new Set(reports.map(r => r.childId)).size },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e0d4", padding: "1.25rem" }}>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2.2rem", fontWeight: 700, color: "#0A0F1E", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: "0.65rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.35rem" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ position: "relative", marginBottom: "1.25rem" }}>
        <Search size={15} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by child name or report title..."
          style={{ width: "100%", paddingLeft: "2.5rem", paddingRight: "1rem", paddingTop: "0.7rem", paddingBottom: "0.7rem", background: "#fff", border: "1px solid #e8e0d4", borderRadius: 10, fontSize: "0.9rem", outline: "none", fontFamily: "DM Sans, sans-serif" }} />
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8e0d4", padding: "5rem", textAlign: "center" }}>
          <BarChart3 size={48} style={{ color: "#e8e0d4", margin: "0 auto 1rem" }} />
          <p style={{ fontWeight: 600, color: "#94a3b8" }}>No reports found</p>
          <p style={{ fontSize: "0.85rem", color: "#cbd5e1", marginTop: "0.35rem" }}>Add reports from individual child profiles.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filtered.map(r => (
            <div key={r.id} style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8e0d4", padding: "1.5rem", transition: "box-shadow 0.2s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = "none"}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem", fontWeight: 700, color: "#0A0F1E" }}>{r.title}</div>
                  <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.75rem", color: "#94a3b8", marginTop: 4 }}>
                    <span style={{ fontWeight: 600, color: "#C9A84C" }}>{r.childName}</span>
                    <span>·</span><span>{r.date}</span>
                    <span>·</span><span>By {r.writtenBy}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {[1,2,3,4,5].map(n => <Star key={n} size={14} style={{ color: n <= r.overallRating ? "#C9A84C" : "#e8e0d4", fill: n <= r.overallRating ? "#C9A84C" : "none" }} />)}
                  </div>
                  <Link href={`/admin/children/${r.childId}`} style={{ padding: "0.4rem", background: "#f9f6f0", borderRadius: 8, color: "#64748b", display: "flex" }}><ArrowRight size={14} /></Link>
                  <button onClick={() => deleteReport(r.id).then(() => setReports(p => p.filter(x => x.id !== r.id)))} style={{ padding: "0.4rem", background: "#fef2f2", border: "none", borderRadius: 8, cursor: "pointer", color: "#ef4444", display: "flex" }}><Trash2 size={14} /></button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem" }}>
                {[["Christian Life", r.christianLifeNote], ["Education", r.educationNote], ["Personal Life", r.personalLifeNote]].map(([label, note]) => (
                  <div key={label as string} style={{ background: "#f9f6f0", padding: "1rem", borderRadius: 12 }}>
                    <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94a3b8", marginBottom: "0.35rem" }}>{label}</div>
                    <div style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.5 }}>{(note as string) || "No notes."}</div>
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
