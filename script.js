const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const question = document.getElementById("question");

const screen1 = document.getElementById("screen1");
const screen2 = document.getElementById("screen2");

const sound = document.getElementById("loveSound");

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


// 🔓 Unlock audio
document.addEventListener("click", () => {
  sound.play().then(() => {
    sound.pause();
    sound.currentTime = 0;
  }).catch(() => {});
}, { once: true });


// 🎯 ESCAPE LOGIC (FIXED VERSION)
let currentX = 0;
let currentY = 0;

function moveNoButton() {

  const card = document.querySelector(".card");
  const cardRect = card.getBoundingClientRect();

  const btnWidth = noBtn.offsetWidth;
  const btnHeight = noBtn.offsetHeight;

  const padding = 10;

  // Boundaries INSIDE card
  const maxX = cardRect.width - btnWidth - padding;
  const maxY = cardRect.height - btnHeight - padding;

  const newX = padding + Math.random() * maxX;
  const newY = padding + Math.random() * maxY;

  noBtn.style.left = newX + "px";
  noBtn.style.top = newY + "px";

  // YES scaling
  let scale = Math.min(1 + attempt * 0.12, 2.2);
  yesBtn.style.transform = `scale(${scale})`;

  // Text update
  if (attempt < messages.length) {
    question.innerText = messages[attempt];
  }

  attempt++;
}

// Desktop
noBtn.addEventListener("mouseenter", moveNoButton);

// Mobile
noBtn.addEventListener("touchstart", moveNoButton);


// ❤️ YES click
yesBtn.addEventListener("click", () => {

  // Smooth transition
  screen1.classList.add("fade-out");

  setTimeout(() => {
    screen1.classList.add("hidden");
    screen2.classList.remove("hidden");
    screen2.classList.add("fade-in");
  }, 400);

  // Sound
  sound.currentTime = 0;
  sound.play().catch(() => {});

  // Vibration
  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 100]);
  }

  // 💥 Confetti burst
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 }
  });

  startHearts();
});


// 💖 Hearts
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

tsParticles.load("particles", {
  background: {
    color: "transparent"
  },
  particles: {
    number: {
      value: 40
    },
    color: {
      value: ["#ff4d6d", "#ff758f", "#ffb3c1"]
    },
    shape: {
    type: "char",
    options: {
        char: {
        value: ["❤", "💖", "💕"],
        font: "Verdana",
        style: "",
        weight: "400"
        }
    }
    },
    opacity: {
      value: 0.6
    },
    size: {
      value: { min: 2, max: 6 }
    },
    move: {
      enable: true,
      speed: 1,
      direction: "top",
      outModes: {
        default: "out"
      }
    }
  }
});