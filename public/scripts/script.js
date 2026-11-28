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
const lyricsPlayIcon = document.querySelector('.lyrics-play-icon');
const lyricsPauseIcon = document.querySelector('.lyrics-pause-icon');
const lyricsProgressContainer = document.getElementById('lyrics-progress-container');
const lyricsProgressBar = document.getElementById('lyrics-progress-bar');
const lyricsCurrentTime = document.getElementById('lyrics-current-time');
const lyricsDuration = document.getElementById('lyrics-duration');
const lyricsVolumeSlider = document.querySelector('.lyrics-volume-slider');

function syncPlayPauseIcons() {
    const isPlaying = !audio.paused;

    playIcon.style.display = isPlaying ? 'none' : 'block';
    pauseIcon.style.display = isPlaying ? 'block' : 'none';

    if (lyricsPlayIcon && lyricsPauseIcon) {
        lyricsPlayIcon.style.display = isPlaying ? 'none' : 'block';
        lyricsPauseIcon.style.display = isPlaying ? 'block' : 'none';
    }
}

audio.addEventListener('play', syncPlayPauseIcons);
audio.addEventListener('pause', syncPlayPauseIcons);
audio.addEventListener('ended', syncPlayPauseIcons);

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

// 4. Kontrol Play / Pause Audio
// Kontrol Play / Pause untuk panel album dan panel lirik
function togglePlayback() {
    if (audio.paused) {
        audio.play().catch(error => {
            console.error('Gagal memutar audio:', error);
        });
    } else {
        audio.pause();
    }
}

playPauseBtn.addEventListener('click', togglePlayback);

document.querySelectorAll('[data-player-action="toggle"]').forEach(btn => {
    btn.addEventListener('click', togglePlayback);
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

    document.querySelectorAll('[data-player-action="shuffle"]').forEach(btn => {
        btn.classList.toggle('active', shuffleMode);
    });

    document.querySelectorAll('[data-player-action="repeat"]').forEach(btn => {
        btn.classList.toggle('active', repeatMode !== 'off');
        btn.classList.toggle('repeat-one', repeatMode === 'one');
    });
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
// Shuffle dan repeat dari panel lirik
document.querySelectorAll('[data-player-action="shuffle"]').forEach(btn => {
    btn.addEventListener('click', () => {
        shuffleMode = !shuffleMode;
        localStorage.setItem('shuffleMode', shuffleMode);
        updateControlIcons();
    });
});

document.querySelectorAll('[data-player-action="repeat"]').forEach(btn => {
    btn.addEventListener('click', () => {
        repeatMode = repeatMode === 'off'
            ? 'all'
            : repeatMode === 'all'
                ? 'one'
                : 'off';

        localStorage.setItem('repeatMode', repeatMode);
        updateControlIcons();
    });
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
// Previous dan Next dari mini player lirik
document.querySelectorAll('[data-player-action="prev"]').forEach(btn => {
    btn.addEventListener('click', () => {
        prevBtn.click();
    });
});

document.querySelectorAll('[data-player-action="next"]').forEach(btn => {
    btn.addEventListener('click', () => {
        nextBtn.click();
    });
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
    const duration = formatTime(audio.duration);

    durationEl.textContent = duration;

    if (lyricsDuration) {
        lyricsDuration.textContent = duration;
    }
});

// 5. Sinkronisasi Real-time dengan Audio CurrentTime
audio.addEventListener('timeupdate', () => {
    const currentTime = audio.currentTime;

    if (audio.duration) {
        const progressPercent = (currentTime / audio.duration) * 100;

        progressBar.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(currentTime);

        if (lyricsProgressBar) {
            lyricsProgressBar.style.width = `${progressPercent}%`;
        }
    }

    if (lyricsCurrentTime) {
        lyricsCurrentTime.textContent = formatTime(currentTime);
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
    const scrollContainer = document.querySelector('.right-column');

    if (!scrollContainer || lyricLines.length === 0) return;

    // Pulihkan highlight dan efek blur seperti kode asli
    lyricLines.forEach((line, index) => {
        const distance = Math.abs(index - activeLineIndex);

        if (index === activeLineIndex) {
            line.classList.add('active');
            line.style.filter = 'blur(0px)';
        } else {
            line.classList.remove('active');

            const blurAmount = Math.min(distance * 1.2, 4);
            line.style.filter = `blur(${blurAmount}px)`;
        }
    });

    // Desktop: auto-scroll selalu aktif.
    // HP: auto-scroll hanya ketika panel lirik dibuka.
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isLyricsVisible = musicContainer.classList.contains('show-lyrics');

    if (isMobile && !isLyricsVisible) return;

    const activeLine = lyricsContainer.querySelector('.lyric-line.active');

    if (!activeLine) return;

    // Scroll hanya area lirik, bukan seluruh halaman
    const lineRect = activeLine.getBoundingClientRect();
    const containerRect = scrollContainer.getBoundingClientRect();

    const targetScroll =
        scrollContainer.scrollTop +
        lineRect.top -
        containerRect.top -
        (scrollContainer.clientHeight - lineRect.height) / 2;

    scrollContainer.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
    });
}



// Klik pada progress bar untuk lompat durasi
progressContainer.addEventListener('click', (e) => {
    if (!audio.duration) return;

    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));

    audio.currentTime = percentage * audio.duration;
});

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
// Seek lagu melalui progress bar pada panel lirik
if (lyricsProgressContainer) {
    lyricsProgressContainer.addEventListener('click', (e) => {
        if (!audio.duration) return;

        const rect = lyricsProgressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));

        audio.currentTime = percentage * audio.duration;
    });
}

// =========================================
// NAVIGASI PANEL ALBUM DAN LIRIK
// =========================================

const musicContainer = document.querySelector('.music-container');
const showLyricsBtn = document.getElementById('show-lyrics-btn');

// ==== Navigasi Panel Album dan Lirik ====
const backBtn = document.getElementById('back-to-player');

if (showLyricsBtn) {
    showLyricsBtn.addEventListener('click', () => {
        musicContainer.classList.add('show-lyrics');
    });
}

if (backBtn) {
    backBtn.addEventListener('click', () => {
        musicContainer.classList.remove('show-lyrics');
    });
}


// Kembali ke panel album
if (backBtn) {
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

    if (lyricsVolumeSlider) {
        lyricsVolumeSlider.value = volumeSlider.value;
    }

    localStorage.setItem('playerVolume', audio.volume);
    updateVolumeIcon();
});
// Volume dari panel lirik
if (lyricsVolumeSlider) {
    lyricsVolumeSlider.value = audio.volume * 100;

    lyricsVolumeSlider.addEventListener('input', () => {
        audio.volume = lyricsVolumeSlider.value / 100;
        volumeSlider.value = lyricsVolumeSlider.value;

        localStorage.setItem('playerVolume', audio.volume);
        updateVolumeIcon();
    });
}

// Klik ikon speaker: toggle mute/unmute cepat
let lastVolumeBeforeMute = 1;
volumeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.volume > 0) {
        lastVolumeBeforeMute = audio.volume;
        audio.volume = 0;
    } else {
        audio.volume = lastVolumeBeforeMute;
    }
    volumeSlider.value = audio.volume * 100;
    if (lyricsVolumeSlider) {
        lyricsVolumeSlider.value = audio.volume * 100;
    }
    localStorage.setItem('playerVolume', audio.volume);
    updateVolumeIcon();
});

// Dukungan tap di mobile (hover gak ada di touch device)
volumeBtn.addEventListener('touchstart', (e) => {
    e.stopPropagation();
}, { passive: true });

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