import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import Login from "./components/Login";
import TutorChat from "./components/TutorChat";
import History from "./components/History";

type Tab = "chat" | "history";

export default function App() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("chat");

  if (loading) {
    return <div style={styles.loading}>로딩 중…</div>;
  }

  if (!user) {
    return (
      <div style={styles.root}>
        <header style={styles.header}>
          <span style={styles.logo}>🔬 AI 과학 튜터</span>
        </header>
        <Login user={user} />
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <header style={styles.header}>
        <span style={styles.logo}>🔬 AI 과학 튜터</span>
        <nav style={styles.nav}>
          <button
            style={{ ...styles.navBtn, ...(tab === "chat" ? styles.navActive : {}) }}
            onClick={() => setTab("chat")}
          >
            질문하기
          </button>
          <button
            style={{ ...styles.navBtn, ...(tab === "history" ? styles.navActive : {}) }}
            onClick={() => setTab("history")}
          >
            학습 기록
          </button>
        </nav>
        <Login user={user} />
      </header>

      <main style={styles.main}>
        {tab === "chat" ? <TutorChat user={user} /> : <History user={user} />}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: { minHeight: "100vh", background: "#11111b", color: "#cdd6f4" },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    color: "#cdd6f4",
    fontSize: 18,
    background: "#11111b",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    padding: "12px 24px",
    background: "#1e1e2e",
    borderBottom: "1px solid #313244",
    flexWrap: "wrap",
  },
  logo: { fontSize: 20, fontWeight: 800, color: "#89b4fa" },
  nav: { display: "flex", gap: 4, flex: 1 },
  navBtn: {
    padding: "7px 18px",
    borderRadius: 8,
    border: "none",
    background: "transparent",
    color: "#a6adc8",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
  },
  navActive: { background: "#313244", color: "#cdd6f4" },
  main: { paddingTop: 28 },
};
