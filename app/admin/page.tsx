"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError("Имэйл болон нууц үгээ оруулна уу."); return; }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Имэйл эсвэл нууц үг буруу байна.");
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(126,184,247,0.04)", border: "1px solid rgba(126,184,247,0.15)",
    padding: "14px 16px", color: "#ddeeff", fontFamily: '"Space Mono", monospace',
    fontSize: 13, outline: "none", transition: "border-color 0.2s",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#06090f", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: '"Space Mono", monospace', position: "relative" }}>
      {/* BG GRID */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "linear-gradient(rgba(126,184,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(126,184,247,0.03) 1px, transparent 1px)", backgroundSize: "80px 80px", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 400, position: "relative" }}>
        {/* LOGO */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 48, color: "#ddeeff" }}>
            K<span style={{ color: "#7eb8f7" }}>.</span>
          </span>
          <p style={{ fontSize: 10, letterSpacing: 4, color: "rgba(126,184,247,0.5)", marginTop: 8 }}>ADMIN PANEL</p>
        </div>

        {/* FORM BOX */}
        <div style={{ border: "1px solid rgba(126,184,247,0.12)", padding: 40, background: "rgba(126,184,247,0.02)" }}>
          <p style={{ fontSize: 10, letterSpacing: 3, color: "#7eb8f7", marginBottom: 32 }}>НЭВТРЭХ</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <label style={{ fontSize: 9, letterSpacing: 3, color: "#7eb8f7", display: "block", marginBottom: 8 }}>ИМЭЙЛ</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@email.com" style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#7eb8f7")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(126,184,247,0.15)")}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
            </div>
            <div>
              <label style={{ fontSize: 9, letterSpacing: 3, color: "#7eb8f7", display: "block", marginBottom: 8 }}>НУУЦ ҮГ</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#7eb8f7")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(126,184,247,0.15)")}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
            </div>

            {error && (
              <p style={{ fontSize: 11, color: "#ff6b6b", letterSpacing: 1 }}>{error}</p>
            )}

            <button onClick={handleLogin} disabled={loading}
              style={{ padding: "14px", background: "#7eb8f7", color: "#06090f", border: "none", fontFamily: '"Space Mono", monospace', fontSize: 11, letterSpacing: 3, fontWeight: 700, cursor: loading ? "wait" : "crosshair", transition: "all 0.2s", opacity: loading ? 0.7 : 1 }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#4a8fd4"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#7eb8f7"; }}>
              {loading ? "НЭВТЭРЧ БАЙНА..." : "НЭВТРЭХ →"}
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 10, color: "rgba(126,184,247,0.3)" }}>
          <a href="/" style={{ color: "rgba(126,184,247,0.3)", textDecoration: "none" }}>← БУЦАХ</a>
        </p>
      </div>
    </div>
  );
}
