"use client";
import React, { useEffect, useState } from "react";
import { getReferrals, updateReferralStatus, deleteReferral, addChild } from "@/lib/db";
import type { Referral } from "@/types";
import { CheckCircle, XCircle, Trash2, User, Loader2, AlertCircle, Eye, X } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  enrolled: "bg-blue-100 text-blue-700",
};

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | Referral["status"]>("all");
  const [selected, setSelected] = useState<Referral | null>(null);
  const [enrollModal, setEnrollModal] = useState<Referral | null>(null);
  const [enrollData, setEnrollData] = useState({ name: "", age: "", gender: "male", community: "" });
  const [enrolling, setEnrolling] = useState(false);

  const load = async () => {
    setLoading(true);
    setReferrals(await getReferrals());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleStatus = async (id: string, status: Referral["status"]) => {
    await updateReferralStatus(id, status);
    setReferrals(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this referral permanently?")) return;
    await deleteReferral(id);
    setReferrals(prev => prev.filter(r => r.id !== id));
    setSelected(null);
  };

  const handleEnroll = async () => {
    if (!enrollModal) return;
    setEnrolling(true);
    try {
      await addChild({
        name: enrollData.name || enrollModal.childName || "Unknown",
        age: Number(enrollData.age) || enrollModal.childAge || 0,
        gender: enrollData.gender as "male" | "female",
        community: enrollData.community,
        enrolledDate: new Date().toISOString().split("T")[0],
        referralId: enrollModal.id,
        concern: enrollModal.concern,
        status: "active",
        progress: {
          christianLife: "not_started",
          education: "not_started",
          personalLife: "not_started",
          notes: "",
          lastUpdated: new Date().toISOString(),
        },
      });
      await handleStatus(enrollModal.id, "enrolled");
      setEnrollModal(null);
      setEnrollData({ name: "", age: "", gender: "male", community: "" });
      alert("Child enrolled successfully!");
    } finally {
      setEnrolling(false);
    }
  };

  const filtered = filter === "all" ? referrals : referrals.filter(r => r.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-ymoBlue">Referral Inbox</h2>
          <p className="text-gray-400 text-sm">{referrals.filter(r => r.status === "pending").length} pending review</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "approved", "enrolled", "rejected"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition ${filter === f ? "bg-ymoBlue text-white" : "bg-white text-gray-400 border border-gray-100 hover:border-ymoBlue hover:text-ymoBlue"}`}>
            {f === "all" ? `All (${referrals.length})` : `${f} (${referrals.filter(r => r.status === f).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-ymoBlue" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <AlertCircle size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-bold">No referrals found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((r) => (
                <div key={r.id} className="flex items-start gap-4 p-5 hover:bg-gray-50 transition">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700 flex-shrink-0">
                    <User size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <p className="font-bold text-gray-800">{r.childName || "Unknown Child"}</p>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Referred by <strong>{r.referrerName}</strong> ({r.relationship}) · {r.concern}</p>
                    <p className="text-xs text-gray-400 truncate">{r.details}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setSelected(r)} className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition" title="View">
                      <Eye size={16} />
                    </button>
                    {r.status === "pending" && <>
                      <button onClick={() => handleStatus(r.id, "approved")} className="p-2 rounded-xl text-gray-400 hover:text-green-600 hover:bg-green-50 transition" title="Approve">
                        <CheckCircle size={16} />
                      </button>
                      <button onClick={() => handleStatus(r.id, "rejected")} className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition" title="Reject">
                        <XCircle size={16} />
                      </button>
                    </>}
                    {r.status === "approved" && (
                      <button onClick={() => { setEnrollModal(r); setEnrollData({ name: r.childName || "", age: String(r.childAge || ""), gender: "male", community: "" }); }}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition">
                        Enroll
                      </button>
                    )}
                    <button onClick={() => handleDelete(r.id)} className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-black text-ymoBlue">Referral Details</h3>
              <button onClick={() => setSelected(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="space-y-4 text-sm">
              <Row label="Child Name" value={selected.childName || "Not provided"} />
              <Row label="Child Age" value={selected.childAge ? `${selected.childAge} years` : "Not provided"} />
              <Row label="Referrer" value={selected.referrerName} />
              <Row label="Relationship" value={selected.relationship} />
              <Row label="Concern" value={selected.concern} />
              <Row label="Status" value={<span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${STATUS_COLORS[selected.status]}`}>{selected.status}</span>} />
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Details</p>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">{selected.details}</p>
              </div>
            </div>
            {selected.status === "pending" && (
              <div className="flex gap-3 mt-8">
                <button onClick={() => handleStatus(selected.id, "approved")} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition">Approve</button>
                <button onClick={() => handleStatus(selected.id, "rejected")} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition">Reject</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enroll Modal */}
      {enrollModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-xl font-black text-ymoBlue mb-6">Enroll Child into YMO</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Full Name *</label>
                <input value={enrollData.name} onChange={e => setEnrollData(p => ({ ...p, name: e.target.value }))} className="w-full p-4 rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-ymoBlue outline-none" placeholder="Child's full name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Age *</label>
                  <input type="number" value={enrollData.age} onChange={e => setEnrollData(p => ({ ...p, age: e.target.value }))} className="w-full p-4 rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-ymoBlue outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Gender *</label>
                  <select value={enrollData.gender} onChange={e => setEnrollData(p => ({ ...p, gender: e.target.value }))} className="w-full p-4 rounded-xl ring-1 ring-gray-200 outline-none">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Community *</label>
                <input value={enrollData.community} onChange={e => setEnrollData(p => ({ ...p, community: e.target.value }))} className="w-full p-4 rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-ymoBlue outline-none" placeholder="e.g. Accra, Kumasi" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEnrollModal(null)} className="flex-1 border border-gray-200 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleEnroll} disabled={enrolling || !enrollData.name || !enrollData.community} className="flex-1 bg-ymoBlue text-white py-3 rounded-xl font-bold hover:bg-black transition disabled:opacity-50 flex items-center justify-center gap-2">
                {enrolling ? <><Loader2 size={16} className="animate-spin" /> Enrolling...</> : "Enroll Child"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <p className="text-xs font-black uppercase tracking-widest text-gray-400 w-28 flex-shrink-0 pt-0.5">{label}</p>
      <p className="text-gray-700 font-medium">{value}</p>
    </div>
  );
}
