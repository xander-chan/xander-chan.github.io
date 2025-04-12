const songs = [
  {
    name: "Haze",
    src: "cafe.wav",
    cover: "cafe.png",
  },
  {
    name: "Enchanted",
    src: "enchanted.wav",
    cover: "enchanted.png",
  },
  {
    name: "Fading",
    src: "fade.wav",
    cover: "fade.png",
  },
  {
    name: "Mystical",
    src: "mystical.wav",
    cover: "mystical.png",
  },
];

const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const title = document.getElementById("song-title");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeSlider = document.getElementById("volume");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const songListToggle = document.getElementById("song-list-toggle");
const songListContainer = document.querySelector(".song-list-container");

let currentSong = 0;
let isPlaying = false;

function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  cover.src = song.cover;
  title.textContent = song.name;
  progress.value = 0;
  currentTimeEl.textContent = "0:00";
}

function playSong() {
  audio.play();
  isPlaying = true;
  playBtn.querySelector("img").src =
    "https://img.icons8.com/?size=100&id=403&format=png&color=FFFFFF"; // Pause icon
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.querySelector("img").src =
    "https://img.icons8.com/?size=100&id=398&format=png&color=FFFFFF"; // Play icon
}

playBtn.addEventListener("click", () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

document.getElementById("prev").addEventListener("click", () => {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
  playSong();
});

document.getElementById("next").addEventListener("click", () => {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
  playSong();
});

muteBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;
  muteBtn.querySelector("img").src = audio.muted
    ? "https://img.icons8.com/?size=100&id=643&format=png&color=FFFFFF" // Muted icon
    : "https://img.icons8.com/?size=100&id=LRLIxP2TYbTN&format=png&color=FFFFFF"; // Unmuted icon
});

volumeSlider.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

progress.addEventListener("input", (e) => {
  audio.currentTime = (audio.duration * e.target.value) / 100;
});

audio.addEventListener("timeupdate", () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.value = percent || 0;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
});

document.querySelectorAll(".song").forEach((songEl) => {
  songEl.addEventListener("click", () => {
    currentSong = Number(songEl.dataset.index);
    loadSong(currentSong);
    playSong();
  });
});

function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

songListToggle.addEventListener("click", () => {
  songListContainer.classList.toggle("active");
});

loadSong(currentSong);

const toggleBtn = document.getElementById("song-list-toggle");
const songList = document.querySelector(".song-list");

toggleBtn.addEventListener("click", () => {
  songList.classList.toggle("active");
});

const replayBtn = document.getElementById("replay");
let isLooping = false;

replayBtn.addEventListener("click", () => {
  isLooping = !isLooping;
  audio.loop = isLooping;

  // Change replay icon based on state
  replayBtn.querySelector("img").src = isLooping
    ? "https://img.icons8.com/?size=100&id=59831&format=png&color=FFFFFF" // Green icon when loop is on
    : "https://img.icons8.com/?size=100&id=91644&format=png&color=FFFFFF"; // White icon when off
});

// If you also want to handle when a song ends (if not looping)
audio.addEventListener("ended", () => {
  if (!isLooping) {
    // Go to next song or stop
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong);
    playSong();
  }
});
