const SONGS = [
    {
        id: 'perfect',
        title: 'Perfect',
        artist: 'Ed Sheeran',
        cover: '/icon_music/perfect.svg',
        audio: '/asset_music/perfect.mp3',
        lrc: '/asset_lyrics/perfect.lrc',
        ready: true
    },
    {
        id: 'merry-christmas-please-dont-call',
        title: 'Merry Christmas Please Don\'t Call',
        artist: 'Bleachers',
        cover: '/icon_music/don\'t-call.svg',
        audio: '/asset_music/don\'t-call.mp3',
        lrc: '/asset_lyrics/don\'t-call.lrc',
        ready: true
    },
    {
        id: 'i-miss-you',
        title: 'I Miss You',
        artist: 'Alex Crichton',
        cover: '/icon_music/i-miss-you.svg',
        audio: '/asset_music/i-miss-you.mp3',
        lrc: '/asset_lyrics/i-miss-you.lrc',
        ready: true
    },
    {
        id: 'the-1975-about-you',
        title: 'The 1975 - About You',
        artist: 'The 1975',
        cover: '/icon_music/about-you.svg',
        audio: '/asset_music/about-you.mp3',
        lrc: '/asset_lyrics/about-you.lrc',
        ready: true
    },
    {
        id: 'shape-of-my-heart',
        title: 'Shape Of My Heart',
        artist: 'Backstreet Boys',
        cover: '/icon_music/shape-of-my-heart.svg',
        audio: '/asset_music/Shape-Of-My-Heart.mp3',
        lrc: '/asset_lyrics/Shape-of-My-Heart.lrc',
        ready: true
    },
    {
        id: 'tulus-jatuh-suka',
        title: 'Tulus - Jatuh Suka',
        artist: 'Tulus',
        cover: '/icon_music/jatuh-suka-tulus.svg',
        audio: '/asset_music/jatuh-suka-tulus.mp3',
        lrc: '/asset_lyrics/jatuh-suka-tulus.lrc',
        ready: true
    },
    {
        id: 'tulus-teh-hijau',
        title: 'Tulus - Teh Hijau',
        artist: 'Tulus',
        cover: '/icon_music/teh-hijau-tulus.svg',
        audio: '/asset_music/teh-hijau-tulus.mp3',
        lrc: '/asset_lyrics/teh-hijau-tulus.lrc',
        ready: true
    },
    {
        id: 'monokrom',
        title: 'Tulus - Monokrom',
        artist: 'Tulus',
        cover: '/icon_music/monokrom.svg',
        audio: '/asset_music/monokrom.mp3',
        lrc: '/asset_lyrics/monokrom.lrc',
        ready: true
    },
    {
        id: 'bergema-sampai-selamanya',
        title: 'Bergema Sampai Selamanya',
        artist: 'Nadhif Basalamah',
        cover: '/icon_music/nadhif.svg',
        audio: '/asset_music/bergema-sampai-selamanya.mp3',
        lrc: '/asset_lyrics/bergema-sampai-selamanya.lrc',
        ready: true
    },
    {
        id: 'penjaga-hati',
        title: 'Penjaga Hati',
        artist: 'Nadhif Basalamah',
        cover: '/icon_music/nadhif.svg',
        audio: '/asset_music/penjaga-hati.mp3',
        lrc: '/asset_lyrics/penjaga-hati.lrc',
        ready: true
    },
    {
        id: 'kota-ini-tak-sama-tanpamu',
        title: 'Kota Ini Tak Sama Tanpamu',
        artist: 'Nadhif Basalamah',
        cover: '/icon_music/nadhif.svg',
        audio: '/asset_music/kota-ini-tak-sama-tanpamu.mp3',
        lrc: '/asset_lyrics/kota-ini-tak-sama-tanpamu.lrc',
        ready: true
    },
    {
        id: 'kita-lewati-berdua',
        title: 'Kita Lewati Berdua',
        artist: 'Overnight',
        cover: '/icon_music/kita-lewati-berdua.svg',
        audio: '/asset_music/kita-lewati-berdua.mp3',
        lrc: '/asset_lyrics/kita-lewati-berdua.lrc',
        ready: true
    },
    {
        id: 'everything-u-are',
        title: 'Everything U Are',
        artist: 'Hindia',
        cover: '/icon_music/everything-u-are.svg',
        audio: '/asset_music/everything-u-are.mp3',
        lrc: '/asset_lyrics/everything-u-are.lrc',
        ready: true
    },
    {
        id: 'masa-ini-nanti-dan-masa-indah-lainnya',
        title: 'Masa Ini Nanti Dan Masa Indah Lainnya',
        artist: 'Nuca',
        cover: '/icon_music/Masa-ini-Nanti-dan-Masa-Indah-Lainnya.svg',
        audio: '/asset_music/Masa-ini-Nanti-dan-Masa-Indah-Lainnya.mp3',
        lrc: '/asset_lyrics/Masa-ini-Nanti-dan-Masa-Indah-Lainnya.lrc',
        ready: true
    },
    {
        id: 'song15',
        title: 'Coming Soon',
        artist: '-',
        cover: '/icon_music/placeholder.svg',
        ready: false
    },
    {
        id: 'song16',
        title: 'Coming Soon',
        artist: '-',
        cover: '/icon_music/placeholder.svg',
        ready: false
    },
    {
        id: 'song17',
        title: 'Coming Soon',
        artist: '-',
        cover: '/icon_music/placeholder.svg',
        ready: false
    },
    {
        id: 'song18',
        title: 'Coming Soon',
        artist: '-',
        cover: '/icon_music/placeholder.svg',
        ready: false
    },
    {
        id: 'song19',
        title: 'Coming Soon',
        artist: '-',
        cover: '/icon_music/placeholder.svg',
        ready: false
    },
    {
        id: 'song20',
        title: 'Coming Soon',
        artist: '-',
        cover: '/icon_music/placeholder.svg',
        ready: false
    },
    {
        id: 'song21',
        title: 'Coming Soon',
        artist: '-',
        cover: '/icon_music/placeholder.svg',
        ready: false
    },
    {
        id: 'song22',
        title: 'Coming Soon',
        artist: '-',
        cover: '/icon_music/placeholder.svg',
        ready: false
    },
    {
        id: 'song23',
        title: 'Coming Soon',
        artist: '-',
        cover: '/icon_music/placeholder.svg',
        ready: false
    },
    {
        id: 'song24',
        title: 'Coming Soon',
        artist: '-',
        cover: '/icon_music/placeholder.svg',
        ready: false
    },
    {
        id: 'song25',
        title: 'Coming Soon',
        artist: '-',
        cover: '/icon_music/placeholder.svg',
        ready: false
    },
    {
        id: 'song26',
        title: 'Coming Soon',
        artist: '-',
        cover: '/icon_music/placeholder.svg',
        ready: false
    },
    {
        id: 'song27',
        title: 'Coming Soon',
        artist: '-',
        cover: '/icon_music/placeholder.svg',
        ready: false
    },
    {
        id: 'song28',
        title: 'Coming Soon',
        artist: '-',
        cover: '/icon_music/placeholder.svg',
        ready: false
    },
    {
        id: 'song29',
        title: 'Coming Soon',
        artist: '-',
        cover: '/icon_music/placeholder.svg',
        ready: false
    },
    {
        id: 'song30',
        title: 'Coming Soon',
        artist: '-',
        cover: '/icon_music/placeholder.svg',
        ready: false
    },

];