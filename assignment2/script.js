const songs = [
  {
    name: "Cafe",
    src: "cafe.wav",
    cover: "cafe.png",
  },
  {
    name: "Forest",
    src: "forest.wav",
    cover: "forest.png",
  },
  {
    name: "Song Three",
    src: "song3.mp3",
    cover: "placeholder3.jpg",
  },
  {
    name: "Song Four",
    src: "song4.mp3",
    cover: "placeholder4.jpg",
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
  playBtn.textContent = "⏸️";
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = "▶️";
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
  muteBtn.textContent = audio.muted ? "🔇" : "🔊";
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
