const clickSound = new Audio("assets/click1.wav");
clickSound.preload = "auto";

const game = document.getElementById("game");
const codePanel = document.getElementById("codePanel");
const submitBtn = document.getElementById("submitCode");
const errorText = document.getElementById("codeError");
const inputs = document.querySelectorAll(".code-inputs input");

let activeSprite = null;
const PASSCODE = "6759";

/* ================= LOAD LEVEL ================= */

function loadLevel() {
  game.innerHTML = "";

  addSprite("canvas", 328, 405, true);
  addSprite("vase",   357, 462, true);
  addSprite("frame",  25, 545, true);
  addSprite("sheet",  122, 740, true);
  addSprite("box",    385, 707, false, "treasureBox");
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
  if (!allCluesFound()) {
    alert("Find all clues first");
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
    levelCompleteSound();
    doorCreakSound();
    doorCloseSound();
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
  // ADD AUDIO FILE HERE
  const sound = new Audio("assets/click1.WAV");
  sound.play();
}

function levelCompleteSound(){
  const levelSound = new Audio("assets/going-to-the-next-level-.WAV");
  levelSound.play();
}

function doorCreakSound(){
  const doorOpen = new Audio("assets/Door Creak.WAV");
    doorOpen.play();
}

function doorCloseSound(){
  const doorClose = new Audio("assets/Door Closing.WAV");
  doorClose.play();
}


/* ================= START ================= */

loadLevel();
