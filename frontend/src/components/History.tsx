import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { ref, onValue, off } from "firebase/database";
import { db } from "../firebase";

interface HistoryItem {
  id: string;
  question: string;
  answer: string;
  createdAt: number | null;
}

interface Props {
  user: User;
}

export default function History({ user }: Props) {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const histRef = ref(db, `users/${user.uid}/history`);
    onValue(histRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: HistoryItem[] = Object.entries(data).map(([id, val]) => ({
          id,
          ...(val as Omit<HistoryItem, "id">),
        }));
        list.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
        setItems(list);
      } else {
        setItems([]);
      }
    });
    return () => off(histRef);
  }, [user.uid]);

  if (items.length === 0) {
    return <p style={styles.empty}>아직 질문 기록이 없습니다.</p>;
  }

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>📚 학습 기록</h2>
      {items.map((item) => (
        <div key={item.id} style={styles.card}>
          <p style={styles.q}>Q. {item.question}</p>
          <p style={styles.a}>{item.answer}</p>
          {item.createdAt && (
            <p style={styles.date}>
              {new Date(item.createdAt).toLocaleString("ko-KR")}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 720, margin: "0 auto", padding: "0 16px 40px" },
  title: { color: "#89b4fa", fontSize: 22, marginBottom: 16 },
  card: {
    background: "#1e1e2e",
    borderRadius: 10,
    padding: "14px 16px",
    marginBottom: 12,
    borderLeft: "3px solid #89b4fa",
  },
  q: { color: "#cdd6f4", fontWeight: 700, fontSize: 15, marginBottom: 6 },
  a: { color: "#a6adc8", fontSize: 14, lineHeight: 1.7, marginBottom: 6 },
  date: { color: "#6c7086", fontSize: 12 },
  empty: { color: "#6c7086", textAlign: "center", marginTop: 40 },
};
