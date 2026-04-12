"use client";
import React, { useEffect, useState } from "react";
import { getChildren, deleteChild } from "@/lib/db";
import type { Child } from "@/types";
import Link from "next/link";
import { ArrowRight, Trash2, Search, Users, Loader2 } from "lucide-react";

const PROGRESS_DOT: Record<string, string> = {
  not_started: "#d1d5db", in_progress: "#f59e0b", progressing: "#3b82f6", completed: "#10b981",
};

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Child["status"]>("all");

  useEffect(() => { getChildren().then(c => { setChildren(c); setLoading(false); }); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove ${name} from YMO records?`)) return;
    await deleteChild(id); setChildren(prev => prev.filter(c => c.id !== id));
  };

  const filtered = children.filter(c => {
    const ms = c.name.toLowerCase().includes(search.toLowerCase()) || c.community.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === "all" || c.status === statusFilter;
    return ms && mf;
  });

  const statusBadge = (s: Child["status"]) => ({
    active: { bg: "#ecfdf5", color: "#059669" },
    graduated: { bg: "#eff6ff", color: "#2563eb" },
    inactive: { bg: "#f1f5f9", color: "#64748b" },
  })[s];

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}><Loader2 size={28} className="animate-spin" style={{ color: "#C9A84C" }} /></div>;

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.8rem", fontWeight: 700, color: "#0A0F1E" }}>Children</h2>
        <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>{children.filter(c => c.status === "active").length} active · {children.length} total</p>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or community..."
            style={{ width: "100%", paddingLeft: "2.5rem", paddingRight: "1rem", paddingTop: "0.7rem", paddingBottom: "0.7rem", background: "#fff", border: "1px solid #e8e0d4", borderRadius: 10, fontSize: "0.9rem", outline: "none", fontFamily: "DM Sans, sans-serif" }} />
        </div>
        {(["all", "active", "graduated", "inactive"] as const).map(f => (
          <button key={f} onClick={() => setStatusFilter(f)} style={{
            padding: "0.5rem 1rem", borderRadius: 100, fontWeight: 600, fontSize: "0.75rem",
            textTransform: "capitalize", cursor: "pointer", border: "1px solid",
            background: statusFilter === f ? "#0A0F1E" : "#fff",
            color: statusFilter === f ? "#fff" : "#64748b",
            borderColor: statusFilter === f ? "#0A0F1E" : "#e8e0d4",
          }}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8e0d4", padding: "5rem", textAlign: "center" }}>
          <Users size={48} style={{ color: "#e8e0d4", margin: "0 auto 1rem" }} />
          <p style={{ fontWeight: 600, color: "#94a3b8" }}>No children found</p>
          <p style={{ fontSize: "0.85rem", color: "#cbd5e1", marginTop: "0.35rem" }}>Enroll children through the Referrals page.</p>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8e0d4", overflow: "hidden" }}>
          {filtered.map(c => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.5rem", borderBottom: "1px solid #f9f6f0" }}>
              <div style={{
                width: 44, height: 44, background: "linear-gradient(135deg, #C9A84C, #F0D080)",
                borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "1.1rem",
                color: "#0A0F1E", flexShrink: 0,
              }}>{c.name[0]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.25rem" }}>
                  <span style={{ fontWeight: 600, color: "#0A0F1E" }}>{c.name}</span>
                  <span style={{ fontSize: "0.6rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 100, textTransform: "uppercase", letterSpacing: "0.08em", background: statusBadge(c.status)?.bg, color: statusBadge(c.status)?.color }}>{c.status}</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: "0.35rem" }}>Age {c.age} · {c.gender} · {c.community}</div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  {(["christianLife", "education", "personalLife"] as const).map(p => (
                    <div key={p} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: PROGRESS_DOT[c.progress?.[p] ?? "not_started"] }} />
                      <span style={{ fontSize: "0.6rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>{p === "christianLife" ? "Faith" : p === "personalLife" ? "Personal" : "Edu"}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                <Link href={`/admin/children/${c.id}`} style={{ padding: "0.5rem", background: "#f9f6f0", borderRadius: 8, color: "#64748b", display: "flex" }}><ArrowRight size={15} /></Link>
                <button onClick={() => handleDelete(c.id, c.name)} style={{ padding: "0.5rem", background: "#fef2f2", border: "none", borderRadius: 8, cursor: "pointer", color: "#ef4444", display: "flex" }}><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
