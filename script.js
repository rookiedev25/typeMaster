// === THEME TOGGLE ===
document.getElementById("theme-toggle").addEventListener("change", function () {
  document.body.classList.toggle("light-mode");
});

// === SENTENCES POOL ===
const sentences = [
  "A quick brown fox jumps over a lazy dog.",
  "Typing is a great way to improve your focus.",
  "Practice makes a person perfect and confident.",
  "Developers love clean and modern UI designs.",
  "JavaScript powers interactive web experiences.",
  "Stay consistent and code every single day.",
  "CSS variables make themes easy to handle.",
  "Debugging is like solving mini-mysteries.",
  "Frontend frameworks simplify app development.",
  "Focus on accuracy before speed.",
];

// === DOM ELEMENTS ===
const sentenceDisplay = document.getElementById("sentence-display");
const inputArea = document.getElementById("input-area");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const charsTypedDisplay = document.getElementById("chars-typed");
const timeLeftDisplay = document.getElementById("time-left");
const restartBtn = document.getElementById("restart-btn");
const timerButtons = document.querySelectorAll(".timer-btn");
const heroDescription = document.querySelector(".description");

// === GAME VARIABLES ===
let timer;
let timeLeft = 0;
let totalTyped = 0;
let correctTyped = 0;
let startTime = null;
let isGameRunning = false;
let targetParagraph = "";

// === FUNCTIONS ===
function generateParagraph(duration) {
  let lines = 1;
  if (duration === 30) lines = 3;
  if (duration === 60) lines = 5;

  const shuffled = sentences.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, lines).join(" ");
}

function updateStats() {
  if (!startTime) return;

  const currentTime = new Date();
  const elapsedTime = (currentTime - startTime) / 60000; // minutes
  const wordsTyped = totalTyped / 5;
  const wpm = Math.round(wordsTyped / elapsedTime);
  const accuracy =
    totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 100;

  wpmDisplay.textContent = isFinite(wpm) ? wpm : "--";
  accuracyDisplay.textContent = isFinite(accuracy) ? accuracy : "--";
  charsTypedDisplay.textContent = totalTyped;
}

function startGame(duration) {
  clearInterval(timer);
  timeLeft = duration;
  timeLeftDisplay.textContent = timeLeft;
  targetParagraph = generateParagraph(duration);
  sentenceDisplay.textContent = targetParagraph;
  inputArea.value = "";
  totalTyped = 0;
  correctTyped = 0;
  updateStats();
  inputArea.disabled = false;
  inputArea.focus();
  isGameRunning = true;
  startTime = null;

  timer = setInterval(() => {
    timeLeft--;
    timeLeftDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      inputArea.disabled = true;
      isGameRunning = false;
      updateStats();
    }
  }, 1000);
}

// === EVENT LISTENERS ===

timerButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const selectedTime = parseInt(btn.dataset.time);
    startGame(selectedTime);
  });
});

inputArea.addEventListener("input", () => {
  if (!isGameRunning) return;

  if (!startTime) {
    startTime = new Date();
  }

  const typedText = inputArea.value;
  const targetText = targetParagraph;

  totalTyped = typedText.length;
  correctTyped = 0;

  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === targetText[i]) {
      correctTyped++;
    }
  }
  if (typedText.length > targetText.length) {
    inputArea.value = typedText.slice(0, targetText.length);
  }
  updateStats();

  // ✅ STOP if user finishes the paragraph correctly
  if (typedText === targetText) {
    clearInterval(timer);
    inputArea.disabled = true;
    isGameRunning = false;
  }
});
restartBtn.addEventListener("click", () => {
  clearInterval(timer);
  inputArea.value = "";
  inputArea.disabled = false;
  sentenceDisplay.textContent = "A quick brown fox jumps over a lazy dog.";
  wpmDisplay.textContent = "--";
  accuracyDisplay.textContent = "--";
  charsTypedDisplay.textContent = "--";
  timeLeftDisplay.textContent = "--";
  startTime = null;
  isGameRunning = false;
});
inputArea.addEventListener("input", () => {
  if (inputArea.value.trim().length > 0) {
    heroDescription.style.display = "none";
  }
});
