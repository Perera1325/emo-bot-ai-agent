from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ai_brain import talk_to_ai
from emotions import detect_emotion
from memory import load_memory, save_memory

# -------------------------
# FastAPI App
# -------------------------
app = FastAPI(
    title="EMO-BOT API 🤖",
    version="0.1.0",
    description="Emotional AI Robot Backend"
)

# -------------------------
# CORS Configuration
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # Allow browser frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Memory
# -------------------------
memory = load_memory()

# -------------------------
# Request / Response Models
# -------------------------
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
    emotion: str

# -------------------------
# Routes
# -------------------------
@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    emotion = detect_emotion(req.message)
    reply = talk_to_ai(req.message, emotion)

    memory.append({
        "user": req.message,
        "emotion": emotion,
        "bot": reply
    })

    save_memory(memory)

    return {
        "reply": reply,
        "emotion": emotion
    }

# -------------------------
# Health Check (Optional)
# -------------------------
@app.get("/")
def root():
    return {"status": "EMO-BOT API is running 🤖"}
