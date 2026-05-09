"use client";

import { useState, useEffect, useRef } from "react";
import { supabase, type Skill, type Project, type About, type ContactInfo } from "@/lib/supabase";

/* ── HELPERS ── */
function useInView(ref: React.RefObject<Element | null>, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

/* ── NAVBAR ── */
function Navbar({ active }: { active: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#about", label: "ТУХАЙ" },
    { href: "#skills", label: "ЧАДВАР" },
    { href: "#projects", label: "ТӨСЛҮҮД" },
    { href: "#contact", label: "ХОЛБОО" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      borderBottom: scrolled ? "1px solid rgba(126,184,247,0.2)" : "1px solid transparent",
      background: scrolled ? "rgba(6,9,15,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      transition: "all 0.4s ease",
      padding: "0 clamp(16px, 5vw, 64px)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="#top" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--paper)", letterSpacing: 2 }}>
            K<span style={{ color: "var(--amber)" }}>.</span>
          </span>
        </a>
        <div id="desktop-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav-link" style={{
              fontSize: 11, letterSpacing: 3,
              color: active === l.href ? "var(--amber)" : "rgba(221,238,255,0.5)",
              textDecoration: "none", transition: "color 0.2s", fontFamily: "var(--font-mono)",
            }}>{l.label}</a>
          ))}
          <a href="/admin" style={{
            fontSize: 10, letterSpacing: 2, padding: "6px 14px",
            border: "1px solid rgba(126,184,247,0.2)", color: "rgba(126,184,247,0.5)",
            textDecoration: "none", fontFamily: "var(--font-mono)", transition: "all 0.2s",
          }}
            onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = "var(--amber)"; el.style.color = "var(--amber)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = "rgba(126,184,247,0.2)"; el.style.color = "rgba(126,184,247,0.5)"; }}
          >ADMIN</a>
        </div>
        <button id="hamburger" onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "crosshair", display: "none", flexDirection: "column", padding: 4 }}
          aria-label="menu">
          {[0,1,2].map((i) => (
            <div key={i} style={{ width: 22, height: 2, background: menuOpen ? "var(--amber)" : "var(--paper)", marginBottom: i < 2 ? 5 : 0, opacity: i === 1 && menuOpen ? 0 : 1, transition: "all 0.3s" }} />
          ))}
        </button>
      </div>
      {menuOpen && (
        <div style={{ background: "var(--ink)", borderTop: "1px solid rgba(126,184,247,0.1)", padding: "24px clamp(16px,5vw,64px)", display: "flex", flexDirection: "column", gap: 20 }}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              style={{ fontSize: 13, letterSpacing: 3, color: "rgba(221,238,255,0.7)", textDecoration: "none" }}>{l.label}</a>
          ))}
          <a href="/admin" style={{ fontSize: 11, letterSpacing: 2, color: "rgba(126,184,247,0.6)", textDecoration: "none" }}>ADMIN</a>
        </div>
      )}
      <style>{`
        @media (max-width: 640px) {
          #desktop-nav { display: none !important; }
          #hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

/* ── HERO ── */
function Hero() {
  const [typed, setTyped] = useState("");
  const fullText = "Хөгжүүлэгч";
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) { setTyped(fullText.slice(0, i + 1)); i++; }
      else clearInterval(timer);
    }, 80);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="top" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 clamp(16px, 5vw, 64px)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "linear-gradient(rgba(126,184,247,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(126,184,247,0.04) 1px, transparent 1px)", backgroundSize: "80px 80px", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <div className="animate-fade-up" style={{ fontSize: 10, letterSpacing: 4, color: "var(--amber)", marginBottom: 48, fontFamily: "var(--font-mono)" }}>
          VOL.01 — KAIZER PORTFOLIO — {new Date().getFullYear()}
        </div>
        <p className="animate-fade-up delay-100" style={{ fontSize: "clamp(11px,1.5vw,13px)", letterSpacing: 3, color: "rgba(221,238,255,0.4)", marginBottom: 16, fontFamily: "var(--font-mono)" }}>
          САЙН БАЙНА УУ, НАМАЙГ
        </p>
        <h1 data-text="KAIZER" className="glitch-text animate-fade-up delay-200" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(64px,14vw,160px)", lineHeight: 0.9, letterSpacing: -2, color: "var(--paper)", marginBottom: 8 }}>
          KAIZER
        </h1>
        <div className="animate-fade-up delay-300" style={{ fontSize: "clamp(18px,4vw,48px)", color: "var(--amber)", fontFamily: "var(--font-display)", marginBottom: 32, minHeight: "1.2em" }}>
          {typed}<span className="cursor-blink" style={{ color: "var(--amber)", marginLeft: 2 }}>|</span>
        </div>
        <p className="animate-fade-up delay-400" style={{ maxWidth: 520, fontSize: "clamp(13px,1.8vw,15px)", lineHeight: 1.9, color: "rgba(221,238,255,0.5)", marginBottom: 48, fontFamily: "var(--font-mono)" }}>
          Орчин үеийн технологи ашиглан хурдан, хэрэглэгчдэд ээлтэй вэб шийдлүүд бүтээдэг. Монгол хөгжүүлэгч.
        </p>
        <div className="animate-fade-up delay-500" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <a href="#projects" style={{ display: "inline-block", padding: "14px 32px", background: "var(--amber)", color: "var(--ink)", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 3, textDecoration: "none", fontWeight: 700, transition: "all 0.2s" }}
            onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = "var(--amber-dark)"; el.style.transform = "translate(-2px,-2px)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = "var(--amber)"; el.style.transform = "none"; }}>
            ТӨСЛҮҮД →
          </a>
          <a href="#contact" style={{ display: "inline-block", padding: "14px 32px", border: "1px solid rgba(221,238,255,0.15)", color: "rgba(221,238,255,0.6)", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 3, textDecoration: "none", transition: "all 0.2s" }}
            onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = "var(--amber)"; el.style.color = "var(--amber)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = "rgba(221,238,255,0.15)"; el.style.color = "rgba(221,238,255,0.6)"; }}>
            ХОЛБОО БАРИХ
          </a>
        </div>
      </div>
      <div className="animate-fade-up delay-700" style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 9, letterSpacing: 3, color: "rgba(221,238,255,0.25)", fontFamily: "var(--font-mono)" }}>SCROLL</span>
        <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, rgba(126,184,247,0.5), transparent)" }} />
      </div>
    </section>
  );
}

/* ── ABOUT ── */
function About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<Element>);
  const [data, setData] = useState<About | null>(null);

  useEffect(() => {
    supabase.from("about").select("*").single().then(({ data }) => { if (data) setData(data); });
  }, []);

  const bio1 = data?.bio1 ?? "Намайг Kaizer гэдэг. Вэб хөгжүүлэлтэд сонирхолтой, орчин үеийн технологиудыг судалж, туршиж байдаг хөгжүүлэгч.";
  const bio2 = data?.bio2 ?? "Хэрэглэгчдэд ойлгомжтой, хурдан, найдвартай дижитал бүтээгдэхүүн хийх нь миний гол зорилго.";
  const stats = [
    { num: data?.years_exp ?? "3+", label: "ЖИЛ" },
    { num: data?.project_count ?? "10+", label: "ТӨСӨЛ" },
    { num: data?.extra_stat ?? "∞", label: "ХҮСЭЛ ЭРМЭЛЗЭЛ" },
    { num: data?.location ?? "MN", label: "БАЙРШИЛ" },
  ];

  return (
    <section id="about" ref={ref} style={{ padding: "120px clamp(16px,5vw,64px)", borderTop: "1px solid rgba(126,184,247,0.08)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div id="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateX(-24px)", transition: "all 0.7s ease" }}>
            <p style={{ fontSize: 10, letterSpacing: 4, color: "var(--amber)", marginBottom: 24, fontFamily: "var(--font-mono)" }}>§01 — ТУХАЙ</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px,5vw,56px)", lineHeight: 1.1, marginBottom: 32, color: "var(--paper)" }}>
              {data?.headline1 ?? "Кодоор"}<br />
              <span style={{ color: "var(--amber)" }}>{data?.headline2 ?? "санааг"}</span><br />
              {data?.headline3 ?? "амьдруулна"}
            </h2>
            <p style={{ fontSize: 14, lineHeight: 2, color: "rgba(221,238,255,0.5)", marginBottom: 20, fontFamily: "var(--font-mono)" }}>{bio1}</p>
            <p style={{ fontSize: 14, lineHeight: 2, color: "rgba(221,238,255,0.5)", fontFamily: "var(--font-mono)" }}>{bio2}</p>
          </div>
          <div style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateX(24px)", transition: "all 0.7s 0.2s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(126,184,247,0.06)" }}>
              {stats.map((s, i) => (
                <div key={i} style={{ background: "var(--ink)", padding: "40px 32px", borderBottom: "2px solid transparent", transition: "border-color 0.3s", cursor: "default" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderBottom = "2px solid var(--amber)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderBottom = "2px solid transparent")}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 42, color: "var(--amber)", marginBottom: 8 }}>{s.num}</div>
                  <div style={{ fontSize: 10, letterSpacing: 3, color: "rgba(221,238,255,0.35)", fontFamily: "var(--font-mono)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { #about-grid { grid-template-columns: 1fr !important; gap: 48px !important; } }`}</style>
    </section>
  );
}

