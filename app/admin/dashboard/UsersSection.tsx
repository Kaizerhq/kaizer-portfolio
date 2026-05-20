"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};

const S = {
  card: { border: "1px solid rgba(126,184,247,0.1)", padding: 24, marginBottom: 12, background: "rgba(126,184,247,0.02)" } as React.CSSProperties,
  btn: { padding: "8px 18px", background: "#7eb8f7", color: "#06090f", border: "none", fontFamily: '"Space Mono", monospace', fontSize: 10, letterSpacing: 2, fontWeight: 700, cursor: "crosshair" } as React.CSSProperties,
  btnDanger: { padding: "8px 16px", background: "transparent", color: "#ff6b6b", border: "1px solid rgba(255,107,107,0.3)", fontFamily: '"Space Mono", monospace', fontSize: 10, letterSpacing: 1, cursor: "crosshair" } as React.CSSProperties,
  sectionTitle: { fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 28, color: "#ddeeff", marginBottom: 8 } as React.CSSProperties,
  sectionSub: { fontSize: 10, letterSpacing: 3, color: "#7eb8f7", marginBottom: 32 } as React.CSSProperties,
};

export default function UsersSection({ toast }: { toast: (m: string) => void }) {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const promote = async (id: string) => {
    await supabase.from("profiles").update({ role: "admin" }).eq("id", id);
    load(); toast("Хэрэглэгч admin болгогдлоо");
  };

  const demote = async (id: string) => {
    await supabase.from("profiles").update({ role: "user" }).eq("id", id);
    load(); toast("Хэрэглэгч буцаагдлаа");
  };

  return (
    <div>
      <p style={S.sectionSub}>ХЭРЭГЛЭГЧИД</p>
      <h2 style={S.sectionTitle}>Хэрэглэгчид удирдах</h2>

      {loading ? (
        <p style={{ fontSize: 12, color: "rgba(221,238,255,0.3)", marginTop: 24 }}>Ачааллаж байна...</p>
      ) : users.length === 0 ? (
        <p style={{ fontSize: 12, color: "rgba(221,238,255,0.3)", marginTop: 24 }}>Хэрэглэгч байхгүй байна.</p>
      ) : users.map((u) => (
        <div key={u.id} style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: "#ddeeff" }}>{u.email}</span>
                <span style={{
                  fontSize: 9, padding: "3px 8px", letterSpacing: 2,
                  background: u.role === "admin" ? "rgba(126,184,247,0.15)" : "rgba(221,238,255,0.05)",
                  color: u.role === "admin" ? "#7eb8f7" : "rgba(221,238,255,0.35)",
                  border: `1px solid ${u.role === "admin" ? "rgba(126,184,247,0.3)" : "rgba(221,238,255,0.1)"}`,
                }}>
                  {u.role === "admin" ? "ADMIN" : "USER"}
                </span>
              </div>
              <p style={{ fontSize: 10, color: "rgba(221,238,255,0.25)", letterSpacing: 1 }}>
                {new Date(u.created_at).toLocaleDateString("mn-MN")}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {u.role === "user" ? (
                <button style={S.btn} onClick={() => promote(u.id)}>ADMIN БОЛГОХ</button>
              ) : (
                <button style={S.btnDanger} onClick={() => demote(u.id)}>БУЦААХ</button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}