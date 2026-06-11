import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { ref, push, serverTimestamp } from "firebase/database";
import { db } from "../firebase";
import { askChat, fetchTTS } from "../api";

interface Props {
  user: User | null;
  initialQuestion?: string;
  onQuestionConsumed?: () => void;
}

const VOICES = [
  { value: "coral",   label: "Coral — 차분한 여성" },
  { value: "alloy",   label: "Alloy — 중성적" },
  { value: "echo",    label: "Echo — 낮은 남성" },
  { value: "fable",   label: "Fable — 따뜻한 남성" },
  { value: "nova",    label: "Nova — 밝은 여성" },
  { value: "onyx",    label: "Onyx — 깊은 남성" },
  { value: "shimmer", label: "Shimmer — 부드러운 여성" },
];

const TONES = [
  { value: "차분하고 또렷한 설명 톤으로 읽어줘.", label: "차분한 설명" },
  { value: "신나고 활기차게 읽어줘.", label: "활기차게" },
  { value: "천천히 또박또박 읽어줘.", label: "천천히" },
  { value: "뉴스 앵커처럼 전문적으로 읽어줘.", label: "뉴스 톤" },
  { value: "친근한 친구처럼 자연스럽게 읽어줘.", label: "친근하게" },
];

export default function TutorChat({ user, initialQuestion, onQuestionConsumed }: Props) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [dbError, setDbError] = useState("");
  const [voice, setVoice] = useState("coral");
  const [tone, setTone] = useState(TONES[0].value);

  useEffect(() => {
    if (initialQuestion) {
      setQuestion(initialQuestion);
      setAnswer("");
      setAudioUrl(null);
      onQuestionConsumed?.();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestion]);

  function handleNewQuestion() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setQuestion("");
    setAnswer("");
    setAudioUrl(null);
    setError("");
  }

  async function handleAsk() {
    const q = question.trim();
    if (!q) return;
    setError("");
    setDbError("");
    setAnswer("");
    setAudioUrl(null);
    setLoading(true);
    try {
      const ans = await askChat(q);
      setAnswer(ans);
      if (user) {
        try {
          await push(ref(db, `users/${user.uid}/history`), {
            question: q,
            answer: ans,
            createdAt: serverTimestamp(),
          });
        } catch (dbErr: unknown) {
          const msg = dbErr instanceof Error ? dbErr.message : String(dbErr);
          console.error("DB 저장 실패:", msg);
          setDbError("DB 저장 실패: " + msg);
        }
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function handleTTS() {
    if (!answer) return;
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setTtsLoading(true);
    try {
      const blob = await fetchTTS(answer, voice, tone);
      setAudioUrl(URL.createObjectURL(blob));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "TTS 오류");
    } finally {
      setTtsLoading(false);
    }
  }

  return (
    <div style={styles.wrap}>
      <h1 style={styles.title}>🔬 AI 과학 튜터</h1>
      <p style={styles.sub}>과학·AI 개념을 질문하면 고등학생 눈높이로 설명해드립니다.</p>

      <div style={styles.inputRow}>
        <input
          style={{ ...styles.input, opacity: answer ? 0.5 : 1 }}
          placeholder="예: 블랙홀이 뭐야? / 머신러닝이란?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !answer && handleAsk()}
          disabled={!!answer || loading}
        />
        {answer ? (
          <button style={{ ...styles.btn, background: "#cba6f7" }} onClick={handleNewQuestion}>
            ✏️ 다른 질문하기
          </button>
        ) : (
          <button style={styles.btn} onClick={handleAsk} disabled={loading}>
            {loading ? "생각 중…" : "질문"}
          </button>
        )}
      </div>

      {error   && <p style={styles.error}>{error}</p>}
      {dbError && <p style={styles.error}>⚠ 기록 저장 실패: {dbError}</p>}

      {answer && (
        <div style={styles.answerBox}>
          <p style={styles.answerText}>{answer}</p>

          {/* TTS 옵션 */}
          <div style={styles.ttsOptions}>
            <div style={styles.selectGroup}>
              <label style={styles.selectLabel}>목소리</label>
              <select
                style={styles.select}
                value={voice}
                onChange={(e) => { setVoice(e.target.value); setAudioUrl(null); }}
              >
                {VOICES.map((v) => (
                  <option key={v.value} value={v.value}>{v.label}</option>
                ))}
              </select>
            </div>
            <div style={styles.selectGroup}>
              <label style={styles.selectLabel}>말투</label>
              <select
                style={styles.select}
                value={tone}
                onChange={(e) => { setTone(e.target.value); setAudioUrl(null); }}
              >
                {TONES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.ttsRow}>
            <button style={styles.ttsBtn} onClick={handleTTS} disabled={ttsLoading}>
              {ttsLoading ? "생성 중…" : "🔊 음성으로 듣기"}
            </button>
            {audioUrl && (
              <audio controls autoPlay src={audioUrl} style={{ flex: 1, minWidth: 180 }} />
            )}
          </div>
          <p style={styles.aiNotice}>* AI가 생성한 음성입니다 (OpenAI TTS)</p>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 720, margin: "0 auto", padding: "0 16px 40px" },
  title: { color: "#89b4fa", fontSize: 28, marginBottom: 6 },
  sub: { color: "#a6adc8", fontSize: 15, marginBottom: 20 },
  inputRow: { display: "flex", gap: 8, marginBottom: 12 },
  input: {
    flex: 1,
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #45475a",
    background: "#181825",
    color: "#cdd6f4",
    fontSize: 16,
  },
  btn: {
    padding: "12px 22px",
    borderRadius: 10,
    border: "none",
    background: "#89b4fa",
    color: "#1e1e2e",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  error: { color: "#f38ba8", fontSize: 14 },
  answerBox: {
    background: "#1e1e2e",
    borderRadius: 12,
    padding: "18px 20px",
    marginTop: 8,
  },
  answerText: { color: "#cdd6f4", lineHeight: 1.8, fontSize: 16, marginBottom: 16 },
  ttsOptions: {
    display: "flex",
    gap: 12,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  selectGroup: { display: "flex", flexDirection: "column", gap: 4 },
  selectLabel: { color: "#6c7086", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.5px" },
  select: {
    padding: "7px 10px",
    borderRadius: 8,
    border: "1px solid #45475a",
    background: "#181825",
    color: "#cdd6f4",
    fontSize: 14,
    cursor: "pointer",
  },
  ttsRow: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  ttsBtn: {
    padding: "9px 18px",
    borderRadius: 8,
    border: "none",
    background: "#a6e3a1",
    color: "#1e1e2e",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  aiNotice: { color: "#6c7086", fontSize: 12, marginTop: 10 },
};
