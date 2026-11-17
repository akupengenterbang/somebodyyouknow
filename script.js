const tearButton = document.querySelector("#tear-button");
const envelope = document.querySelector("#envelope");
const introScene = document.querySelector("#intro-scene");
const questionScene = document.querySelector("#question-scene");
const questionCard = document.querySelector("#question-card");
const choiceButtons = document.querySelectorAll(".choice-button");
const noScene = document.querySelector("#no-scene");
const birthdayScene = document.querySelector("#birthday-scene");
const playButton = document.querySelector("#play-button");
const audio = document.querySelector("#birthday-audio");
const playStatus = document.querySelector("#play-status");
const lettersScene = document.querySelector("#letters-scene");
const scrollHint = document.querySelector("#scroll-hint");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let choiceMade = false;

const flowerPhotosByPage = {
  "intro-scene": ["assets/photo-blue-bouquet.png", "assets/photo-blue-lily.png", "assets/photo-blue-roses.png", "assets/photo-blue-blossoms.png", "assets/photo-blue-flower.png"],
  "question-scene": ["assets/photo-blue-lily.png", "assets/photo-blue-flower.png", "assets/photo-blue-bouquet.png", "assets/photo-blue-roses.png", "assets/photo-blue-blossoms.png"],
  "no-scene": ["assets/photo-blue-roses.png", "assets/photo-blue-blossoms.png", "assets/photo-blue-lily.png", "assets/photo-blue-flower.png", "assets/photo-blue-bouquet.png"],
  "birthday-scene": ["assets/photo-blue-blossoms.png", "assets/photo-blue-bouquet.png", "assets/photo-blue-flower.png", "assets/photo-blue-lily.png", "assets/photo-blue-roses.png"],
  "paper-one": ["assets/photo-blue-flower.png", "assets/photo-blue-bouquet.png", "assets/photo-blue-roses.png", "assets/photo-blue-lily.png", "assets/photo-blue-blossoms.png"],
};

Object.entries(flowerPhotosByPage).forEach(([pageId, photos]) => {
  const page = document.getElementById(pageId);
  const flowerLayer = document.createElement("div");
  flowerLayer.className = "page-flowers";
  flowerLayer.setAttribute("aria-hidden", "true");

  photos.forEach((source) => {
    const flower = document.createElement("img");
    flower.className = "page-flower";
    flower.src = source;
    flower.alt = "";
    flower.loading = "lazy";
    flowerLayer.append(flower);
  });

  page.prepend(flowerLayer);
});

tearButton.addEventListener("click", () => {
  tearButton.disabled = true;
  tearButton.classList.add("is-hidden");
  envelope.classList.add("is-torn");

  window.setTimeout(() => {
    introScene.hidden = true;
    questionScene.hidden = false;
    document.querySelector("#question-title").focus?.();
  }, 950);
});

choiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (choiceMade) return;
    choiceMade = true;

    const choice = button.dataset.choice;
    button.classList.add("is-selected");
    questionCard.classList.add("zoom-out");

    window.setTimeout(() => {
      questionScene.hidden = true;
      const nextScene = choice === "yes" ? birthdayScene : noScene;
      nextScene.hidden = false;
      nextScene.classList.add(choice === "yes" ? "slide-right" : "slide-left");
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    }, 520);
  });
});

playButton.addEventListener("click", async () => {
  if (audio.paused) {
    playButton.disabled = true;
    playStatus.classList.remove("is-error");
    playStatus.textContent = "Memutar lagu untukmu…";

    try {
      await audio.play();
    } catch (error) {
      playButton.disabled = false;
      playStatus.classList.add("is-error");
      playStatus.textContent = "Lagunya belum bisa diputar sekarang. Coba lagi sebentar.";
    }
  } else {
    audio.pause();
  }
});

audio.addEventListener("playing", () => {
  playButton.disabled = false;
  playButton.classList.add("is-playing");
  playButton.setAttribute("aria-label", "Jeda lagu");
  playButton.querySelector(".play-icon").textContent = "Ⅱ";
  playStatus.textContent = "Nikmati lagunya…";
  window.setTimeout(openLetters, 500);
});

audio.addEventListener("pause", () => {
  playButton.classList.remove("is-playing");
  playButton.setAttribute("aria-label", "Putar lagu");
  playButton.querySelector(".play-icon").textContent = "▶";
  if (lettersScene.hidden) {
    playStatus.textContent = "Lagu dijeda. Putar lagi untuk melanjutkan.";
  }
});

audio.addEventListener("error", () => {
  playButton.disabled = false;
  playStatus.classList.add("is-error");
  playStatus.textContent = "Audio tidak dapat dimuat. Coba putar lagi sebentar.";
});

function openLetters() {
  if (!birthdayScene || !lettersScene || !lettersScene.hidden) return;

  scrollHint.hidden = false;
  lettersScene.hidden = false;
  lettersScene.scrollIntoView({
    behavior: reducedMotion ? "auto" : "smooth",
    block: "start",
  });
}