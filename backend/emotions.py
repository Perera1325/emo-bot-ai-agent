def detect_emotion(text):
    text = text.lower()

    if any(word in text for word in ["sad", "tired", "lonely"]):
        return "sad 😔"
    elif any(word in text for word in ["happy", "love", "great"]):
        return "happy 😊"
    elif any(word in text for word in ["angry", "mad"]):
        return "angry 😡"
    else:
        return "neutral 🙂"
