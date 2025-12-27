const bgMusic = new Audio("assets/horror-spooky.WAV"); // change name if needed
bgMusic.loop = true;
bgMusic.volume = 0.4;

const clickSound = new Audio("assets/click1.WAV");
clickSound.volume = 0.7;

const TOTAL_CLUES = 4;
let foundClues = 0;

let timeLeft = 120; // seconds
let timerInterval = null;
let gameOver = false;

const game = document.getElementById("game");
const codePanel = document.getElementById("codePanel");
const submitBtn = document.getElementById("submitCode");
const errorText = document.getElementById("codeError");
const inputs = document.querySelectorAll(".code-inputs input");

let activeSprite = null;
const PASSCODE = "6759";

/* ================= LOAD LEVEL ================= */

document.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
  }
}, { once: true });


function loadLevel() {
  game.innerHTML = "";

  addSprite("canvas", 328, 405, true);
  addSprite("vase",   357, 462, true);
  addSprite("frame",  25, 545, true);
  addSprite("sheet",  122, 740, true);
  addSprite("box",    385, 707, false, "treasureBox");
  startTimer();

}

function addSprite(name, top, left, isClue, id=null) {
  const s = document.createElement("div");
  s.className = `sprite ${name}`;
  s.style.top = top + "px";
  s.style.left = left + "px";
  if (isClue) s.dataset.clue = "true";
  if (id) s.id = id;
  game.appendChild(s);
}

/* ================= CLICK HANDLING ================= */

game.addEventListener("click", e => {
  const sprite = e.target.closest(".sprite");

  if (!sprite) {
    closeActive();
    return;
  }

  if (sprite === activeSprite) {
    closeActive();
    return;
  }

  closeActive();

  if (sprite.classList.contains("box")) {
    openCodePanel();
    return;
  }

  reveal(sprite);
  playClickSound()
});

function reveal(sprite) {
  if (!sprite.dataset.revealed && sprite.dataset.clue) {
    foundClues++;
    document.getElementById("score").textContent =
      `Clues: ${foundClues} / ${TOTAL_CLUES}`;
  }

  sprite.classList.add("revealed");
  sprite.dataset.revealed = "true";
  activeSprite = sprite;
}

function closeActive() {
  if (!activeSprite) return;
  activeSprite.classList.remove("revealed");
  activeSprite = null;
}

/* ================= CODE PANEL ================= */

function openCodePanel() {
  if (foundClues < TOTAL_CLUES) {
    showMessage(
    "Clues Missing",
    "Find all clues before opening the treasure box.",
     []
    );

    setTimeout(() => {
      document.getElementById("messageOverlay").classList.add("hidden");
    }, 2000);

    return;
  }
  codePanel.classList.remove("hidden");
  
}

submitBtn.addEventListener("click", () => {
  let code = "";
  inputs.forEach(i => code += i.value);

  if (code === PASSCODE) {
    errorText.style.display = "none";
    codePanel.classList.add("hidden");
    document.getElementById("treasureBox").classList.add("revealed");

    playLevelEndSequence(() => {
      levelUnlocked();
    });
  }
 
  else {
    errorText.style.display = "block";
  }
});

/* ================= HELPERS ================= */

function allCluesFound() {
  return document.querySelectorAll(".sprite[data-clue][data-revealed]").length === 4;
}

function playClickSound() {
  clickSound.currentTime = 0;
  clickSound.play();
}

function playLevelEndSequence(callback) {
  const levelSound = new Audio("assets/going-to-the-next-level-.WAV");
  const doorOpen  = new Audio("assets/Door Creak.WAV");
  const doorClose = new Audio("assets/Door Closing.WAV");

  levelSound.play();

  setTimeout(() => doorOpen.play(), 1000);
  setTimeout(() => {
    doorClose.play();
    if (callback) callback();
  }, 2000);
}

function startTimer() {
  updateTimerUI();

  timerInterval = setInterval(() => {
    if (gameOver) return;

    timeLeft--;
    updateTimerUI();

    if (timeLeft <= 0) {
      endGameTimeUp();
    }
  }, 1000);
}

function updateTimerUI() {
  const min = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const sec = String(timeLeft % 60).padStart(2, "0");
  document.getElementById("timer").textContent = `Time: ${min}:${sec}`;
}

function levelUnlocked() {
  gameOver = true;
  clearInterval(timerInterval);

  showMessage(
    "🎉 Level 3 Unlocked",
    "You solved the room successfully.",
    [
      { text: "Next Level", action: () => window.location.href = "level3.html" },
      { text: "Exit", action: () => window.location.href = "index.html" }
    ]
  );
}

function endGameTimeUp() {
  gameOver = true;
  clearInterval(timerInterval);

  showMessage(
    "⏰ Time's Up",
    "You ran out of time.",
    [
      { text: "Try Again", action: () => location.reload() },
      { text: "Exit", action: () => window.location.href = "index.html" }
    ]
  );
}

function showMessage(title, text, buttons) {
  const overlay = document.getElementById("messageOverlay");
  const titleEl = document.getElementById("messageTitle");
  const textEl = document.getElementById("messageText");
  const actions = document.getElementById("messageActions");

  titleEl.textContent = title;
  textEl.textContent = text;
  actions.innerHTML = "";

  buttons.forEach(btn => {
    const b = document.createElement("button");
    b.textContent = btn.text;
    b.onclick = btn.action;
    actions.appendChild(b);
  });

  overlay.classList.remove("hidden");
}

document.getElementById("messageClose").onclick = () => {
  document.getElementById("messageOverlay").classList.add("hidden");
};



/* ================= START ================= */

loadLevel();
