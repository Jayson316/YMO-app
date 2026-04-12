"use client";
import React, { useEffect, useState } from "react";
import { getChild, updateChild, addReport, getChildReports, deleteReport } from "@/lib/db";
import type { Child, Report, PillarProgress } from "@/types";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Plus, Trash2, Star, X, Shield, BookOpen, Heart } from "lucide-react";

const PROGRESS_OPTS: { value: PillarProgress; label: string; color: string; bg: string }[] = [
  { value: "not_started", label: "Not Started", color: "#94a3b8", bg: "#f1f5f9" },
  { value: "in_progress", label: "In Progress", color: "#d97706", bg: "#fffbeb" },
  { value: "progressing", label: "Progressing", color: "#2563eb", bg: "#eff6ff" },
  { value: "completed", label: "Completed", color: "#059669", bg: "#ecfdf5" },
];

export default function ChildProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [child, setChild] = useState<Child | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [rf, setRf] = useState({ title: "", christianLifeNote: "", educationNote: "", personalLifeNote: "", overallRating: 3, writtenBy: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([getChild(id), getChildReports(id)]).then(([c, r]) => { setChild(c); setReports(r); setLoading(false); });
  }, [id]);

  const handleSave = async () => {
    if (!child) return; setSaving(true);
    await updateChild(id, { progress: child.progress, status: child.status });
    setSaving(false);
  };

  const handleReport = async () => {
    if (!child || !rf.title || !rf.writtenBy) return; setSubmitting(true);
    await addReport({ childId: id, childName: child.name, date: new Date().toISOString().split("T")[0], ...rf, overallRating: rf.overallRating as 1|2|3|4|5 });
    setReports(await getChildReports(id));
    setReportModal(false); setRf({ title: "", christianLifeNote: "", educationNote: "", personalLifeNote: "", overallRating: 3, writtenBy: "" });
    setSubmitting(false);
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}><Loader2 size={28} className="animate-spin" style={{ color: "#C9A84C" }} /></div>;
  if (!child) return <div style={{ padding: "2rem", textAlign: "center" }}>Child not found. <Link href="/admin/children" style={{ color: "#C9A84C" }}>Go back</Link></div>;

  const pillars = [
    { key: "christianLife" as const, label: "Christian Life", icon: <Shield size={16} /> },
    { key: "education" as const, label: "Education", icon: <BookOpen size={16} /> },
    { key: "personalLife" as const, label: "Personal Life", icon: <Heart size={16} /> },
  ];

  const inputStyle: React.CSSProperties = { width: "100%", padding: "0.875rem 1rem", border: "1px solid #e8e0d4", borderRadius: 10, fontSize: "0.9rem", outline: "none", fontFamily: "DM Sans, sans-serif" };

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <Link href="/admin/children" style={{ padding: "0.5rem", background: "#fff", border: "1px solid #e8e0d4", borderRadius: 10, color: "#64748b", display: "flex", textDecoration: "none" }}><ArrowLeft size={18} /></Link>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.8rem", fontWeight: 700, color: "#0A0F1E" }}>{child.name}</h2>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Age {child.age} · {child.gender} · {child.community} · Enrolled {child.enrolledDate}</p>
        </div>
        <button onClick={handleSave} disabled={saving} style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          background: "linear-gradient(135deg, #C9A84C, #F0D080)", border: "none",
          padding: "0.75rem 1.5rem", borderRadius: 10, fontWeight: 700, fontSize: "0.85rem",
          cursor: saving ? "not-allowed" : "pointer", color: "#0A0F1E", opacity: saving ? 0.6 : 1,
        }}>
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "1.25rem" }}>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e0d4", padding: "1.25rem" }}>
          <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94a3b8", marginBottom: "0.5rem" }}>Status</label>
          <select value={child.status} onChange={e => setChild(p => p ? { ...p, status: e.target.value as Child["status"] } : null)} style={inputStyle}>
            <option value="active">Active</option>
            <option value="graduated">Graduated</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e0d4", padding: "1.25rem" }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94a3b8", marginBottom: "0.5rem" }}>Primary Concern</div>
          <div style={{ fontWeight: 600, color: "#0A0F1E" }}>{child.concern}</div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8e0d4", padding: "1.5rem", marginBottom: "1.25rem" }}>
        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem", fontWeight: 700, color: "#0A0F1E", marginBottom: "1.5rem" }}>Pillar Progress</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {pillars.map(p => (
            <div key={p.key}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", color: "#C9A84C" }}>
                {p.icon}
                <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "#0A0F1E" }}>{p.label}</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {PROGRESS_OPTS.map(opt => {
                  const active = child.progress?.[p.key] === opt.value;
                  return (
                    <button key={opt.value} onClick={() => setChild(prev => prev ? { ...prev, progress: { ...prev.progress, [p.key]: opt.value, lastUpdated: new Date().toISOString() } } : null)} style={{
                      padding: "0.5rem 1rem", borderRadius: 100, fontWeight: 600, fontSize: "0.8rem", cursor: "pointer",
                      background: active ? opt.bg : "#f9f6f0", color: active ? opt.color : "#94a3b8",
                      border: active ? `2px solid ${opt.color}` : "2px solid transparent",
                      transition: "all 0.15s",
                    }}>{opt.label}</button>
                  );
                })}
              </div>
            </div>
          ))}
          <div>
            <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94a3b8", marginBottom: "0.5rem" }}>Progress Notes</label>
            <textarea value={child.progress?.notes || ""} onChange={e => setChild(p => p ? { ...p, progress: { ...p.progress, notes: e.target.value } } : null)} rows={3} placeholder="General notes..." style={{ ...inputStyle, resize: "vertical" }} />
          </div>
        </div>
      </div>

      {/* Reports */}
      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8e0d4", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", borderBottom: "1px solid #f0ece4" }}>
          <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem", fontWeight: 700, color: "#0A0F1E" }}>Progress Reports ({reports.length})</h3>
          <button onClick={() => setReportModal(true)} style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            background: "#0A0F1E", color: "#C9A84C", border: "none",
            padding: "0.6rem 1.25rem", borderRadius: 10, fontWeight: 700, fontSize: "0.8rem", cursor: "pointer",
          }}><Plus size={14} /> Add Report</button>
        </div>
        {reports.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8", fontSize: "0.9rem" }}>No reports yet. Add the first one.</div>
        ) : reports.map(r => (
          <div key={r.id} style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f9f6f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
              <div>
                <div style={{ fontWeight: 700, color: "#0A0F1E" }}>{r.title}</div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{r.date} · By {r.writtenBy}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1,2,3,4,5].map(n => <Star key={n} size={12} style={{ color: n <= r.overallRating ? "#C9A84C" : "#e8e0d4", fill: n <= r.overallRating ? "#C9A84C" : "none" }} />)}
                </div>
                <button onClick={() => deleteReport(r.id).then(() => setReports(p => p.filter(x => x.id !== r.id)))} style={{ background: "none", border: "none", cursor: "pointer", color: "#d1d5db", padding: "0.25rem" }}><Trash2 size={14} /></button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem" }}>
              {[["Christian Life", r.christianLifeNote], ["Education", r.educationNote], ["Personal Life", r.personalLifeNote]].map(([label, note]) => (
                <div key={label as string} style={{ background: "#f9f6f0", padding: "0.875rem", borderRadius: 12 }}>
                  <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94a3b8", marginBottom: "0.35rem" }}>{label}</div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.5 }}>{(note as string) || "—"}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Report Modal */}
      {reportModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "2rem", maxWidth: 500, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.4rem", fontWeight: 700 }}>New Progress Report</h3>
              <button onClick={() => setReportModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[["Report Title *", "title", "text"], ["Written By *", "writtenBy", "text"]].map(([label, field, type]) => (
                <div key={field}>
                  <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94a3b8", marginBottom: "0.4rem" }}>{label}</label>
                  <input type={type} value={(rf as any)[field]} onChange={e => setRf(p => ({ ...p, [field]: e.target.value }))} style={inputStyle} placeholder={field === "title" ? "e.g. Monthly Review – January" : "Your name"} />
                </div>
              ))}
              {[["Christian Life Update", "christianLifeNote", "Spiritual progress..."], ["Education Update", "educationNote", "Academic progress..."], ["Personal Life Update", "personalLifeNote", "Character & life skills..."]].map(([label, field, placeholder]) => (
                <div key={field}>
                  <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94a3b8", marginBottom: "0.4rem" }}>{label}</label>
                  <textarea value={(rf as any)[field]} onChange={e => setRf(p => ({ ...p, [field]: e.target.value }))} rows={2} placeholder={placeholder} style={{ ...inputStyle, resize: "vertical" }} />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94a3b8", marginBottom: "0.5rem" }}>Overall Rating</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setRf(p => ({ ...p, overallRating: n }))} style={{
                      width: 40, height: 40, borderRadius: 10, fontWeight: 700, cursor: "pointer", border: "none",
                      background: n <= rf.overallRating ? "linear-gradient(135deg, #C9A84C, #F0D080)" : "#f9f6f0",
                      color: n <= rf.overallRating ? "#0A0F1E" : "#94a3b8",
                    }}>{n}</button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
              <button onClick={() => setReportModal(false)} style={{ flex: 1, background: "#f9f6f0", border: "none", padding: "0.875rem", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleReport} disabled={submitting || !rf.title || !rf.writtenBy} style={{
                flex: 2, background: "linear-gradient(135deg, #C9A84C, #F0D080)", border: "none",
                padding: "0.875rem", borderRadius: 10, fontWeight: 700, cursor: "pointer",
                color: "#0A0F1E", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                opacity: (!rf.title || !rf.writtenBy) ? 0.5 : 1,
              }}>
                {submitting ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