/* ── SKILLS ── */
function Skills() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<Element>);
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    supabase.from("skills").select("*").order("order_index").then(({ data }) => { if (data) setSkills(data); });
  }, []);

  return (
    <section id="skills" ref={ref} style={{ padding: "120px clamp(16px,5vw,64px)", borderTop: "1px solid rgba(126,184,247,0.08)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ fontSize: 10, letterSpacing: 4, color: "var(--amber)", marginBottom: 24, fontFamily: "var(--font-mono)" }}>§02 — ЧАДВАР</p>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px,5vw,56px)", marginBottom: 64, color: "var(--paper)", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: "all 0.6s ease" }}>
          Технологийн стек
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 0 }}>
          {skills.map((skill, i) => (
            <div key={skill.id} style={{ borderBottom: "1px solid rgba(126,184,247,0.06)", borderRight: "1px solid rgba(126,184,247,0.06)", padding: "32px 24px", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(16px)", transition: `all 0.5s ${i * 0.08}s ease` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: 1, color: "var(--paper)" }}>{skill.name}</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--amber)" }}>{skill.level}</span>
              </div>
              <div style={{ height: 2, background: "rgba(126,184,247,0.1)", overflow: "hidden" }}>
                <div style={{ height: "100%", background: "linear-gradient(90deg, var(--amber), var(--rust))", width: inView ? `${skill.level}%` : "0%", transition: `width 1.2s ${0.3 + i * 0.1}s cubic-bezier(0.4,0,0.2,1)` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── PROJECTS ── */
function Projects() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<Element>);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    supabase.from("projects").select("*").order("order_index").then(({ data }) => { if (data) setProjects(data); });
  }, []);

  return (
    <section id="projects" ref={ref} style={{ padding: "120px clamp(16px,5vw,64px)", borderTop: "1px solid rgba(126,184,247,0.08)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ fontSize: 10, letterSpacing: 4, color: "var(--amber)", marginBottom: 24, fontFamily: "var(--font-mono)" }}>§03 — ТӨСЛҮҮД</p>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px,5vw,56px)", marginBottom: 64, color: "var(--paper)", opacity: inView ? 1 : 0, transition: "opacity 0.6s ease" }}>
          Хийсэн бүтээлүүд
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
          {projects.map((p, i) => (
            <div key={p.id} className="project-card" style={{ border: "1px solid rgba(126,184,247,0.08)", padding: 32, cursor: "crosshair", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)", transition: `opacity 0.6s ${i * 0.15}s ease, transform 0.6s ${i * 0.15}s ease` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "rgba(126,184,247,0.12)" }}>0{i + 1}</span>
                <span style={{ fontSize: 10, letterSpacing: 2, color: "var(--amber)", fontFamily: "var(--font-mono)" }}>{p.year}</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--paper)", marginBottom: 16 }}>{p.title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "rgba(221,238,255,0.45)", marginBottom: 24, fontFamily: "var(--font-mono)" }}>{p.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {p.stack.map((t) => (
                  <span key={t} style={{ fontSize: 10, letterSpacing: 2, padding: "4px 10px", border: "1px solid rgba(126,184,247,0.2)", color: "var(--amber)", fontFamily: "var(--font-mono)" }}>{t}</span>
                ))}
              </div>
              {p.link && <a href={p.link} style={{ display: "block", marginTop: 20, fontSize: 11, letterSpacing: 2, color: "var(--amber)", textDecoration: "none" }}>ҮЗЭХ →</a>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CONTACT ── */
function Contact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<Element>);
  const [info, setInfo] = useState<ContactInfo | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    supabase.from("contact_info").select("*").single().then(({ data }) => { if (data) setInfo(data); });
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    await supabase.from("messages").insert([form]);
    setSending(false);
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "transparent", border: "none",
    borderBottom: "1px solid rgba(126,184,247,0.15)", padding: "16px 0",
    color: "var(--paper)", fontFamily: "var(--font-mono)", fontSize: 13, outline: "none", transition: "border-color 0.2s",
  };

  const contactItems = [
    { label: "ИМЭЙЛ", val: info?.email ?? "kaizerhq@gmail.com" },
    { label: "БАЙРШИЛ", val: info?.location ?? "Улаанбаатар, Монгол" },
    { label: "GITHUB", val: info?.github ?? "github.com/kaizerhq" },
  ];

  return (
    <section id="contact" ref={ref} style={{ padding: "120px clamp(16px,5vw,64px)", borderTop: "1px solid rgba(126,184,247,0.08)" }}>
      <div id="contact-grid" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
        <div style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: "all 0.6s ease" }}>
          <p style={{ fontSize: 10, letterSpacing: 4, color: "var(--amber)", marginBottom: 24, fontFamily: "var(--font-mono)" }}>§04 — ХОЛБОО</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px,4vw,52px)", lineHeight: 1.1, marginBottom: 32, color: "var(--paper)" }}>
            Хамтран<br /><span style={{ color: "var(--amber)" }}>ажиллая</span>
          </h2>
          <p style={{ fontSize: 13, lineHeight: 2, color: "rgba(221,238,255,0.45)", marginBottom: 48, fontFamily: "var(--font-mono)" }}>
            {info?.tagline ?? "Таны санаа, миний код. Хамтдаа гайхалтай зүйл бүтээцгээе."}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {contactItems.map((item) => (
              <div key={item.label}>
                <p style={{ fontSize: 9, letterSpacing: 3, color: "var(--amber)", marginBottom: 4, fontFamily: "var(--font-mono)" }}>{item.label}</p>
                <p style={{ fontSize: 13, color: "rgba(221,238,255,0.55)", fontFamily: "var(--font-mono)" }}>{item.val}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: "all 0.6s 0.2s ease" }}>
          {sent ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column", gap: 16, textAlign: "center" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 48, color: "var(--amber)" }}>✓</span>
              <p style={{ fontSize: 13, letterSpacing: 2, color: "rgba(221,238,255,0.5)", fontFamily: "var(--font-mono)" }}>МЕССЕЖ ИЛГЭЭГДЛЭЭ</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {[
                { label: "НЭР", key: "name", type: "text", placeholder: "Таны нэр" },
                { label: "ИМЭЙЛ", key: "email", type: "email", placeholder: "tanii@email.mn" },
              ].map((f) => (
                <div key={f.key}>
                  <label style={{ fontSize: 9, letterSpacing: 3, color: "var(--amber)", display: "block", marginBottom: 4, fontFamily: "var(--font-mono)" }}>{f.label}</label>
                  <input type={f.type} value={form[f.key as keyof typeof form]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder} style={inputStyle}
                    onFocus={(e) => (e.target.style.borderBottomColor = "var(--amber)")}
                    onBlur={(e) => (e.target.style.borderBottomColor = "rgba(126,184,247,0.15)")} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 9, letterSpacing: 3, color: "var(--amber)", display: "block", marginBottom: 4, fontFamily: "var(--font-mono)" }}>МЕССЕЖ</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Таны санаа..." rows={4} style={{ ...inputStyle, resize: "none" }}
                  onFocus={(e) => (e.target.style.borderBottomColor = "var(--amber)")}
                  onBlur={(e) => (e.target.style.borderBottomColor = "rgba(126,184,247,0.15)")} />
              </div>
              <button onClick={handleSubmit} disabled={sending}
                style={{ alignSelf: "flex-start", padding: "14px 40px", background: "var(--amber)", color: "var(--ink)", border: "none", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 3, fontWeight: 700, cursor: "crosshair", transition: "all 0.2s", opacity: sending ? 0.7 : 1 }}
                onMouseEnter={(e) => { if (!sending) { e.currentTarget.style.background = "var(--amber-dark)"; e.currentTarget.style.transform = "translate(-2px,-2px)"; } }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--amber)"; e.currentTarget.style.transform = "none"; }}>
                {sending ? "ИЛГЭЭЖ БАЙНА..." : "ИЛГЭЭХ →"}
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`@media (max-width: 768px) { #contact-grid { grid-template-columns: 1fr !important; gap: 48px !important; } }`}</style>
    </section>
  );
}

