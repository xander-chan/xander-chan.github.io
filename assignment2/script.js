// Song data array - each object represents a song with its name, audio source, and cover image
const songs = [
  { name: "Haze", src: "cafe.wav", cover: "cafe.png" },
  { name: "Enchanted", src: "enchanted.wav", cover: "enchanted.png" },
  { name: "Fading", src: "fade.wav", cover: "fade.png" },
  { name: "Mystical", src: "mystical.wav", cover: "mystical.png" },
];

// Get references to all necessary HTML elements to then add functionality too
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
const songList = document.querySelector(".song-list");
const replayBtn = document.getElementById("replay");

let currentSong = 0; // Index of the currently playing song
let isPlaying = false; // Keeps track of whether audio is playing
let isLooping = false; // Tracks if repeat mode is enabled

// Load a song and update UI
function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  cover.src = song.cover;
  title.textContent = song.name;
  progress.value = 0;
  currentTimeEl.textContent = "0:00";
}

// Play the loaded song and update the play button to show a "pause" icon
function playSong() {
  audio.play();
  isPlaying = true;

  // When the song is playing, we want the user to have the option to pause it,
  // so we switch the play button's icon to a "pause" symbol.
  playBtn.querySelector("img").src =
    "https://img.icons8.com/?size=100&id=403&format=png&color=FFFFFF";
}

// Pause the song and update the button to show a "play" icon
function pauseSong() {
  audio.pause();
  isPlaying = false;

  playBtn.querySelector("img").src =
    "https://img.icons8.com/?size=100&id=398&format=png&color=FFFFFF"; // Play icon
}

// When the play button is clicked, either play or pause depending on the current state
playBtn.addEventListener("click", () => {
  isPlaying ? pauseSong() : playSong();
});

// Play previous song in the list, wrapping to the end if at the beginning
document.getElementById("prev").addEventListener("click", () => {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
  playSong();
});

// Play next song in the list, looping back to start when at the end
document.getElementById("next").addEventListener("click", () => {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
  playSong();
});

// Toggle mute on/off and change the mute button icon accordingly
muteBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;
  muteBtn.querySelector("img").src = audio.muted
    ? "https://img.icons8.com/?size=100&id=643&format=png&color=FFFFFF" // Mute icon
    : "https://img.icons8.com/?size=100&id=LRLIxP2TYbTN&format=png&color=FFFFFF"; // Volume icon
});

// Volume slider input changes the audio volume directly
volumeSlider.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

// Seek to a different part of the song using the progress bar
progress.addEventListener("input", (e) => {
  audio.currentTime = (audio.duration * e.target.value) / 100;
});

// Keep updating the progress bar and timestamps as the song plays, timeupdate keeps looking at the audio in HTML
audio.addEventListener("timeupdate", () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.value = percent || 0;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
});

// Format raw seconds into mm:ss format for display, (got help on this but didn't really need it as none of my songs go above 1 minute)
function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

// When a song is clicked from the list, play that song
document.querySelectorAll(".song").forEach((songEl) => {
  songEl.addEventListener("click", () => {
    currentSong = Number(songEl.dataset.index);
    loadSong(currentSong);
    playSong();
  });
});

// Toggle the visibility of the song list on click
songListToggle.addEventListener("click", () => {
  songList.classList.toggle("active");
});

// Toggle repeat mode on/off and switch icons
replayBtn.addEventListener("click", () => {
  isLooping = !isLooping;
  audio.loop = isLooping;
  replayBtn.querySelector("img").src = isLooping
    ? "https://img.icons8.com/?size=100&id=59831&format=png&color=FFFFFF" // Played repeat
    : "https://img.icons8.com/?size=100&id=91644&format=png&color=FFFFFF"; // Regular repeat
});

// If a song finishes and repeat is OFF, auto-play the next one
audio.addEventListener("ended", () => {
  if (!isLooping) {
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong);
    playSong();
  }
});

// Load the initial song when the page starts
loadSong(currentSong);

/* 
 Got assistance from W3Schools tutorials and documentation and also GitHub help
*/
