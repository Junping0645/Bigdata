import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile,
  sendEmailVerification,
  User,
} from "firebase/auth";
import { auth } from "../firebase";

interface Props {
  user: User | null;
}

type Step = "login" | "register" | "verify";

export default function Login({ user }: Props) {
  const [step, setStep] = useState<Step>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  function reset() {
    setError(""); setInfo("");
  }

  // ── 로그인 ─────────────────────────────────────────────────────
  async function handleLogin() {
    reset(); setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: unknown) {
      setError(firebaseMsg(e));
    } finally {
      setLoading(false);
    }
  }

  // ── 회원가입 ────────────────────────────────────────────────────
  async function handleRegister() {
    reset();
    if (!displayName.trim()) { setError("이름을 입력해주세요."); return; }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: displayName.trim() });
      await sendEmailVerification(cred.user);
      setStep("verify");
      setInfo(`${email} 로 인증 메일을 보냈습니다. 확인 후 로그인하세요.`);
      await signOut(auth);
    } catch (e: unknown) {
      setError(firebaseMsg(e));
    } finally {
      setLoading(false);
    }
  }

  // ── Google 로그인 ────────────────────────────────────────────────
  async function handleGoogle() {
    reset(); setLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e: unknown) {
      setError(firebaseMsg(e));
    } finally {
      setLoading(false);
    }
  }

  // ── 로그인 상태 헤더 ─────────────────────────────────────────────
  if (user) {
    return (
      <div style={styles.bar}>
        <span>
          👋 <strong>{user.displayName ?? user.email}</strong> 님 환영합니다
          {!user.emailVerified && user.providerData[0]?.providerId === "password" && (
            <span style={styles.unverified}> (이메일 미인증)</span>
          )}
        </span>
        <button style={styles.btnSmall} onClick={() => signOut(auth)}>
          로그아웃
        </button>
      </div>
    );
  }

  // ── 인증 메일 안내 화면 ──────────────────────────────────────────
  if (step === "verify") {
    return (
      <div style={styles.box}>
        <h2 style={styles.title}>📧 이메일 인증</h2>
        <p style={{ ...styles.info, textAlign: "center" }}>{info}</p>
        <button style={styles.btn} onClick={() => { setStep("login"); setInfo(""); }}>
          로그인으로 돌아가기
        </button>
      </div>
    );
  }

  // ── 로그인 / 회원가입 폼 ─────────────────────────────────────────
  const isRegister = step === "register";
  return (
    <div style={styles.box}>
      <h2 style={styles.title}>{isRegister ? "회원가입" : "로그인"}</h2>

      {isRegister && (
        <input
          style={styles.input}
          placeholder="이름 (표시될 닉네임)"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      )}
      <input
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        style={styles.input}
        type="password"
        placeholder="비밀번호 (6자 이상)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && (isRegister ? handleRegister() : handleLogin())}
      />

      {error && <p style={styles.error}>{error}</p>}
      {info  && <p style={styles.info}>{info}</p>}

      <button style={styles.btn} onClick={isRegister ? handleRegister : handleLogin} disabled={loading}>
        {loading ? "처리 중…" : isRegister ? "가입하기" : "로그인"}
      </button>

      <button style={{ ...styles.btn, background: "#4285F4" }} onClick={handleGoogle} disabled={loading}>
        Google로 시작
      </button>

      <button
        style={styles.btnText}
        onClick={() => { reset(); setStep(isRegister ? "login" : "register"); }}
      >
        {isRegister ? "이미 계정이 있어요 → 로그인" : "계정이 없어요 → 회원가입"}
      </button>
    </div>
  );
}

// Firebase 에러 메시지 한글화
function firebaseMsg(e: unknown): string {
  if (!(e instanceof Error)) return "알 수 없는 오류";
  const code = (e as { code?: string }).code ?? "";
  const map: Record<string, string> = {
    "auth/invalid-email": "이메일 형식이 올바르지 않습니다.",
    "auth/user-not-found": "등록되지 않은 이메일입니다.",
    "auth/wrong-password": "비밀번호가 틀렸습니다.",
    "auth/invalid-credential": "이메일 또는 비밀번호가 틀렸습니다.",
    "auth/email-already-in-use": "이미 사용 중인 이메일입니다.",
    "auth/weak-password": "비밀번호는 6자 이상이어야 합니다.",
    "auth/too-many-requests": "요청이 너무 많습니다. 잠시 후 다시 시도하세요.",
    "auth/popup-closed-by-user": "Google 로그인 창이 닫혔습니다.",
  };
  return map[code] ?? e.message;
}

const styles: Record<string, React.CSSProperties> = {
  box: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    maxWidth: 340,
    margin: "60px auto",
    padding: 28,
    background: "#1e1e2e",
    borderRadius: 12,
  },
  bar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 16px",
    background: "#1e1e2e",
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 14,
    color: "#cdd6f4",
  },
  title: { color: "#cdd6f4", marginBottom: 4, fontSize: 20 },
  input: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #45475a",
    background: "#181825",
    color: "#cdd6f4",
    fontSize: 15,
  },
  btn: {
    padding: "11px 0",
    borderRadius: 8,
    border: "none",
    background: "#89b4fa",
    color: "#1e1e2e",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
  },
  btnSmall: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    background: "#f38ba8",
    color: "#1e1e2e",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
  },
  btnText: {
    background: "none",
    border: "none",
    color: "#89b4fa",
    fontSize: 13,
    cursor: "pointer",
    textDecoration: "underline",
    padding: "2px 0",
  },
  error: { color: "#f38ba8", fontSize: 13, margin: 0 },
  info: { color: "#a6e3a1", fontSize: 13, margin: 0 },
  unverified: { color: "#f9e2af", fontSize: 12 },
};
