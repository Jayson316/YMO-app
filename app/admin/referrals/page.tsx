"use client";
import React, { useEffect, useState } from "react";
import { getReferrals, updateReferralStatus, deleteReferral, addChild } from "@/lib/db";
import type { Referral } from "@/types";
import { CheckCircle, XCircle, Trash2, Eye, X, Loader2, AlertCircle, UserPlus } from "lucide-react";

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  pending: { bg: "#fffbeb", color: "#d97706" },
  approved: { bg: "#ecfdf5", color: "#059669" },
  rejected: { bg: "#fef2f2", color: "#dc2626" },
  enrolled: { bg: "#eff6ff", color: "#2563eb" },
};

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | Referral["status"]>("all");
  const [selected, setSelected] = useState<Referral | null>(null);
  const [enrollModal, setEnrollModal] = useState<Referral | null>(null);
  const [enrollData, setEnrollData] = useState({ name: "", age: "", gender: "male", community: "" });
  const [enrolling, setEnrolling] = useState(false);

  const load = async () => { setLoading(true); setReferrals(await getReferrals()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const handleStatus = async (id: string, status: Referral["status"]) => {
    await updateReferralStatus(id, status);
    setReferrals(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this referral?")) return;
    await deleteReferral(id);
    setReferrals(prev => prev.filter(r => r.id !== id));
    setSelected(null);
  };

  const handleEnroll = async () => {
    if (!enrollModal || !enrollData.name || !enrollData.community) return;
    setEnrolling(true);
    await addChild({
      name: enrollData.name, age: Number(enrollData.age) || 0,
      gender: enrollData.gender as "male" | "female",
      community: enrollData.community,
      enrolledDate: new Date().toISOString().split("T")[0],
      referralId: enrollModal.id, concern: enrollModal.concern, status: "active",
      progress: { christianLife: "not_started", education: "not_started", personalLife: "not_started", notes: "", lastUpdated: new Date().toISOString() },
    });
    await handleStatus(enrollModal.id, "enrolled");
    setEnrollModal(null);
    setEnrolling(false);
  };

  const filtered = filter === "all" ? referrals : referrals.filter(r => r.status === filter);

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.8rem", fontWeight: 700, color: "#0A0F1E" }}>Referral Inbox</h2>
        <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>{referrals.filter(r => r.status === "pending").length} pending review</p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        {(["all", "pending", "approved", "enrolled", "rejected"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "0.5rem 1rem", borderRadius: 100,
            background: filter === f ? "#0A0F1E" : "#fff",
            color: filter === f ? "#fff" : "#64748b",
            border: filter === f ? "none" : "1px solid #e8e0d4",
            fontWeight: 600, fontSize: "0.75rem", textTransform: "capitalize",
            cursor: "pointer", transition: "all 0.2s",
          }}>
            {f === "all" ? `All (${referrals.length})` : `${f} (${referrals.filter(r => r.status === f).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}><Loader2 size={28} className="animate-spin" style={{ color: "#C9A84C" }} /></div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8e0d4", overflow: "hidden" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "4rem", textAlign: "center" }}>
              <AlertCircle size={40} style={{ color: "#d1d5db", margin: "0 auto 1rem" }} />
              <p style={{ color: "#94a3b8", fontWeight: 600 }}>No referrals found</p>
            </div>
          ) : filtered.map(r => (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.5rem", borderBottom: "1px solid #f9f6f0" }}>
              <div style={{
                width: 40, height: 40, background: "#f0ece4", borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Cormorant Garamond, serif", fontWeight: 700, color: "#C9A84C", flexShrink: 0,
              }}>{(r.childName || "?")[0].toUpperCase()}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 600, color: "#0A0F1E", fontSize: "0.9rem" }}>{r.childName || "Unknown Child"}</span>
                  <span style={{
                    fontSize: "0.6rem", fontWeight: 700, padding: "0.2rem 0.6rem",
                    borderRadius: 100, textTransform: "uppercase", letterSpacing: "0.08em",
                    background: STATUS_STYLE[r.status]?.bg, color: STATUS_STYLE[r.status]?.color,
                  }}>{r.status}</span>
                </div>
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 2 }}>
                  By <strong>{r.referrerName}</strong> ({r.relationship}) · {r.concern}
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                <button onClick={() => setSelected(r)} style={{ padding: "0.5rem", background: "#f9f6f0", border: "none", borderRadius: 8, cursor: "pointer", color: "#64748b" }} title="View"><Eye size={15} /></button>
                {r.status === "pending" && <>
                  <button onClick={() => handleStatus(r.id, "approved")} style={{ padding: "0.5rem", background: "#ecfdf5", border: "none", borderRadius: 8, cursor: "pointer", color: "#10b981" }} title="Approve"><CheckCircle size={15} /></button>
                  <button onClick={() => handleStatus(r.id, "rejected")} style={{ padding: "0.5rem", background: "#fef2f2", border: "none", borderRadius: 8, cursor: "pointer", color: "#ef4444" }} title="Reject"><XCircle size={15} /></button>
                </>}
                {r.status === "approved" && (
                  <button onClick={() => { setEnrollModal(r); setEnrollData({ name: r.childName || "", age: String(r.childAge || ""), gender: "male", community: "" }); }} style={{ padding: "0.4rem 0.75rem", background: "#0A0F1E", border: "none", borderRadius: 8, cursor: "pointer", color: "#C9A84C", fontSize: "0.7rem", fontWeight: 700 }}>Enroll</button>
                )}
                <button onClick={() => handleDelete(r.id)} style={{ padding: "0.5rem", background: "#fef2f2", border: "none", borderRadius: 8, cursor: "pointer", color: "#ef4444" }} title="Delete"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={() => setSelected(null)}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "2rem", maxWidth: 480, width: "100%", maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.5rem", fontWeight: 700 }}>Referral Details</h3>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[["Child Name", selected.childName || "Not provided"], ["Child Age", selected.childAge ? `${selected.childAge} years` : "Not provided"], ["Referrer", selected.referrerName], ["Relationship", selected.relationship], ["Concern", selected.concern]].map(([label, value]) => (
                <div key={label} style={{ display: "flex", gap: "1rem" }}>
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94a3b8", width: 100, flexShrink: 0, paddingTop: 2 }}>{label}</span>
                  <span style={{ color: "#0A0F1E", fontSize: "0.9rem" }}>{value}</span>
                </div>
              ))}
              <div>
                <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94a3b8", display: "block", marginBottom: "0.5rem" }}>Details</span>
                <div style={{ background: "#f9f6f0", padding: "1rem", borderRadius: 12, fontSize: "0.9rem", color: "#0A0F1E", lineHeight: 1.7 }}>{selected.details}</div>
              </div>
            </div>
            {selected.status === "pending" && (
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button onClick={() => { handleStatus(selected.id, "approved"); setSelected(null); }} style={{ flex: 1, background: "#ecfdf5", border: "none", padding: "0.875rem", borderRadius: 10, color: "#059669", fontWeight: 700, cursor: "pointer" }}>✓ Approve</button>
                <button onClick={() => { handleStatus(selected.id, "rejected"); setSelected(null); }} style={{ flex: 1, background: "#fef2f2", border: "none", padding: "0.875rem", borderRadius: 10, color: "#dc2626", fontWeight: 700, cursor: "pointer" }}>✕ Reject</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enroll Modal */}
      {enrollModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "2rem", maxWidth: 440, width: "100%" }}>
            <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Enroll Child into YMO</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[["Full Name *", "name", "text", "Child's full name"], ["Community *", "community", "text", "e.g. Accra, Kumasi"]].map(([label, field, type, placeholder]) => (
                <div key={field as string}>
                  <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94a3b8", marginBottom: "0.4rem" }}>{label}</label>
                  <input type={type as string} value={(enrollData as any)[field as string]} onChange={e => setEnrollData(p => ({ ...p, [field as string]: e.target.value }))}
                    placeholder={placeholder as string} style={{ width: "100%", padding: "0.875rem 1rem", border: "1px solid #e8e0d4", borderRadius: 10, fontSize: "0.9rem", outline: "none", fontFamily: "DM Sans, sans-serif" }} />
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94a3b8", marginBottom: "0.4rem" }}>Age</label>
                  <input type="number" value={enrollData.age} onChange={e => setEnrollData(p => ({ ...p, age: e.target.value }))} style={{ width: "100%", padding: "0.875rem 1rem", border: "1px solid #e8e0d4", borderRadius: 10, fontSize: "0.9rem", outline: "none", fontFamily: "DM Sans, sans-serif" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94a3b8", marginBottom: "0.4rem" }}>Gender</label>
                  <select value={enrollData.gender} onChange={e => setEnrollData(p => ({ ...p, gender: e.target.value }))} style={{ width: "100%", padding: "0.875rem 1rem", border: "1px solid #e8e0d4", borderRadius: 10, fontSize: "0.9rem", outline: "none", fontFamily: "DM Sans, sans-serif" }}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
              <button onClick={() => setEnrollModal(null)} style={{ flex: 1, background: "#f9f6f0", border: "none", padding: "0.875rem", borderRadius: 10, fontWeight: 600, cursor: "pointer", color: "#64748b" }}>Cancel</button>
              <button onClick={handleEnroll} disabled={enrolling || !enrollData.name || !enrollData.community} style={{
                flex: 2, background: "linear-gradient(135deg, #C9A84C, #F0D080)", border: "none",
                padding: "0.875rem", borderRadius: 10, fontWeight: 700, cursor: "pointer",
                color: "#0A0F1E", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                opacity: (!enrollData.name || !enrollData.community) ? 0.5 : 1,
              }}>
                {enrolling ? <><Loader2 size={16} className="animate-spin" /> Enrolling...</> : <><UserPlus size={16} /> Enroll Child</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
