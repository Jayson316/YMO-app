"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, ChevronDown, Shield, BookOpen, Heart, Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import ReferralForm from "@/components/public/ReferralForm";

const navLinks = [
  { id: "about", label: "Who We Are" },
  { id: "pillars", label: "Our Pillars" },
  { id: "impact", label: "Impact" },
  { id: "process", label: "How It Works" },
  { id: "refer", label: "Refer a Child" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 75, behavior: "smooth" });
  };

  return (
    <main className="bg-white dark:bg-[#0d1f12] text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 dark:bg-[#0d1f12]/95 backdrop-blur-md shadow-md" : "bg-white/80 dark:bg-[#0d1f12]/80 backdrop-blur-sm"} border-b border-green-100 dark:border-green-900/30`}>
        <div className="max-w-6xl mx-auto px-6 h-[68px] flex items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-600 dark:bg-green-500 rounded-lg flex items-center justify-center font-serif font-black text-white italic text-lg flex-shrink-0">Y</div>
            <div className="text-left">
              <div className="font-serif font-bold text-base text-gray-900 dark:text-[#e8f5ec] leading-none">YOUNG IN MIND</div>
              <div className="text-[10px] font-bold text-green-600 dark:text-[#52b788] tracking-widest uppercase mt-0.5">Organization</div>
            </div>
          </button>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ id, label }) => (
              <button key={id} onClick={() => scrollTo(id)} className="text-xs font-semibold text-gray-500 dark:text-[#6b9e74] hover:text-green-600 dark:hover:text-[#52b788] hover:bg-green-50 dark:hover:bg-[#142b18] px-3 py-2 rounded-lg transition-all">
                {label}
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggleTheme} className="w-9 h-9 rounded-lg border border-green-200 dark:border-[#1a3d22] bg-green-50 dark:bg-[#142b18] flex items-center justify-center text-green-600 dark:text-[#52b788] transition-all">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link href="/admin/login" className="text-xs font-bold text-gray-500 dark:text-[#6b9e74] border border-gray-200 dark:border-[#1a3d22] hover:border-green-500 hover:text-green-600 dark:hover:text-[#52b788] px-4 py-2 rounded-lg transition-all">Admin</Link>
            <button onClick={() => scrollTo("refer")} className="bg-green-600 dark:bg-green-700 hover:bg-green-700 text-white text-xs font-bold px-5 py-2 rounded-full transition-all">Donate</button>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="w-9 h-9 rounded-lg border border-green-200 dark:border-[#1a3d22] bg-green-50 dark:bg-[#142b18] flex items-center justify-center text-green-600 dark:text-[#52b788] transition-all">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-800 dark:text-[#e8f5ec]">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-[#0a1a0d] border-t border-green-100 dark:border-[#1a3d22] px-6 pb-6 pt-2">
            {navLinks.map(({ id, label }) => (
              <button key={id} onClick={() => scrollTo(id)} className="block w-full text-left py-3 text-base font-semibold text-gray-800 dark:text-[#c8e6cc] border-b border-gray-100 dark:border-[#142b18] hover:text-green-600 dark:hover:text-[#52b788] transition-colors">
                {label}
              </button>
            ))}
            <div className="flex gap-3 mt-4">
              <Link href="/admin/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-3 border border-gray-200 dark:border-[#1a3d22] rounded-xl font-bold text-sm text-gray-600 dark:text-[#6b9e74]">Admin</Link>
              <button onClick={() => scrollTo("refer")} className="flex-1 bg-green-600 dark:bg-green-700 text-white py-3 rounded-xl font-bold text-sm">Donate</button>
            </div>
          </div>
        )}
      </nav>
      <section className="min-h-screen pt-[68px] relative overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.45)),url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center" />
        <div className="max-w-6xl mx-auto px-6 py-20 relative z-10 w-full">
          <div className="inline-flex items-center gap-2 bg-green-600/80 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-green-300" />
            <span className="text-xs font-bold text-white tracking-widest uppercase">Faith · Education · Character</span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-black text-white leading-tight tracking-tight mb-5">
            Transforming Lives<br />Through <em className="text-green-300 not-italic">Faith &amp; Support</em>
          </h1>
          <p className="text-lg text-white/80 max-w-xl leading-relaxed mb-8">
            Supporting vulnerable children through education, care, and Christian values.
          </p>
          <div className="flex gap-4 flex-wrap mb-10">
            <button onClick={() => scrollTo("refer")} className="inline-flex items-center gap-2 bg-white text-green-700 font-black text-sm px-7 py-4 rounded-xl shadow-xl hover:-translate-y-0.5 transition-all">
              Refer a Child <ArrowRight size={16} />
            </button>
            <button onClick={() => scrollTo("about")} className="inline-flex items-center gap-2 border-2 border-white/60 hover:border-white text-white font-bold text-sm px-7 py-4 rounded-xl hover:bg-white/10 transition-all">
              Learn More
            </button>
          </div>
          <div className="flex flex-wrap gap-3 mb-10">
            {[
              "200+ children helped",
              "15 communities reached",
              "Confidential referral process",
            ].map((tag) => (
              <span key={tag} className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5">
              <div className="text-xs font-bold text-green-300 uppercase tracking-widest mb-1">Our Mission</div>
              <p className="text-white/80 text-sm leading-relaxed">Finding the overlooked, walking alongside them, and helping them grow in Christian life, learning, and personal responsibility.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex flex-col justify-center">
              <div className="font-serif text-4xl font-black text-white leading-none">2025</div>
              <div className="text-xs font-bold text-green-300 uppercase tracking-widest mt-1">Founded</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex flex-col justify-center">
              <div className="font-serif text-4xl font-black text-white leading-none">24/7</div>
              <div className="text-xs font-bold text-green-300 uppercase tracking-widest mt-1">Mentorship</div>
            </div>
          </div>
        </div>
        <button onClick={() => scrollTo("about")} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 hover:text-white/70 transition-colors cursor-pointer">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <ChevronDown size={16} />
        </button>
      </section>

      <section id="about" className="bg-white dark:bg-[#0d1f12] py-10 border-b-2 border-green-100 dark:border-[#1a3d22]">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-base leading-relaxed text-gray-600 dark:text-[#6b9e74]">
            <strong className="text-gray-900 dark:text-[#e8f5ec]">Who We Are: </strong>
            YMO is a Christian organization dedicated to improving the lives of children through education, support, and faith-driven initiatives. We identify children who have been overlooked by traditional support systems and walk alongside them on their journey to becoming committed Christians and responsible citizens.
          </p>
        </div>
      </section>
      <section id="pillars" className="bg-green-50 dark:bg-[#0a1a0d] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-green-600 dark:text-[#52b788] tracking-widest uppercase mb-3">Our Foundation</div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-[#e8f5ec] mb-3">Our Three-Fold Commitment</h2>
            <div className="w-12 h-0.5 bg-green-600 dark:bg-[#52b788] mx-auto mb-4" />
            <p className="text-gray-500 dark:text-[#6b9e74] max-w-md mx-auto leading-relaxed">Focusing on the areas critical to a child's success in this life and the next.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Christian Life", desc: "Nurturing a deep, committed relationship with God through scriptural literacy, prayer, and discipleship.", num: "01", featured: false },
              { icon: BookOpen, title: "Education", desc: "Bridging academic gaps by providing resources, tutoring, and structured support for children in underserved communities.", num: "02", featured: true },
              { icon: Heart, title: "Personal Life", desc: "Character building and life skills training to develop responsible, ethical, and high-functioning citizens.", num: "03", featured: false },
            ].map(p => (
              <div key={p.title} className={`relative rounded-2xl p-8 overflow-hidden transition-all hover:-translate-y-1 ${p.featured ? "bg-green-700 dark:bg-[#1a3d22] shadow-2xl" : "bg-white dark:bg-[#142b18] border border-green-100 dark:border-[#1a3d22] hover:shadow-xl"}`}>
                <div className={`absolute bottom-3 right-5 font-serif text-6xl font-black leading-none pointer-events-none ${p.featured ? "text-white/5" : "text-green-600/5"}`}>{p.num}</div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${p.featured ? "bg-white/15" : "bg-green-100 dark:bg-[#0d1f12]"}`}>
                  <p.icon size={26} className={p.featured ? "text-white" : "text-green-600 dark:text-[#52b788]"} />
                </div>
                <h3 className={`font-serif text-2xl font-bold mb-3 ${p.featured ? "text-white" : "text-gray-900 dark:text-[#e8f5ec]"}`}>{p.title}</h3>
                <div className={`w-8 h-0.5 mb-4 ${p.featured ? "bg-green-300" : "bg-green-600 dark:bg-[#52b788]"}`} />
                <p className={`text-sm leading-relaxed ${p.featured ? "text-white/70" : "text-gray-500 dark:text-[#6b9e74]"}`}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="impact" className="bg-white dark:bg-[#0d1f12] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-green-600 dark:text-[#52b788] tracking-widest uppercase mb-3">Numbers That Matter</div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-[#e8f5ec] mb-3">Our Impact</h2>
            <div className="w-12 h-0.5 bg-green-600 dark:bg-[#52b788] mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-green-100 dark:divide-[#1a3d22]">
            {[{ value: "200+", label: "Children Helped" }, { value: "15", label: "Communities Reached" }, { value: "100+", label: "Sponsors" }, { value: "24/7", label: "Mentorship" }].map(s => (
              <div key={s.label} className="text-center py-10 px-6">
                <div className="font-serif text-5xl font-black text-green-600 dark:text-[#52b788] leading-none mb-2">{s.value}</div>
                <div className="text-xs font-bold text-gray-400 dark:text-[#4a7a54] uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="bg-green-50 dark:bg-[#0a1a0d] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-green-600 dark:text-[#52b788] tracking-widest uppercase mb-3">How It Works</div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-[#e8f5ec]">Our Intervention Process</h2>
            <div className="w-12 h-0.5 bg-green-600 dark:bg-[#52b788] mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-4 gap-5">
            {[
              { step: "01", title: "Referral", desc: "Community identifies a child in need and submits a confidential referral." },
              { step: "02", title: "Assessment", desc: "YMO team evaluates the child's spiritual, academic, and personal needs." },
              { step: "03", title: "Integration", desc: "Child is enrolled into our 3-pillar mentorship program." },
              { step: "04", title: "Transformation", desc: "Child emerges as a committed Christian leader and responsible citizen." },
            ].map(s => (
              <div key={s.step} className="bg-white dark:bg-[#142b18] rounded-2xl p-6 border border-green-100 dark:border-[#1a3d22] hover:-translate-y-1 hover:shadow-xl transition-all">
                <div className="w-10 h-10 bg-green-100 dark:bg-[#0d1f12] rounded-xl flex items-center justify-center text-green-600 dark:text-[#52b788] font-black text-sm mb-4">{s.step}</div>
                <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-[#e8f5ec] mb-2">{s.title}</h4>
                <p className="text-sm text-gray-500 dark:text-[#6b9e74] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-[#0d1f12] py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="w-full aspect-square bg-gradient-to-br from-green-100 to-green-300 dark:from-[#142b18] dark:to-[#1a3d22] rounded-3xl flex items-center justify-center font-serif text-8xl font-bold text-green-700 dark:text-[#52b788] relative overflow-hidden">
            EA
            <div className="absolute bottom-6 right-6 bg-white dark:bg-[#142b18] p-4 rounded-2xl shadow-xl text-center">
              <div className="font-serif text-3xl font-black text-green-600 dark:text-[#52b788]">2025</div>
              <div className="text-xs font-bold text-gray-400 dark:text-[#4a7a54] uppercase tracking-widest">Founded</div>
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-green-600 dark:text-[#52b788] tracking-widest uppercase mb-3">Leadership</div>
            <h2 className="font-serif text-4xl font-bold text-gray-900 dark:text-[#e8f5ec] mb-6">Governance &amp; Vision</h2>
            <blockquote className="font-serif text-xl italic text-gray-800 dark:text-[#c8e6cc] leading-relaxed mb-6 border-l-4 border-green-600 dark:border-[#52b788] pl-6">
              "We don't wait for children to find us. We go to them. At Young In Mind, we are committed to finding the overlooked and giving them a future anchored in Christ and Excellence."
            </blockquote>
            <div className="text-lg font-bold text-green-700 dark:text-[#52b788]">Miss Edinia Ashitey</div>
            <div className="text-xs font-bold text-gray-400 dark:text-[#4a7a54] uppercase tracking-widest mt-1">Executive Director</div>
            <div className="bg-green-50 dark:bg-[#142b18] rounded-2xl p-5 border border-green-100 dark:border-[#1a3d22] mt-6">
              <h4 className="text-xs font-bold text-gray-400 dark:text-[#4a7a54] uppercase tracking-widest mb-4">Board of Directors</h4>
              <div className="flex items-center gap-3 py-3 border-b border-green-100 dark:border-[#1a3d22]">
                <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-[#52b788] flex-shrink-0" />
                <span className="font-semibold text-gray-800 dark:text-[#c8e6cc] text-sm">Miss Edinia Ashitey — Executive Director</span>
              </div>
              <p className="text-gray-400 dark:text-[#4a7a54] text-sm italic pt-3">Additional Board Members to be announced...</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-green-700 dark:bg-[#071a0f] py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4 relative z-10">Be the reason a child smiles today</h2>
        <p className="text-white/70 max-w-md mx-auto mb-8 leading-relaxed relative z-10">Your support helps us reach more children with the guidance they deserve.</p>
        <button onClick={() => scrollTo("refer")} className="inline-flex items-center gap-2 bg-white text-green-700 font-black text-base px-8 py-4 rounded-full shadow-2xl hover:-translate-y-0.5 transition-all relative z-10">
          Donate Now ❤️
        </button>
      </section>

      <section id="refer" className="bg-white dark:bg-[#0d1f12]">
        <ReferralForm />
      </section>

      <footer className="bg-gray-950 dark:bg-[#071a0f] py-14 px-6 border-t border-green-900/20">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center font-serif font-black text-white italic">Y</div>
            <span className="font-serif font-bold text-white text-base">YOUNG IN MIND ORGANIZATION</span>
          </div>
          <p className="text-gray-500 text-sm max-w-md leading-relaxed">Dedicated to finding the overlooked and raising them as committed Christians and responsible citizens.</p>
          <div className="flex gap-8 flex-wrap justify-center">
            {["Privacy Policy", "Governance", "Contact"].map(item => (
              <a key={item} href="#" className="text-gray-600 hover:text-green-400 text-xs font-bold uppercase tracking-widest transition-colors">{item}</a>
            ))}
            <Link href="/admin/login" className="text-green-500 hover:text-green-400 text-xs font-bold uppercase tracking-widest transition-colors">Admin Portal</Link>
          </div>
          <div className="w-full h-px bg-white/5" />
          <p className="text-gray-700 text-xs tracking-widest">© 2025 YMO Organization. All Rights Reserved.</p>
        </div>
      </footer>
    </main>
  );
}
