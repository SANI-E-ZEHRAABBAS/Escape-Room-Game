const artLevel = document.getElementById("art-level");
const lockedMessage = document.getElementById("lockedMessage");

const openBook = document.getElementById("openBook");
const closeBook = document.getElementById("closeBook");
const instructionOverlay = document.getElementById("instructionOverlay");

/* Locked Level Click */
artLevel.addEventListener("click", () => {
    lockedMessage.classList.remove("hidden");

    setTimeout(() => {
        lockedMessage.classList.add("hidden");
    }, 2000);
});

/* Instruction Book */
openBook.addEventListener("click", () => {
    instructionOverlay.classList.remove("hidden");
});

closeBook.addEventListener("click", () => {
    instructionOverlay.classList.add("hidden");
});
const playButton = document.querySelector(".play-btn");

/* Redirect to Haunted Lab Level */
playButton.addEventListener("click", () => {
    window.location.href = "level1.html";
});
const bgAudio = document.getElementById("bg-audio");

function startAudio() {
    bgAudio.volume = 0.4; // keep it subtle
    bgAudio.play();

    document.removeEventListener("click", startAudio);
}

document.addEventListener("click", startAudio);

