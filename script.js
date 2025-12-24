let activeSprite = null;

const game = document.getElementById("game");

const TOTAL_CLUES = 4;
const PASSCODE = "6759";

/* =========================
   LEVEL SETUP
========================= */

function loadLevel() {
  game.innerHTML = "";

  addSprite("canvas", 124, 405, true);
  addSprite("vase", 345, 462, true);
  addSprite("frame", -124, 210, true);
  addSprite("sheet", 260, 420, true);
  addSprite("box", 383, 701, false);
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
  if (sprite.classList.contains("box")) {
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


/* =========================
   BOX LOGIC
========================= */

function handleBox(box) {
  if (!allCluesFound()) {
    alert("Something is missing...");
    return;
  }

  const code = prompt("Enter the passcode:");
  if (code === PASSCODE) {
    reveal(box);
  } else {
    alert("Wrong code!");
  }
}

function allCluesFound() {
  return document.querySelectorAll(".sprite[data-clue='true'][data-revealed='true']").length === TOTAL_CLUES;
}

/* =========================
   AUDIO (EMPTY SLOT)
========================= */

function playClickSound() {
  // ADD AUDIO FILE HERE
  const sound = new Audio("assets/click1.WAV");
  sound.play();
}

/* =========================
   START
========================= */

loadLevel();
