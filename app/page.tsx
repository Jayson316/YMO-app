import React from "react";
import Link from "next/link";
import PublicReferralForm from "@/components/public/PublicReferralForm";
import { BookOpen, Heart, ShieldCheck, ArrowRight, Users, Target, Clock, Award } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* NAV */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-ymoBlue rounded-xl flex items-center justify-center text-white font-black text-lg italic shadow-lg">Y</div>
            <div>
              <span className="text-lg font-black text-ymoBlue tracking-tighter">YOUNG IN MIND</span>
              <p className="text-[9px] font-bold text-blue-600 tracking-[0.3em] uppercase -mt-1">Organization</p>
            </div>
          </div>
          <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-gray-500">
            <a href="#about" className="hover:text-ymoBlue transition">About</a>
            <a href="#pillars" className="hover:text-ymoBlue transition">Our Pillars</a>
            <a href="#process" className="hover:text-ymoBlue transition">Our Process</a>
            <a href="#refer" className="hover:text-ymoBlue transition">Refer a Child</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/login" className="text-xs font-bold text-gray-400 hover:text-ymoBlue transition uppercase tracking-widest">Admin</Link>
            <button className="bg-ymoBlue text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-black transition shadow-lg">Donate</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative py-28 px-6 overflow-hidden bg-ymoLight">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="z-10">
            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">Faith · Education · Character</span>
            <h1 className="text-6xl md:text-7xl font-extrabold text-ymoBlue leading-[1.05] mb-8 tracking-tight">
              Transforming <span className="text-blue-700">Potentials</span> into Leaders for Christ.
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-lg">
              YMO identifies children overlooked by traditional support systems and transforms them into responsible members of society and committed Christians.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#refer" className="inline-flex items-center gap-3 bg-ymoBlue text-white px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-xl">
                Refer a Child <ArrowRight size={20} />
              </a>
              <a href="#about" className="inline-flex items-center gap-3 border-2 border-ymoBlue text-ymoBlue px-10 py-5 rounded-2xl font-bold text-lg hover:bg-ymoBlue hover:text-white transition-all">
                Learn More
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-ymoGold/20 rounded-[3rem] blur-2xl"></div>
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80"
              className="rounded-[3rem] relative z-10 shadow-2xl border-8 border-white object-cover h-[480px] w-full"
              alt="YMO Outreach"
            />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-ymoBlue text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { icon: <Users size={28} />, value: "150+", label: "Children Reached" },
            { icon: <Target size={28} />, value: "12", label: "Communities" },
            { icon: <Award size={28} />, value: "100%", label: "Commitment" },
            { icon: <Clock size={28} />, value: "24/7", label: "Mentorship" },
          ].map((s) => (
            <div key={s.label}>
              <div className="flex justify-center mb-3 text-ymoGold">{s.icon}</div>
              <p className="text-5xl font-black tracking-tighter mb-1">{s.value}</p>
              <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PILLARS */}
      <section id="pillars" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-ymoBlue uppercase tracking-tight mb-4">Our Three-Fold Commitment</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Focusing on the three areas critical to a child's success in this life and the next.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: <ShieldCheck size={40} />, title: "Christian Life", desc: "Nurturing a deep, committed relationship with God through scriptural literacy, prayer, and discipleship.", featured: false },
              { icon: <BookOpen size={40} />, title: "Education", desc: "Bridging academic gaps by providing resources, tutoring, and support for children in underserved areas.", featured: true },
              { icon: <Heart size={40} />, title: "Personal Life", desc: "Character building and life skills training to develop responsible, ethical, and high-functioning citizens.", featured: false },
            ].map((p) => (
              <div key={p.title} className={`p-10 rounded-[2.5rem] border transition-all hover:-translate-y-2 hover:shadow-2xl ${p.featured ? "bg-ymoBlue text-white border-transparent shadow-2xl" : "bg-gray-50 border-gray-100 hover:bg-white"}`}>
                <div className={`mb-6 ${p.featured ? "text-ymoGold" : "text-blue-600"}`}>{p.icon}</div>
                <h3 className={`text-2xl font-bold mb-4 ${p.featured ? "text-white" : "text-ymoBlue"}`}>{p.title}</h3>
                <p className={p.featured ? "text-blue-200" : "text-gray-600"}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="py-24 px-6 bg-ymoLight">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-16">Our Intervention Process</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Referral", desc: "Community identifies a child in need and submits a referral." },
              { step: "02", title: "Assessment", desc: "YMO team evaluates the child's spiritual & academic needs." },
              { step: "03", title: "Integration", desc: "Child enters our 3-pillar mentorship program." },
              { step: "04", title: "Impact", desc: "Child emerges as a responsible Christian leader." },
            ].map((s) => (
              <div key={s.step} className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                <p className="text-5xl font-black text-blue-100 mb-4">{s.step}</p>
                <p className="font-bold text-ymoBlue mb-2 uppercase tracking-widest text-xs">{s.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIRECTOR */}
      <section id="about" className="py-24 bg-ymoBlue text-white px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-8">A Message from our Director</h2>
            <blockquote className="text-2xl text-blue-100 italic font-light leading-relaxed mb-10">
              "We don't wait for children to find us. We go to them. At Young In Mind, we are committed to finding the overlooked and giving them a future anchored in Christ and excellence."
            </blockquote>
            <div>
              <h4 className="text-2xl font-bold text-ymoGold">Miss Edinia Ashitey</h4>
              <p className="text-blue-300 uppercase tracking-widest text-xs font-bold">Executive Director & Founder</p>
            </div>
          </div>
          <div className="bg-white/10 p-12 rounded-[3rem] backdrop-blur-xl border border-white/10 space-y-6">
            <h3 className="text-2xl font-bold">Board of Directors</h3>
            <div className="flex items-center gap-3 text-lg">
              <div className="w-2 h-2 bg-ymoGold rounded-full"></div>
              Miss Edinia Ashitey — Founder & Executive Director
            </div>
            <p className="text-white/40 italic text-sm">Additional Board Members to be announced...</p>
            <div className="pt-6 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-3 text-sm text-blue-200">
                <ShieldCheck size={16} className="text-ymoGold" /> Board-Led Accountability
              </div>
              <div className="flex items-center gap-3 text-sm text-blue-200">
                <Heart size={16} className="text-ymoGold" /> Child Protection First
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REFERRAL FORM */}
      <section id="refer">
        <PublicReferralForm />
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-50 py-16 px-6 text-center border-t border-gray-100">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-8 h-8 bg-ymoBlue rounded-lg flex items-center justify-center text-white font-black text-sm italic">Y</div>
          <span className="font-black text-ymoBlue tracking-tighter">YOUNG IN MIND ORGANIZATION</span>
        </div>
        <p className="text-gray-400 text-sm max-w-md mx-auto mb-8">A professional NGO dedicated to finding the overlooked and raising them as committed Christians and responsible citizens.</p>
        <div className="flex justify-center gap-8 text-gray-300 text-xs font-bold uppercase tracking-widest mb-8">
          <a href="#" className="hover:text-blue-600 transition">Privacy Policy</a>
          <a href="#" className="hover:text-blue-600 transition">Governance</a>
          <Link href="/admin/login" className="hover:text-blue-600 transition">Admin Portal</Link>
        </div>
        <p className="text-xs text-gray-300 uppercase tracking-widest">&copy; 2024 Young In Mind Organization. All Rights Reserved.</p>
      </footer>
    </main>
  );
}
