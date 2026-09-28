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
        backgroundColor: 0x7192f,
        color1: 0xff3366,
        color2: 0xff6688,
        birdSize: 1.20,
        wingSpan: 25.00,
        speedLimit: 4.00,
        separation: 20.00,
        alignment: 20.00,
        cohesion: 20.00,
        quantity: 3.50
    });
});

const grid = document.getElementById('song-grid');

SONGS.forEach(song => {
    const card = document.createElement(song.ready ? 'a' : 'div');
    card.className = 'song-card' + (song.ready ? '' : ' disabled');

    if (song.ready) {
        card.href = `/lirik.html?song=${song.id}`;
    }

    card.innerHTML = `
        <div class="song-card-cover">
            <img src="${song.cover}" alt="${song.title}">
        </div>
        <p class="song-card-title">${song.title}</p>
    `;

    grid.appendChild(card);
});