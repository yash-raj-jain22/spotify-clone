// =========================
// Spotify Clone - Script
// =========================
// This file controls song fetching, playback, seek interactions,
// and basic mobile sidebar toggling.

console.log("Hello, lets get started with js");

// Global audio instance used across all controls.
let current_song = new Audio();
let songs;
// Main playback control buttons.
const play = document.getElementById("play");
const previous = document.getElementById("prev");
const next = document.getElementById("next");

function secondsToMinSec(seconds) {
    // Convert total seconds to mm:ss format.
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

async function getsongs() {
    // Fetch the songs directory HTML listing.
    let song = await fetch("../songs/");
    let response = await song.text();
    // console.log(response);

    // Parse the listing to extract all anchor links.
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    // Keep only MP3 files and store the filename part.
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/%5Csongs%5C")[1]);
        }
    }
    return songs;
}


const playMusic = (song, pause = false) => {
    // Set the current song source.
    current_song.src = ("../songs/" + song + ".mp3");

    // Start playback immediately unless explicitly paused.
    if (!pause) {
        current_song.play()
        play.src = "../img/pause.svg";
    }

    // Update song title and reset visible timer.
    document.querySelector(".song-info").innerHTML = song.replaceAll("%20", " ").replace(".mp3", "");
    document.querySelector(".song-time").innerHTML = "0:00"
}



async function main() {
    // 1) Get all songs from the server.
    songs = await getsongs();


    // 2) Render songs in the playlist.
    let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert" src="../img/music.svg" alt="music">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ").replace(".mp3", "")}</div>
                                <div>Song Artist</div>
                            </div>
                            <div class="playnow">
                                <img class="invert " src="../img/play-now.svg" alt="Play Now">
                                <span>Play Now</span>
                            </div>
                        </li>`
    }

    // 3) Add click listeners to each rendered song item.
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach((e) => {
        let selected_song = e.getElementsByTagName("div")[0].getElementsByTagName("div")[0].innerHTML;
        e.addEventListener("click", () => {
            playMusic(selected_song);
        })


    })

    // 4) Play/Pause button behavior.
    play.addEventListener("click", () => {
        // If no song is selected yet, auto-select the first one.
        if (current_song.src == "") {
            console.log("No song selected");
            current_song.src = ("../songs/" + songs[0]);
            current_song.play();
            play.src = "../img/pause.svg";
            document.querySelector(".song-info").innerHTML = current_song.src.split("/").pop().replaceAll("%20", " ").replace(".mp3", "");
        }
        // If selected song is paused, resume it.
        else if (current_song.paused) {
            current_song.play();
            play.src = "../img/pause.svg";
        }
        // Otherwise pause current playback.
        else {
            current_song.pause();
            play.src = "../img/play.svg";
        }
    })

    // Helper audio object used here to inspect first-song metadata.
    var audio = new Audio(songs[0]);
    // audio.play();

    // Log metadata once the sample audio is ready.
    audio.addEventListener("loadeddata", () => {
        console.log(audio.duration, audio.currentSrc, audio.currentTime);
    });


    // 5) Sync progress UI while song is playing.
    current_song.addEventListener("timeupdate", () => {
        // console.log(current_song.currentTime, current_song.duration);
        document.querySelector(".song-time").innerHTML = secondsToMinSec(Math.floor(current_song.currentTime)) + " / " + secondsToMinSec(Math.floor(current_song.duration));
        document.querySelector(".circle").style.left = (current_song.currentTime / current_song.duration) * 100 + "%";
        document.querySelector(".overbar").style.width = (current_song.currentTime / current_song.duration) * 100 + "%";
    })

    // 6) Seek to clicked position on the progress bar.
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let clickPosition = e.clientX - document.querySelector(".underbar").getBoundingClientRect().left;
        let barWidth = document.querySelector(".underbar").offsetWidth;
        let clickPercentage = clickPosition / barWidth;
        current_song.currentTime = (clickPercentage) * current_song.duration;
    })


    // 7) Mobile sidebar open/close interactions.
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").classList.toggle("left-active");
        document.querySelector(".right").classList.toggle("black-cover");
    })
    document.querySelector(".hamburger-close").addEventListener("click", () => {
        document.querySelector(".left").classList.toggle("left-active");
        document.querySelector(".right").classList.toggle("black-cover");
    })

    // 8) Placeholder handlers for previous/next controls.
    previous.addEventListener("click", () => {
        
        let index = songs.indexOf(current_song.src.split("/").pop());
        if (index == 0) return;
        playMusic(songs[index - 1].split(".mp3")[0]);
    })
    next.addEventListener("click", () => {
        let index = songs.indexOf(current_song.src.split("/").pop());
        if (index == songs.length - 1) return;
        playMusic(songs[index + 1].split(".mp3")[0]);
    })


}

// Entry point.
main();