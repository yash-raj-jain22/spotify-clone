console.log("Hello, lets get started with js");
let current_song = new Audio();
const play = document.getElementById("play");

function secondsToMinSec(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
async function getsongs() {
    let song = await fetch("http://127.0.0.1:3002/songs");
    let response = await song.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
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
    // let audio = new Audio ("/songs/" + song + ".mp3");
    current_song.src = ("/songs/" + song + ".mp3");
    if (!pause) {
        current_song.play()
        play.src = "pause.svg";
    }
    document.querySelector(".song-info").innerHTML = song.replaceAll("%20", " ").replace(".mp3", "");
    document.querySelector(".song-time").innerHTML = "0:00"
}



async function main() {
    // Get the list of songs from the server
    let songs = await getsongs();



    let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert" src="music.svg" alt="music">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ").replace(".mp3", "")}</div>
                                <div>Song Artist</div>
                            </div>
                            <div class="playnow">
                                <img class="invert " src="play-now.svg" alt="Play Now">
                                <span>Play Now</span>
                            </div>
                        </li>`
    }

    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach((e) => {
        let selected_song = e.getElementsByTagName("div")[0].getElementsByTagName("div")[0].innerHTML;
        e.addEventListener("click", () => {
            playMusic(selected_song);
        })


    })

    play.addEventListener("click", () => {
        if (current_song.src == "") {
            console.log("No song selected");
            current_song.src = ("/songs/" + songs[0]);
            current_song.play();
            play.src = "pause.svg";
            document.querySelector(".song-info").innerHTML = current_song.src.split("/").pop().replaceAll("%20", " ").replace(".mp3", "");
        }
        else if (current_song.paused) {
            current_song.play();
            play.src = "pause.svg";
        }
        else {
            current_song.pause();
            play.src = "play.svg";
        }
    })

    // play the first song
    var audio = new Audio(songs[0]);
    // audio.play();

    audio.addEventListener("loadeddata", () => {
        console.log(audio.duration, audio.currentSrc, audio.currentTime);
    });


    current_song.addEventListener("timeupdate", () => {
        // console.log(current_song.currentTime, current_song.duration);
        document.querySelector(".song-time").innerHTML = secondsToMinSec(Math.floor(current_song.currentTime)) + " / " + secondsToMinSec(Math.floor(current_song.duration));
        document.querySelector(".circle").style.left = (current_song.currentTime / current_song.duration) * 100 + "%";
        document.querySelector(".overbar").style.width = (current_song.currentTime / current_song.duration) * 100 + "%";


    })
}

main();