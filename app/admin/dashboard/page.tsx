"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, type Skill, type Project, type About, type ContactInfo, type Message } from "@/lib/supabase";
import UsersSection from "./UsersSection";

/* ── STYLES ── */
const S = {
  page: { minHeight: "100vh", background: "#06090f", color: "#ddeeff", fontFamily: '"Space Mono", monospace' } as React.CSSProperties,
  sidebar: { width: 220, background: "rgba(126,184,247,0.03)", borderRight: "1px solid rgba(126,184,247,0.08)", padding: "32px 0", display: "flex", flexDirection: "column" as const, gap: 4 },
  main: { flex: 1, padding: "40px clamp(16px,3vw,48px)", overflowY: "auto" as const },
  card: { border: "1px solid rgba(126,184,247,0.1)", padding: 24, marginBottom: 16, background: "rgba(126,184,247,0.02)" } as React.CSSProperties,
  input: { width: "100%", background: "rgba(126,184,247,0.04)", border: "1px solid rgba(126,184,247,0.12)", padding: "10px 12px", color: "#ddeeff", fontFamily: '"Space Mono", monospace', fontSize: 12, outline: "none" } as React.CSSProperties,
  label: { fontSize: 9, letterSpacing: 3, color: "#7eb8f7", display: "block", marginBottom: 6 } as React.CSSProperties,
  btn: { padding: "10px 20px", background: "#7eb8f7", color: "#06090f", border: "none", fontFamily: '"Space Mono", monospace', fontSize: 10, letterSpacing: 2, fontWeight: 700, cursor: "crosshair" } as React.CSSProperties,
  btnDanger: { padding: "8px 16px", background: "transparent", color: "#ff6b6b", border: "1px solid rgba(255,107,107,0.3)", fontFamily: '"Space Mono", monospace', fontSize: 10, letterSpacing: 1, cursor: "crosshair" } as React.CSSProperties,
  btnGhost: { padding: "8px 16px", background: "transparent", color: "#7eb8f7", border: "1px solid rgba(126,184,247,0.2)", fontFamily: '"Space Mono", monospace', fontSize: 10, letterSpacing: 1, cursor: "crosshair" } as React.CSSProperties,
  sectionTitle: { fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 28, color: "#ddeeff", marginBottom: 8 } as React.CSSProperties,
  sectionSub: { fontSize: 10, letterSpacing: 3, color: "#7eb8f7", marginBottom: 32 } as React.CSSProperties,
  row: { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" as const },
  field: { display: "flex", flexDirection: "column" as const, gap: 6, flex: 1 },
};

/* ── NAV ITEM ── */
function NavItem({ label, active, onClick, badge }: { label: string; active: boolean; onClick: () => void; badge?: number }) {
  return (
    <button onClick={onClick} style={{
      padding: "12px 24px", background: active ? "rgba(126,184,247,0.1)" : "transparent",
      border: "none", borderLeft: active ? "2px solid #7eb8f7" : "2px solid transparent",
      color: active ? "#7eb8f7" : "rgba(221,238,255,0.4)", fontFamily: '"Space Mono", monospace',
      fontSize: 10, letterSpacing: 2, cursor: "crosshair", textAlign: "left", width: "100%",
      display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s",
    }}>
      {label}
      {badge !== undefined && badge > 0 && (
        <span style={{ background: "#7eb8f7", color: "#06090f", fontSize: 9, padding: "2px 6px", fontWeight: 700 }}>{badge}</span>
      )}
    </button>
  );
}

/* ── TOAST ── */
function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, background: "#7eb8f7", color: "#06090f", padding: "12px 20px", fontFamily: '"Space Mono", monospace', fontSize: 11, letterSpacing: 1, zIndex: 9999 }}>
      ✓ {msg}
    </div>
  );
}

