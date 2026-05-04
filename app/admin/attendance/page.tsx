"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import { getChildren, getAttendanceByDate, saveAttendanceBatch, logAttendanceSession, getAllAttendance } from "@/lib/db";
import type { Child, AttendanceRecord, AttendanceStatus } from "@/types";
import {
  CalendarCheck, CheckCircle2, XCircle, Clock, ShieldCheck,
  Users, Search, Save, Loader2, ArrowRight, History, Sun, CalendarDays,
} from "lucide-react";

const G = "#40916C", GD = "#2D6A4F", GP = "#D8F3DC", BG = "#F0FAF4";

const statusOptions = [
  { key: "present" as const, label: "Present", color: "#065f46", bg: "#d1fae5", icon: CheckCircle2 },
  { key: "absent" as const, label: "Absent", color: "#991b1b", bg: "#fee2e2", icon: XCircle },
  { key: "late" as const, label: "Late", color: "#92400e", bg: "#fef3c7", icon: Clock },
  { key: "excused" as const, label: "Excused", color: "#1e40af", bg: "#dbeafe", icon: ShieldCheck },
];

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

export default function AttendancePage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [date, setDate] = useState(todayISO());
  const [session, setSession] = useState("Morning Session");
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [view, setView] = useState<"register" | "history">("register");

  useEffect(() => {
    Promise.all([getChildren(), getAllAttendance()])
      .then(([c, h]) => { setChildren(c); setHistory(h); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!date) return;
    getAttendanceByDate(date).then(records => {
      const map: Record<string, AttendanceStatus> = {};
      records.forEach(r => { if (!session || r.session === session) map[r.childId] = r.status; });
      setMarks(map);
    });
  }, [date, session]);

  const activeChildren = useMemo(() => children.filter(c => c.status === "active"), [children]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return activeChildren;
    return activeChildren.filter(c => c.name.toLowerCase().includes(q) || c.community?.toLowerCase().includes(q));
  }, [activeChildren, search]);

  const counts = useMemo(() => {
    let present = 0, absent = 0, late = 0, excused = 0;
    activeChildren.forEach(c => {
      const s = marks[c.id];
      if (s === "present") present++;
      else if (s === "absent") absent++;
      else if (s === "late") late++;
      else if (s === "excused") excused++;
    });
    return { total: activeChildren.length, present, absent, late, excused, unmarked: activeChildren.length - (present+absent+late+excused) };
  }, [activeChildren, marks]);

  const handleSave = async () => {
    setError("");
    if (!date) { setError("Please choose a date."); return; }
    const records = activeChildren.filter(c => marks[c.id]).map(c => ({
      childId: c.id, childName: c.name, date, status: marks[c.id], session,
    }));
    if (records.length === 0) { setError("Mark at least one child before saving."); return; }
    try {
      setSaving(true);
      await saveAttendanceBatch(records);
      await logAttendanceSession({ date, session, totalChildren: activeChildren.length, presentCount: counts.present, absentCount: counts.absent + counts.excused + counts.late });
      setHistory(await getAllAttendance());
      setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch (e) {
      setError("Could not save attendance. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const dateHistory = useMemo(() => {
    const map: Record<string, any> = {};
    history.forEach(r => {
      const key = `${r.date}__${r.session || ""}`;
      if (!map[key]) map[key] = { date: r.date, session: r.session, present: 0, absent: 0, total: 0 };
      map[key].total++;
      if (r.status === "present") map[key].present++;
      else map[key].absent++;
    });
    return Object.values(map).sort((a: any, b: any) => b.date.localeCompare(a.date));
  }, [history]);

  const card: React.CSSProperties = { background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" };

  if (loading) return (
    <AdminGuard>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <Loader2 size={28} style={{ color: G }} />
      </div>
    </AdminGuard>
  );

  return (
    <AdminGuard>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg, #2D6A4F 0%, #40916C 60%, #52b788 100%)", borderRadius: 24, padding: "1.75rem 2.25rem", marginBottom: "1.5rem", position: "relative", overflow: "hidden", boxShadow: "0 20px 60px rgba(45,106,79,0.25)" }}>
          <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.65)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Daily Register</p>
              <h1 style={{ fontFamily: "Playfair Display,serif", fontSize: "clamp(1.6rem,4vw,2.3rem)", fontWeight: 700, color: "#fff", lineHeight: 1.15 }}>Children Attendance</h1>
              <p style={{ color: "rgba(255,255,255,0.78)", marginTop: "0.4rem", fontSize: "0.9rem" }}>Mark which children are present today and save their attendance.</p>
            </div>
            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button onClick={() => setView("register")} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem", borderRadius: 100, fontSize: "0.76rem", fontWeight: 700, border: view === "register" ? "1px solid rgba(255,255,255,0.55)" : "1px solid rgba(255,255,255,0.2)", background: view === "register" ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}>
                <CalendarCheck size={14} /> Today&apos;s Register
              </button>
              <button onClick={() => setView("history")} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem", borderRadius: 100, fontSize: "0.76rem", fontWeight: 700, border: view === "history" ? "1px solid rgba(255,255,255,0.55)" : "1px solid rgba(255,255,255,0.2)", background: view === "history" ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}>
                <History size={14} /> History
              </button>
            </div>
          </div>
        </div>

        {view === "register" ? (
          <>
            <div style={{ ...card, padding: "1.25rem 1.5rem", marginBottom: "1.25rem", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.66rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "0.45rem" }}>Date</label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 0.85rem", border: "1px solid #e2e8f0", borderRadius: 12, background: "#fff" }}>
                  <CalendarDays size={15} color="#94a3b8" />
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "inherit", fontSize: "0.88rem" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.66rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "0.45rem" }}>Session</label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 0.85rem", border: "1px solid #e2e8f0", borderRadius: 12, background: "#fff" }}>
                  <Sun size={15} color="#94a3b8" />
                  <select value={session} onChange={e => setSession(e.target.value)} style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "inherit", fontSize: "0.88rem" }}>
                    <option>Morning Session</option>
                    <option>Afternoon Session</option>
                    <option>Sunday Service</option>
                    <option>Bible Study</option>
                    <option>Tutoring</option>
                    <option>Mentorship</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.66rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "0.45rem" }}>Search</label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 0.85rem", border: "1px solid #e2e8f0", borderRadius: 12, background: "#fff" }}>
                  <Search size={15} color="#94a3b8" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Name or community" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "inherit", fontSize: "0.88rem" }} />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
                <button onClick={() => { const next: Record<string,AttendanceStatus> = {}; activeChildren.forEach(c => { next[c.id] = "present"; }); setMarks(next); }} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.65rem 1rem", borderRadius: 100, fontSize: "0.76rem", fontWeight: 700, border: "1px solid #e2e8f0", background: "#d1fae5", color: "#065f46", cursor: "pointer" }}>Mark all present</button>
                <button onClick={() => setMarks({})} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.65rem 1rem", borderRadius: 100, fontSize: "0.76rem", fontWeight: 700, border: "1px solid #e2e8f0", background: "#f1f5f9", color: "#475569", cursor: "pointer" }}>Clear</button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "0.85rem", marginBottom: "1.25rem" }}>
              {[
                { label: "Total", value: counts.total, color: "#0f172a", bg: "#f1f5f9", icon: Users },
                { label: "Present", value: counts.present, color: "#065f46", bg: "#d1fae5", icon: CheckCircle2 },
                { label: "Absent", value: counts.absent, color: "#991b1b", bg: "#fee2e2", icon: XCircle },
                { label: "Late", value: counts.late, color: "#92400e", bg: "#fef3c7", icon: Clock },
                { label: "Excused", value: counts.excused, color: "#1e40af", bg: "#dbeafe", icon: ShieldCheck },
                { label: "Unmarked", value: counts.unmarked, color: "#475569", bg: "#e2e8f0", icon: Users },
              ].map(s => (
                <div key={s.label} style={{ ...card, padding: "1rem 1.1rem" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.5rem" }}>
                    <s.icon size={15} />
                  </div>
                  <div style={{ fontFamily: "Playfair Display,serif", fontSize: "1.7rem", fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ ...card, overflow: "hidden", marginBottom: "1.25rem" }}>
              {filtered.length === 0 ? (
                <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "#94a3b8" }}>
                  <Users size={26} style={{ marginBottom: "0.5rem", opacity: 0.5 }} />
                  <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#0f172a" }}>No active children</div>
                  <Link href="/admin/children" style={{ display: "inline-flex", marginTop: "1rem", alignItems: "center", gap: "0.4rem", color: G, fontWeight: 700, fontSize: "0.82rem", textDecoration: "none" }}>
                    Go to children <ArrowRight size={13} />
                  </Link>
                </div>
              ) : (
                filtered.map((c, i) => {
                  const status = marks[c.id];
                  return (
                    <div key={c.id} style={{ padding: "0.9rem 1.5rem", borderBottom: i === filtered.length - 1 ? "none" : "1px solid #f8fafc", display: "flex", alignItems: "center", gap: "0.85rem", flexWrap: "wrap" }}>
                      <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg,#40916C,#74C69D)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>
                        {c.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div style={{ flex: 1, minWidth: 180 }}>
                        <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#0f172a" }}>{c.name}</div>
                        <div style={{ fontSize: "0.74rem", color: "#94a3b8", marginTop: 2 }}>Age {c.age || "—"}{c.community ? ` · ${c.community}` : ""}</div>
                      </div>
                      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                        {statusOptions.map(opt => {
                          const active = status === opt.key;
                          const Icon = opt.icon;
                          return (
                            <button key={opt.key} onClick={() => setMarks(m => ({ ...m, [c.id]: opt.key }))} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.45rem 0.8rem", borderRadius: 100, fontSize: "0.74rem", fontWeight: 700, border: active ? `1.5px solid ${opt.color}` : "1px solid #e2e8f0", background: active ? opt.bg : "transparent", color: active ? opt.color : "#64748b", cursor: "pointer" }}>
                              <Icon size={13} /> {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", borderRadius: 14, padding: "0.85rem 1rem", marginBottom: "1rem", fontSize: "0.88rem" }}>{error}</div>}

            <div style={{ ...card, padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a" }}>Ready to save?</div>
                <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: 3 }}>
                  Saving for <strong>{date}</strong> · {session}.
                  {savedAt && <span style={{ color: G, marginLeft: 6 }}>Saved at {savedAt}</span>}
                </div>
              </div>
              <button disabled={saving} onClick={handleSave} style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem", background: saving ? "rgba(64,145,108,0.5)" : `linear-gradient(135deg, ${G}, ${GD})`, color: "#fff", border: "none", padding: "0.85rem 1.6rem", borderRadius: 100, fontSize: "0.84rem", fontWeight: 800, cursor: saving ? "not-allowed" : "pointer", boxShadow: "0 10px 25px rgba(64,145,108,0.25)" }}>
                {saving ? <><Loader2 size={15} /> Saving...</> : <><Save size={15} /> Save Attendance</>}
              </button>
            </div>
          </>
        ) : (
          <div style={{ ...card, overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <History size={16} style={{ color: G }} />
              <h3 style={{ fontFamily: "Playfair Display,serif", fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>Attendance History</h3>
            </div>
            {dateHistory.length === 0 ? (
              <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "#94a3b8" }}>
                <CalendarDays size={26} style={{ marginBottom: "0.5rem", opacity: 0.5 }} />
                <div style={{ fontSize: "0.95rem", fontWeight: 600 }}>No attendance recorded yet</div>
              </div>
            ) : (
              (dateHistory as any[]).map((h: any) => {
                const pct = h.total ? Math.round((h.present / h.total) * 100) : 0;
                return (
                  <div key={`${h.date}-${h.session}`} style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #f8fafc", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: GP, color: GD, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CalendarCheck size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.92rem" }}>
                        {new Date(h.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "#94a3b8", marginTop: 2 }}>{h.session} · {h.total} children</div>
                    </div>
                    <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.3rem 0.7rem", borderRadius: 100, fontSize: "0.7rem", fontWeight: 700, background: "#d1fae5", color: "#065f46" }}><CheckCircle2 size={12} /> {h.present} present</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.3rem 0.7rem", borderRadius: 100, fontSize: "0.7rem", fontWeight: 700, background: "#fee2e2", color: "#991b1b" }}><XCircle size={12} /> {h.absent} not present</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.3rem 0.7rem", borderRadius: 100, fontSize: "0.7rem", fontWeight: 700, background: GP, color: GD }}>{pct}% rate</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
