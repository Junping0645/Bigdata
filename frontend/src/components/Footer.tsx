const SITES = [
  { name: "Claude",       domain: "claude.ai",         url: "https://claude.ai",            desc: "AI 대화" },
  { name: "ChatGPT",      domain: "chatgpt.com",        url: "https://chatgpt.com",          desc: "AI 대화" },
  { name: "Google",       domain: "google.com",         url: "https://google.com",           desc: "검색" },
  { name: "YouTube",      domain: "youtube.com",        url: "https://youtube.com",          desc: "동영상" },
  { name: "GitHub",       domain: "github.com",         url: "https://github.com",           desc: "코드" },
  { name: "Wikipedia",    domain: "ko.wikipedia.org",   url: "https://ko.wikipedia.org",     desc: "백과사전" },
  { name: "Khan Academy", domain: "khanacademy.org",    url: "https://khanacademy.org",      desc: "학습" },
  { name: "Wolfram",      domain: "wolframalpha.com",   url: "https://wolframalpha.com",     desc: "계산" },
];

export default function Footer() {
  return (
    <footer style={s.footer}>
      <p style={s.label}>🔗 빠른 바로가기</p>
      <div style={s.grid}>
        {SITES.map((site) => (
          <a
            key={site.name}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            style={s.link}
          >
            <img
              src={`https://www.google.com/s2/favicons?sz=64&domain=${site.domain}`}
              alt={site.name}
              style={s.icon}
            />
            <span style={s.siteName}>{site.name}</span>
            <span style={s.siteDesc}>{site.desc}</span>
          </a>
        ))}
      </div>
      <p style={s.copy}>© 2025 AI 과학 튜터 · Powered by OpenAI & Firebase</p>
    </footer>
  );
}

const s: Record<string, React.CSSProperties> = {
  footer: {
    borderTop: "1px solid #313244",
    background: "#1e1e2e",
    padding: "32px 24px 24px",
    marginTop: 48,
  },
  label: {
    textAlign: "center",
    color: "#6c7086",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    marginBottom: 20,
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    maxWidth: 900,
    margin: "0 auto 28px",
  },
  link: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    padding: "14px 18px",
    background: "#181825",
    borderRadius: 12,
    textDecoration: "none",
    minWidth: 80,
    transition: "background 0.15s",
  },
  icon: { width: 32, height: 32, borderRadius: 6 },
  siteName: { color: "#cdd6f4", fontSize: 12, fontWeight: 600 },
  siteDesc: { color: "#6c7086", fontSize: 11 },
  copy: {
    textAlign: "center",
    color: "#45475a",
    fontSize: 12,
  },
};
