"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminAuth() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(""); setSuccess("");
    if (!email || !password) { setError("Имэйл болон нууц үгээ оруулна уу."); return; }

    if (mode === "register") {
      if (password !== confirmPassword) { setError("Нууц үг таарахгүй байна."); return; }
      if (password.length < 6) { setError("Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой."); return; }
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message); }
      else { setSuccess("Бүртгэл амжилттай! Нэвтэрч орно уу."); setEmail(""); setPassword(""); setConfirmPassword(""); setTimeout(() => setMode("login"), 2000); }
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError("Имэйл эсвэл нууц үг буруу байна."); setLoading(false); return; }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
    if (profile?.role === "admin") { router.push("/admin/dashboard"); }
    else { router.push("/"); }
  };

  const inp: React.CSSProperties = { width: "100%", background: "rgba(126,184,247,0.04)", border: "1px solid rgba(126,184,247,0.15)", padding: "14px 16px", color: "#ddeeff", fontFamily: '"Space Mono", monospace', fontSize: 13, outline: "none", transition: "border-color 0.2s" };

  return (
    <div style={{ minHeight: "100vh", background: "#06090f", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: '"Space Mono", monospace' }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "linear-gradient(rgba(126,184,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(126,184,247,0.03) 1px, transparent 1px)", backgroundSize: "80px 80px", pointerEvents: "none" }} />
      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <a href="/" style={{ textDecoration: "none" }}><span style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 48, color: "#ddeeff" }}>K<span style={{ color: "#7eb8f7" }}>.</span></span></a>
          <p style={{ fontSize: 10, letterSpacing: 4, color: "rgba(126,184,247,0.5)", marginTop: 8 }}>НЭВТРЭХ / БҮРТГҮҮЛЭХ</p>
        </div>

        <div style={{ display: "flex", marginBottom: 32, border: "1px solid rgba(126,184,247,0.12)" }}>
          {(["login", "register"] as const).map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(""); setSuccess(""); }} style={{ flex: 1, padding: "12px", background: mode === m ? "rgba(126,184,247,0.1)" : "transparent", border: "none", borderBottom: mode === m ? "2px solid #7eb8f7" : "2px solid transparent", color: mode === m ? "#7eb8f7" : "rgba(221,238,255,0.35)", fontFamily: '"Space Mono", monospace', fontSize: 10, letterSpacing: 3, cursor: "crosshair", transition: "all 0.2s" }}>
              {m === "login" ? "НЭВТРЭХ" : "БҮРТГҮҮЛЭХ"}
            </button>
          ))}
        </div>

        <div style={{ border: "1px solid rgba(126,184,247,0.12)", padding: 40, background: "rgba(126,184,247,0.02)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div><label style={{ fontSize: 9, letterSpacing: 3, color: "#7eb8f7", display: "block", marginBottom: 8 }}>ИМЭЙЛ</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tanii@email.com" style={inp} onFocus={(e) => (e.target.style.borderColor = "#7eb8f7")} onBlur={(e) => (e.target.style.borderColor = "rgba(126,184,247,0.15)")} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} /></div>
            <div><label style={{ fontSize: 9, letterSpacing: 3, color: "#7eb8f7", display: "block", marginBottom: 8 }}>НУУЦ ҮГ</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={inp} onFocus={(e) => (e.target.style.borderColor = "#7eb8f7")} onBlur={(e) => (e.target.style.borderColor = "rgba(126,184,247,0.15)")} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} /></div>
            {mode === "register" && <div><label style={{ fontSize: 9, letterSpacing: 3, color: "#7eb8f7", display: "block", marginBottom: 8 }}>НУУЦ ҮГ ДАВТАХ</label><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" style={inp} onFocus={(e) => (e.target.style.borderColor = "#7eb8f7")} onBlur={(e) => (e.target.style.borderColor = "rgba(126,184,247,0.15)")} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} /></div>}
            {error && <p style={{ fontSize: 11, color: "#ff6b6b", letterSpacing: 1, lineHeight: 1.6 }}>{error}</p>}
            {success && <p style={{ fontSize: 11, color: "#7eb8f7", letterSpacing: 1, lineHeight: 1.6 }}>{success}</p>}
            <button onClick={handleSubmit} disabled={loading} style={{ padding: "14px", background: "#7eb8f7", color: "#06090f", border: "none", fontFamily: '"Space Mono", monospace', fontSize: 11, letterSpacing: 3, fontWeight: 700, cursor: loading ? "wait" : "crosshair", transition: "all 0.2s", opacity: loading ? 0.7 : 1 }} onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#4a8fd4"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#7eb8f7"; }}>
              {loading ? "ТҮР ХҮЛЭЭНЭ ҮҮ..." : mode === "login" ? "НЭВТРЭХ →" : "БҮРТГҮҮЛЭХ →"}
            </button>
          </div>
        </div>
        <p style={{ textAlign: "center", marginTop: 24, fontSize: 10 }}><a href="/" style={{ color: "rgba(126,184,247,0.3)", textDecoration: "none" }}>← НҮҮР ХУУДАС</a></p>
      </div>
    </div>
  );
}