// ===== THREE JS SETUP =====
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

// ===== LIGHTING =====
const light = new THREE.PointLight(0x00ffff, 2, 100);
light.position.set(5,5,5);
scene.add(light);

// ===== ROBOT HEAD =====
const headGeometry = new THREE.BoxGeometry(2,2,2);
const headMaterial = new THREE.MeshStandardMaterial({
    color: 0x001f2f,
    emissive: 0x00ffff,
    emissiveIntensity: 0.2,
    metalness: 1,
    roughness: 0.2
});
const head = new THREE.Mesh(headGeometry, headMaterial);
scene.add(head);

// ===== EYES =====
const eyeGeometry = new THREE.SphereGeometry(0.3,32,32);
const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x00ffff,
    emissiveIntensity: 1
});

const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
leftEye.position.set(-0.5,0.3,1.1);
scene.add(leftEye);

const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
rightEye.position.set(0.5,0.3,1.1);
scene.add(rightEye);

// ===== MOUTH =====
const mouthGeometry = new THREE.BoxGeometry(0.8,0.1,0.1);
const mouthMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x00ffff
});
const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
mouth.position.set(0,-0.5,1.1);
scene.add(mouth);

// ===== FLOATING ANIMATION =====
let time = 0;
function animate() {
    requestAnimationFrame(animate);

    time += 0.02;

    head.rotation.y += 0.005;
    head.position.y = Math.sin(time) * 0.2;

    leftEye.scale.y = 1 + Math.sin(time*3)*0.1;
    rightEye.scale.y = 1 + Math.sin(time*3)*0.1;

    renderer.render(scene, camera);
}
animate();

// ===== CHAT SYSTEM =====
const backendURL = "https://emo-bot-backend.onrender.com/chat";

async function sendMessage() {
    const input = document.getElementById("input");
    const messages = document.getElementById("messages");

    const text = input.value.trim();
    if(!text) return;

    messages.innerHTML += `<div class="message user">You: ${text}</div>`;
    input.value = "";

    try {
        const response = await fetch(backendURL,{
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        messages.innerHTML += `<div class="message bot">EMO-BOT: ${data.reply}</div>`;

        updateEmotion(data.emotion);

    } catch (error) {
        messages.innerHTML += `<div class="message bot">⚠ Backend error</div>`;
    }

    messages.scrollTop = messages.scrollHeight;
}

// ===== EMOTION SYSTEM =====
function updateEmotion(emotion){

    if(emotion === "happy"){
        eyeMaterial.color.set(0x00ff88);
        eyeMaterial.emissive.set(0x00ff88);
        mouth.scale.y = 2;
    }
    else if(emotion === "sad"){
        eyeMaterial.color.set(0x5555ff);
        mouth.scale.y = 0.3;
    }
    else if(emotion === "angry"){
        eyeMaterial.color.set(0xff0000);
        mouth.scale.y = 0.2;
    }
    else {
        eyeMaterial.color.set(0x00ffff);
        mouth.scale.y = 1;
    }
}

// ===== RESIZE FIX =====
window.addEventListener("resize",()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
});
