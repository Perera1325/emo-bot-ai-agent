import os
from groq import Groq
from dotenv import load_dotenv
from pathlib import Path

# Load .env explicitly from project root
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)

api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise RuntimeError("GROQ_API_KEY not found. Check your .env file.")

client = Groq(api_key=api_key)

# VERIFIED ACTIVE GROQ MODELS (2026-safe)
MODELS = [
    "llama-3.1-8b-instant",
    "llama-3.2-3b-preview"
]

def talk_to_ai(user_message, emotion):
    prompt = f"""
You are EMO-BOT 🤖.
You are a cute, friendly, emotional AI robot.
User name: Perera
Current emotion: {emotion}

Reply naturally like a caring robot friend.
User says: {user_message}
"""

    last_error = None

    for model in MODELS:
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        except Exception as e:
            last_error = e
            print(f"[WARN] Model {model} failed, trying next...")

    raise RuntimeError(f"All models failed. Last error: {last_error}")
