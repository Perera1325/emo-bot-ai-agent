const robot = document.getElementById("robot");
const emotionText = document.getElementById("emotion");

function setEmotion(emotion) {
  robot.className = "robot";

  if (emotion.includes("happy")) {
    robot.classList.add("glow-happy");
  } else if (emotion.includes("sad")) {
    robot.classList.add("glow-sad");
  } else if (emotion.includes("angry")) {
    robot.classList.add("glow-angry");
  } else {
    robot.classList.add("glow-neutral");
  }

  emotionText.innerText = emotion;
}

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
    setEmotion(data.emotion);
    chat.scrollTop = chat.scrollHeight;

  } catch (err) {
    chat.innerHTML += `<div class="bot">⚠️ Backend not running</div>`;
  }
}
