import { useState } from "react";
import { User, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import History from "./History";

interface Props {
  user: User;
}

export default function MyPage({ user }: Props) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(user.displayName ?? "");
  const [localName, setLocalName] = useState(user.displayName ?? "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function handleSave() {
    if (!newName.trim()) return;
    setLoading(true);
    setMsg("");
    setError("");
    try {
      await updateProfile(auth.currentUser!, { displayName: newName.trim() });
      setLocalName(newName.trim());
      setEditing(false);
      setMsg("닉네임이 변경되었습니다.");
      setTimeout(() => setMsg(""), 3000);
    } catch (e: unknown) {
      setError("변경 실패: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setNewName(localName);
    setEditing(false);
    setError("");
  }

  const initials = (localName || user.email || "?")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={s.wrap}>
      {/* ── 프로필 카드 ── */}
      <div style={s.profileCard}>
        <div style={s.avatar}>{initials}</div>
        <div style={s.profileInfo}>
          <div style={s.nameRow}>
            {editing ? (
              <>
                <input
                  style={s.nameInput}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  autoFocus
                  maxLength={20}
                />
                <button style={s.saveBtn} onClick={handleSave} disabled={loading}>
                  {loading ? "저장 중…" : "저장"}
                </button>
                <button style={s.cancelBtn} onClick={handleCancel}>
                  취소
                </button>
              </>
            ) : (
              <>
                <span style={s.displayName}>{localName || "이름 없음"}</span>
                <button style={s.editBtn} onClick={() => setEditing(true)}>
                  ✏️ 닉네임 수정
                </button>
              </>
            )}
          </div>
          <p style={s.email}>{user.email}</p>
          {msg   && <p style={s.success}>{msg}</p>}
          {error && <p style={s.err}>{error}</p>}
        </div>
      </div>

      {/* ── 학습 기록 ── */}
      <History user={user} />
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap: {
    maxWidth: 760,
    margin: "0 auto",
    padding: "32px 20px 60px",
  },
  profileCard: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    background: "#1e1e2e",
    borderRadius: 16,
    padding: "24px 28px",
    marginBottom: 36,
    flexWrap: "wrap",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #89b4fa, #cba6f7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 26,
    fontWeight: 800,
    color: "#1e1e2e",
    flexShrink: 0,
  },
  profileInfo: { flex: 1, minWidth: 200 },
  nameRow: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 },
  displayName: { fontSize: 22, fontWeight: 700, color: "#cdd6f4" },
  email: { color: "#6c7086", fontSize: 14, margin: 0 },
  nameInput: {
    fontSize: 18,
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid #89b4fa",
    background: "#181825",
    color: "#cdd6f4",
    width: 180,
  },
  saveBtn: {
    padding: "6px 16px",
    borderRadius: 8,
    border: "none",
    background: "#89b4fa",
    color: "#1e1e2e",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "6px 12px",
    borderRadius: 8,
    border: "1px solid #45475a",
    background: "transparent",
    color: "#a6adc8",
    fontSize: 14,
    cursor: "pointer",
  },
  editBtn: {
    padding: "5px 12px",
    borderRadius: 8,
    border: "1px solid #45475a",
    background: "transparent",
    color: "#89b4fa",
    fontSize: 13,
    cursor: "pointer",
  },
  success: { color: "#a6e3a1", fontSize: 13, margin: "4px 0 0" },
  err: { color: "#f38ba8", fontSize: 13, margin: "4px 0 0" },
};