/* ── SKILLS SECTION ── */
function SkillsSection({ toast }: { toast: (m: string) => void }) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({ name: "", level: 80 });
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: "", level: 80 });

  const load = () => supabase.from("skills").select("*").order("order_index").then(({ data }) => data && setSkills(data));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!newSkill.name) return;
    await supabase.from("skills").insert([{ ...newSkill, order_index: skills.length + 1 }]);
    setNewSkill({ name: "", level: 80 });
    load(); toast("Чадвар нэмэгдлээ");
  };

  const save = async (id: string) => {
    await supabase.from("skills").update(editData).eq("id", id);
    setEditId(null); load(); toast("Хадгалагдлаа");
  };

  const remove = async (id: string) => {
    await supabase.from("skills").delete().eq("id", id);
    load(); toast("Устгагдлаа");
  };

  return (
    <div>
      <p style={S.sectionSub}>§02 — ЧАДВАР</p>
      <h2 style={S.sectionTitle}>Чадварууд</h2>

      {/* ADD NEW */}
      <div style={{ ...S.card, marginBottom: 24 }}>
        <p style={{ ...S.label, marginBottom: 16 }}>ШИНЭ ЧАДВАР НЭМЭХ</p>
        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>НЭР</label>
            <input style={S.input} value={newSkill.name} onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })} placeholder="React / Next.js" />
          </div>
          <div style={{ ...S.field, maxWidth: 120 }}>
            <label style={S.label}>ТҮВШИН (0-100)</label>
            <input style={S.input} type="number" min={0} max={100} value={newSkill.level} onChange={(e) => setNewSkill({ ...newSkill, level: Number(e.target.value) })} />
          </div>
          <button style={{ ...S.btn, alignSelf: "flex-end" }} onClick={add}>НЭМЭХ +</button>
        </div>
      </div>

      {/* LIST */}
      {skills.map((s) => (
        <div key={s.id} style={S.card}>
          {editId === s.id ? (
            <div style={S.row}>
              <div style={S.field}>
                <label style={S.label}>НЭР</label>
                <input style={S.input} value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
              </div>
              <div style={{ ...S.field, maxWidth: 120 }}>
                <label style={S.label}>ТҮВШИН</label>
                <input style={S.input} type="number" min={0} max={100} value={editData.level} onChange={(e) => setEditData({ ...editData, level: Number(e.target.value) })} />
              </div>
              <button style={{ ...S.btn, alignSelf: "flex-end" }} onClick={() => save(s.id)}>ХАДГАЛАХ</button>
              <button style={{ ...S.btnGhost, alignSelf: "flex-end" }} onClick={() => setEditId(null)}>БОЛИХ</button>
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 13, color: "#ddeeff" }}>{s.name}</span>
                <div style={{ marginTop: 8, height: 2, width: 200, background: "rgba(126,184,247,0.1)" }}>
                  <div style={{ height: "100%", width: `${s.level}%`, background: "linear-gradient(90deg, #7eb8f7, #b8d9ff)" }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 20, fontFamily: '"DM Serif Display"', color: "#7eb8f7" }}>{s.level}</span>
                <button style={S.btnGhost} onClick={() => { setEditId(s.id); setEditData({ name: s.name, level: s.level }); }}>ЗАСАХ</button>
                <button style={S.btnDanger} onClick={() => remove(s.id)}>УСТГАХ</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── PROJECTS SECTION ── */
function ProjectsSection({ toast }: { toast: (m: string) => void }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", desc: "", stack: "", year: new Date().getFullYear().toString(), link: "" });
  const [editForm, setEditForm] = useState({ title: "", desc: "", stack: "", year: "", link: "" });
  const [adding, setAdding] = useState(false);

  const load = () => supabase.from("projects").select("*").order("order_index").then(({ data }) => data && setProjects(data));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.title || !form.desc) return;
    await supabase.from("projects").insert([{ title: form.title, desc: form.desc, stack: form.stack.split(",").map(s => s.trim()).filter(Boolean), year: form.year, link: form.link || null, order_index: projects.length + 1 }]);
    setForm({ title: "", desc: "", stack: "", year: new Date().getFullYear().toString(), link: "" });
    setAdding(false); load(); toast("Төсөл нэмэгдлээ");
  };

  const save = async (id: string) => {
    await supabase.from("projects").update({ title: editForm.title, desc: editForm.desc, stack: editForm.stack.split(",").map(s => s.trim()).filter(Boolean), year: editForm.year, link: editForm.link || null }).eq("id", id);
    setEditId(null); load(); toast("Хадгалагдлаа");
  };

  const remove = async (id: string) => {
    await supabase.from("projects").delete().eq("id", id);
    load(); toast("Устгагдлаа");
  };

  const FormFields = ({ data, onChange }: { data: typeof form; onChange: (d: typeof form) => void }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={S.row}>
        <div style={S.field}>
          <label style={S.label}>ГАРЧИГ</label>
          <input style={S.input} value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })} placeholder="Төслийн нэр" />
        </div>
        <div style={{ ...S.field, maxWidth: 100 }}>
          <label style={S.label}>ОН</label>
          <input style={S.input} value={data.year} onChange={(e) => onChange({ ...data, year: e.target.value })} />
        </div>
      </div>
      <div style={S.field}>
        <label style={S.label}>ТАЙЛБАР</label>
        <textarea style={{ ...S.input, resize: "none" }} rows={3} value={data.desc} onChange={(e) => onChange({ ...data, desc: e.target.value })} placeholder="Төслийн тайлбар..." />
      </div>
      <div style={S.field}>
        <label style={S.label}>СТЕК (таслалаар тусгаарлах)</label>
        <input style={S.input} value={data.stack} onChange={(e) => onChange({ ...data, stack: e.target.value })} placeholder="React, TypeScript, Tailwind" />
      </div>
      <div style={S.field}>
        <label style={S.label}>ЛИНК (заавал биш)</label>
        <input style={S.input} value={data.link} onChange={(e) => onChange({ ...data, link: e.target.value })} placeholder="https://..." />
      </div>
    </div>
  );

  return (
    <div>
      <p style={S.sectionSub}>§03 — ТӨСЛҮҮД</p>
      <h2 style={S.sectionTitle}>Төслүүд</h2>
      <button style={{ ...S.btn, marginBottom: 24 }} onClick={() => setAdding(!adding)}>{adding ? "БОЛИХ" : "ШИНЭ ТӨСӨЛ +"}</button>

      {adding && (
        <div style={{ ...S.card, marginBottom: 24 }}>
          <p style={{ ...S.label, marginBottom: 16 }}>ШИНЭ ТӨСӨЛ</p>
          <FormFields data={form} onChange={setForm} />
          <button style={{ ...S.btn, marginTop: 16 }} onClick={add}>НЭМЭХ →</button>
        </div>
      )}

      {projects.map((p, i) => (
        <div key={p.id} style={S.card}>
          {editId === p.id ? (
            <>
              <FormFields data={editForm} onChange={(d) => setEditForm(d)} />
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button style={S.btn} onClick={() => save(p.id)}>ХАДГАЛАХ</button>
                <button style={S.btnGhost} onClick={() => setEditId(null)}>БОЛИХ</button>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 20, fontFamily: '"DM Serif Display"', color: "rgba(126,184,247,0.2)" }}>0{i + 1}</span>
                  <span style={{ fontSize: 14, color: "#ddeeff" }}>{p.title}</span>
                  <span style={{ fontSize: 10, color: "#7eb8f7", letterSpacing: 2 }}>{p.year}</span>
                </div>
                <p style={{ fontSize: 12, color: "rgba(221,238,255,0.4)", lineHeight: 1.7, marginBottom: 10 }}>{p.desc}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {p.stack.map((t) => <span key={t} style={{ fontSize: 9, padding: "3px 8px", border: "1px solid rgba(126,184,247,0.2)", color: "#7eb8f7", letterSpacing: 1 }}>{t}</span>)}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button style={S.btnGhost} onClick={() => { setEditId(p.id); setEditForm({ title: p.title, desc: p.desc, stack: p.stack.join(", "), year: p.year, link: p.link || "" }); }}>ЗАСАХ</button>
                <button style={S.btnDanger} onClick={() => remove(p.id)}>УСТГАХ</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── ABOUT SECTION ── */
function AboutSection({ toast }: { toast: (m: string) => void }) {
  const [data, setData] = useState<About | null>(null);
  const [form, setForm] = useState({ bio1: "", bio2: "", years_exp: "", project_count: "", extra_stat: "", location: "", headline1: "", headline2: "", headline3: "" });

  useEffect(() => {
    supabase.from("about").select("*").single().then(({ data }) => {
      if (data) { setData(data); setForm({ bio1: data.bio1, bio2: data.bio2, years_exp: data.years_exp, project_count: data.project_count, extra_stat: data.extra_stat, location: data.location, headline1: data.headline1, headline2: data.headline2, headline3: data.headline3 }); }
    });
  }, []);

  const save = async () => {
    if (!data) return;
    await supabase.from("about").update(form).eq("id", data.id);
    toast("Хадгалагдлаа");
  };

  return (
    <div>
      <p style={S.sectionSub}>§01 — ТУХАЙ</p>
      <h2 style={S.sectionTitle}>Тухай хэсэг</h2>
      <div style={S.card}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={S.row}>
            {["headline1", "headline2", "headline3"].map((k) => (
              <div key={k} style={S.field}>
                <label style={S.label}>{k.toUpperCase()}</label>
                <input style={S.input} value={form[k as keyof typeof form]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
              </div>
            ))}
          </div>
          <div style={S.field}>
            <label style={S.label}>БИОГРАФИ 1</label>
            <textarea style={{ ...S.input, resize: "none" }} rows={3} value={form.bio1} onChange={(e) => setForm({ ...form, bio1: e.target.value })} />
          </div>
          <div style={S.field}>
            <label style={S.label}>БИОГРАФИ 2</label>
            <textarea style={{ ...S.input, resize: "none" }} rows={3} value={form.bio2} onChange={(e) => setForm({ ...form, bio2: e.target.value })} />
          </div>
          <div style={S.row}>
            {[["years_exp", "ЖИЛ"], ["project_count", "ТӨСӨЛ"], ["extra_stat", "НЭМЭЛТ"], ["location", "БАЙРШИЛ"]].map(([k, l]) => (
              <div key={k} style={S.field}>
                <label style={S.label}>{l}</label>
                <input style={S.input} value={form[k as keyof typeof form]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
              </div>
            ))}
          </div>
          <button style={S.btn} onClick={save}>ХАДГАЛАХ →</button>
        </div>
      </div>
    </div>
  );
}

/* ── CONTACT SECTION ── */
function ContactSection({ toast }: { toast: (m: string) => void }) {
  const [data, setData] = useState<ContactInfo | null>(null);
  const [form, setForm] = useState({ email: "", location: "", github: "", facebook: "", tagline: "" });

  useEffect(() => {
    supabase.from("contact_info").select("*").single().then(({ data }) => {
      if (data) { setData(data); setForm({ email: data.email, location: data.location, github: data.github, facebook: data.facebook, tagline: data.tagline }); }
    });
  }, []);

  const save = async () => {
    if (!data) return;
    await supabase.from("contact_info").update(form).eq("id", data.id);
    toast("Хадгалагдлаа");
  };

  return (
    <div>
      <p style={S.sectionSub}>§04 — ХОЛБОО</p>
      <h2 style={S.sectionTitle}>Холбоо барих мэдээлэл</h2>
      <div style={S.card}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[["email", "ИМЭЙЛ"], ["location", "БАЙРШИЛ"], ["github", "GITHUB"], ["facebook", "FACEBOOK"]].map(([k, l]) => (
            <div key={k} style={S.field}>
              <label style={S.label}>{l}</label>
              <input style={S.input} value={form[k as keyof typeof form]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
            </div>
          ))}
          <div style={S.field}>
            <label style={S.label}>TAGLINE</label>
            <textarea style={{ ...S.input, resize: "none" }} rows={2} value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          </div>
          <button style={S.btn} onClick={save}>ХАДГАЛАХ →</button>
        </div>
      </div>
    </div>
  );
}

/* ── MESSAGES SECTION ── */
function MessagesSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [unread, setUnread] = useState(0);

  const load = () => supabase.from("messages").select("*").order("created_at", { ascending: false }).then(({ data }) => {
    if (data) { setMessages(data); setUnread(data.filter((m) => !m.read).length); }
  });

  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    await supabase.from("messages").update({ read: true }).eq("id", id);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("messages").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <p style={S.sectionSub}>МЕССЕЖҮҮД</p>
      <h2 style={S.sectionTitle}>Ирсэн мессежүүд {unread > 0 && <span style={{ fontSize: 16, color: "#7eb8f7" }}>({unread} шинэ)</span>}</h2>
      {messages.length === 0 ? (
        <p style={{ color: "rgba(221,238,255,0.3)", fontSize: 12, marginTop: 24 }}>Одоогоор мессеж байхгүй байна.</p>
      ) : messages.map((m) => (
        <div key={m.id} style={{ ...S.card, opacity: m.read ? 0.6 : 1, borderColor: m.read ? "rgba(126,184,247,0.06)" : "rgba(126,184,247,0.2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 16, marginBottom: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, color: "#ddeeff", fontWeight: 700 }}>{m.name}</span>
                <span style={{ fontSize: 11, color: "#7eb8f7" }}>{m.email}</span>
                <span style={{ fontSize: 10, color: "rgba(221,238,255,0.3)" }}>{new Date(m.created_at).toLocaleString("mn-MN")}</span>
                {!m.read && <span style={{ fontSize: 9, padding: "2px 6px", background: "#7eb8f7", color: "#06090f", letterSpacing: 1 }}>ШИНЭ</span>}
              </div>
              <p style={{ fontSize: 12, color: "rgba(221,238,255,0.55)", lineHeight: 1.7 }}>{m.message}</p>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              {!m.read && <button style={S.btnGhost} onClick={() => markRead(m.id)}>УНШСАН</button>}
              <button style={S.btnDanger} onClick={() => remove(m.id)}>УСТГАХ</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── MAIN DASHBOARD ── */
export default function Dashboard() {
  const router = useRouter();
  const [tab, setTab] = useState("skills");
  const [toastMsg, setToastMsg] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [userEmail, setUserEmail] = useState("");

  const toast = (msg: string) => setToastMsg(msg);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push("/admin"); return; }
      setUserEmail(session.user.email ?? "");
    });
    supabase.from("messages").select("id", { count: "exact" }).eq("read", false).then(({ count }) => setUnreadCount(count ?? 0));
  }, [router]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  const tabs = [
    { id: "skills", label: "ЧАДВАР" },
    { id: "projects", label: "ТӨСЛҮҮД" },
    { id: "about", label: "ТУХАЙ" },
    { id: "contact", label: "ХОЛБОО" },
    { id: "messages", label: "МЕССЕЖ", badge: unreadCount },
    { id: "users", label: "ХЭРЭГЛЭГЧИД" },
  ];

  return (
    <div style={S.page}>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* SIDEBAR */}
        <div style={S.sidebar}>
          <div style={{ padding: "0 24px 32px", borderBottom: "1px solid rgba(126,184,247,0.08)" }}>
            <a href="/" style={{ textDecoration: "none" }}>
              <span style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 28, color: "#ddeeff" }}>K<span style={{ color: "#7eb8f7" }}>.</span></span>
            </a>
            <p style={{ fontSize: 9, letterSpacing: 3, color: "rgba(126,184,247,0.4)", marginTop: 4 }}>ADMIN PANEL</p>
          </div>

          <div style={{ padding: "24px 0", flex: 1 }}>
            {tabs.map((t) => <NavItem key={t.id} label={t.label} active={tab === t.id} onClick={() => setTab(t.id)} badge={t.badge} />)}
          </div>

          <div style={{ padding: "24px", borderTop: "1px solid rgba(126,184,247,0.08)" }}>
            <p style={{ fontSize: 9, color: "rgba(126,184,247,0.4)", marginBottom: 12, wordBreak: "break-all" }}>{userEmail}</p>
            <button onClick={logout} style={{ ...S.btnDanger, width: "100%", textAlign: "center" }}>ГАРАХ</button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={S.main}>
          {tab === "skills" && <SkillsSection toast={toast} />}
          {tab === "projects" && <ProjectsSection toast={toast} />}
          {tab === "about" && <AboutSection toast={toast} />}
          {tab === "contact" && <ContactSection toast={toast} />}
          {tab === "messages" && <MessagesSection />}
          {tab === "users" && <UsersSection toast={toast} />}
        </div>
      </div>

      {toastMsg && <Toast msg={toastMsg} onClose={() => setToastMsg("")} />}

      {/* MOBILE SIDEBAR NOTE */}
      <style>{`
        @media (max-width: 640px) {
          .admin-sidebar { display: none; }
        }
      `}</style>
    </div>
  );
}
