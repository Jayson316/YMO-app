"use client";
import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Loader2, Lock, Mail, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
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
      await login(email, password);
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ymoBlue flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white font-black text-2xl italic mx-auto mb-4 border border-white/20">Y</div>
          <h1 className="text-2xl font-black text-white tracking-tight">YMO Admin Portal</h1>
          <p className="text-blue-400 text-xs uppercase tracking-widest mt-1">Young In Mind Organization</p>
        </div>

        <div className="bg-white rounded-[2rem] p-10 shadow-2xl">
          <h2 className="text-xl font-black text-ymoBlue mb-8 text-center uppercase tracking-tight">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@younginmind.org"
                  className="w-full pl-12 pr-4 py-4 rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-ymoBlue outline-none transition bg-gray-50"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? "text" : "password"} required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-ymoBlue outline-none transition bg-gray-50"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {error && <div className="bg-red-50 text-red-600 text-sm font-bold p-4 rounded-xl">{error}</div>}
            <button disabled={loading} className="w-full bg-ymoBlue text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-black transition disabled:opacity-50 flex items-center justify-center gap-3">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Signing In...</> : "Sign In"}
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-8">
            Access restricted to authorized YMO administrators only.
          </p>
        </div>

        <p className="text-center mt-6">
          <a href="/" className="text-blue-400 text-xs font-bold hover:text-white transition">← Back to YMO Website</a>
        </p>
      </div>
    </div>
  );
}
