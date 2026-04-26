"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  Shield,
  BookOpen,
  Heart,
  BadgeCheck,
  Users,
  HandHeart,
  Sparkles,
  ClipboardCheck,
  UserCheck,
  Waypoints,
  Home as HomeIcon,
  ShieldCheck,
  ChevronRight,
  HeartHandshake,
} from "lucide-react";
import ReferralForm from "@/components/public/ReferralForm";

const G = "#40916C";
const GD = "#2D6A4F";
const GL = "#74C69D";
const GP = "#D8F3DC";
const BG = "#F0FAF4";

const navLinks = [
  { id: "about", label: "Who We Are" },
  { id: "pillars", label: "Our Pillars" },
  { id: "impact", label: "Impact" },
  { id: "process", label: "How It Works" },
  { id: "refer", label: "Refer a Child" },
];

const trustStats = [
  { value: "200+", label: "Children Helped" },
  { value: "15", label: "Communities Reached" },
  { value: "100+", label: "Sponsors" },
  { value: "24/7", label: "Mentorship" },
];

const introCards = [
  {
    icon: Users,
    title: "Who We Serve",
    desc: "We identify children who have been overlooked by traditional support systems and need intentional guidance, care, and support.",
  },
  {
    icon: HandHeart,
    title: "What We Provide",
    desc: "We walk alongside children through education support, personal development, and faith-driven mentorship rooted in Christian values.",
  },
  {
    icon: Sparkles,
    title: "What We Hope To Build",
    desc: "Our goal is to help children grow into committed Christians and responsible citizens who can lead with character and purpose.",
  },
];

const pillars = [
  {
    icon: Shield,
    title: "Christian Life",
    desc: "Nurturing a deep, committed relationship with God through scriptural literacy, prayer, and discipleship.",
  },
  {
    icon: BookOpen,
    title: "Education",
    desc: "Bridging academic gaps by providing resources, tutoring, and structured support for children in underserved communities.",
    featured: true,
  },
  {
    icon: Heart,
    title: "Personal Life",
    desc: "Character building and life skills training to develop responsible, ethical, and high-functioning citizens.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Referral",
    desc: "A child in need is identified by the community and submitted through a confidential referral process.",
    icon: ClipboardCheck,
  },
  {
    step: "02",
    title: "Assessment",
    desc: "The YMO team evaluates the child’s spiritual, academic, and personal needs with care and attention.",
    icon: UserCheck,
  },
  {
    step: "03",
    title: "Integration",
    desc: "The child is enrolled into YMO’s three-pillar mentorship and support structure.",
    icon: Waypoints,
  },
  {
    step: "04",
    title: "Transformation",
    desc: "Through consistent support, the child grows toward becoming a committed Christian leader and responsible citizen.",
    icon: HomeIcon,
  },
];

