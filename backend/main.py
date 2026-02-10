from ai_brain import talk_to_ai
from emotions import detect_emotion
from memory import load_memory, save_memory

memory = load_memory()

print("🤖 EMO-BOT is online! Type 'exit' to stop.\n")

while True:
    user_input = input("You: ")

    if user_input.lower() == "exit":
        print("EMO-BOT: Bye Perera 🤍 take care!")
        break

    emotion = detect_emotion(user_input)
    reply = talk_to_ai(user_input, emotion)

    memory.append({
        "user": user_input,
        "emotion": emotion,
        "bot": reply
    })

    save_memory(memory)

    print("EMO-BOT:", reply)
