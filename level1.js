let activeSprite = null;

const game = document.getElementById("game");

const TOTAL_CLUES = 4;
const PASSCODE = "blood";

/* =========================
   LEVEL SETUP
========================= */

function loadLevel() {
  game.innerHTML = "";

  addSprite("sprite1", 290, 660, true);
  addSprite("sprite2", 306, 527, true);
  addSprite("sprite3", 103, 705, true);
  addSprite("sprite4", 380, 330, true);
  addSprite("book", 215, 350, false);
}

/* =========================
   SPRITE CREATION
========================= */

function addSprite(name, top, left, isClue) {
  const sprite = document.createElement("div");
  sprite.classList.add("sprite", name);
  sprite.style.top = top + "px";
  sprite.style.left = left + "px";
  sprite.dataset.clue = isClue;
  game.appendChild(sprite);
}

/* =========================
   CLICK HANDLER
========================= */

game.addEventListener("click", (e) => {
  const sprite = e.target.closest(".sprite");

  // CLICKED EMPTY SPACE → CLOSE ACTIVE CLUE
  if (!sprite) {
    closeActiveSprite();
    return;
  }

  playClickSound();

  // CLICKED SAME OPEN SPRITE → CLOSE IT
  if (sprite === activeSprite) {
    closeActiveSprite();
    return;
  }

  // CLICKED A DIFFERENT SPRITE
  if (activeSprite) {
    closeActiveSprite();
  }

  // TREASURE BOX LOGIC
  if (sprite.classList.contains("book")) {
    handleBox(sprite);
    return;
  }

  // NORMAL CLUE
  reveal(sprite);
  activeSprite = sprite;
});



/* =========================
   CLUE REVEAL
========================= */

function reveal(sprite) {
  sprite.classList.add("revealed");
  sprite.dataset.revealed = "true";
  activeSprite = sprite;
}

function closeActiveSprite() {
  if (!activeSprite) return;

  activeSprite.classList.remove("revealed");
  activeSprite = null;
}


const passcodeModal = document.getElementById("passcode-modal");
const passcodeInput = document.getElementById("passcode-input");
const submitPasscode = document.getElementById("submit-passcode");
const closePasscode = document.getElementById("close-passcode");
const passcodeError = document.getElementById("passcode-error");

let currentBox = null; // store the clicked box

function handleBox(box) {
  if (!allCluesFound()) {
    showTemporaryMessage("Something is missing...");
    return;
  }

  currentBox = box; // store reference
  passcodeInput.value = "";
  passcodeError.style.display = "none";
  passcodeModal.style.display = "flex";
  passcodeInput.focus();
}

submitPasscode.addEventListener("click", () => {
  const code = passcodeInput.value.trim();

  if (code === PASSCODE) {
    passcodeError.style.display = "none";
    currentBox && reveal(currentBox); // reveal the book if it's a box
    passcodeModal.style.display = "none";

    // Show level unlocked message
    showLevelUnlocked();
  } else {
    passcodeError.style.display = "block";
  }
});

function showLevelUnlocked() {
  const unlockedMsg = document.createElement("div");
  unlockedMsg.textContent = "Level 2 Unlocked!";
  unlockedMsg.style.position = "fixed";
  unlockedMsg.style.top = "50%";
  unlockedMsg.style.left = "50%";
  unlockedMsg.style.transform = "translate(-50%, -50%)";
  unlockedMsg.style.backgroundColor = "#111";
  unlockedMsg.style.color = "red";
  unlockedMsg.style.padding = "30px 50px";
  unlockedMsg.style.border = "3px solid red";
  unlockedMsg.style.borderRadius = "20px";
  unlockedMsg.style.fontFamily = "'Creepster', cursive";
  unlockedMsg.style.fontSize = "32px";
  unlockedMsg.style.textAlign = "center";
  unlockedMsg.style.boxShadow = "0 0 50px red";
  unlockedMsg.style.zIndex = 1000;
  document.body.appendChild(unlockedMsg);

  // After 3 seconds, redirect to Level 2
  setTimeout(() => {
    document.body.removeChild(unlockedMsg);
    window.location.href = "level2.html"; // change to your level 2 page
  }, 3000);
}


function allCluesFound() {
  return document.querySelectorAll(".sprite[data-clue='true'][data-revealed='true']").length === TOTAL_CLUES;
}

/* =========================
   AUDIO (EMPTY SLOT)
========================= */

function playClickSound() {
  // ADD AUDIO FILE HERE
  const sound = new Audio("assets/click2.mp3");
  sound.play();
}
const exitLevelBtn = document.getElementById("exit-level1");
const nextLevelBtn = document.getElementById("next-level");

// Exit Level 1 → always clickable
exitLevelBtn.addEventListener("click", () => {
  window.location.href = "index.html"; // main page
});



/* =========================
   HORROR TIMER & SCORE SYSTEM
========================= */

let timer;
let timeLeft = 180; // 3 minutes
const timerModal = document.getElementById("timer-modal");
const exitBtn = document.getElementById("exit-btn");
const retryBtn = document.getElementById("retry-btn");
const timerDisplay = document.getElementById("timer-display");
const scoreSpan = document.getElementById("score");
const clueMessage = document.getElementById("clue-message");
let score = 0;

function startTimer() {
  clearInterval(timer);
  timeLeft = 180;
  timerModal.style.display = "none";
  clueMessage.style.display = "none";
  score = 0;
  scoreSpan.textContent = `${score}/4`;
  updateTimerDisplay();

  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      showTimeOver();
    }
  }, 1000);
}

function updateTimerDisplay() {
  let minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  let seconds = (timeLeft % 60).toString().padStart(2, "0");
  timerDisplay.textContent = `${minutes}:${seconds}`;

  if (timeLeft <= 30) {
    timerDisplay.style.color = "#ff0000";
    timerDisplay.style.textShadow = "0 0 15px #ff0000, 0 0 30px #ff0000, 0 0 45px #ff0000";
  }
}

function showTimeOver() {
  timerModal.style.display = "flex";
  const scream = new Audio("assets/horror-spooky.wav"); // optional scary sound
  scream.play();
}

exitBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

retryBtn.addEventListener("click", () => {
  loadLevel();
  startTimer();
});


/* =========================
   SCORE UPDATE & MESSAGE
========================= */
function reveal(sprite) {
  if (!sprite.classList.contains("revealed")) {
    sprite.classList.add("revealed");
    sprite.dataset.revealed = "true";
    activeSprite = sprite;

    if (sprite.dataset.clue === "true") {
      score++;
      scoreSpan.textContent = `${score}/4`;

      if (score === 4) {
        showClueMessage();
      }
    }
  }
}

function showClueMessage() {
  clueMessage.style.display = "block";

  setTimeout(() => {
    clueMessage.style.display = "none";
  }, 10000);
}

/* =========================
   START GAME
========================= */
loadLevel();
startTimer();





/* =========================
   START
========================= */

loadLevel();
