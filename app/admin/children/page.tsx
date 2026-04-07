"use client";
import React, { useEffect, useState } from "react";
import { getChildren, deleteChild } from "@/lib/db";
import type { Child } from "@/types";
import Link from "next/link";
import { ArrowRight, Trash2, Search, Users, Loader2 } from "lucide-react";

const PROGRESS_COLORS: Record<string, string> = {
  not_started: "bg-gray-200",
  in_progress: "bg-yellow-400",
  progressing: "bg-blue-400",
  completed: "bg-green-500",
};

const PROGRESS_LABELS: Record<string, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  progressing: "Progressing",
  completed: "Completed",
};

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Child["status"]>("all");

  const load = async () => {
    setLoading(true);
    setChildren(await getChildren());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove ${name} from YMO records?`)) return;
    await deleteChild(id);
    setChildren(prev => prev.filter(c => c.id !== id));
  };

  const filtered = children.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.community.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusColor = (s: Child["status"]) => {
    if (s === "active") return "bg-green-100 text-green-700";
    if (s === "graduated") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-600";
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-ymoBlue" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-black text-ymoBlue">Children</h2>
          <p className="text-gray-400 text-sm">{children.filter(c => c.status === "active").length} active · {children.length} total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or community..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-100 ring-1 ring-gray-100 focus:ring-2 focus:ring-ymoBlue outline-none text-sm" />
        </div>
        {(["all", "active", "graduated", "inactive"] as const).map(f => (
          <button key={f} onClick={() => setStatusFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition ${statusFilter === f ? "bg-ymoBlue text-white" : "bg-white text-gray-400 border border-gray-100 hover:border-ymoBlue"}`}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center text-gray-400">
          <Users size={48} className="mx-auto mb-4 opacity-20" />
          <p className="font-bold">No children found</p>
          <p className="text-sm mt-1">Enroll children through the Referrals page.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {filtered.map((c) => (
              <div key={c.id} className="flex items-center gap-4 p-5 hover:bg-gray-50 transition">
                <div className="w-11 h-11 bg-ymoBlue rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <p className="font-bold text-gray-800">{c.name}</p>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${statusColor(c.status)}`}>{c.status}</span>
                  </div>
                  <p className="text-xs text-gray-400">Age {c.age} · {c.gender} · {c.community}</p>
                  {/* Pillar mini-progress */}
                  <div className="flex gap-2 mt-2">
                    {(["christianLife", "education", "personalLife"] as const).map(p => (
                      <div key={p} className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${PROGRESS_COLORS[c.progress?.[p] ?? "not_started"]}`} />
                        <span className="text-[9px] text-gray-400 uppercase tracking-wider">{p === "christianLife" ? "Faith" : p === "personalLife" ? "Personal" : "Edu"}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/admin/children/${c.id}`} className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition">
                    <ArrowRight size={16} />
                  </Link>
                  <button onClick={() => handleDelete(c.id, c.name)} className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
