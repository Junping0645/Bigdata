import { useState } from "react";

interface KnowledgeItem {
  rank: number;
  title: string;
  summary: string;
  image: string;
  question: string;
}

const SCIENCE: KnowledgeItem[] = [
  {
    rank: 1,
    title: "블랙홀과 사건의 지평선",
    summary: "중력이 너무 강해 빛조차 빠져나올 수 없는 천체. 탈출 불가능한 경계선을 '사건의 지평선'이라 부릅니다.",
    image: "https://picsum.photos/seed/cosmos-bh/400/220",
    question: "블랙홀과 사건의 지평선이 뭐야?",
  },
  {
    rank: 2,
    title: "양자 얽힘",
    summary: "두 입자가 아무리 멀리 떨어져도 하나를 측정하는 순간 다른 하나의 상태가 즉시 결정되는 현상입니다.",
    image: "https://picsum.photos/seed/quantum-ent/400/220",
    question: "양자 얽힘이 뭐야?",
  },
  {
    rank: 3,
    title: "CRISPR 유전자 가위",
    summary: "원하는 DNA 부위를 정확히 잘라내고 수정하는 혁명적 유전공학 기술. 유전병 치료에 응용됩니다.",
    image: "https://picsum.photos/seed/dna-crispr/400/220",
    question: "CRISPR 유전자 가위가 뭐야?",
  },
  {
    rank: 4,
    title: "상대성 이론",
    summary: "시간과 공간은 절대적이지 않고 속도와 중력에 따라 늘어나거나 줄어든다는 아인슈타인의 이론입니다.",
    image: "https://picsum.photos/seed/einstein-rel/400/220",
    question: "상대성 이론을 쉽게 설명해줘",
  },
  {
    rank: 5,
    title: "광합성의 원리",
    summary: "식물이 빛에너지·물·이산화탄소로 포도당을 만들고 산소를 방출하는 생명 유지의 핵심 반응입니다.",
    image: "https://picsum.photos/seed/leaves-photo/400/220",
    question: "광합성의 원리가 뭐야?",
  },
];

const AI_TOPICS: KnowledgeItem[] = [
  {
    rank: 1,
    title: "트랜스포머와 어텐션",
    summary: "ChatGPT·Claude의 기반 구조. '어텐션'으로 문장 내 단어 간 관계를 파악해 문맥을 깊이 이해합니다.",
    image: "https://picsum.photos/seed/neural-attn/400/220",
    question: "트랜스포머 모델과 어텐션 메커니즘이 뭐야?",
  },
  {
    rank: 2,
    title: "강화학습",
    summary: "시행착오를 통해 보상을 최대화하는 방향으로 스스로 학습. 알파고·게임 AI에 사용됩니다.",
    image: "https://picsum.photos/seed/robot-rl/400/220",
    question: "강화학습이 뭐야?",
  },
  {
    rank: 3,
    title: "생성형 AI와 GAN",
    summary: "가짜 데이터를 만드는 '생성자'와 진위를 구분하는 '판별자'가 경쟁하며 사실적인 이미지를 생성합니다.",
    image: "https://picsum.photos/seed/digital-gen/400/220",
    question: "생성형 AI와 GAN이 뭐야?",
  },
  {
    rank: 4,
    title: "컴퓨터 비전 (CNN)",
    summary: "합성곱 신경망으로 이미지를 분석·분류하는 기술. 자율주행·의료 영상·얼굴 인식에 활용됩니다.",
    image: "https://picsum.photos/seed/vision-cnn/400/220",
    question: "컴퓨터 비전과 CNN이 뭐야?",
  },
  {
    rank: 5,
    title: "자연어 처리 (NLP)",
    summary: "인간의 언어를 컴퓨터가 이해하고 생성하는 기술. 번역, 요약, 챗봇 등 다양한 분야에 쓰입니다.",
    image: "https://picsum.photos/seed/language-nlp/400/220",
    question: "자연어 처리(NLP)가 뭐야?",
  },
];

interface Props {
  onAsk: (question: string) => void;
}

export default function TodayKnowledge({ onAsk }: Props) {
  return (
    <div style={s.wrap}>
      <Section title="🔭 오늘의 과학 지식 Top 5" items={SCIENCE} accent="#89b4fa" onAsk={onAsk} />
      <Section title="🤖 오늘의 AI 지식 Top 5" items={AI_TOPICS} accent="#cba6f7" onAsk={onAsk} />
    </div>
  );
}

function Section({
  title,
  items,
  accent,
  onAsk,
}: {
  title: string;
  items: KnowledgeItem[];
  accent: string;
  onAsk: (q: string) => void;
}) {
  return (
    <section style={s.section}>
      <h2 style={{ ...s.sectionTitle, color: accent }}>{title}</h2>
      <div style={s.grid}>
        {items.map((item) => (
          <KnowledgeCard key={item.rank} item={item} accent={accent} onAsk={onAsk} />
        ))}
      </div>
    </section>
  );
}

function KnowledgeCard({
  item,
  accent,
  onAsk,
}: {
  item: KnowledgeItem;
  accent: string;
  onAsk: (q: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...s.card,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? `0 8px 24px rgba(0,0,0,0.4)` : "0 2px 8px rgba(0,0,0,0.2)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={s.imgWrap}>
        <img src={item.image} alt={item.title} style={s.img} loading="lazy" />
        <span style={{ ...s.rank, background: accent, color: "#1e1e2e" }}>
          {item.rank}위
        </span>
      </div>
      <div style={s.cardBody}>
        <h3 style={s.cardTitle}>{item.title}</h3>
        <p style={s.cardSummary}>{item.summary}</p>
        <button
          style={{ ...s.askBtn, borderColor: accent, color: accent }}
          onClick={() => onAsk(item.question)}
        >
          AI에게 물어보기 →
        </button>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap: { padding: "0 0 40px" },
  section: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "40px 24px 0",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 800,
    marginBottom: 20,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 20,
  },
  card: {
    background: "#1e1e2e",
    borderRadius: 14,
    overflow: "hidden",
    transition: "transform 0.2s, box-shadow 0.2s",
    display: "flex",
    flexDirection: "column",
  },
  imgWrap: { position: "relative" },
  img: { width: "100%", height: 160, objectFit: "cover", display: "block" },
  rank: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: "3px 10px",
    borderRadius: 20,
    fontWeight: 800,
    fontSize: 13,
  },
  cardBody: {
    padding: "14px 16px 16px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  cardTitle: { color: "#cdd6f4", fontSize: 15, fontWeight: 700, marginBottom: 8 },
  cardSummary: {
    color: "#a6adc8",
    fontSize: 13,
    lineHeight: 1.6,
    flex: 1,
    marginBottom: 14,
  },
  askBtn: {
    background: "transparent",
    border: "1px solid",
    borderRadius: 8,
    padding: "7px 12px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    alignSelf: "flex-start",
    transition: "opacity 0.15s",
  },
};
