"use client";
import React, { useEffect, useState } from "react";
import { getReferrals, getChildren, getReports } from "@/lib/db";
import type { Referral, Child, Report } from "@/types";
import Link from "next/link";
import { Users, FileText, BarChart3, Clock, TrendingUp, ArrowRight, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getReferrals(), getChildren(), getReports()]).then(([r, c, rp]) => {
      setReferrals(r); setChildren(c); setReports(rp); setLoading(false);
    });
  }, []);

  const pending = referrals.filter(r => r.status === "pending").length;
  const approved = referrals.filter(r => r.status === "approved").length;
  const active = children.filter(c => c.status === "active").length;

  const stats = [
    { label: "Total Referrals", value: referrals.length, icon: <FileText size={22} />, color: "bg-blue-50 text-blue-600", href: "/admin/referrals" },
    { label: "Pending Review", value: pending, icon: <Clock size={22} />, color: "bg-yellow-50 text-yellow-600", href: "/admin/referrals" },
    { label: "Active Children", value: active, icon: <Users size={22} />, color: "bg-green-50 text-green-600", href: "/admin/children" },
    { label: "Progress Reports", value: reports.length, icon: <BarChart3 size={22} />, color: "bg-purple-50 text-purple-600", href: "/admin/reports" },
  ];

  const statusIcon = (s: string) => {
    if (s === "approved" || s === "enrolled") return <CheckCircle size={14} className="text-green-500" />;
    if (s === "rejected") return <XCircle size={14} className="text-red-500" />;
    return <AlertCircle size={14} className="text-yellow-500" />;
  };

  const statusColor = (s: string) => {
    if (s === "approved" || s === "enrolled") return "bg-green-100 text-green-700";
    if (s === "rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-ymoBlue border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-ymoBlue text-white rounded-3xl p-8">
        <h2 className="text-2xl font-black mb-1">Welcome back, Miss Ashitey 👋</h2>
        <p className="text-blue-300 text-sm">Here's what's happening at YMO today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all group">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>{s.icon}</div>
            <p className="text-3xl font-black text-ymoBlue mb-1">{s.value}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Referrals */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-black text-ymoBlue uppercase tracking-tight text-sm">Recent Referrals</h3>
            <Link href="/admin/referrals" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          <div className="divide-y divide-gray-50">
            {referrals.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
                <div>
                  <p className="font-bold text-sm text-gray-800">{r.childName || "Unknown Child"}</p>
                  <p className="text-xs text-gray-400">by {r.referrerName} · {r.concern}</p>
                </div>
                <span className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full capitalize ${statusColor(r.status)}`}>
                  {statusIcon(r.status)} {r.status}
                </span>
              </div>
            ))}
            {referrals.length === 0 && <p className="px-6 py-8 text-sm text-gray-400 text-center">No referrals yet.</p>}
          </div>
        </div>

        {/* Active Children */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-black text-ymoBlue uppercase tracking-tight text-sm">Active Children</h3>
            <Link href="/admin/children" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          <div className="divide-y divide-gray-50">
            {children.filter(c => c.status === "active").slice(0, 5).map((c) => (
              <Link key={c.id} href={`/admin/children/${c.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700 font-black text-sm">
                    {c.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">{c.name}</p>
                    <p className="text-xs text-gray-400">Age {c.age} · {c.community}</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-gray-300" />
              </Link>
            ))}
            {children.filter(c => c.status === "active").length === 0 && (
              <p className="px-6 py-8 text-sm text-gray-400 text-center">No active children yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Pillar Overview */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-black text-ymoBlue uppercase tracking-tight text-sm mb-6">Pillar Progress Overview</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {["christianLife", "education", "personalLife"].map((pillar, i) => {
            const labels = ["Christian Life", "Education", "Personal Life"];
            const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500"];
            const inProgress = children.filter(c => (c.progress as any)?.[pillar] === "in_progress").length;
            const completed = children.filter(c => (c.progress as any)?.[pillar] === "completed").length;
            const total = children.length || 1;
            const pct = Math.round((completed / total) * 100);
            return (
              <div key={pillar}>
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">{labels[i]}</span>
                  <span className="text-xs font-bold text-gray-400">{pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${colors[i]} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{completed} completed · {inProgress} in progress</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
