const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function askChat(question: string): Promise<string> {
  const res = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error("chat 요청 실패");
  const data = await res.json();
  return data.answer as string;
}

export async function fetchTTS(
  text: string,
  voice: string = "coral",
  instructions?: string
): Promise<Blob> {
  const res = await fetch(`${BASE}/api/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice, instructions }),
  });
  if (!res.ok) throw new Error("TTS 요청 실패");
  return res.blob();
}
