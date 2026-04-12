"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, Shield, BookOpen, Heart, ChevronDown } from "lucide-react";
import ReferralForm from "@/components/public/ReferralForm";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const G = "#40916C", GD = "#2D6A4F", GL = "#74C69D", GP = "#D8F3DC", BG = "#F0FAF4";

  return (
    <main style={{ background: "#fff", color: "#1a1a2e" }}>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(64,145,108,0.15)", boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.07)" : "none", transition: "box-shadow .3s", padding: "0 1.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: 38, height: 38, background: G, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Playfair Display,serif", fontWeight: 900, fontSize: "1.1rem", color: "#fff", fontStyle: "italic" }}>Y</div>
            <div>
              <div style={{ fontFamily: "Playfair Display,serif", fontWeight: 700, fontSize: "1rem", color: "#1a1a2e", lineHeight: 1 }}>YOUNG IN MIND</div>
              <div style={{ fontSize: "0.55rem", fontWeight: 700, color: G, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 2 }}>Organization</div>
            </div>
          </div>
          <div className="hidden md:flex" style={{ alignItems: "center", gap: "0.25rem" }}>
            {[["#about","Mission"],["#pillars","Our Pillars"],["#process","Process"],["#refer","Refer a Child"]].map(([h,l]) => (
              <a key={h} href={h} style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6b7280", textDecoration: "none", padding: "0.5rem 0.875rem", borderRadius: 8, transition: "all .2s" }} onMouseEnter={e=>{(e.currentTarget as any).style.color=G;(e.currentTarget as any).style.background=BG;}} onMouseLeave={e=>{(e.currentTarget as any).style.color="#6b7280";(e.currentTarget as any).style.background="transparent";}}>{l}</a>
            ))}
          </div>
          <div className="hidden md:flex" style={{ alignItems: "center", gap: "0.75rem" }}>
            <Link href="/admin/login" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6b7280", textDecoration: "none", padding: "0.5rem 1rem", border: "1px solid #e5e7eb", borderRadius: 8 }}>Admin</Link>
            <button style={{ background: G, color: "#fff", border: "none", padding: "0.6rem 1.4rem", borderRadius: 100, fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit" }}>Donate</button>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden" style={{ background: "none", border: "none", cursor: "pointer", color: "#1a1a2e", padding: "0.25rem" }}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {menuOpen && (
          <div style={{ background: "#fff", borderTop: `1px solid ${BG}`, padding: "1rem 1.5rem 1.5rem" }}>
            {[["#about","Mission"],["#pillars","Our Pillars"],["#process","Process"],["#refer","Refer a Child"]].map(([h,l]) => (
              <a key={h} href={h} onClick={()=>setMenuOpen(false)} style={{ display: "block", padding: "0.75rem 0", fontSize: "1rem", fontWeight: 600, color: "#1a1a2e", textDecoration: "none", borderBottom: "1px solid #f3f4f6" }}>{l}</a>
            ))}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
              <Link href="/admin/login" onClick={()=>setMenuOpen(false)} style={{ flex: 1, textAlign: "center", padding: "0.75rem", border: "1px solid #e5e7eb", borderRadius: 10, fontWeight: 700, fontSize: "0.85rem", color: "#6b7280", textDecoration: "none" }}>Admin</Link>
              <button style={{ flex: 1, background: G, color: "#fff", border: "none", padding: "0.75rem", borderRadius: 10, fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", fontFamily: "inherit" }}>Donate</button>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "92vh", marginTop: 68, position: "relative", overflow: "hidden", display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(0,0,0,0.52),rgba(0,0,0,0.45)),url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80')`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 1.5rem", position: "relative", zIndex: 1, width: "100%" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(64,145,108,0.85)", backdropFilter: "blur(8px)", borderRadius: 100, padding: "0.4rem 1rem", marginBottom: "1.5rem" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: GL }} />
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#fff", letterSpacing: "0.2em", textTransform: "uppercase" }}>Faith · Education · Character</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display,serif", fontSize: "clamp(2.8rem,7vw,5.5rem)", fontWeight: 900, color: "#fff", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>
            Transforming Lives<br />Through <em style={{ color: GL }}>Faith &amp; Support</em>
          </h1>
          <p style={{ fontSize: "clamp(1rem,2vw,1.15rem)", color: "rgba(255,255,255,0.82)", lineHeight: 1.8, maxWidth: 540, marginBottom: "2rem" }}>
            Supporting vulnerable children through education, care, and Christian values — giving them the foundation to become responsible leaders in society.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a href="#refer" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", background: "#fff", color: GD, padding: "0.9rem 1.75rem", borderRadius: 10, fontWeight: 800, fontSize: "0.9rem", textDecoration: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
              Refer a Child <ArrowRight size={16} />
            </a>
            <a href="#about" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", border: "2px solid rgba(255,255,255,0.6)", color: "#fff", padding: "0.9rem 1.75rem", borderRadius: 10, fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}>
              Learn More
            </a>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem", color: "rgba(255,255,255,0.4)" }}>
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>Scroll</span>
          <ChevronDown size={16} />
        </div>
      </section>

      {/* WHO WE ARE */}
      <section id="about" style={{ background: "#fff", padding: "2.5rem 1.5rem", borderBottom: `2px solid ${GP}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "#6b7280" }}>
            <strong style={{ color: "#1a1a2e" }}>Who We Are:</strong> YMO is a Christian organization dedicated to improving the lives of children through education, support, and faith-driven initiatives. We identify children who have been overlooked by traditional support systems and walk alongside them on their journey to becoming committed Christians and responsible citizens.
          </p>
        </div>
      </section>

      {/* PILLARS */}
      <section id="pillars" style={{ background: BG, padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: G, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Our Foundation</div>
            <h2 style={{ fontFamily: "Playfair Display,serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 700, color: "#1a1a2e", marginBottom: "0.75rem" }}>Our Three-Fold Commitment</h2>
            <div style={{ width: 50, height: 3, background: G, borderRadius: 2, margin: "0 auto 1rem" }} />
            <p style={{ color: "#6b7280", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>Focusing on the areas critical to a child's success in this life and the next.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.5rem" }}>
            {[
              { icon: <Shield size={26}/>, title: "Christian Life", desc: "Nurturing a deep, committed relationship with God through scriptural literacy, prayer, and discipleship.", num: "01", featured: false },
              { icon: <BookOpen size={26}/>, title: "Education", desc: "Bridging academic gaps by providing resources, tutoring, and structured support for children in underserved communities.", num: "02", featured: true },
              { icon: <Heart size={26}/>, title: "Personal Life", desc: "Character building and life skills training to develop responsible, ethical, and high-functioning citizens.", num: "03", featured: false },
            ].map(p => (
              <div key={p.title} style={{ background: p.featured ? GD : "#fff", borderRadius: 18, padding: "2.5rem", border: p.featured ? "none" : `1px solid rgba(64,145,108,0.12)`, position: "relative", overflow: "hidden", boxShadow: p.featured ? `0 20px 50px rgba(45,106,79,0.25)` : "none", transition: "all .3s" }}
                onMouseEnter={e=>{if(!p.featured){(e.currentTarget as any).style.transform="translateY(-6px)";(e.currentTarget as any).style.boxShadow="0 20px 50px rgba(64,145,108,0.15)";}}}
                onMouseLeave={e=>{if(!p.featured){(e.currentTarget as any).style.transform="translateY(0)";(e.currentTarget as any).style.boxShadow="none";}}}>
                <div style={{ position: "absolute", bottom: "1rem", right: "1.5rem", fontFamily: "Playfair Display,serif", fontSize: "4rem", fontWeight: 900, color: p.featured ? "rgba(255,255,255,0.06)" : "rgba(64,145,108,0.06)", lineHeight: 1, pointerEvents: "none" }}>{p.num}</div>
                <div style={{ width: 56, height: 56, background: p.featured ? "rgba(255,255,255,0.15)" : GP, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem", color: p.featured ? "#fff" : G }}>{p.icon}</div>
                <h3 style={{ fontFamily: "Playfair Display,serif", fontSize: "1.4rem", fontWeight: 700, color: p.featured ? "#fff" : "#1a1a2e", marginBottom: "0.75rem" }}>{p.title}</h3>
                <div style={{ width: 30, height: 2, background: p.featured ? GL : G, marginBottom: "1rem" }} />
                <p style={{ color: p.featured ? "rgba(255,255,255,0.7)" : "#6b7280", lineHeight: 1.7, fontSize: "0.92rem" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section style={{ background: "#fff", padding: "5rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, color: G, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Numbers That Matter</div>
          <h2 style={{ fontFamily: "Playfair Display,serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 700, color: "#1a1a2e", marginBottom: "0.75rem" }}>Our Impact</h2>
          <div style={{ width: 50, height: 3, background: G, borderRadius: 2, margin: "0 auto" }} />
        </div>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
          {[{value:"200+",label:"Children Helped"},{value:"15",label:"Communities Reached"},{value:"100+",label:"Sponsors"},{value:"24/7",label:"Mentorship"}].map((s,i) => (
            <div key={s.label} style={{ textAlign: "center", padding: "2.5rem 1.5rem", borderRight: i<3 ? `1px solid ${BG}` : "none" }}>
              <div style={{ fontFamily: "Playfair Display,serif", fontSize: "3.5rem", fontWeight: 900, color: G, lineHeight: 1, marginBottom: "0.5rem" }}>{s.value}</div>
              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" style={{ background: BG, padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: G, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>How It Works</div>
            <h2 style={{ fontFamily: "Playfair Display,serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 700, color: "#1a1a2e" }}>Our Intervention Process</h2>
            <div style={{ width: 50, height: 3, background: G, borderRadius: 2, margin: "1rem auto 0" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1.25rem" }}>
            {[{step:"01",title:"Referral",desc:"Community identifies a child in need and submits a confidential referral."},{step:"02",title:"Assessment",desc:"YMO team evaluates the child's spiritual, academic, and personal needs."},{step:"03",title:"Integration",desc:"Child is enrolled into our 3-pillar mentorship program."},{step:"04",title:"Transformation",desc:"Child emerges as a committed Christian leader and responsible citizen."}].map(s => (
              <div key={s.step} style={{ background: "#fff", borderRadius: 16, padding: "2rem", border: `1px solid rgba(64,145,108,0.1)`, transition: "all .3s" }}
                onMouseEnter={e=>{(e.currentTarget as any).style.transform="translateY(-4px)";(e.currentTarget as any).style.boxShadow="0 12px 35px rgba(64,145,108,0.12)";}}
                onMouseLeave={e=>{(e.currentTarget as any).style.transform="translateY(0)";(e.currentTarget as any).style.boxShadow="none";}}>
                <div style={{ width: 40, height: 40, background: GP, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.9rem", color: G, marginBottom: "1rem" }}>{s.step}</div>
                <h4 style={{ fontFamily: "Playfair Display,serif", fontSize: "1.1rem", fontWeight: 700, color: "#1a1a2e", marginBottom: "0.5rem" }}>{s.title}</h4>
                <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIRECTOR */}
      <section style={{ background: "#fff", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "4rem", alignItems: "center" }}>
          <div style={{ width: "100%", aspectRatio: "1", background: `linear-gradient(135deg,${GP},${GL})`, borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Playfair Display,serif", fontSize: "5rem", fontWeight: 700, color: GD, position: "relative", overflow: "hidden" }}>
            EA
            <div style={{ position: "absolute", bottom: "1.5rem", right: "1.5rem", background: "#fff", padding: "1rem 1.25rem", borderRadius: 14, boxShadow: "0 8px 25px rgba(0,0,0,0.1)", textAlign: "center" }}>
              <div style={{ fontFamily: "Playfair Display,serif", fontSize: "1.8rem", fontWeight: 700, color: G }}>2024</div>
              <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em" }}>Founded</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: G, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Leadership</div>
            <h2 style={{ fontFamily: "Playfair Display,serif", fontSize: "clamp(1.8rem,4vw,2.5rem)", fontWeight: 700, color: "#1a1a2e", marginBottom: "1.5rem" }}>Governance &amp; Vision</h2>
            <blockquote style={{ fontFamily: "Playfair Display,serif", fontSize: "clamp(1.1rem,2vw,1.35rem)", fontStyle: "italic", color: "#1a1a2e", lineHeight: 1.75, marginBottom: "1.75rem", borderLeft: `4px solid ${G}`, paddingLeft: "1.5rem" }}>
              "We don't wait for children to find us. We go to them. At Young In Mind, we are committed to finding the overlooked and giving them a future anchored in Christ and Excellence."
            </blockquote>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: GD }}>Miss Edinia Ashitey</div>
            <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 3 }}>Founder & Executive Director</div>
            <div style={{ background: BG, borderRadius: 18, padding: "1.5rem", border: `1px solid rgba(64,145,108,0.15)`, marginTop: "1.5rem" }}>
              <h4 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#6b7280", marginBottom: "1rem" }}>Board of Directors</h4>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 0", borderBottom: `1px solid rgba(64,145,108,0.1)` }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: G, flexShrink: 0 }} />
                <span style={{ fontWeight: 600, color: "#1a1a2e", fontSize: "0.9rem" }}>Miss Edinia Ashitey — Founder & Executive Director</span>
              </div>
              <p style={{ color: "#6b7280", fontSize: "0.85rem", fontStyle: "italic", paddingTop: "0.75rem" }}>Additional Board Members to be announced...</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ background: GD, padding: "4rem 1.5rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-50%", left: "-10%", width: 400, height: 400, borderRadius: "50%", background: "rgba(116,198,157,0.1)", pointerEvents: "none" }} />
        <h2 style={{ fontFamily: "Playfair Display,serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 700, color: "#fff", marginBottom: "1rem", position: "relative", zIndex: 1 }}>Be the reason a child smiles today</h2>
        <p style={{ color: "rgba(255,255,255,0.75)", maxWidth: 450, margin: "0 auto 2rem", lineHeight: 1.7, position: "relative", zIndex: 1 }}>Your support helps us reach more children with the spiritual, educational, and personal guidance they deserve.</p>
        <button style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", background: "#fff", color: GD, padding: "1rem 2.5rem", borderRadius: 100, fontWeight: 800, fontSize: "0.95rem", border: "none", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", position: "relative", zIndex: 1 }}>
          Donate Now ❤️
        </button>
      </section>

      {/* FORM */}
      <section id="refer"><ReferralForm /></section>

      {/* FOOTER */}
      <footer style={{ background: "#0f1f17", padding: "3.5rem 1.5rem", borderTop: "1px solid rgba(64,145,108,0.2)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 36, height: 36, background: G, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Playfair Display,serif", fontWeight: 900, color: "#fff", fontStyle: "italic" }}>Y</div>
            <span style={{ fontFamily: "Playfair Display,serif", fontWeight: 700, color: "#fff", fontSize: "1rem" }}>YOUNG IN MIND ORGANIZATION</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", maxWidth: 420, lineHeight: 1.7 }}>Dedicated to finding the overlooked and raising them as committed Christians and responsible citizens.</p>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
            {["Privacy Policy","Governance","Contact"].map(item => (
              <a key={item} href="#" style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", textDecoration: "none" }}>{item}</a>
            ))}
            <Link href="/admin/login" style={{ color: GL, fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", textDecoration: "none" }}>Admin</Link>
          </div>
          <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.07)" }} />
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.72rem", letterSpacing: "0.08em" }}>&copy; 2024 YMO Organization. All Rights Reserved.</p>
        </div>
      </footer>
    </main>
  );
}
