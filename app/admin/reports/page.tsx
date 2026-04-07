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

  useEffect(() => {
    getReports().then(r => { setReports(r); setLoading(false); });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this report?")) return;
    await deleteReport(id);
    setReports(prev => prev.filter(r => r.id !== id));
  };

  const filtered = reports.filter(r =>
    r.childName.toLowerCase().includes(search.toLowerCase()) ||
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  const avgRating = reports.length ? (reports.reduce((a, r) => a + r.overallRating, 0) / reports.length).toFixed(1) : "—";

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-ymoBlue" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-ymoBlue">Progress Reports</h2>
        <p className="text-gray-400 text-sm">{reports.length} reports · Avg rating: {avgRating} / 5</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Reports", value: reports.length },
          { label: "Avg Rating", value: `${avgRating} ★` },
          { label: "This Month", value: reports.filter(r => r.date.startsWith(new Date().toISOString().slice(0, 7))).length },
          { label: "Children Covered", value: new Set(reports.map(r => r.childId)).size },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-3xl font-black text-ymoBlue mb-1">{s.value}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by child name or report title..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-100 focus:ring-2 focus:ring-ymoBlue outline-none text-sm" />
      </div>

      {/* Reports List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center text-gray-400">
          <BarChart3 size={48} className="mx-auto mb-4 opacity-20" />
          <p className="font-bold">No reports found</p>
          <p className="text-sm mt-1">Add reports from individual child profiles.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-black text-gray-800 text-lg">{r.title}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <span className="font-bold text-blue-600">{r.childName}</span>
                    <span>·</span>
                    <span>{r.date}</span>
                    <span>·</span>
                    <span>By {r.writtenBy}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(n => <Star key={n} size={14} className={n <= r.overallRating ? "text-ymoGold fill-ymoGold" : "text-gray-200"} />)}
                  </div>
                  <Link href={`/admin/children/${r.childId}`} className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition" title="View Child">
                    <ArrowRight size={16} />
                  </Link>
                  <button onClick={() => handleDelete(r.id)} className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                {[["Christian Life", r.christianLifeNote], ["Education", r.educationNote], ["Personal Life", r.personalLifeNote]].map(([label, note]) => (
                  <div key={label as string} className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{label}</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{(note as string) || "No notes."}</p>
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