const actionCards = [
  {
    title: "Refer a Child",
    desc: "Know a child who may need support? Submit a confidential referral to the YMO assessment team.",
    target: "refer",
  },
  {
    title: "See Our Approach",
    desc: "Explore the three-fold commitment that guides how we support each child spiritually, academically, and personally.",
    target: "pillars",
  },
  {
    title: "Understand the Process",
    desc: "Learn how children move from referral to assessment, integration, and transformation.",
    target: "process",
  },
  {
    title: "Read Our Vision",
    desc: "Meet the Executive Director and understand the heart behind Young In Mind’s mission and governance.",
    target: "governance",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const sectionTag = (label: string) => (
    <div
      className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.24em]"
      style={{ color: G, borderColor: "rgba(64,145,108,0.18)", background: "rgba(216,243,220,0.45)" }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: G }} />
      {label}
    </div>
  );

  return (
    <main className="bg-white text-slate-900">
      <nav
        className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl"
        style={{
          background: "rgba(255,255,255,0.94)",
          borderColor: "rgba(64,145,108,0.14)",
          boxShadow: scrolled ? "0 10px 30px rgba(15,23,42,0.08)" : "none",
        }}
      >
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 md:px-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 text-left"
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-black italic text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${G}, ${GD})` }}
            >
              Y
            </div>
            <div>
              <div className="font-serif text-[15px] font-bold tracking-[0.08em] text-slate-900">YOUNG IN MIND</div>
              <div className="text-[10px] font-extrabold uppercase tracking-[0.28em]" style={{ color: G }}>
                Organization
              </div>
            </div>
          </button>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = BG;
                  e.currentTarget.style.color = GD;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#64748b";
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/admin/login"
              className="rounded-full border px-4 py-2 text-sm font-bold text-slate-600 transition hover:text-slate-900"
              style={{ borderColor: "rgba(148,163,184,0.3)" }}
            >
              Admin portal
            </Link>
            <button
              onClick={() => scrollTo("refer")}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5"
              style={{ background: `linear-gradient(135deg, ${G}, ${GD})` }}
            >
              Refer a child
              <ArrowRight size={16} />
            </button>
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t bg-white px-5 py-4 md:hidden" style={{ borderColor: "rgba(64,145,108,0.12)" }}>
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="border-b py-3 text-left text-sm font-semibold text-slate-700"
                  style={{ borderColor: "rgba(226,232,240,0.9)" }}
                >
                  {link.label}
                </button>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                href="/admin/login"
                className="rounded-xl border px-4 py-3 text-center text-sm font-bold text-slate-600"
                style={{ borderColor: "rgba(148,163,184,0.3)" }}
              >
                Admin
              </Link>
              <button
                onClick={() => scrollTo("refer")}
                className="rounded-xl px-4 py-3 text-sm font-extrabold text-white"
                style={{ background: `linear-gradient(135deg, ${G}, ${GD})` }}
              >
                Refer
              </button>
            </div>
          </div>
        )}
      </nav>

      <section className="relative isolate overflow-hidden px-5 pb-16 pt-32 md:px-8 md:pb-20 md:pt-36">
        <div
          className="absolute inset-0 -z-20"
          style={{
            backgroundImage:
              "linear-gradient(120deg, rgba(15,23,42,0.82), rgba(15,23,42,0.66)), url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1800&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-white/10" />

        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.24em] text-white/90 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: GL }} />
              Faith · Education · Character
            </div>
            <h1 className="max-w-4xl font-serif text-[clamp(3rem,7vw,5.8rem)] font-black leading-[0.95] text-white">
              Transforming lives through faith, support, and opportunity.
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-8 text-white/80 md:text-[18px]">
              Young In Mind supports vulnerable children through education, care, and Christian values, giving them the foundation to become responsible leaders in society.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo("refer")}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-extrabold text-slate-900 shadow-2xl transition hover:-translate-y-0.5"
              >
                Start a confidential referral
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => scrollTo("process")}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                See how it works
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/85">
              {[
                "200+ children helped",
                "15 communities reached",
                "Confidential referral process",
              ].map((item) => (
                <div key={item} className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:justify-self-end">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 text-white shadow-2xl backdrop-blur-md">
              <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-white/65">Our mission</div>
              <p className="mt-3 text-lg font-medium leading-8 text-white/90">
                Finding the overlooked, walking alongside them, and helping them grow in Christian life, learning, and personal responsibility.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 text-white shadow-xl backdrop-blur-md">
                <div className="text-3xl font-black">2025</div>
                <div className="mt-1 text-sm text-white/70">Founded</div>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 text-white shadow-xl backdrop-blur-md">
                <div className="text-3xl font-black">24/7</div>
                <div className="mt-1 text-sm text-white/70">Mentorship</div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => scrollTo("about")}
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-[11px] font-bold uppercase tracking-[0.24em] text-white/60"
        >
          Scroll
          <ChevronDown size={16} />
        </button>
      </section>

      <section className="px-5 py-6 md:px-8">
        <div
          className="mx-auto grid max-w-7xl gap-4 rounded-[28px] border px-6 py-5 shadow-sm md:grid-cols-4"
          style={{ background: BG, borderColor: "rgba(64,145,108,0.12)" }}
        >
          {trustStats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 rounded-2xl bg-white px-4 py-4 shadow-sm">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-black"
                style={{ background: GP, color: GD }}
              >
                <BadgeCheck size={20} />
              </div>
              <div>
                <div className="font-serif text-2xl font-black" style={{ color: GD }}>
                  {stat.value}
                </div>
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            {sectionTag("Who we are")}
            <h2 className="font-serif text-[clamp(2rem,4vw,3.4rem)] font-bold leading-tight text-slate-900">
              We are committed to reaching children who have been overlooked.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              YMO is a Christian organization dedicated to improving the lives of children through education, support, and faith-driven initiatives. We identify children who have been overlooked by traditional support systems and walk alongside them on their journey to becoming committed Christians and responsible citizens.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {introCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="rounded-[28px] border bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  style={{ borderColor: "rgba(64,145,108,0.12)" }}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: GP, color: G }}>
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-5 font-serif text-2xl font-bold text-slate-900">{card.title}</h3>
                  <p className="mt-3 text-[15px] leading-7 text-slate-600">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pillars" className="px-5 py-16 md:px-8 md:py-20" style={{ background: BG }}>
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            {sectionTag("Our foundation")}
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] font-bold text-slate-900">Our three-fold commitment</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              We focus on the areas that are critical to a child’s success in this life and the next.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              const featured = Boolean(pillar.featured);
              return (
                <div
                  key={pillar.title}
                  className="relative overflow-hidden rounded-[30px] p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-2xl"
                  style={{
                    background: featured ? `linear-gradient(160deg, ${GD}, ${G})` : "white",
                    color: featured ? "white" : "#0f172a",
                    border: featured ? "none" : "1px solid rgba(64,145,108,0.12)",
                  }}
                >
                  <div className="absolute right-6 top-6 font-serif text-6xl font-black opacity-10">0{index + 1}</div>
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{
                      background: featured ? "rgba(255,255,255,0.14)" : GP,
                      color: featured ? "white" : G,
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-6 font-serif text-3xl font-bold">{pillar.title}</h3>
                  <div className="mt-4 h-1 w-14 rounded-full" style={{ background: featured ? GL : G }} />
                  <p className="mt-5 text-[15px] leading-7" style={{ color: featured ? "rgba(255,255,255,0.82)" : "#475569" }}>
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="impact" className="px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            {sectionTag("Our impact")}
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] font-bold text-slate-900">Numbers that matter</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              We believe every child deserves to be seen, supported, and guided with intention. These figures reflect the reach and consistency YMO is building through its mission.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {trustStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[24px] border p-6"
                  style={{ background: "white", borderColor: "rgba(64,145,108,0.12)" }}
                >
                  <div className="font-serif text-5xl font-black leading-none" style={{ color: G }}>
                    {stat.value}
                  </div>
                  <div className="mt-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border p-8 shadow-sm" style={{ background: BG, borderColor: "rgba(64,145,108,0.12)" }}>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500 shadow-sm">
              <ShieldCheck size={16} style={{ color: G }} />
              Why this matters
            </div>
            <h3 className="mt-6 font-serif text-3xl font-bold text-slate-900">Support should touch the whole child.</h3>
            <p className="mt-4 text-[15px] leading-7 text-slate-600">
              YMO’s work is built around more than one kind of need. Children are supported spiritually, academically, and personally so that progress is both meaningful and lasting.
            </p>
            <div className="mt-8 rounded-[24px] bg-white p-6 shadow-sm">
              <div className="text-xs font-extrabold uppercase tracking-[0.18em]" style={{ color: G }}>A living commitment</div>
              <p className="mt-3 text-[15px] leading-7 text-slate-600">
                From prayer and discipleship to tutoring, mentorship, and character formation, our goal is to help children grow with faith, stability, and direction.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="px-5 py-16 md:px-8 md:py-20" style={{ background: BG }}>
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            {sectionTag("How it works")}
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] font-bold text-slate-900">Our intervention process</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Every referral is handled carefully so that children receive the right kind of support at the right time.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-4">
            {processSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="rounded-[28px] border bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  style={{ borderColor: "rgba(64,145,108,0.12)" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: GP, color: G }}>
                      <Icon size={22} />
                    </div>
                    <div className="font-serif text-4xl font-black text-slate-200">{step.step}</div>
                  </div>
                  <h3 className="mt-6 font-serif text-2xl font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-3 text-[15px] leading-7 text-slate-600">{step.desc}</p>
                </div>
              );
            })}
          </div>

          <div
            className="mt-8 grid gap-4 rounded-[28px] border p-6 md:grid-cols-3 md:p-8"
            style={{ background: "white", borderColor: "rgba(64,145,108,0.12)" }}
          >
            {[
              "All referrals are handled confidentially and reviewed with care.",
              "Assessment considers spiritual, academic, and personal needs together.",
              "The process is designed to help communities act early and wisely.",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-sm font-medium leading-6 text-slate-700">
                <BadgeCheck size={18} className="mt-0.5 shrink-0" style={{ color: G }} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="governance" className="px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div
            className="relative overflow-hidden rounded-[36px] border p-8 text-white shadow-xl"
            style={{ background: `linear-gradient(145deg, ${GD}, ${G})`, borderColor: "rgba(64,145,108,0.12)" }}
          >
            <div className="absolute -right-10 -top-8 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-white/10" />
            <div className="relative">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-[24px] bg-white/15 font-serif text-4xl font-black shadow-lg">
                EA
              </div>
              <div className="mt-8 text-xs font-extrabold uppercase tracking-[0.24em] text-white/65">Leadership</div>
              <h2 className="mt-3 font-serif text-4xl font-bold">Governance &amp; vision</h2>
              <blockquote className="mt-6 border-l-4 border-white/35 pl-5 font-serif text-2xl leading-10 text-white/95">
                “We don’t wait for children to find us. We go to them. At Young In Mind, we are committed to finding the overlooked and giving them a future anchored in Christ and excellence.”
              </blockquote>
              <div className="mt-6 text-xl font-bold">Miss Edinia Ashitey</div>
              <div className="mt-1 text-sm uppercase tracking-[0.18em] text-white/70">Executive Director</div>
            </div>
          </div>

          <div>
            {sectionTag("Leadership")}
            <h3 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold text-slate-900">A mission led with conviction and care.</h3>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Young In Mind is led by Miss Edinia Ashitey, Executive Director. The organization is built on a vision to identify overlooked children and give them a future grounded in Christ, excellence, and responsible citizenship.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Faith-driven leadership rooted in service and responsibility.",
                "A focus on going to children who may otherwise be missed.",
                "A commitment to support children spiritually, academically, and personally.",
                "Governance information can expand here as the organization continues to grow.",
              ].map((item) => (
                <div key={item} className="rounded-[24px] border bg-white p-5 text-[15px] leading-7 text-slate-600" style={{ borderColor: "rgba(64,145,108,0.12)" }}>
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: GP, color: G }}>
                    <ShieldCheck size={18} />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-20" style={{ background: BG }}>
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            {sectionTag("Get involved")}
            <h2 className="font-serif text-[clamp(2rem,4vw,3.1rem)] font-bold text-slate-900">Find the next right step.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Whether you are identifying a child in need, learning about our approach, or exploring the mission — you are in the right place.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {actionCards.map((card) => (
              <button
                key={card.title}
                onClick={() => scrollTo(card.target)}
                className="group rounded-[28px] border bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                style={{ borderColor: "rgba(64,145,108,0.12)" }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: GP, color: G }}>
                  <ChevronRight size={20} />
                </div>
                <h3 className="mt-5 font-serif text-2xl font-bold text-slate-900">{card.title}</h3>
                <p className="mt-3 text-[15px] leading-7 text-slate-600">{card.desc}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold" style={{ color: G }}>
                  Go to section
                  <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-20">
        <div
          className="mx-auto max-w-7xl overflow-hidden rounded-[36px] px-7 py-10 text-white shadow-2xl md:px-10 md:py-14"
          style={{ background: `linear-gradient(135deg, ${GD}, ${G})` }}
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-white/65">Confidential referral</div>
              <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,3.2rem)] font-bold leading-tight">Be the reason a child is seen.</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
                Your action can help a child receive assessment, guidance, and support. If you know a child who may need help, submit a referral and our team will review it carefully.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => scrollTo("refer")}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-extrabold text-slate-900 transition hover:-translate-y-0.5"
                >
                  Start a referral
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => scrollTo("process")}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Review the process
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              {[
                "Who can submit: community members, guardians, educators, and trusted leaders.",
                "What happens next: referral review, assessment, and integration into the support journey where appropriate.",
                "How it is handled: all data is confidential and treated with care.",
              ].map((item) => (
                <div key={item} className="rounded-[24px] border border-white/15 bg-white/10 px-5 py-5 text-[15px] leading-7 text-white/88 backdrop-blur-md">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="refer">
        <ReferralForm />
      </section>

      <footer className="px-5 py-14 md:px-8" style={{ background: "#0f1f17" }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.7fr_0.7fr]">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-black italic text-white" style={{ background: `linear-gradient(135deg, ${G}, ${GD})` }}>
                  Y
                </div>
                <div>
                  <div className="font-serif text-lg font-bold text-white">Young In Mind Organization</div>
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-white/40">Faith · Education · Character</div>
                </div>
              </div>
              <p className="mt-5 max-w-md text-[15px] leading-7 text-white/55">
                Dedicated to finding the overlooked and raising them as committed Christians and responsible citizens.
              </p>
            </div>

            <div>
              <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-white/40">Explore</div>
              <div className="mt-4 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <button key={link.id} onClick={() => scrollTo(link.id)} className="text-left text-sm font-semibold text-white/70 transition hover:text-white">
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-white/40">Quick actions</div>
              <div className="mt-4 flex flex-col gap-3">
                <button onClick={() => scrollTo("refer")} className="text-left text-sm font-semibold text-white/70 transition hover:text-white">
                  Start a confidential referral
                </button>
                <button onClick={() => scrollTo("process")} className="text-left text-sm font-semibold text-white/70 transition hover:text-white">
                  See how it works
                </button>
                <ThemeToggle />
            <Link href="/admin/login" className="text-sm font-semibold text-white/70 transition hover:text-white">
                  Admin portal
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 h-px w-full bg-white/10" />
          <div className="mt-6 flex flex-col gap-3 text-sm text-white/35 md:flex-row md:items-center md:justify-between">
            <p>© 2025 YMO Organization. All rights reserved.</p>
            <p>Supporting vulnerable children through faith, education, and personal development.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
