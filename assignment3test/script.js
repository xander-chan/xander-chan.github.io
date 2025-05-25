let startTime = null;
let currentLevel = 0;
const totalLevels = 9;

const levelPairs = [
  ["🍎", "🍏"],
  ["🐶", "🐱"],
  ["🚗", "🚕"],
  ["🌺", "🌸"],
  ["🍨", "🍧"],
  ["🐉", "🐍"],
  ["🏝️", "🏖️"],
  ["😀", "😃"],
  ["😈", "👿"],
];

function updateClock() {
  const clock = document.getElementById("clock");
  const now = new Date();
  clock.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
setInterval(updateClock, 1000);
updateClock();

function openGamePopup() {
  const popup = document.getElementById("gameWindow");
  popup.style.display = "block";

  // Force reflow for animation restart
  void popup.offsetWidth;

  popup.classList.add("show");

  document.getElementById("endScreen").classList.add("hidden");
  document.getElementById("gameContainer").style.display = "block";
  currentLevel = 0;
  startTime = new Date();
  generateLevel();
}

function closeGamePopup() {
  const popup = document.getElementById("gameWindow");
  popup.classList.remove("show");
  // wait for animation to finish before hiding
  setTimeout(() => {
    popup.style.display = "none";
  }, 400);

  document.getElementById("emojiGrid").innerHTML = "";
  const feedback = document.getElementById("feedback");
  if (feedback) feedback.className = "";
  stopMovingEmojis(); // stop any ongoing movement on close
}

function restartGame() {
  openGamePopup();
}

let movingEmojis = [];
let animationFrameId = null;

function generateLevel() {
  const grid = document.getElementById("emojiGrid");
  const feedback = document.getElementById("feedback");
  if (feedback) feedback.className = ""; // reset feedback styles & hide
  grid.innerHTML = "";
  stopMovingEmojis(); // Clear previous movement

  const [sameEmoji, oddEmoji] = levelPairs[currentLevel];
  const total = 108;
  const oddIndex = Math.floor(Math.random() * total);

  // grid size for bounds calculation:
  const gridWidth = grid.clientWidth;
  const gridHeight = grid.clientHeight;
  const cellSize = 40 + 6; // cell width + gap approx

  movingEmojis = [];

  for (let i = 0; i < total; i++) {
    const cell = document.createElement("div");
    cell.className = "emoji-cell";
    cell.textContent = i === oddIndex ? oddEmoji : sameEmoji;

    // Reset position for all cells first:
    cell.style.position = "relative";
    cell.style.transform = "none";
    cell.style.transition = "transform 0.3s ease";

    if (i === oddIndex) {
      cell.onclick = () => {
        showFeedback(true);
        currentLevel++;
        if (currentLevel < totalLevels) {
          setTimeout(generateLevel, 800);
        } else {
          setTimeout(showEndScreen, 800);
        }
      };

      if (currentLevel === totalLevels - 1) {
        // last level: position absolute to move inside grid bounds
        cell.style.position = "absolute";
        movingEmojis.push(createMovingEmoji(cell, gridWidth, gridHeight));
      }
    } else {
      cell.onclick = () => {
        showFeedback(false);
      };
      if (currentLevel === totalLevels - 1) {
        cell.style.position = "absolute";
        movingEmojis.push(createMovingEmoji(cell, gridWidth, gridHeight));
      }
    }

    grid.appendChild(cell);
  }

  document.getElementById("level-indicator").textContent = `Level ${
    currentLevel + 1
  }`;

  if (currentLevel === totalLevels - 1) {
    startMovingEmojis();
  }
}

function showFeedback(isCorrect) {
  const feedback = document.getElementById("feedback");
  if (!feedback) return;

  feedback.textContent = isCorrect ? "✔" : "✘";
  feedback.className = "show " + (isCorrect ? "correct" : "incorrect");

  // Hide after animation
  setTimeout(() => {
    feedback.className = "";
  }, 700);
}

// Create an object for each moving emoji to track its position & velocity
function createMovingEmoji(cell, gridWidth, gridHeight) {
  const cellSize = 40 + 6;
  // Start at a random position inside grid
  const x = Math.random() * (gridWidth - cellSize);
  const y = Math.random() * (gridHeight - cellSize);

  // Random velocity - pixels per second
  const speed = 50; // Adjust for smoothness & consistent speed
  // Random direction unit vector
  const angle = Math.random() * 2 * Math.PI;
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;

  cell.style.transform = `translate(${x}px, ${y}px)`;

  return { cell, x, y, vx, vy, gridWidth, gridHeight, cellSize };
}

function startMovingEmojis() {
  let lastTime = performance.now();

  function animate(time) {
    const delta = (time - lastTime) / 1000; // seconds elapsed
    lastTime = time;

    for (const emoji of movingEmojis) {
      emoji.x += emoji.vx * delta;
      emoji.y += emoji.vy * delta;

      // Bounce off edges of grid box
      if (emoji.x < 0) {
        emoji.x = 0;
        emoji.vx = -emoji.vx;
      } else if (emoji.x > emoji.gridWidth - emoji.cellSize) {
        emoji.x = emoji.gridWidth - emoji.cellSize;
        emoji.vx = -emoji.vx;
      }
      if (emoji.y < 0) {
        emoji.y = 0;
        emoji.vy = -emoji.vy;
      } else if (emoji.y > emoji.gridHeight - emoji.cellSize) {
        emoji.y = emoji.gridHeight - emoji.cellSize;
        emoji.vy = -emoji.vy;
      }

      emoji.cell.style.transform = `translate(${emoji.x}px, ${emoji.y}px)`;
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  animationFrameId = requestAnimationFrame(animate);
}

function stopMovingEmojis() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  movingEmojis = [];
}

function showEndScreen() {
  stopMovingEmojis();
  const endTime = new Date();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  document.getElementById("timeTaken").textContent = `${duration} seconds`;
  document.getElementById("gameContainer").style.display = "none";
  document.getElementById("endScreen").classList.remove("hidden");
}

const bgMusic = document.getElementById("bgMusic");
const volumeSlider = document.getElementById("volumeSlider");
const volumeIcon = document.getElementById("volumeIcon");

function toggleVolumeSlider() {
  const slider = document.getElementById("volume-slider-container");
  slider.classList.toggle("show");
}

volumeSlider.addEventListener("input", (e) => {
  const volume = parseFloat(e.target.value);
  bgMusic.volume = volume;

  // Change icon depending on volume
  if (volume === 0) {
    volumeIcon.textContent = "🔇";
  } else if (volume < 0.5) {
    volumeIcon.textContent = "🔉";
  } else {
    volumeIcon.textContent = "🔊";
  }
});

// Sync icon on page load
window.addEventListener("load", () => {
  const initVolume = parseFloat(volumeSlider.value);
  bgMusic.volume = initVolume;
  volumeIcon.textContent =
    initVolume === 0 ? "🔇" : initVolume < 0.5 ? "🔉" : "🔊";
});
