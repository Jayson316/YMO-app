"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const { auth } = await import("@/lib/firebase");
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/dashboard");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f1f17", padding: "2rem" }}>
      <Link href="/" style={{ position: "fixed", top: "1.5rem", left: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "0.8rem", fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to Site
      </Link>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ width: 56, height: 56, background: "#40916C", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontFamily: "Playfair Display,serif", fontWeight: 900, fontSize: "1.8rem", color: "#fff", fontStyle: "italic" }}>Y</div>
          <h1 style={{ fontFamily: "Playfair Display,serif", fontSize: "1.8rem", fontWeight: 700, color: "#fff" }}>YMO Admin Portal</h1>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#40916C", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 6 }}>Young In Mind Organization</p>
        </div>
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(64,145,108,0.2)", borderRadius: 20, padding: "2.5rem", backdropFilter: "blur(20px)" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@younginmind.org"
                  style={{ width: "100%", padding: "0.9rem 1rem 0.9rem 2.75rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }} />
              </div>
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                <input type={showPass ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  style={{ width: "100%", padding: "0.9rem 2.75rem 0.9rem 2.75rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)" }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: 10, padding: "0.75rem 1rem", color: "#f87171", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</div>}
            <button disabled={loading} style={{ width: "100%", background: loading ? "rgba(64,145,108,0.4)" : "#40916C", color: "#fff", border: "none", padding: "1rem", borderRadius: 10, fontWeight: 700, fontSize: "0.85rem", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing In...</> : "Sign In to Dashboard"}
            </button>
          </form>
          <p style={{ textAlign: "center", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", marginTop: "1.5rem" }}>Access restricted to authorized YMO administrators only.</p>
        </div>
      </div>
    </div>
  );
}
