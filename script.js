const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const question = document.getElementById("question");

const screen1 = document.getElementById("screen1");
const screen2 = document.getElementById("screen2");

const sound = document.getElementById("loveSound");

const nameInput = document.getElementById("nameInput");
const generateBtn = document.getElementById("generateBtn");
const generatedLink = document.getElementById("generatedLink");
const linkBox = document.getElementById("linkBox");
const copyBtn = document.getElementById("copyBtn");

let attempt = 0;
let heartsInterval = null;
let isFloating = false;

const messages = [
  "Do you love me? ❤️",
  "Are you sure? 😏",
  "Really sure? 😳",
  "Think again 😜",
  "Last chance 😈",
  "You can't escape 😎"
];


// 🔹 URL PERSONALIZATION
const params = new URLSearchParams(window.location.search);
const nameFromUrl = params.get("name");
const nameBox = document.querySelector(".name-box");

if (nameFromUrl) {
  console.log("Name detected:", nameFromUrl);

  question.innerText = `Do you love me, ${nameFromUrl}? ❤️`;

  // Hide input
  nameBox.style.display = "none";
  linkBox.style.display = "none";

  // 🔥 IMPORTANT: START FLOATING
  setTimeout(() => {
    }, 300);
}


// 🔹 GENERATE LINK
generateBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();

  if (!name) {
    alert("Enter a name first 😅");
    return;
  }

  const encodedName = encodeURIComponent(name);
  const baseUrl = window.location.origin + window.location.pathname;

  const fullLink = `${baseUrl}?name=${encodedName}`;

  generatedLink.innerText = fullLink;
  linkBox.classList.remove("hidden");

  question.innerText = `Do you love me, ${name}? ❤️`;
});


// 🔹 COPY LINK
copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(generatedLink.innerText);

  copyBtn.innerText = "Copied ✅";

  setTimeout(() => {
    copyBtn.innerText = "Copy Link 📋";
  }, 1500);
});



// 🔓 AUDIO UNLOCK
let audioUnlocked = false;


// 🎯 NO BUTTON MOVE (SAFE INSIDE CARD)
function moveNoButton() {
  const card = document.querySelector(".card");
  const cardRect = card.getBoundingClientRect();

  // FIRST TIME: convert to absolute correctly
  if (!isFloating) {
    const btnRect = noBtn.getBoundingClientRect();

    noBtn.style.position = "absolute";
    noBtn.style.left = (btnRect.left - cardRect.left) + "px";
    noBtn.style.top = (btnRect.top - cardRect.top) + "px";

    isFloating = true;
    return; // 🔴 IMPORTANT: stop here first time
  }

  // AFTER FIRST TIME → random movement inside card
// 🎯 Define safe padding (avoid edges)
const paddingX = 40;
const paddingY = 60;

const minX = paddingX;
const maxX = card.clientWidth - noBtn.offsetWidth - paddingX;

const minY = paddingY;
const maxY = card.clientHeight - noBtn.offsetHeight - paddingY;

// 🎲 Controlled random position
const x = minX + Math.random() * (maxX - minX);
const y = minY + Math.random() * (maxY - minY);

  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";

  let scale = Math.min(1 + attempt * 0.12, 2.2);
  yesBtn.style.transform = `scale(${scale})`;

  if (attempt < messages.length) {
    question.innerText = messages[attempt];
  }

  attempt++;
}

document.addEventListener("mousemove", (e) => {
  const rect = noBtn.getBoundingClientRect();

  const distance =
    Math.abs(e.clientX - rect.left) +
    Math.abs(e.clientY - rect.top);

  if (distance < 100) {
    moveNoButton();
  }
});

noBtn.addEventListener("touchstart", moveNoButton);


// ❤️ YES CLICK
yesBtn.addEventListener("click", () => {

    // 🔥 START FLOATING IMMEDIATELY
  if (nameFromUrl) {
    startNameFloating(nameFromUrl);
  }

  screen1.classList.add("fade-out");

  setTimeout(() => {
    screen1.classList.add("hidden");
    screen2.classList.remove("hidden");
    screen2.classList.add("fade-in");
  }, 400);

sound.currentTime = 0;

// Force play using user interaction context
const playAudio = () => {
  sound.play().catch(err => {
    console.log("Audio blocked:", err);
  });
};

// Try immediately
playAudio();

// Backup retry (for strict browsers)
setTimeout(playAudio, 100);

  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 }
  });

  if (nameFromUrl) {
  startNameFloating(nameFromUrl);
  }

  startHearts();
});


// 💖 HEARTS
function startHearts() {
  if (heartsInterval) return;

  heartsInterval = setInterval(() => {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.innerText = "❤️";

    heart.style.left = Math.random() * window.innerWidth + "px";
    heart.style.fontSize = (18 + Math.random() * 25) + "px";

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 3000);
  }, 250);

  setTimeout(() => clearInterval(heartsInterval), 10000);
}


// 🎨 PARTICLES
tsParticles.load("particles", {
  background: { color: "transparent" },
  particles: {
    number: { value: 40 },
    color: { value: ["#ff4d6d", "#ff758f", "#ffb3c1"] },
    shape: {
      type: "char",
      options: {
        char: {
          value: ["❤", "💖", "💕"],
          font: "Verdana"
        }
      }
    },
    opacity: { value: 0.6 },
    size: { value: { min: 2, max: 6 } },
    move: {
      enable: true,
      speed: 1,
      direction: "top",
      outModes: { default: "out" }
    }
  }
});

function startNameFloating(name) {

  if (window.nameFloatingStarted) return;
  window.nameFloatingStarted = true;

  const createOne = () => {
    const el = document.createElement("div");
    el.className = "name-float";
    el.innerText = `${name} ❤️`;

    el.style.left = Math.random() * (window.innerWidth - 100) + "px";
    el.style.fontSize = (18 + Math.random() * 15) + "px";

    document.body.appendChild(el);

    setTimeout(() => el.remove(), 8000);
  };

  // 🔥 CREATE FIRST ONE IMMEDIATELY
  createOne();

  // Then continue interval
  setInterval(createOne, 900);
}