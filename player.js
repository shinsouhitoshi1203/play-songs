///// features
/// loads songs
/// play, pause
/// seek
/// next, prev
/// replay
/// random



export default class Play {
    constructor (playlist, title, album, audioControl, controls, progress ) {
        this.playlist = playlist;
        this.songTitle = title;
        this.albumCover = album;
        this.audioControl = audioControl;
        this.controls = controls;
        this.progress = progress;
    }

    #currentSong = 0;
    #isPlayed = false;
    percent() {
        let audioControl = this.audioControl;
        let currentPosition = audioControl.currentTime;
        return Math.trunc(currentPosition);
    }
    #songLength() {
        let audioControl = this.audioControl;
        let duration = audioControl.duration;
        return Math.trunc(duration);
    }
    
    #songs = [
        {
            name: "Il Vento D'oro",
            singer: "V.A",
            path: "./komatsumiho.nazo.mp3",
            image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        },
        {
            name: "Tu Phir Se Aana",
            singer: "Raftaar x Salim Merchant x Karma",
            path: "./negai.mp3",
            image:
            "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
            name: "Naachne Ka Shaunq",
            singer: "Raftaar x Brobha V",
            path:
            "./lovegone.mp3",
            image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
            name: "Negai",
            singer: "Raftaar x Salim Merchant x Karma",
            path: "./negai.mp3",
            image:
            "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
    ]

    renderList() {
        let htmls = this.#songs
            .map(
                function (song, index) {
                    let name = song.name, artist = song.singer, mp3 = song.path, album = song.image;
                    return `<div class="song">
                        <div class="thumb" style="background-image: url(${album})">
                        </div>
                        <div class="body">
                        <h3 class="title">${name}</h3>
                        <p class="author">${artist}</p>
                        </div>
                        <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>`;
                }
            )
            .join('');
        this.playlist.innerHTML = htmls;
    }
    #spinCD(controls) {
        
    }
    renderSong(songPosition) {
        let _this = this;
        function loadCDAlbum(_this, data) {
            _this.albumCover.querySelector(".cd-thumb").style.backgroundImage = `url(${data})`;
        }
        function loadTitle(_this, data) {
            _this.songTitle.innerText = data;
        }
        function loadAudio(_this, src) {
            _this.audioControl.src = src;
        }
        let song = this.#songs[songPosition];
        if (song) {
            let name = song.name, artist = song.singer, mp3 = song.path, album = song.image;
            const p = new Promise(
                function (resolve) {
                    loadAudio(_this, mp3);
                    loadCDAlbum(_this, album);
                    loadTitle(_this, name);
                    resolve();
                }
            )
            p.then (()=>{
                // this.play();
            })
            
        } else throw new Error ("bugs");
    }

    play() {
        this.audioControl.play();
    }

    pause() {
        this.audioControl.pause();
    }

    #autoNext () {
        let n = this.#currentSong;
        this.#currentSong = (n >= this.#songs.length - 1) ? 0 : ++n;
        this.renderSong(this.#currentSong);
        this.play();
    }
    #autoRandom () {
        let n = this.#currentSong, newIndex = n;
        console.log(newIndex);
        while (newIndex == n) {
            newIndex = Math.floor(Math.random() * this.#songs.length-1) + 1;
        }
        this.#currentSong = newIndex;
        this.renderSong(this.#currentSong);
        this.play();
    }
    

    renderEvent() {
        //animation
        let spin = this.albumCover.animate(
            [
                {transform: "rotate(360deg)"}
            ], 
            {
                duration: 10000,
                iterations: Infinity
            }
        )
        spin.pause();
        //declarations
        let playButton = this.controls.querySelector('.btn-toggle-play');
        let nextButton = this.controls.querySelector('.btn-next');
        let prevButton = this.controls.querySelector('.btn-prev');
        let loopButton = this.controls.querySelector('.btn-repeat');
        let shuffleButton = this.controls.querySelector('.btn-random');
        let audioControl = this.audioControl;

        //events
        playButton.addEventListener("click", ()=>{
            if (this.#isPlayed) {
                this.audioControl.pause();
            } else {
                this.play();
            }
        });
        nextButton.addEventListener("click", ()=>{
            if (!shuffleButton.classList.contains("active")) {
                this.#autoNext();
            } else {
                console.log(Math.floor(Math.random() * this.#songs.length-1) + 1);
                this.#autoRandom();
            }
        });
        prevButton.addEventListener("click", ()=>{
            let n = this.#currentSong;
            this.#currentSong = (n == 0) ? this.#songs.length-1 : --n;
            this.renderSong(this.#currentSong);
            this.play();
        });
        loopButton.addEventListener("click", ()=>{
            if (loopButton.classList.contains("active")) {
                audioControl.loop = false;
            } else {
                audioControl.loop = true;
            }
            loopButton.classList.toggle("active");
        });
        shuffleButton.addEventListener("click", ()=>{
            shuffleButton.classList.toggle("active");
        });
        audioControl.addEventListener("playing", ()=> {
            this.#isPlayed = true;
            this.controls.classList.add("playing");
            spin.play();
            this.progress.setAttribute("max", this.#songLength());
        });
        audioControl.addEventListener("pause", ()=> {
            this.#isPlayed = false;
            this.controls.classList.remove("playing")
            spin.pause();
        });
        audioControl.addEventListener("timeupdate", ()=> {
            this.progress.value = this.percent();
        });
        audioControl.addEventListener("ended", () => {
            if (!loopButton.classList.contains("active") && !shuffleButton.classList.contains("active")) {
                this.#autoNext();
            } else if (shuffleButton.classList.contains("active")) {
                this.#autoRandom();
            }
        })
        this.progress.addEventListener("input", ()=> {
            const newPosition = this.progress.value;
            this.audioControl.currentTime = newPosition;
        });
    }
    run() {
        this.renderList();
        this.renderSong(this.#currentSong);
        this.renderEvent();
    }
}