import json
from pathlib import Path

# Always resolve memory path from project root
BASE_DIR = Path(__file__).resolve().parent.parent
MEMORY_FILE = BASE_DIR / "data" / "memory.json"

def load_memory():
    if not MEMORY_FILE.exists():
        return []

    with open(MEMORY_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_memory(memory):
    with open(MEMORY_FILE, "w", encoding="utf-8") as f:
        json.dump(memory, f, indent=2)
