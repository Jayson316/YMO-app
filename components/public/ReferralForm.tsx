"use client";
import React, { useState } from "react";
import { addReferral } from "@/lib/db";
import { CheckCircle, Loader2, ArrowRight } from "lucide-react";

export default function ReferralForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const G = "#40916C", GD = "#2D6A4F", GP = "#D8F3DC", BG = "#F0FAF4";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true); setError("");
    const fd = new FormData(e.currentTarget);
    try {
      await addReferral({
        referrerName: fd.get("referrerName") as string,
        relationship: fd.get("relationship") as string,
        concern: fd.get("concern") as string,
        details: fd.get("details") as string,
        childName: fd.get("childName") as string,
        childAge: Number(fd.get("childAge")) || undefined,
      });
      setSuccess(true);
    } catch { setError("Submission failed. Please try again."); }
    finally { setLoading(false); }
  };

  const inp: React.CSSProperties = { width: "100%", padding: "0.9rem 1.1rem", background: "#fff", border: "1.5px solid rgba(64,145,108,0.2)", borderRadius: 10, fontSize: "0.92rem", color: "#1a1a2e", outline: "none", fontFamily: "inherit", transition: "border-color .2s, box-shadow .2s" };

  return (
    <div style={{ padding: "5rem 1.5rem", background: "#fff" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, color: G, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Confidential Referral</div>
          <h2 style={{ fontFamily: "Playfair Display,serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 700, color: "#1a1a2e", marginBottom: "0.75rem" }}>Child Identification Portal</h2>
          <div style={{ width: 50, height: 3, background: G, borderRadius: 2, margin: "0 auto 1rem" }} />
          <p style={{ color: "#6b7280", lineHeight: 1.7 }}>Submit a referral to our assessment team. All data is confidential and handled with care.</p>
        </div>
        <div style={{ background: BG, borderRadius: 24, padding: "clamp(1.5rem,5vw,3rem)", border: "1px solid rgba(64,145,108,0.15)" }}>
          {success ? (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <div style={{ width: 80, height: 80, background: G, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                <CheckCircle size={36} color="#fff" />
              </div>
              <h3 style={{ fontFamily: "Playfair Display,serif", fontSize: "2rem", fontWeight: 700, color: "#1a1a2e", marginBottom: "0.75rem" }}>Referral Submitted</h3>
              <p style={{ color: "#6b7280", lineHeight: 1.7, marginBottom: "2rem" }}>Miss Edinia Ashitey and the YMO team will review this referral shortly.</p>
              <button onClick={() => setSuccess(false)} style={{ background: "none", border: `2px solid ${G}`, color: G, padding: "0.75rem 2rem", borderRadius: 100, fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", fontFamily: "inherit" }}>Submit Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div><label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#6b7280", marginBottom: "0.5rem" }}>Referrer Full Name *</label><input name="referrerName" required placeholder="Your full name" style={inp} onFocus={e=>{e.currentTarget.style.borderColor=G;e.currentTarget.style.boxShadow="0 0 0 3px rgba(64,145,108,0.12)";}} onBlur={e=>{e.currentTarget.style.borderColor="rgba(64,145,108,0.2)";e.currentTarget.style.boxShadow="none";}} /></div>
                <div><label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#6b7280", marginBottom: "0.5rem" }}>Relationship to Child *</label><input name="relationship" required placeholder="e.g. Teacher, Neighbour" style={inp} onFocus={e=>{e.currentTarget.style.borderColor=G;e.currentTarget.style.boxShadow="0 0 0 3px rgba(64,145,108,0.12)";}} onBlur={e=>{e.currentTarget.style.borderColor="rgba(64,145,108,0.2)";e.currentTarget.style.boxShadow="none";}} /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div><label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#6b7280", marginBottom: "0.5rem" }}>Child's Name</label><input name="childName" placeholder="If known" style={inp} onFocus={e=>{e.currentTarget.style.borderColor=G;}} onBlur={e=>{e.currentTarget.style.borderColor="rgba(64,145,108,0.2)";}} /></div>
                <div><label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#6b7280", marginBottom: "0.5rem" }}>Child's Age</label><input name="childAge" type="number" min="1" max="18" placeholder="If known" style={inp} onFocus={e=>{e.currentTarget.style.borderColor=G;}} onBlur={e=>{e.currentTarget.style.borderColor="rgba(64,145,108,0.2)";}} /></div>
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#6b7280", marginBottom: "0.5rem" }}>Primary Area of Concern *</label>
                <select name="concern" required style={{ ...inp, cursor: "pointer" }} onFocus={e=>{e.currentTarget.style.borderColor=G;}} onBlur={e=>{e.currentTarget.style.borderColor="rgba(64,145,108,0.2)";}}>
                  <option value="">Select an area...</option>
                  <option>Christian Life &amp; Faith</option>
                  <option>Education &amp; Academics</option>
                  <option>Personal &amp; Character Life</option>
                  <option>All of the Above</option>
                </select>
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#6b7280", marginBottom: "0.5rem" }}>Details *</label>
                <textarea name="details" required rows={5} placeholder="Describe the child's situation and what kind of support they need..." style={{ ...inp, resize: "vertical" }} onFocus={e=>{e.currentTarget.style.borderColor=G;e.currentTarget.style.boxShadow="0 0 0 3px rgba(64,145,108,0.12)";}} onBlur={e=>{e.currentTarget.style.borderColor="rgba(64,145,108,0.2)";e.currentTarget.style.boxShadow="none";}} />
              </div>
              {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "0.875rem 1rem", color: "#dc2626", fontSize: "0.875rem", marginBottom: "1rem" }}>{error}</div>}
              <button disabled={loading} style={{ width: "100%", background: loading ? "rgba(64,145,108,0.5)" : G, color: "#fff", border: "none", padding: "1.1rem", borderRadius: 12, fontWeight: 800, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", transition: "all .2s" }}>
                {loading ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : <><ArrowRight size={18} /> Submit Referral to YMO</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
