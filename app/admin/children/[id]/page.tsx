"use client";
import React, { useEffect, useState } from "react";
import { getChild, updateChild, addReport, getChildReports, deleteReport } from "@/lib/db";
import type { Child, Report, PillarProgress } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Plus, Trash2, Star, BookOpen, Heart, ShieldCheck, X } from "lucide-react";
import Link from "next/link";

const PROGRESS_OPTIONS: { value: PillarProgress; label: string; color: string }[] = [
  { value: "not_started", label: "Not Started", color: "bg-gray-100 text-gray-600" },
  { value: "in_progress", label: "In Progress", color: "bg-yellow-100 text-yellow-700" },
  { value: "progressing", label: "Progressing", color: "bg-blue-100 text-blue-700" },
  { value: "completed", label: "Completed", color: "bg-green-100 text-green-700" },
];

export default function ChildProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [child, setChild] = useState<Child | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    title: "", christianLifeNote: "", educationNote: "", personalLifeNote: "",
    overallRating: 3, writtenBy: "",
  });
  const [submittingReport, setSubmittingReport] = useState(false);

  useEffect(() => {
    Promise.all([getChild(id), getChildReports(id)]).then(([c, r]) => {
      setChild(c); setReports(r); setLoading(false);
    });
  }, [id]);

  const handleProgressChange = (pillar: keyof Child["progress"], value: PillarProgress) => {
    if (!child) return;
    setChild(prev => prev ? {
      ...prev,
      progress: { ...prev.progress, [pillar]: value, lastUpdated: new Date().toISOString() }
    } : null);
  };

  const handleSave = async () => {
    if (!child) return;
    setSaving(true);
    await updateChild(id, { progress: child.progress, status: child.status });
    setSaving(false);
    alert("Saved successfully!");
  };

  const handleAddReport = async () => {
    if (!child || !reportForm.title || !reportForm.writtenBy) return;
    setSubmittingReport(true);
    await addReport({
      childId: id,
      childName: child.name,
      date: new Date().toISOString().split("T")[0],
      ...reportForm,
      overallRating: reportForm.overallRating as 1 | 2 | 3 | 4 | 5,
    });
    const updated = await getChildReports(id);
    setReports(updated);
    setReportModal(false);
    setReportForm({ title: "", christianLifeNote: "", educationNote: "", personalLifeNote: "", overallRating: 3, writtenBy: "" });
    setSubmittingReport(false);
  };

  const handleDeleteReport = async (rid: string) => {
    if (!confirm("Delete this report?")) return;
    await deleteReport(rid);
    setReports(prev => prev.filter(r => r.id !== rid));
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-ymoBlue" /></div>;
  if (!child) return <div className="text-center py-20 text-gray-400">Child not found. <Link href="/admin/children" className="text-blue-600 underline">Go back</Link></div>;

  const pillars = [
    { key: "christianLife" as const, label: "Christian Life", icon: <ShieldCheck size={18} /> },
    { key: "education" as const, label: "Education", icon: <BookOpen size={18} /> },
    { key: "personalLife" as const, label: "Personal Life", icon: <Heart size={18} /> },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/children" className="p-2 rounded-xl bg-white border border-gray-100 hover:bg-gray-50 transition">
          <ArrowLeft size={18} className="text-gray-500" />
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-black text-ymoBlue">{child.name}</h2>
          <p className="text-gray-400 text-sm">Age {child.age} · {child.gender} · {child.community} · Enrolled {child.enrolledDate}</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-ymoBlue text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-black transition disabled:opacity-50">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Changes
        </button>
      </div>

      {/* Status + Concern */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Status</label>
          <select value={child.status} onChange={e => setChild(prev => prev ? { ...prev, status: e.target.value as Child["status"] } : null)}
            className="w-full p-4 rounded-xl ring-1 ring-gray-200 outline-none focus:ring-2 focus:ring-ymoBlue">
            <option value="active">Active</option>
            <option value="graduated">Graduated</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Primary Concern</p>
          <p className="font-bold text-gray-700">{child.concern}</p>
        </div>
      </div>

      {/* Pillar Progress */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-black text-ymoBlue uppercase tracking-tight text-sm mb-6">Pillar Progress</h3>
        <div className="space-y-6">
          {pillars.map(p => (
            <div key={p.key}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-blue-600">{p.icon}</span>
                <span className="font-bold text-sm text-gray-700">{p.label}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {PROGRESS_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => handleProgressChange(p.key, opt.value)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition border-2 ${child.progress?.[p.key] === opt.value ? `${opt.color} border-current shadow-md` : "bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100"}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Progress Notes</label>
          <textarea
            value={child.progress?.notes || ""}
            onChange={e => setChild(prev => prev ? { ...prev, progress: { ...prev.progress, notes: e.target.value } } : null)}
            rows={3} placeholder="General notes about this child's progress..."
            className="w-full p-4 rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-ymoBlue outline-none text-sm"
          />
        </div>
      </div>

      {/* Reports */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-black text-ymoBlue uppercase tracking-tight text-sm">Progress Reports ({reports.length})</h3>
          <button onClick={() => setReportModal(true)} className="flex items-center gap-2 bg-ymoBlue text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-black transition">
            <Plus size={14} /> Add Report
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {reports.length === 0 && <p className="px-6 py-10 text-sm text-gray-400 text-center">No reports yet. Add the first one.</p>}
          {reports.map(r => (
            <div key={r.id} className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-gray-800">{r.title}</p>
                  <p className="text-xs text-gray-400">{r.date} · Written by {r.writtenBy}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(n => <Star key={n} size={12} className={n <= r.overallRating ? "text-ymoGold fill-ymoGold" : "text-gray-200"} />)}
                  </div>
                  <button onClick={() => handleDeleteReport(r.id)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                {[["Christian Life", r.christianLifeNote], ["Education", r.educationNote], ["Personal Life", r.personalLifeNote]].map(([label, note]) => (
                  <div key={label as string} className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{note || "—"}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Modal */}
      {reportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-black text-ymoBlue">New Progress Report</h3>
              <button onClick={() => setReportModal(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Report Title *</label>
                <input value={reportForm.title} onChange={e => setReportForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full p-4 rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-ymoBlue outline-none" placeholder="e.g. Monthly Review – January" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Christian Life Update</label>
                <textarea value={reportForm.christianLifeNote} onChange={e => setReportForm(p => ({ ...p, christianLifeNote: e.target.value }))}
                  rows={2} className="w-full p-4 rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-ymoBlue outline-none" placeholder="Spiritual progress..." />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Education Update</label>
                <textarea value={reportForm.educationNote} onChange={e => setReportForm(p => ({ ...p, educationNote: e.target.value }))}
                  rows={2} className="w-full p-4 rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-ymoBlue outline-none" placeholder="Academic progress..." />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Personal Life Update</label>
                <textarea value={reportForm.personalLifeNote} onChange={e => setReportForm(p => ({ ...p, personalLifeNote: e.target.value }))}
                  rows={2} className="w-full p-4 rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-ymoBlue outline-none" placeholder="Character & life skills..." />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Overall Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setReportForm(p => ({ ...p, overallRating: n }))}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition ${n <= reportForm.overallRating ? "bg-ymoGold text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Written By *</label>
                <input value={reportForm.writtenBy} onChange={e => setReportForm(p => ({ ...p, writtenBy: e.target.value }))}
                  className="w-full p-4 rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-ymoBlue outline-none" placeholder="Your name" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setReportModal(false)} className="flex-1 border border-gray-200 py-3 rounded-xl font-bold text-gray-500">Cancel</button>
              <button onClick={handleAddReport} disabled={submittingReport || !reportForm.title || !reportForm.writtenBy}
                className="flex-1 bg-ymoBlue text-white py-3 rounded-xl font-bold hover:bg-black transition disabled:opacity-50 flex items-center justify-center gap-2">
                {submittingReport ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
