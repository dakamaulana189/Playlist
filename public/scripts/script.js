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

// 1. Load file .lrc secara otomatis dari folder asset_lyrics
async function loadLyrics() {
    try {
        const response = await window.fetch('/asset_lyrics/lyric.lrc');
        const lrcText = await response.text();
        parseLRC(lrcText);
    } catch (error) {
        console.error("Gagal memuat file lirik:", error);
        lyricsContainer.innerHTML = '<div class="lyric-line active">Gagal memuat lirik. Pastikan nama file .lrc sesuai!</div>';
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
playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    } else {
        audio.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
});

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
        if (index === activeLineIndex) {
            line.classList.add('active');
            // Auto scroll agar lirik aktif selalu di tengah
            line.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            line.classList.remove('active');
        }
    });
}

// Klik pada progress bar untuk lompat durasi
progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
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

// Jalankan parser saat halaman dimuat
loadLyrics();