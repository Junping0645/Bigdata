import os
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).parent / ".env")
from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI

client = OpenAI()  # OPENAI_API_KEY 환경변수 자동 사용
app = FastAPI()

# FRONTEND_URL 환경변수로 Vercel 도메인 관리 (배포 후 .env에 추가)
_origins = ["http://localhost:5173"]
if os.getenv("FRONTEND_URL"):
    _origins.append(os.getenv("FRONTEND_URL"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatReq(BaseModel):
    question: str


class TTSReq(BaseModel):
    text: str
    voice: str = "coral"
    instructions: str | None = None


SYSTEM = (
    "너는 한국 고등학생 눈높이로 과학·AI 개념을 쉽고 정확하게 설명하는 튜터다. "
    "핵심부터 짚고, 비유를 곁들여라. 답변은 300자 이내로 간결하게."
)


@app.get("/")
def health():
    return {"status": "ok"}


@app.post("/api/chat")
def chat(req: ChatReq):
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="질문이 비어 있습니다.")
    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": req.question},
        ],
    )
    return {"answer": res.choices[0].message.content}


@app.post("/api/tts")
def tts(req: TTSReq):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="텍스트가 비어 있습니다.")
    speech = client.audio.speech.create(
        model="gpt-4o-mini-tts",
        voice=req.voice,
        input=req.text,
        instructions=req.instructions or "차분하고 또렷한 설명 톤으로 읽어줘.",
    )
    return Response(content=speech.content, media_type="audio/mpeg")
