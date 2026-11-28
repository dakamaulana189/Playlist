// Inisialisasi Background Animasi Vanta.js (Birds)
window.addEventListener('DOMContentLoaded', () => {
    VANTA.BIRDS({
        el: "body",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        backgroundColor: 0x7192f, // Warna dasar merah tua gelap
        color1: 0xff3366,          // Warna aksen burung pertama
        color2: 0xff6688,          // Warna aksen burung kedua
        birdSize: 1.20,
        wingSpan: 25.00,
        speedLimit: 4.00,
        separation: 20.00,
        alignment: 20.00,
        cohesion: 20.00,
        quantity: 3.50
    });
});
const audio = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const lyricsContainer = document.getElementById('lyrics-container');

let lyricsData = [];
let activeLineIndex = -1;

// Ambil lagu yang dipilih dari URL, fallback ke lagu pertama yang ready
const params = new URLSearchParams(window.location.search);
const songId = params.get('song');
const currentSong = SONGS.find(s => s.id === songId && s.ready) || SONGS.find(s => s.ready);

document.getElementById('album-cover').src = currentSong.cover;
document.querySelector('.song-title').textContent = currentSong.title;
document.querySelector('.artist-name').textContent = currentSong.artist;
audio.src = currentSong.audio;

// 1. Load file .lrc secara otomatis dari folder asset_lyrics
async function loadLyrics() {

    try {
        const response = await window.fetch(currentSong.lrc);
        const lrcText = await response.text();
        parseLRC(lrcText);
    } catch (error) {
        console.error("Gagal memuat file lirik:", error);
        lyricsContainer.innerHTML = '<div class="lyric-line active">Gagal memuat lirik.</div>';
    }
}


// 2. Parser format .lrc standar [MM:SS.xxx]
function parseLRC(text) {
    const lines = text.split('\n');
    lyricsData = [];

    const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

    lines.forEach(line => {
        const match = timeReg.exec(line);
        if (match) {
            const minutes = parseInt(match[1], 10);
            const seconds = parseInt(match[2], 10);
            const milliseconds = parseInt(match[3].padEnd(3, '0'), 10);

            const timeInSeconds = minutes * 60 + seconds + milliseconds / 1000;
            const textContent = line.replace(timeReg, '').trim();

            if (textContent) {
                lyricsData.push({ time: timeInSeconds, text: textContent });
            }
        }
    });

    renderLyrics();
}

// 3. Render lirik ke HTML
function renderLyrics() {
    lyricsContainer.innerHTML = '';
    lyricsData.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'lyric-line';
        div.textContent = item.text;
        div.dataset.index = index;

        // Klik lirik bisa lompat ke detik tersebut
        div.addEventListener('click', () => {
            audio.currentTime = item.time;
            audio.play();
        });

        lyricsContainer.appendChild(div);
    });
}

// Sinkronisasi ikon selalu mengikuti kondisi audio sebenarnya.
// Ini juga menangani pause/play dari kontrol sistem atau perangkat.
function syncPlaybackIcons() {
    const isPlaying = !audio.paused && !audio.ended;
    playIcon.style.display = isPlaying ? 'none' : 'block';
    pauseIcon.style.display = isPlaying ? 'block' : 'none';
}

audio.addEventListener('play', syncPlaybackIcons);
audio.addEventListener('pause', syncPlaybackIcons);
audio.addEventListener('ended', syncPlaybackIcons);
syncPlaybackIcons();

