console.log("Hello, lets get started with js");
let current_song = new Audio();
async function getsongs() {


    let song = await fetch("http://127.0.0.1:3000/songs");
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


const playMusic = (song) => {
    // let audio = new Audio ("/songs/" + song + ".mp3");
    current_song.src = ("/songs/" + song + ".mp3");
    current_song.play()
}



async function main() {
    // Get the list of songs from the server
    let current_song;
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
            console.log(selected_song)
            playMusic(selected_song);
        })


    })

    // play the first song
    var audio = new Audio(songs[0]);
    // audio.play();

    audio.addEventListener("loadeddata", () => {
        console.log(audio.duration, audio.currentSrc, audio.currentTime);
    });
}

main();