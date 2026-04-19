"use client";

import React, { useState } from "react";
import { addReferral } from "@/lib/db";
import { CheckCircle, Loader2, ArrowRight, ShieldCheck, Users, ClipboardCheck } from "lucide-react";

export default function ReferralForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const G = "#40916C",
    GD = "#2D6A4F",
    GP = "#D8F3DC",
    BG = "#F0FAF4";

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
        childAge: Number(fd.get("childAge")) || undefined,
      });
      setSuccess(true);
    } catch {
      setError("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = {
    width: "100%",
    padding: "0.95rem 1.05rem",
    background: "#fff",
    border: "1.5px solid rgba(64,145,108,0.18)",
    borderRadius: 14,
    fontSize: "0.95rem",
    color: "#1a1a2e",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color .2s, box-shadow .2s",
  };

  const infoCards = [
    {
      icon: Users,
      title: "Who can submit",
      desc: "Guardians, educators, church leaders, or trusted community members can use this form.",
    },
    {
      icon: ClipboardCheck,
      title: "What happens next",
      desc: "The YMO team reviews the referral, assesses the child’s needs, and determines the best next step.",
    },
    {
      icon: ShieldCheck,
      title: "How it is handled",
      desc: "Information is collected confidentially and should include only details relevant to helping the child.",
    },
  ];

  return (
    <div style={{ padding: "5.5rem 1.5rem", background: "#fff" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              borderRadius: 999,
              padding: "0.45rem 0.9rem",
              background: "rgba(216,243,220,0.55)",
              border: "1px solid rgba(64,145,108,0.16)",
              marginBottom: "1rem",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: G }} />
            <span style={{ fontSize: "0.7rem", fontWeight: 800, color: G, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Confidential referral
            </span>
          </div>
          <h2
            style={{
              fontFamily: "Playfair Display,serif",
              fontSize: "clamp(2.1rem,4vw,3.2rem)",
              fontWeight: 700,
              color: "#1a1a2e",
              marginBottom: "0.9rem",
            }}
          >
            Child Identification Portal
          </h2>
          <p style={{ color: "#6b7280", lineHeight: 1.8, maxWidth: 700, margin: "0 auto" }}>
            Use this form to help YMO identify a child who may need support. Share the clearest information you have, and the team will review it with care and confidentiality.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          {infoCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                style={{
                  background: BG,
                  border: "1px solid rgba(64,145,108,0.12)",
                  borderRadius: 22,
                  padding: "1.25rem",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: G,
                    boxShadow: "0 4px 14px rgba(64,145,108,0.08)",
                  }}
                >
                  <Icon size={20} />
                </div>
                <h3
                  style={{
                    fontFamily: "Playfair Display,serif",
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "#1a1a2e",
                    margin: "0.9rem 0 0.45rem",
                  }}
                >
                  {card.title}
                </h3>
                <p style={{ color: "#6b7280", fontSize: "0.92rem", lineHeight: 1.7 }}>{card.desc}</p>
              </div>
            );
          })}
        </div>

        <div
          style={{
            background: BG,
            borderRadius: 28,
            padding: "clamp(1.5rem,5vw,3rem)",
            border: "1px solid rgba(64,145,108,0.15)",
            boxShadow: "0 12px 40px rgba(15,23,42,0.05)",
          }}
        >
          {success ? (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <div
                style={{
                  width: 84,
                  height: 84,
                  background: `linear-gradient(135deg, ${G}, ${GD})`,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  boxShadow: "0 12px 30px rgba(64,145,108,0.25)",
                }}
              >
                <CheckCircle size={38} color="#fff" />
              </div>
              <h3 style={{ fontFamily: "Playfair Display,serif", fontSize: "2rem", fontWeight: 700, color: "#1a1a2e", marginBottom: "0.75rem" }}>
                Referral submitted
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.8, marginBottom: "2rem", maxWidth: 560, marginInline: "auto" }}>
                Thank you. The YMO team will review this referral and determine the most appropriate next step based on the information provided.
              </p>
              <button
                onClick={() => setSuccess(false)}
                style={{
                  background: "none",
                  border: `2px solid ${G}`,
                  color: G,
                  padding: "0.8rem 2rem",
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Submit another referral
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#6b7280", marginBottom: "0.55rem" }}>
                    Referrer full name *
                  </label>
                  <input
                    name="referrerName"
                    required
                    placeholder="Your full name"
                    style={inp}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = G;
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(64,145,108,0.12)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(64,145,108,0.18)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#6b7280", marginBottom: "0.55rem" }}>
                    Relationship to child *
                  </label>
                  <input
                    name="relationship"
                    required
                    placeholder="Teacher, guardian, neighbour..."
                    style={inp}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = G;
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(64,145,108,0.12)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(64,145,108,0.18)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#6b7280", marginBottom: "0.55rem" }}>
                    Child&apos;s name
                  </label>
                  <input
                    name="childName"
                    placeholder="If known"
                    style={inp}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = G;
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(64,145,108,0.12)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(64,145,108,0.18)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#6b7280", marginBottom: "0.55rem" }}>
                    Child&apos;s age
                  </label>
                  <input
                    name="childAge"
                    type="number"
                    min="1"
                    max="18"
                    placeholder="If known"
                    style={inp}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = G;
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(64,145,108,0.12)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(64,145,108,0.18)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#6b7280", marginBottom: "0.55rem" }}>
                  Primary area of concern *
                </label>
                <select
                  name="concern"
                  required
                  style={{ ...inp, cursor: "pointer" }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = G;
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(64,145,108,0.12)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(64,145,108,0.18)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <option value="">Select an area...</option>
                  <option>Christian Life &amp; Faith</option>
                  <option>Education &amp; Academics</option>
                  <option>Personal &amp; Character Life</option>
                  <option>All of the Above</option>
                </select>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#6b7280", marginBottom: "0.55rem" }}>
                  Details *
                </label>
                <textarea
                  name="details"
                  required
                  rows={6}
                  placeholder="Describe the child’s situation, the support they may need, and any context that would help the YMO team understand the referral."
                  style={{ ...inp, resize: "vertical" }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = G;
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(64,145,108,0.12)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(64,145,108,0.18)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 14, padding: "0.95rem 1rem", color: "#dc2626", fontSize: "0.92rem", marginBottom: "1rem" }}>
                  {error}
                </div>
              )}

              <button
                disabled={loading}
                style={{
                  width: "100%",
                  background: loading ? "rgba(64,145,108,0.5)" : `linear-gradient(135deg, ${G}, ${GD})`,
                  color: "#fff",
                  border: "none",
                  padding: "1.15rem",
                  borderRadius: 16,
                  fontWeight: 800,
                  fontSize: "0.86rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                  transition: "all .2s",
                  boxShadow: "0 12px 30px rgba(64,145,108,0.2)",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <ArrowRight size={18} /> Submit referral to YMO
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
