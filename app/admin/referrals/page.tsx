"use client";
import React, { useEffect, useState } from "react";
import { getReferrals, updateReferralStatus, deleteReferral, addChild } from "@/lib/db";
import type { Referral } from "@/types";
import { FileText, Clock, CheckCircle, XCircle, UserPlus, Trash2, Eye, X, Loader2, Search, Filter } from "lucide-react";

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Referral | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => { getReferrals().then(r => { setReferrals(r); setLoading(false); }); }, []);

  const filtered = referrals.filter(r => {
    const matchFilter = filter === "all" || r.status === filter;
    const matchSearch = r.childName?.toLowerCase().includes(search.toLowerCase()) || r.referrerName?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all: referrals.length,
    pending: referrals.filter(r => r.status === "pending").length,
    approved: referrals.filter(r => r.status === "approved").length,
    enrolled: referrals.filter(r => r.status === "enrolled").length,
    rejected: referrals.filter(r => r.status === "rejected").length,
  };

  const handleStatus = async (id: string, status: string) => {
    await updateReferralStatus(id, status as any);
    setReferrals(p => p.map(r => r.id === id ? { ...r, status: status as any } : r));
    if (selected?.id === id) setSelected(p => p ? { ...p, status: status as any } : null);
  };

  const handleEnroll = async (r: Referral) => {
    setEnrolling(true);
    try {
      await addChild({ name: r.childName || "Unknown", age: r.childAge || 0, gender: "male", community: "", referralId: r.id, concern: r.concern, status: "active", progress: { christianLife: "not_started", education: "not_started", personalLife: "not_started", notes: "", lastUpdated: new Date().toISOString() } });
      await updateReferralStatus(r.id, "enrolled");
      setReferrals(p => p.map(x => x.id === r.id ? { ...x, status: "enrolled" } : x));
      setSelected(null);
    } finally { setEnrolling(false); }
  };

  const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
    pending: { color: "#92400e", bg: "#fef3c7", label: "Pending" },
    approved: { color: "#065f46", bg: "#d1fae5", label: "Approved" },
    enrolled: { color: "#1e40af", bg: "#dbeafe", label: "Enrolled" },
    rejected: { color: "#991b1b", bg: "#fee2e2", label: "Rejected" },
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <Loader2 size={28} style={{ color: "#f59e0b", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #92400e, #d97706, #f59e0b)", borderRadius: 24, padding: "2rem 2.5rem", marginBottom: "1.5rem", position: "relative", overflow: "hidden", boxShadow: "0 20px 60px rgba(217,119,6,0.3)" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={20} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontFamily: "Playfair Display,serif", fontSize: "1.6rem", fontWeight: 700, color: "#fff", lineHeight: 1 }}>Referrals</h1>
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", marginTop: 3 }}>Review and manage child referrals</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "2rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
            {[{ label: "Total", value: counts.all }, { label: "Pending", value: counts.pending }, { label: "Enrolled", value: counts.enrolled }].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff" }}>{s.value}</div>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.55)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {[
          { key: "all", label: "All", icon: Filter },
          { key: "pending", label: "Pending", icon: Clock },
          { key: "approved", label: "Approved", icon: CheckCircle },
          { key: "enrolled", label: "Enrolled", icon: UserPlus },
          { key: "rejected", label: "Rejected", icon: XCircle },
        ].map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)} style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            padding: "0.5rem 1rem", borderRadius: 100, fontWeight: 700, fontSize: "0.8rem",
            border: "none", cursor: "pointer", fontFamily: "inherit", transition: "all .2s",
            background: filter === t.key ? "#f59e0b" : "#fff",
            color: filter === t.key ? "#fff" : "#64748b",
            boxShadow: filter === t.key ? "0 4px 12px rgba(245,158,11,0.3)" : "0 1px 4px rgba(0,0,0,0.06)",
          }}>
            <t.icon size={13} /> {t.label} ({counts[t.key as keyof typeof counts]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "1.25rem" }}>
        <Search size={15} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by child or referrer name..."
          style={{ width: "100%", paddingLeft: "2.5rem", paddingRight: "1rem", paddingTop: "0.8rem", paddingBottom: "0.8rem", background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }}
          onFocus={e => e.currentTarget.style.borderColor = "#f59e0b"}
          onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"} />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", padding: "5rem", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
            <FileText size={28} style={{ color: "#f59e0b" }} />
          </div>
          <p style={{ fontWeight: 700, color: "#64748b" }}>No referrals found</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filtered.map(r => {
            const sc = statusConfig[r.status] || statusConfig.pending;
            return (
              <div key={r.id} style={{ background: "#fff", borderRadius: 18, border: "1px solid #f1f5f9", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "all .2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Playfair Display,serif", fontWeight: 700, color: "#92400e", fontSize: "1rem", flexShrink: 0 }}>
                  {(r.childName || r.referrerName || "?")[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.95rem" }}>{r.childName || "Unknown child"}</div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 2 }}>Referred by {r.referrerName} · {r.relationship} · {r.concern}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                  <span style={{ padding: "0.3rem 0.75rem", borderRadius: 100, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", background: sc.bg, color: sc.color }}>{sc.label}</span>
                  <button onClick={() => setSelected(r)} style={{ width: 34, height: 34, background: "#f8fafc", border: "none", borderRadius: 8, cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}><Eye size={15} /></button>
                  {r.status === "pending" && <button onClick={() => handleStatus(r.id, "approved")} style={{ width: 34, height: 34, background: "#d1fae5", border: "none", borderRadius: 8, cursor: "pointer", color: "#065f46", display: "flex", alignItems: "center", justifyContent: "center" }}><CheckCircle size={15} /></button>}
                  {r.status === "approved" && <button onClick={() => handleEnroll(r)} disabled={enrolling} style={{ padding: "0.4rem 0.875rem", background: "#dbeafe", border: "none", borderRadius: 8, cursor: "pointer", color: "#1e40af", fontWeight: 700, fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.35rem", fontFamily: "inherit" }}><UserPlus size={13} /> Enroll</button>}
                  <button onClick={() => deleteReferral(r.id).then(() => setReferrals(p => p.filter(x => x.id !== r.id)))} style={{ width: 34, height: 34, background: "#fef2f2", border: "none", borderRadius: 8, cursor: "pointer", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={15} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={() => setSelected(null)}>
          <div style={{ background: "#fff", borderRadius: 24, padding: "2rem", maxWidth: 560, width: "100%", boxShadow: "0 25px 80px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "Playfair Display,serif", fontSize: "1.4rem", fontWeight: 700, color: "#0f172a" }}>Referral Details</h2>
              <button onClick={() => setSelected(null)} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "0.4rem", cursor: "pointer", color: "#64748b" }}><X size={18} /></button>
            </div>
            {[
              { label: "Child Name", value: selected.childName || "Not provided" },
              { label: "Child Age", value: selected.childAge ? selected.childAge + " years" : "Not provided" },
              { label: "Referred By", value: selected.referrerName },
              { label: "Relationship", value: selected.relationship },
              { label: "Primary Concern", value: selected.concern },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#94a3b8", marginBottom: "0.35rem" }}>{f.label}</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#0f172a" }}>{f.value}</div>
              </div>
            ))}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#94a3b8", marginBottom: "0.35rem" }}>Details</div>
              <div style={{ fontSize: "0.9rem", color: "#475569", lineHeight: 1.7, background: "#f8fafc", padding: "1rem", borderRadius: 12 }}>{selected.details}</div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {selected.status === "pending" && <button onClick={() => handleStatus(selected.id, "approved")} style={{ flex: 1, padding: "0.75rem", background: "#d1fae5", border: "none", borderRadius: 12, cursor: "pointer", color: "#065f46", fontWeight: 700, fontSize: "0.85rem", fontFamily: "inherit" }}>Approve</button>}
              {selected.status === "approved" && <button onClick={() => handleEnroll(selected)} disabled={enrolling} style={{ flex: 1, padding: "0.75rem", background: "#dbeafe", border: "none", borderRadius: 12, cursor: "pointer", color: "#1e40af", fontWeight: 700, fontSize: "0.85rem", fontFamily: "inherit" }}>{enrolling ? "Enrolling..." : "Enroll Child"}</button>}
              {selected.status === "pending" && <button onClick={() => handleStatus(selected.id, "rejected")} style={{ flex: 1, padding: "0.75rem", background: "#fee2e2", border: "none", borderRadius: 12, cursor: "pointer", color: "#dc2626", fontWeight: 700, fontSize: "0.85rem", fontFamily: "inherit" }}>Reject</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