/* ── FOOTER ── */
function Footer({ info }: { info: ContactInfo | null }) {
  return (
    <footer style={{ borderTop: "1px solid rgba(126,184,247,0.08)", padding: "40px clamp(16px,5vw,64px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
      <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--paper)" }}>K<span style={{ color: "var(--amber)" }}>.</span></span>
      <span style={{ fontSize: 10, letterSpacing: 2, color: "rgba(221,238,255,0.2)", fontFamily: "var(--font-mono)" }}>© {new Date().getFullYear()} KAIZER — БҮРТГЭГДСЭН</span>
      <div style={{ display: "flex", gap: 24 }}>
        {[{ label: "GITHUB", href: `https://${info?.github ?? "github.com/kaizerhq"}` }, { label: "FACEBOOK", href: `https://${info?.facebook ?? "#"}` }].map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 10, letterSpacing: 2, color: "rgba(221,238,255,0.3)", textDecoration: "none", fontFamily: "var(--font-mono)", transition: "color 0.2s" }}
            onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "var(--amber)")}
            onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "rgba(221,238,255,0.3)")}>
            {s.label}
          </a>
        ))}
      </div>
    </footer>
  );
}

/* ── MAIN ── */
export default function Home() {
  const [activeSection, setActiveSection] = useState("#top");
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    supabase.from("contact_info").select("*").single().then(({ data }) => { if (data) setContactInfo(data); });
    const sections = ["#about", "#skills", "#projects", "#contact"];
    const observers: IntersectionObserver[] = [];
    sections.forEach((id) => {
      const el = document.querySelector(id);
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setActiveSection(id); }, { threshold: 0.4 });
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <>
      <Navbar active={activeSection} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer info={contactInfo} />
    </>
  );
}
