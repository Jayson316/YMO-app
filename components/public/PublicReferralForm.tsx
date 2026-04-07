"use client";
import React, { useState } from "react";
import { addReferral } from "@/lib/db";
import { CheckCircle, Loader2 } from "lucide-react";

export default function PublicReferralForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      await addReferral({
        referrerName: fd.get("referrerName") as string,
        relationship: fd.get("relationship") as string,
        concern: fd.get("concern") as string,
        details: fd.get("details") as string,
        childName: fd.get("childName") as string,
        childAge: Number(fd.get("childAge")),
      });
      setSuccess(true);
    } catch (err) {
      setError("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-32 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-ymoBlue tracking-tight uppercase">Child Identification Portal</h2>
          <p className="text-gray-500 mt-4">Submit a referral. All data is confidential and reviewed by our team.</p>
        </div>
        <div className="bg-ymoLight p-8 md:p-16 rounded-[3rem] border border-gray-100 shadow-sm">
          {success ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-ymoBlue mb-2">Referral Submitted</h3>
              <p className="text-gray-500">Miss Edinia Ashitey and the YMO team will review this referral shortly.</p>
              <button onClick={() => setSuccess(false)} className="mt-8 text-blue-700 font-bold underline text-sm">Submit another referral</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Referrer Full Name *</label>
                  <input name="referrerName" required placeholder="Your full name" className="w-full bg-white p-5 rounded-2xl ring-1 ring-gray-200 focus:ring-2 focus:ring-ymoBlue outline-none transition" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Relationship to Child *</label>
                  <input name="relationship" required placeholder="e.g. Teacher, Neighbour, Parent" className="w-full bg-white p-5 rounded-2xl ring-1 ring-gray-200 focus:ring-2 focus:ring-ymoBlue outline-none transition" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Child's Name (if known)</label>
                  <input name="childName" placeholder="Child's name" className="w-full bg-white p-5 rounded-2xl ring-1 ring-gray-200 focus:ring-2 focus:ring-ymoBlue outline-none transition" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Child's Age (if known)</label>
                  <input name="childAge" type="number" min="1" max="18" placeholder="Age" className="w-full bg-white p-5 rounded-2xl ring-1 ring-gray-200 focus:ring-2 focus:ring-ymoBlue outline-none transition" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Primary Area of Concern *</label>
                <select name="concern" required className="w-full bg-white p-5 rounded-2xl ring-1 ring-gray-200 focus:ring-2 focus:ring-ymoBlue outline-none">
                  <option>Christian Life &amp; Faith</option>
                  <option>Education &amp; Academics</option>
                  <option>Personal &amp; Character Life</option>
                  <option>All of the Above</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Details — How can YMO help? *</label>
                <textarea name="details" required rows={5} placeholder="Describe the child's situation and what kind of support they need..." className="w-full bg-white p-5 rounded-2xl ring-1 ring-gray-200 focus:ring-2 focus:ring-ymoBlue outline-none transition" />
              </div>
              {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
              <button disabled={loading} className="w-full bg-ymoBlue text-white py-6 rounded-2xl font-black text-sm tracking-[0.2em] uppercase hover:bg-black transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3">
                {loading ? <><Loader2 size={20} className="animate-spin" /> Processing...</> : "Submit Referral to YMO"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