// 4. Kontrol Play / Pause Audio
playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play().catch(error => {
            console.warn('Audio tidak dapat diputar:', error);
        });
    } else {
        audio.pause();
    }
});
// ==== Playback controls: shuffle, prev/next, repeat ====
const readySongs = SONGS.filter(s => s.ready);
const shuffleBtn = document.getElementById('shuffle-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const repeatBtn = document.getElementById('repeat-btn');

let shuffleMode = localStorage.getItem('shuffleMode') === 'true';
let repeatMode = localStorage.getItem('repeatMode') || 'off'; // 'off' | 'all' | 'one'

function updateControlIcons() {
    shuffleBtn.classList.toggle('active', shuffleMode);
    repeatBtn.classList.toggle('active', repeatMode !== 'off');
    repeatBtn.classList.toggle('repeat-one', repeatMode === 'one');
}
updateControlIcons();

shuffleBtn.addEventListener('click', () => {
    shuffleMode = !shuffleMode;
    localStorage.setItem('shuffleMode', shuffleMode);
    updateControlIcons();
});

repeatBtn.addEventListener('click', () => {
    repeatMode = repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off';
    localStorage.setItem('repeatMode', repeatMode);
    updateControlIcons();
});

function getCurrentIndex() {
    return readySongs.findIndex(s => s.id === currentSong.id);
}

function getRandomIndex(excludeIndex) {
    if (readySongs.length <= 1) return excludeIndex;
    let idx;
    do {
        idx = Math.floor(Math.random() * readySongs.length);
    } while (idx === excludeIndex);
    return idx;
}

function goToSong(index, autoplay) {
    const target = readySongs[index];
    if (!target) return;
    window.location.href = `/lirik.html?song=${target.id}${autoplay ? '&autoplay=1' : ''}`;
}

prevBtn.addEventListener('click', () => {
    const idx = getCurrentIndex();
    const targetIndex = shuffleMode
        ? getRandomIndex(idx)
        : (idx - 1 < 0 ? readySongs.length - 1 : idx - 1);
    goToSong(targetIndex, !audio.paused);
});

nextBtn.addEventListener('click', () => {
    const idx = getCurrentIndex();
    const targetIndex = shuffleMode
        ? getRandomIndex(idx)
        : (idx + 1 >= readySongs.length ? 0 : idx + 1);
    goToSong(targetIndex, !audio.paused);
});

// Lagu selesai diputar
audio.addEventListener('ended', () => {
    if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
        return;
    }

    const idx = getCurrentIndex();
    const isLastSong = idx === readySongs.length - 1;

    if (repeatMode === 'off' && !shuffleMode && isLastSong) {
        // Playlist habis, berhenti di lagu terakhir
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        return;
    }

    const targetIndex = shuffleMode ? getRandomIndex(idx) : (idx + 1) % readySongs.length;
    goToSong(targetIndex, true);
});

// Autoplay kalau halaman ini dibuka dari next/prev/lagu selesai/klik beranda
if (params.get('autoplay') === '1') {
    audio.addEventListener('loadedmetadata', () => {
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    playIcon.style.display = 'none';
                    pauseIcon.style.display = 'block';
                })
                .catch(() => {
                    // Autoplay diblokir browser, biarin user klik manual
                    console.warn('Autoplay diblokir, tunggu interaksi user.');
                });
        }
    }, { once: true });
}

// Format waktu menit:detik
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
});

