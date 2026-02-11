// ================================
// EMO-BOT Advanced Frontend Script
// ================================

// 🔗 Backend API URL (Render)
const API_URL = "https://emo-bot-backend.onrender.com/chat";

// DOM Elements
const chatBox = document.getElementById("chat");
const inputField = document.getElementById("input");
const emotionText = document.getElementById("emotion");

// ================================
// ROBOT EMOTION SYSTEM
// ================================

const robotFace = document.querySelector(".robot");
let currentEmotion = "neutral";

// Emotion styles
function setEmotion(emotion) {
    currentEmotion = emotion;
    emotionText.innerText = emotion + " 🤖";

    robotFace.classList.remove("happy", "sad", "thinking", "angry");

    switch (emotion) {
        case "happy":
            robotFace.classList.add("happy");
            break;
        case "sad":
            robotFace.classList.add("sad");
            break;
        case "thinking":
            robotFace.classList.add("thinking");
            break;
        case "angry":
            robotFace.classList.add("angry");
            break;
        default:
            break;
    }
}

// Auto blinking
setInterval(() => {
    robotFace.classList.add("blink");
    setTimeout(() => {
        robotFace.classList.remove("blink");
    }, 200);
}, 4000);

// ================================
// CHAT FUNCTIONS
// ================================

function addMessage(sender, message) {
    const messageDiv = document.createElement("div");

    messageDiv.className = sender === "user"
        ? "message user-message"
        : "message bot-message";

    messageDiv.innerHTML = `<strong>${sender === "user" ? "You" : "EMO-BOT"}:</strong> ${message}`;

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.className = "message bot-message typing";
    typingDiv.id = "typing";
    typingDiv.innerHTML = "EMO-BOT is thinking...";
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
    const typing = document.getElementById("typing");
    if (typing) typing.remove();
}

// ================================
// SEND MESSAGE
// ================================

async function sendMessage() {
    const userInput = inputField.value.trim();
    if (!userInput) return;

    addMessage("user", userInput);
    inputField.value = "";
    setEmotion("thinking");
    showTyping();

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: userInput })
        });

        if (!response.ok) {
            throw new Error("Server error");
        }

        const data = await response.json();
        removeTyping();

        addMessage("bot", data.reply);

        // Smart emotion detection
        if (data.reply.toLowerCase().includes("love") ||
            data.reply.toLowerCase().includes("great") ||
            data.reply.toLowerCase().includes("happy")) {
            setEmotion("happy");
        }
        else if (data.reply.toLowerCase().includes("sorry") ||
            data.reply.toLowerCase().includes("sad")) {
            setEmotion("sad");
        }
        else {
            setEmotion("neutral");
        }

    } catch (error) {
        removeTyping();
        addMessage("bot", "⚠️ Backend not running or waking up... please wait 30 seconds and try again.");
        setEmotion("sad");
        console.error("Error:", error);
    }
}

// ================================
// ENTER KEY SUPPORT
// ================================

inputField.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

// ================================
// BACKEND HEALTH CHECK
// ================================

async function checkBackend() {
    try {
        const response = await fetch("https://emo-bot-backend.onrender.com");
        if (!response.ok) throw new Error();
        console.log("Backend connected ✅");
    } catch {
        addMessage("bot", "⚠️ Backend is sleeping (Render free plan). First message may take 30 seconds.");
    }
}

checkBackend();
