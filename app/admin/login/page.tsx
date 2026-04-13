"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f1f17", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: 56, height: 56, background: "#40916C", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontFamily: "serif", fontWeight: 900, fontSize: "1.8rem", color: "#fff", fontStyle: "italic" }}>Y</div>
          <h1 style={{ fontFamily: "serif", fontSize: "1.8rem", fontWeight: 700, color: "#fff" }}>YMO Admin</h1>
        </div>
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(64,145,108,0.3)", borderRadius: 16, padding: "2rem" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.4rem" }}>Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@younginmind.org"
                style={{ width: "100%", padding: "0.85rem 1rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }} />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.4rem" }}>Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                style={{ width: "100%", padding: "0.85rem 1rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }} />
            </div>
            {error && <p style={{ color: "#f87171", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ width: "100%", background: "#40916C", color: "#fff", border: "none", padding: "0.9rem", borderRadius: 8, fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit" }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>← Back to website</Link>
        </p>
      </div>
    </div>
  );
}