// 5. Sinkronisasi Real-time dengan Audio CurrentTime
audio.addEventListener('timeupdate', () => {
    const currentTime = audio.currentTime;

    // Update progress bar
    if (audio.duration) {
        const progressPercent = (currentTime / audio.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(currentTime);
    }

    // Cari baris lirik aktif berdasarkan detik lagu
    let currentIndex = -1;
    for (let i = 0; i < lyricsData.length; i++) {
        if (currentTime >= lyricsData[i].time) {
            currentIndex = i;
        } else {
            break;
        }
    }

    if (currentIndex !== activeLineIndex) {
        activeLineIndex = currentIndex;
        updateActiveLyricUI();
    }
});

// 6. Highlight dan Auto-Scroll Lirik
function updateActiveLyricUI() {
    const lyricLines = lyricsContainer.querySelectorAll('.lyric-line');

    lyricLines.forEach((line, index) => {
        const distance = Math.abs(index - activeLineIndex);

        if (index === activeLineIndex) {
            line.classList.add('active');
            line.style.filter = 'blur(0px)';
            line.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            line.classList.remove('active');
            const blurAmount = Math.min(distance * 1.2, 4);
            line.style.filter = `blur(${blurAmount}px)`;
        }
    });
}

// Seek progress bar menggunakan Pointer Events (mouse, stylus, dan touch).
// Posisi dihitung dari bounding box agar akurat saat disentuh di HP.
function seekAudioFromPointer(e) {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

    const rect = progressContainer.getBoundingClientRect();
    const positionX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const percentage = rect.width > 0 ? positionX / rect.width : 0;

    audio.currentTime = percentage * audio.duration;
}

let isSeekingProgress = false;

progressContainer.addEventListener('pointerdown', (e) => {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

    isSeekingProgress = true;
    progressContainer.setPointerCapture(e.pointerId);
    seekAudioFromPointer(e);
});

progressContainer.addEventListener('pointermove', (e) => {
    if (isSeekingProgress) {
        seekAudioFromPointer(e);
    }
});

function stopProgressSeeking() {
    isSeekingProgress = false;
}

progressContainer.addEventListener('pointerup', stopProgressSeeking);
progressContainer.addEventListener('pointercancel', stopProgressSeeking);
progressContainer.addEventListener('lostpointercapture', stopProgressSeeking);

const timeTooltip = document.getElementById('time-tooltip');

// Menampilkan tooltip waktu dinamis saat kursor digeser di atas progress bar
progressContainer.addEventListener('mousemove', (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = progressContainer.clientWidth;

    let percentage = clickX / width;
    percentage = Math.max(0, Math.min(1, percentage)); // Batasi antara 0 dan 1

    const hoverTime = percentage * audio.duration;

    // Set teks tooltip dan posisinya mengikuti kursor
    timeTooltip.textContent = formatTime(hoverTime);
    timeTooltip.style.left = `${clickX}px`;
});

// Navigasi tampilan mobile hanya melalui tombol.
// Tidak ada gesture swipe agar sentuhan/scroll lirik tidak mengganti halaman.
const musicContainer = document.querySelector('.music-container');
const showLyricsBtn = document.getElementById('show-lyrics-btn');
const backBtn = document.getElementById('back-to-player');

if (showLyricsBtn && musicContainer) {
    showLyricsBtn.addEventListener('click', () => {
        musicContainer.classList.add('show-lyrics');
    });
}

if (backBtn && musicContainer) {
    backBtn.addEventListener('click', () => {
        musicContainer.classList.remove('show-lyrics');
    });
}
// ==== Kontrol Volume ====
const volumeBtn = document.getElementById('volume-btn');
const volumeIcon = document.getElementById('volume-icon');
const muteIcon = document.getElementById('mute-icon');
const volumeSlider = document.getElementById('volume-slider');
const volumeWrapper = document.querySelector('.volume-wrapper');

// Load volume tersimpan, default 100%
const savedVolume = localStorage.getItem('playerVolume');
audio.volume = savedVolume !== null ? parseFloat(savedVolume) : 1;
volumeSlider.value = audio.volume * 100;

function updateVolumeIcon() {
    const isMuted = audio.volume === 0;
    volumeIcon.style.display = isMuted ? 'none' : 'block';
    muteIcon.style.display = isMuted ? 'block' : 'none';
}
updateVolumeIcon();

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value / 100;
    localStorage.setItem('playerVolume', audio.volume);
    updateVolumeIcon();
});

// Volume:
// - Desktop: klik ikon tetap berfungsi sebagai mute/unmute.
// - Mobile: tap ikon membuka panel slider karena perangkat touch tidak punya hover.
let lastVolumeBeforeMute = audio.volume > 0 ? audio.volume : 1;

volumeBtn.addEventListener('click', (e) => {
    e.stopPropagation();

    const isMobileLayout = window.matchMedia('(max-width: 768px)').matches;

    if (isMobileLayout) {
        volumeWrapper.classList.toggle('open');
        return;
    }

    if (audio.volume > 0) {
        lastVolumeBeforeMute = audio.volume;
        audio.volume = 0;
    } else {
        audio.volume = lastVolumeBeforeMute;
    }

    volumeSlider.value = audio.volume * 100;
    localStorage.setItem('playerVolume', audio.volume);
    updateVolumeIcon();
});

volumeWrapper.addEventListener('click', (e) => {
    e.stopPropagation();
});

document.addEventListener('click', (e) => {
    if (!volumeWrapper.contains(e.target)) {
        volumeWrapper.classList.remove('open');
    }
});
// ==== Fullscreen ====
const fullscreenBtn = document.getElementById('fullscreen-btn');
const expandIcon = document.getElementById('expand-icon');
const collapseIcon = document.getElementById('collapse-icon');

function updateFullscreenIcon() {
    const isFullscreen = !!document.fullscreenElement;
    expandIcon.style.display = isFullscreen ? 'none' : 'block';
    collapseIcon.style.display = isFullscreen ? 'block' : 'none';
}

fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error('Gagal masuk fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
    }
});

// Sinkronisasi ikon kalau user keluar fullscreen pakai Esc (bukan lewat tombol)
document.addEventListener('fullscreenchange', updateFullscreenIcon);
// Jalankan parser saat halaman dimuat
loadLyrics();