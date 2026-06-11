import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import Login from "./components/Login";
import TutorChat from "./components/TutorChat";
import TodayKnowledge from "./components/TodayKnowledge";
import MyPage from "./components/MyPage";
import Footer from "./components/Footer";

type Tab = "home" | "mypage";

export default function App() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("home");
  const [pendingQuestion, setPendingQuestion] = useState("");

  function handleAsk(q: string) {
    setPendingQuestion(q);
    setTab("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <header style={styles.header}>
        <span style={styles.logo}>🔬 AI 과학 튜터</span>
        <nav style={styles.nav}>
          <button
            style={{ ...styles.navBtn, ...(tab === "home" ? styles.navActive : {}) }}
            onClick={() => setTab("home")}
          >
            홈
          </button>
          <button
            style={{ ...styles.navBtn, ...(tab === "mypage" ? styles.navActive : {}) }}
            onClick={() => setTab("mypage")}
          >
            마이페이지
          </button>
        </nav>
        <Login user={user} />
      </header>

      <main style={styles.main}>
        {tab === "home" ? (
          <>
            <TutorChat
              user={user}
              initialQuestion={pendingQuestion}
              onQuestionConsumed={() => setPendingQuestion("")}
            />
            <TodayKnowledge onAsk={handleAsk} />
          </>
        ) : (
          <MyPage user={user} />
        )}
      </main>

      <Footer />
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
    position: "sticky",
    top: 0,
    zIndex: 100,
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
