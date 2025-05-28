let startTime = null;
let currentLevel = 0;
const totalLevels = 10;

// Each level consists of a pair: the repeating emoji and the outlier
// Emojis were selected for subtle but clear visual distinctions to challenge perception
const levelPairs = [
  ["🍎", "🍏"],
  ["🐶", "🐱"],
  ["🚗", "🚕"],
  ["🌺", "🌸"],
  ["🍨", "🍧"],
  ["🐉", "🐍"],
  ["🏝️", "🏖️"],
  ["🌟", "⭐"],
  ["😀", "😃"],
  ["😈", "👿"],
];

// Audio elements for feedback and atmosphere
// Sound cues enhance usability by reinforcing success/failure
const bgMusic = document.getElementById("bgMusic");
const correctSound = document.getElementById("correctSound");
const incorrectSound = document.getElementById("incorrectSound");

// Updates the fake 'desktop clock' in the UI
// Helps reinforce the Windows 2000s theme
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

// Open game popup: resets UI, initializes level, starts music
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

  bgMusic.play();
}

// Hide game window and clean up
function closeGamePopup() {
  const popup = document.getElementById("gameWindow");
  popup.classList.remove("show");
  setTimeout(() => {
    popup.style.display = "none";
  }, 400);

  document.getElementById("emojiGrid").innerHTML = "";
  const feedback = document.getElementById("feedback");
  if (feedback) feedback.className = "";
  stopMovingEmojis(); // stop any ongoing movement on close

  // Pause background music and reset
  bgMusic.pause();
  bgMusic.currentTime = 0;
}

function restartGame() {
  openGamePopup();
}

let movingEmojis = [];
let animationFrameId = null;

// Builds each grid, a lot of my understanding came from https://scrimba.com/learn-javascript-c0v, https://www.w3schools.com/js/ and other youtube videos
function generateLevel() {
  const grid = document.getElementById("emojiGrid");
  const feedback = document.getElementById("feedback");
  if (feedback) feedback.className = "";
  grid.innerHTML = "";
  stopMovingEmojis();

  const [sameEmoji, oddEmoji] = levelPairs[currentLevel]; // Goes back to the 8th line of code and so on, to define which is the same and odd one outs
  const total = 108; // Basically means 12 x 9 grid
  const oddIndex = Math.floor(Math.random() * total); // Randomiser

  const gridWidth = grid.clientWidth;
  const gridHeight = grid.clientHeight;
  const cellSize = 40 + 6;

  movingEmojis = [];

  // Loop to create all 108 emoji cells
  for (let i = 0; i < total; i++) {
    // Create a new div element to represent one emoji in the grid
    const cell = document.createElement("div");

    cell.className = "emoji-cell";
    cell.textContent = i === oddIndex ? oddEmoji : sameEmoji;

    // Set default positioning for the emoji
    cell.style.position = "relative";

    // Reset any previous movement
    cell.style.transform = "none";
    cell.style.transition = "transform 0.3s ease";

    // If this is the odd emoji:
    if (i === oddIndex) {
      // When clicked, show positive feedback (checkmark or sound),
      // then advance to the next level (or finish if it's the last one)
      cell.onclick = () => {
        showFeedback(true); // correct click feedback
        currentLevel++; // move to the next level

        // If not the last level, generate the next one after 800ms
        if (currentLevel < totalLevels) {
          setTimeout(generateLevel, 800);
        } else {
          // If last level was completed, show the end screen
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

// Visual and Audio Feedback from the CSS and HTML
function showFeedback(isCorrect) {
  const feedback = document.getElementById("feedback");
  if (!feedback) return;

  feedback.textContent = isCorrect ? "✔" : "✘";
  feedback.className = "show " + (isCorrect ? "correct" : "incorrect");

  // Play sound effect
  if (isCorrect) {
    correctSound.currentTime = 0;
    correctSound.play();
  } else {
    incorrectSound.currentTime = 0;
    incorrectSound.play();
  }

  // Hide after animation
  setTimeout(() => {
    feedback.className = "";
  }, 700);
}

// Final level interaction: moving emojis bounce within grid bounds, somewhat inspired by classic screen-saver behavior (e.g. DVD logo bounce)
// and basic understanding from https://www.w3schools.com/graphics/game_movement.asp, https://developer.mozilla.org/en-US/docs/Web/CSS/transform.
function createMovingEmoji(cell, gridWidth, gridHeight) {
  const cellSize = 40 + 6;
  // Start at a random position inside grid
  const x = Math.random() * (gridWidth - cellSize);
  const y = Math.random() * (gridHeight - cellSize);

  const speed = 50; // Adjust for smoothness & consistent speed
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

      // Bounce off edges of grid box so it doesn't go out of frame
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

// After game completion
function showEndScreen() {
  stopMovingEmojis();

  // Stop background music
  bgMusic.pause();
  bgMusic.currentTime = 0;

  // Play cheer sound
  const winSound = document.getElementById("winSound");
  winSound.play();

  const endTime = new Date();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  document.getElementById("timeTaken").textContent = `${duration} seconds`;
  document.getElementById("gameContainer").style.display = "none";
  document.getElementById("endScreen").classList.remove("hidden");
}

const volumeSlider = document.getElementById("volumeSlider");
const volumeIcon = document.getElementById("volumeIcon");

function toggleVolumeSlider() {
  const slider = document.getElementById("volume-slider-container");
  slider.classList.toggle("show");
}

volumeSlider.addEventListener("input", (e) => {
  const volume = parseFloat(e.target.value);

  // Set different relative volumes
  bgMusic.volume = volume * 0.3; // Softer background music
  correctSound.volume = volume * 0.8; // Louder than music
  incorrectSound.volume = volume * 0.8; // Louder than music

  // Change icon depending on volume
  if (volume === 0) {
    volumeIcon.textContent = "🔇";
  } else if (volume < 0.5) {
    volumeIcon.textContent = "🔉";
  } else {
    volumeIcon.textContent = "🔊";
  }
});

window.addEventListener("load", () => {
  const initVolume = parseFloat(volumeSlider.value);
  bgMusic.volume = initVolume * 0.3;
  correctSound.volume = initVolume * 0.8;
  incorrectSound.volume = initVolume * 0.8;
  winSound.volume = initVolume * 0.3;

  volumeIcon.textContent =
    initVolume === 0 ? "🔇" : initVolume < 0.5 ? "🔉" : "🔊";
});
