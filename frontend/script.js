const robot = document.getElementById("robot");
const emotionText = document.getElementById("emotion");

let speakingInterval = null;

/* ---------------- EMOTION CONTROL ---------------- */

function setEmotion(emotion) {
  robot.className = "robot";

  if (emotion.includes("happy")) {
    robot.classList.add("glow-happy");
    document.body.style.background =
      "radial-gradient(circle at top, #022c22, #020617)";
  } else if (emotion.includes("sad")) {
    robot.classList.add("glow-sad");
    document.body.style.background =
      "radial-gradient(circle at top, #020617, #020617)";
  } else if (emotion.includes("angry")) {
    robot.classList.add("glow-angry");
    document.body.style.background =
      "radial-gradient(circle at top, #450a0a, #020617)";
  } else {
    robot.classList.add("glow-neutral");
    document.body.style.background =
      "radial-gradient(circle at top, #0f172a, #020617)";
  }

  emotionText.innerText = emotion;
}

/* ---------------- VOICE + MOUTH ---------------- */

function speak(text) {
  if (!window.speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1.1;

  // Choose a friendly voice if available
  const voices = speechSynthesis.getVoices();
  utterance.voice =
    voices.find(v => v.name.toLowerCase().includes("female")) || voices[0];

  // Mouth animation while speaking
  utterance.onstart = () => {
    const mouth = document.querySelector(".mouth");
    speakingInterval = setInterval(() => {
      mouth.style.height =
        Math.random() > 0.5 ? "14px" : "6px";
    }, 150);
  };

  utterance.onend = () => {
    clearInterval(speakingInterval);
    document.querySelector(".mouth").style.height = "6px";
  };

  speechSynthesis.speak(utterance);
}

/* ---------------- CHAT ---------------- */

async function sendMessage() {
  const input = document.getElementById("input");
  const chat = document.getElementById("chat");

  const msg = input.value.trim();
  if (!msg) return;

  chat.innerHTML += `<div class="user">You: ${msg}</div>`;
  input.value = "";
  chat.scrollTop = chat.scrollHeight;

  try {
    const res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    const data = await res.json();

    chat.innerHTML += `<div class="bot">EMO-BOT: ${data.reply}</div>`;
    chat.scrollTop = chat.scrollHeight;

    setEmotion(data.emotion);
    speak(data.reply);

  } catch (err) {
    chat.innerHTML += `<div class="bot">⚠️ Backend not running</div>`;
  }
}
