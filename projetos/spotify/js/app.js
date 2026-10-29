/* Interface: roteamento, telas, player, biblioteca, fila e menus. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // ---------- ícones ----------
  const S = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  const SPEAKER = '<path d="M11 4.5 6.5 8H3.5a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h3l4.5 3.5z"/>';
  const HEART = 'M12 20.5s-8.5-5.1-8.5-11A4.75 4.75 0 0 1 12 6.6a4.75 4.75 0 0 1 8.5 2.9c0 5.9-8.5 11-8.5 11z';
  const ICONS = {
    home: '<path d="M12.5 3.25a1 1 0 0 0-1 0l-7.5 4.33A2 2 0 0 0 3 9.31V21h6v-6h6v6h6V9.31a2 2 0 0 0-1-1.73z"/>',
    homeOutline: '<path d="M12.5 3.25a1 1 0 0 0-1 0l-7.5 4.33A2 2 0 0 0 3 9.31V21h7v-6h4v6h7V9.31a2 2 0 0 0-1-1.73zM19 19h-3v-6H8v6H5V9.31l7-4.04 7 4.04z"/>',
    search: '<path d="M10.53 2a8.53 8.53 0 1 0 5.29 15.22l4.47 4.48 1.42-1.42-4.48-4.47A8.53 8.53 0 0 0 10.53 2zM4 10.53a6.53 6.53 0 1 1 13.06 0 6.53 6.53 0 0 1-13.06 0z"/>',
    browse: `<rect x="3" y="4" width="18" height="16" rx="2" ${S}/><path d="M3 9h18M9 9v11" ${S}/>`,
    library: '<path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.13A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.46a1 1 0 0 0-.5-.87zM16 20V4.73l4 2.31V20zM8 2a1 1 0 0 1 1 1v18a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1z"/>',
    plus: '<path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7z"/>',
    play: '<path d="M7.05 3.6A1 1 0 0 0 5.5 4.44v15.12a1 1 0 0 0 1.55.84l11.6-7.56a1 1 0 0 0 0-1.68z"/>',
    pause: '<rect x="5.5" y="3.5" width="4.5" height="17" rx="1"/><rect x="14" y="3.5" width="4.5" height="17" rx="1"/>',
    next: '<path d="M17.7 3a.7.7 0 0 0-.7.7v6.8L6.05 3.6A1 1 0 0 0 4.5 4.44v15.12a1 1 0 0 0 1.55.84L17 13.5v6.8a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7z"/>',
    prev: '<path d="M6.3 3a.7.7 0 0 1 .7.7v6.8l10.95-6.9a1 1 0 0 1 1.55.84v15.12a1 1 0 0 1-1.55.84L7 13.5v6.8a.7.7 0 0 1-.7.7H4.7a.7.7 0 0 1-.7-.7V3.7a.7.7 0 0 1 .7-.7z"/>',
    shuffle: `<path d="M3 17h3.5c1.5 0 2.7-.8 3.5-2l4-6c.8-1.2 2-2 3.5-2H21M17.5 4 21 7l-3.5 3M3 7h3.5c1.5 0 2.7.8 3.5 2M21 17h-3.5c-1.5 0-2.7-.8-3.5-2M17.5 14l3.5 3-3.5 3" ${S} stroke-width="2"/>`,
    repeat: `<path d="M7 4 4 7l3 3M4 7h12a4 4 0 0 1 4 4v1M17 20l3-3-3-3M20 17H8a4 4 0 0 1-4-4v-1" ${S} stroke-width="2"/>`,
    repeatOne: `<path d="M7 4 4 7l3 3M4 7h12a4 4 0 0 1 4 4v1M17 20l3-3-3-3M20 17H8a4 4 0 0 1-4-4v-1" ${S} stroke-width="2"/><path d="M11 10.6l1.3-1V14.5" ${S} stroke-width="1.7"/>`,
    heart: `<path d="${HEART}" ${S}/>`,
    heartFill: `<path d="${HEART}"/>`,
    addCircle: `<circle cx="12" cy="12" r="9.2" ${S} stroke-width="1.6"/><path d="M11.2 7.5h1.6v3.7h3.7v1.6h-3.7v3.7h-1.6v-3.7H7.5v-1.6h3.7z"/>`,
    check: '<circle cx="12" cy="12" r="10"/><path d="m7.5 12.2 3 3 6-6.2" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    more: '<circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/>',
    clock: `<circle cx="12" cy="12" r="9" ${S} stroke-width="1.6"/><path d="M12 7v5.3l3.2 2" ${S} stroke-width="1.6"/>`,
    volume: `${SPEAKER}<path d="M15 8.5a5 5 0 0 1 0 7M17.8 5.7a9 9 0 0 1 0 12.6" ${S}/>`,
    volLow: `${SPEAKER}<path d="M15 8.5a5 5 0 0 1 0 7" ${S}/>`,
    mute: `${SPEAKER}<path d="m15 9.5 5 5m0-5-5 5" ${S}/>`,
    queue: '<path d="M3 5h13v2H3zM3 11h13v2H3zM3 17h8v2H3z"/><circle cx="15.5" cy="17.5" r="2.5"/><path d="M16.2 6h5.3v3h-3.3v8.5h-2z"/>',
    nowPlaying: `<rect x="3" y="3" width="18" height="18" rx="2.5" ${S}/><path d="M14.5 3v18" ${S}/><circle cx="8.8" cy="10" r="2"/><path d="M5.8 16.5c.3-2 1.5-3 3-3s2.7 1 3 3z"/>`,
    close: `<path d="m6 6 12 12M18 6 6 18" ${S} stroke-width="2"/>`,
    chevLeft: `<path d="m15 5-7 7 7 7" ${S} stroke-width="2.2"/>`,
    chevRight: `<path d="m9 5 7 7-7 7" ${S} stroke-width="2.2"/>`,
    note: `<path d="M9 18V5.5l11-2V16" ${S}/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>`,
    pencil: `<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z" ${S} stroke-width="1.6"/>`,
    trash: `<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13" ${S}/>`,
    share: `<path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M5 12v8h14v-8" ${S}/>`,
    user: `<circle cx="12" cy="8" r="4" ${S}/><path d="M4 21c.8-4 4-6 8-6s7.2 2 8 6" ${S}/>`,
    album: `<circle cx="12" cy="12" r="9" ${S}/><circle cx="12" cy="12" r="2.5"/>`,
    addQueue: '<path d="M3 5h13v2H3zM3 11h13v2H3zM3 17h8v2H3zM18 13h2v3h3v2h-3v3h-2v-3h-3v-2h3z"/>',
    bell: `<path d="M6 16v-5a6 6 0 1 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0" ${S}/>`,
    list: `<path d="M4 6h16M4 12h11M4 18h6" ${S}/>`,
    pin: '<path d="M8.8 2.5h6.4l-.9 6 3.2 3.5v1.5H6.5V12l3.2-3.5zM11.2 13.5h1.6V21l-.8 1-.8-1z"/>',
    verified: '<path d="m12 1.5 2.6 2 3.3-.2.9 3.2 2.8 1.8-1.2 3.1 1.2 3.1-2.8 1.8-.9 3.2-3.3-.2-2.6 2-2.6-2-3.3.2-.9-3.2-2.8-1.8 1.2-3.1-1.2-3.1 2.8-1.8.9-3.2 3.3.2z" fill="#4cb3ff"/><path d="m8 12 2.7 2.7L16.3 9" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    expand: `<path d="M4 14v6h6M20 10V4h-6M4 20l6-6M20 4l-6 6" ${S}/>`,
  };
  const LOGO = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#1ed760"/><path d="M6 9.2c4-1.2 8.6-.9 12 1.1M6.6 12.6c3.3-.9 7-.6 9.9 1M7.2 15.8c2.6-.7 5.4-.4 7.7.8" stroke="#000" stroke-width="1.8" stroke-linecap="round" fill="none"/></svg>';
  const ic = (name, size = 24, cls = '') =>
    `<svg class="ic ${cls}" viewBox="0 0 24 24" width="${size}" height="${size}" fill="currentColor" fill-rule="evenodd" aria-hidden="true">${ICONS[name] || ''}</svg>`;

  // ---------- persistência ----------
  const store = {
    get(k, d) {
      try {
        const v = localStorage.getItem('spc:' + k);
        return v == null ? d : JSON.parse(v);
      } catch {
        return d;
      }
    },
    set(k, v) {
      try { localStorage.setItem('spc:' + k, JSON.stringify(v)); } catch { /* armazenamento indisponível */ }
    },
  };

  const DAY = 86400000;
  const DEFAULT_LIBRARY = [
    { type: 'playlist', id: 'descobertas', at: Date.now() - 2 * DAY },
    { type: 'playlist', id: 'lofi-beats', at: Date.now() - 5 * DAY },
    { type: 'artist', id: 'neon-lagoa', at: Date.now() - 8 * DAY },
    { type: 'album', id: 'pista-infinita', at: Date.now() - 12 * DAY },
    { type: 'artist', id: 'clara-vento', at: Date.now() - 20 * DAY },
  ];

  const state = {
    liked: store.get('liked', []),
    playlists: store.get('playlists', []),
    library: store.get('library', DEFAULT_LIBRARY),
    recent: store.get('recent', []),
    volume: store.get('volume', 0.7),
    muted: false,
    shuffle: store.get('shuffle', false),
    repeat: store.get('repeat', 0),
    rightOpen: store.get('rightOpen', true),
    libCollapsed: store.get('libCollapsed', false),
    current: store.get('current', null),
    context: store.get('context', null),
    queue: [], original: [], pos: -1, userQueue: [],
    loading: false, loadedId: null,
    libFilter: 'all', libQuery: '', libSearchOpen: false,
    searchFilter: 'all', homeFilter: 'all', artistExpanded: false,
    tmp: {}, viewMeta: {},
  };

  function persist() {
    store.set('liked', state.liked);
    store.set('playlists', state.playlists);
    store.set('library', state.library);
    store.set('recent', state.recent);
    store.set('volume', state.volume);
    store.set('shuffle', state.shuffle);
    store.set('repeat', state.repeat);
    store.set('rightOpen', state.rightOpen);
    store.set('libCollapsed', state.libCollapsed);
    store.set('current', state.current);
    store.set('context', state.context);
  }

  // ---------- entidades ----------
  const userPl = id => state.playlists.find(p => p.id === id);
  const isLiked = id => state.liked.some(x => x.id === id);
  const inLibrary = (type, id) => state.library.some(x => x.type === type && x.id === id);

  function ent(type, id) {
    if (type === 'album') {
      const a = DB.album(id);
      if (!a) return null;
      const ar = DB.artist(a.artistId);
      return { type, id, key: `album:${id}`, href: `#/album/${id}`, title: a.title, subtitle: `${a.year} • ${ar.name}`, libSub: `Álbum • ${ar.name}`, label: a.type, tracks: a.tracks, hue: a.hue, cover: a.cover, data: a, artist: ar };
    }
    if (type === 'artist') {
      const a = DB.artist(id);
      if (!a) return null;
      return { type, id, key: `artist:${id}`, href: `#/artist/${id}`, title: a.name, subtitle: 'Artista', libSub: 'Artista', label: 'Artista', tracks: DB.topTracks(id), hue: a.hue, cover: a.image, round: true, data: a };
    }
    if (type === 'playlist') {
      const u = userPl(id);
      if (u) return { type, id, key: `playlist:${id}`, href: `#/playlist/${id}`, title: u.name, subtitle: 'De Você', libSub: 'Playlist • Você', label: 'Playlist', desc: u.desc, tracks: u.tracks.map(x => x.id), hue: u.hue, user: true, data: u };
      const p = DB.playlist(id);
      if (!p) return null;
      return { type, id, key: `playlist:${id}`, href: `#/playlist/${id}`, title: p.title, subtitle: p.desc, libSub: 'Playlist • Spotify', label: 'Playlist', desc: p.desc, tracks: p.tracks, hue: p.hue, cover: p.cover, data: p };
    }
    if (type === 'liked') {
      const n = state.liked.length;
      return { type, id: 'liked', key: 'liked:liked', href: '#/liked', title: 'Músicas Curtidas', subtitle: `Playlist • ${n} ${n === 1 ? 'música' : 'músicas'}`, libSub: `Playlist • ${n} ${n === 1 ? 'música' : 'músicas'}`, label: 'Playlist', tracks: state.liked.map(x => x.id), hue: 252, liked: true };
    }
    if (type === 'genre') {
      const g = DB.GENRES[id];
      if (!g) return null;
      return { type, id, key: `genre:${id}`, href: `#/genre/${id}`, title: g.name, subtitle: 'Gênero', label: 'Gênero', tracks: DB.genreTracks(id), color: g.color };
    }
    if (type === 'tmp') return { type, id, key: `tmp:${id}`, href: '#/search', title: 'Busca', tracks: state.tmp[id] || [] };
    return null;
  }

  function entFromKey(key) {
    if (!key) return null;
    const i = key.indexOf(':');
    return ent(key.slice(0, i), key.slice(i + 1));
  }

  const headerColor = e => e.color || `hsl(${Math.round(e.hue)} 42% 36%)`;

  function coverHTML(e) {
    if (e.liked) return `<div class="cov cov-liked">${ic('heartFill')}</div>`;
    if (e.user) {
      const covers = [...new Set(e.tracks.map(id => DB.track(id)?.cover).filter(Boolean))];
      if (covers.length >= 4) return `<div class="cov cov-mosaic">${covers.slice(0, 4).map(src => `<img src="${src}" alt="">`).join('')}</div>`;
      if (covers.length) return `<img class="cov" src="${covers[0]}" alt="">`;
      return `<div class="cov cov-empty">${ic('note')}</div>`;
    }
    if (e.type === 'genre') return `<div class="cov" style="background:${e.color}"></div>`;
    return `<img class="cov" src="${e.cover}" alt="" loading="lazy" draggable="false">`;
  }

  function contextTracks(key) {
    const e = entFromKey(key);
    return e ? e.tracks.filter(id => DB.track(id)) : [];
  }

  // ---------- componentes ----------
  const playBtn = (key, cls = '') =>
    `<button class="play-btn ${cls}" data-play-context="${key}" aria-label="Tocar">${ic('play')}</button>`;

  const likeBtn = (id, cls = '') => {
    const on = isLiked(id);
    return `<button class="icon-btn like ${cls} ${on ? 'on' : ''}" data-like="${id}" aria-label="${on ? 'Remover de Músicas Curtidas' : 'Salvar em Músicas Curtidas'}">${ic(on ? 'heartFill' : 'heart', 16)}</button>`;
  };

  function saveBtn(e) {
    if (e.user || e.liked || e.type === 'genre' || e.type === 'tmp') return '';
    const on = inLibrary(e.type, e.id);
    if (e.type === 'artist') return `<button class="pill outline follow-btn" data-save="artist:${e.id}">${on ? 'Seguindo' : 'Seguir'}</button>`;
    return `<button class="icon-btn lg save-btn ${on ? 'on' : ''}" data-save="${e.type}:${e.id}" title="${on ? 'Remover da Sua Biblioteca' : 'Salvar na Sua Biblioteca'}">${ic(on ? 'check' : 'addCircle', 32)}</button>`;
  }

  function card(e) {
    return `<div class="card" data-href="${e.href}" data-key="${e.key}">
      <div class="card-cover ${e.round ? 'round' : ''}">${coverHTML(e)}${e.tracks.length ? playBtn(e.key, 'card-play') : ''}</div>
      <div class="card-title">${esc(e.title)}</div>
      <div class="card-sub">${esc(e.subtitle)}</div>
    </div>`;
  }

  function shelf(title, items, { href, wrap = false } = {}) {
    if (!items.length) return '';
    return `<section class="shelf">
      <div class="shelf-head"><h2>${href ? `<a href="${href}">${esc(title)}</a>` : esc(title)}</h2>${href ? `<a class="show-all" href="${href}">Mostrar tudo</a>` : ''}</div>
      <div class="cards ${wrap ? 'wrap' : 'one-row'}">${items.map(card).join('')}</div>
    </section>`;
  }

  function trackList(ids, { ctx, album = true, cover = true, added = null, playlistId = null, plays = false, header = true, idxBase = 0, numBase = 0 } = {}) {
    const cls = ['tracklist', album && 'has-album', added && 'has-added', plays && 'has-plays'].filter(Boolean).join(' ');
    const head = header
      ? `<div class="tl-head"><div class="c-num">#</div><div>Título</div>${plays ? '<div class="c-plays">Reproduções</div>' : ''}${album ? '<div class="c-album">Álbum</div>' : ''}${added ? '<div class="c-added">Adicionada em</div>' : ''}<div class="c-dur">${ic('clock', 16)}</div></div>`
      : '';
    const rows = ids.map((id, i) => {
      const t = DB.track(id);
      if (!t) return '';
      const ar = DB.artist(t.artistId), al = DB.album(t.albumId);
      return `<div class="row" data-track="${t.id}" data-ctx="${ctx}" data-idx="${idxBase + i}" ${playlistId ? `data-pl="${playlistId}"` : ''}>
        <div class="c-num"><span class="num">${numBase + i + 1}</span><span class="eq"><i></i><i></i><i></i><i></i></span><button class="row-play" data-row-play aria-label="Tocar ${esc(t.title)}">${ic('play', 16)}</button></div>
        <div class="c-title">${cover ? `<img src="${t.cover}" alt="" loading="lazy">` : ''}<div class="t-text"><div class="t-name">${esc(t.title)}</div><div class="t-artist"><a href="#/artist/${ar.id}">${esc(ar.name)}</a></div></div></div>
        ${plays ? `<div class="c-plays">${fmtNum(t.plays)}</div>` : ''}
        ${album ? `<div class="c-album"><a href="#/album/${al.id}">${esc(al.title)}</a></div>` : ''}
        ${added ? `<div class="c-added">${fmtDate(added[t.id] ?? Date.now())}</div>` : ''}
        <div class="c-dur">${likeBtn(t.id, 'row-like')}<span>${fmtTime(t.duration)}</span><button class="icon-btn row-more" data-more aria-label="Mais opções">${ic('more', 16)}</button></div>
      </div>`;
    }).join('');
    return `<div class="${cls}">${head}${rows}</div>`;
  }

  function addedMap(e) {
    const m = {};
    if (e.liked) state.liked.forEach(x => (m[x.id] = x.at));
    else if (e.user) e.data.tracks.forEach(x => (m[x.id] = x.at));
    else if (e.type === 'playlist') {
      const r = rng(hashStr('added:' + e.id));
      e.tracks.forEach(id => (m[id] = Date.now() - Math.floor(r() * 90 + 1) * DAY));
    } else return null;
    return m;
  }

  const titleSize = s => (s.length > 28 ? 'sm' : s.length > 16 ? 'md' : 'lg');

  // ---------- telas ----------
  function setView(html, { title = '', color = null, playKey = null, threshold = 280 } = {}) {
    $('#view').innerHTML = html;
    state.viewMeta = { title, color, playKey, threshold };
    const head = $('#stickyHead');
    if (color) {
      head.hidden = false;
      head.style.setProperty('--c', color);
      head.innerHTML = `${playKey ? playBtn(playKey, 'sm') : ''}<span class="sh-title">${esc(title)}</span>`;
    } else {
      head.hidden = true;
      head.innerHTML = '';
    }
  }

  function greeting() {
    const h = new Date().getHours();
    return h < 5 ? 'Boa noite' : h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  }

  function homeSections() {
    const pls = g => DB.playlists.filter(p => p.group === g).map(p => ent('playlist', p.id));
    return [
      { key: 'made', title: 'Feito para você', items: pls('made'), kinds: ['playlists'] },
      { key: 'recent', title: 'Tocados recentemente', items: state.recent.map(entFromKey).filter(Boolean), kinds: ['music', 'playlists', 'artists'] },
      { key: 'albums', title: 'Álbuns populares', items: DB.albums.slice().sort((a, b) => b.plays - a.plays).map(a => ent('album', a.id)), kinds: ['music'] },
      { key: 'artists', title: 'Artistas populares', items: DB.artists.slice().sort((a, b) => b.listeners - a.listeners).map(a => ent('artist', a.id)), kinds: ['artists'] },
      { key: 'editorial', title: 'Playlists em destaque', items: pls('editorial'), kinds: ['playlists'] },
      { key: 'new', title: 'Lançamentos para você', items: DB.albums.filter(a => a.year >= 2025).map(a => ent('album', a.id)), kinds: ['music'] },
    ];
  }

  function renderHome() {
    const quick = [];
    const seen = new Set();
    const push = e => { if (e && !seen.has(e.key) && quick.length < 8) { seen.add(e.key); quick.push(e); } };
    if (state.liked.length) push(ent('liked'));
    state.recent.forEach(k => push(entFromKey(k)));
    DB.playlists.forEach(p => push(ent('playlist', p.id)));

    const f = state.homeFilter;
    const chips = [['all', 'Tudo'], ['music', 'Música'], ['playlists', 'Playlists'], ['artists', 'Artistas']]
      .map(([k, l]) => `<button class="chip ${f === k ? 'active' : ''}" data-action="home-filter" data-f="${k}">${l}</button>`).join('');
    const sections = homeSections().filter(s => f === 'all' || s.kinds.includes(f));

    setView(`
      <div class="home" style="--home-c:${headerColor(quick[0] || { hue: 250 })}">
        <div class="home-bg"></div>
        <div class="home-inner">
          <div class="chips">${chips}</div>
          <h1 class="greeting">${greeting()}</h1>
          ${f === 'all' ? `<div class="quick-grid">${quick.map(e => `
            <a class="quick" href="${e.href}" data-key="${e.key}" data-color="${headerColor(e)}">
              <div class="quick-cover ${e.round ? 'round' : ''}">${coverHTML(e)}</div>
              <span class="quick-title">${esc(e.title)}</span>
              ${playBtn(e.key, 'quick-play')}
            </a>`).join('')}</div>` : ''}
          ${sections.map(s => shelf(s.title, s.items, { href: `#/section/${s.key}` })).join('')}
        </div>
      </div>`);
  }

  function renderSection(key) {
    const s = homeSections().find(x => x.key === key);
    if (!s) return renderNotFound();
    setView(`<div class="page"><h1 class="page-title">${esc(s.title)}</h1><div class="cards wrap">${s.items.map(card).join('')}</div></div>`);
  }

  function renderEntity(e) {
    if (!e) return renderNotFound();
    const tracks = e.tracks.map(DB.track).filter(Boolean);
    const total = tracks.reduce((s, t) => s + t.duration, 0);
    const color = headerColor(e);
    const n = `${tracks.length} ${tracks.length === 1 ? 'música' : 'músicas'}`;
    let meta;
    if (e.type === 'album') meta = `<img class="meta-avatar" src="${e.artist.image}" alt=""><a class="meta-strong" href="#/artist/${e.artist.id}">${esc(e.artist.name)}</a><span>• ${e.data.year}</span><span>• ${n}, ${fmtLong(total)}</span>`;
    else if (e.user || e.liked) meta = `<span class="meta-strong">Você</span><span>• ${n}${tracks.length ? `, ${fmtLong(total)}` : ''}</span>`;
    else if (e.type === 'genre') meta = `<span>${n}, cerca de ${fmtLong(total)}</span>`;
    else meta = `<span class="meta-logo">${LOGO}</span><span class="meta-strong">Spotify</span><span>• ${fmtNum(e.data.likes)} salvamentos</span><span>• ${n}, cerca de ${fmtLong(total)}</span>`;

    const editable = e.user ? `data-action="edit-playlist" data-id="${e.id}"` : '';
    const body = tracks.length
      ? trackList(e.tracks, { ctx: e.key, album: e.type !== 'album', cover: e.type !== 'album', added: addedMap(e), playlistId: e.user ? e.id : null })
      : emptyState(e);

    setView(`
      <div class="hero" style="--c:${color}">
        <div class="hero-cover ${e.user ? 'editable' : ''}" ${editable}>${coverHTML(e)}${e.user ? `<div class="edit-ov">${ic('pencil', 44)}<span>Editar detalhes</span></div>` : ''}</div>
        <div class="hero-info">
          <span class="hero-label">${e.user ? 'Playlist pública' : esc(e.label)}</span>
          <h1 class="hero-title ${titleSize(e.title)} ${e.user ? 'editable' : ''}" ${editable}>${esc(e.title)}</h1>
          ${e.desc && e.type === 'playlist' ? `<p class="hero-desc">${esc(e.desc)}</p>` : ''}
          <div class="hero-meta">${meta}</div>
        </div>
      </div>
      <div class="view-body" style="--c:${color}">
        <div class="action-bar">
          ${tracks.length ? playBtn(e.key, 'big') : ''}
          ${tracks.length ? `<button class="icon-btn lg shuffle-toggle ${state.shuffle ? 'on' : ''}" data-action="shuffle" title="Ordem aleatória">${ic('shuffle', 30)}</button>` : ''}
          ${saveBtn(e)}
          <button class="icon-btn lg" data-action="more-entity" data-key="${e.key}" title="Mais opções">${ic('more', 30)}</button>
        </div>
        ${body}
        ${e.type === 'album' ? albumFooter(e) : ''}
        ${e.user ? recommendations(e) : ''}
      </div>`, { title: e.title, color, playKey: tracks.length ? e.key : null });
  }

  function emptyState(e) {
    if (e.liked) return `<div class="empty">${ic('heart', 56)}<h2>As músicas que você curtir vão aparecer aqui</h2><p>Salve músicas tocando no ícone de coração.</p><a class="pill white" href="#/search">Encontrar músicas</a></div>`;
    if (e.user) return '';
    return '<div class="empty"><h2>Nada por aqui ainda</h2></div>';
  }

  function albumFooter(e) {
    const a = e.data;
    const date = new Date(a.year, (hashStr(a.id) % 12), (hashStr(a.id) % 27) + 1);
    const more = e.artist.albums.filter(id => id !== a.id).map(id => ent('album', id));
    return `<div class="album-foot"><p>${date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</p><p class="small">© ${a.year} ${esc(a.label)}<br>℗ ${a.year} ${esc(a.label)}</p></div>
      ${shelf(`Mais de ${e.artist.name}`, more, { href: `#/artist/${e.artist.id}` })}`;
  }

  function addRows(ids, plId) {
    return `<div class="add-list">${ids.map(id => {
      const t = DB.track(id), ar = DB.artist(t.artistId), al = DB.album(t.albumId);
      return `<div class="row add-row" data-track="${t.id}" data-ctx="tmp:recs" data-idx="${state.tmp.recs.indexOf(id)}">
        <div class="c-title"><img src="${t.cover}" alt=""><div class="t-text"><div class="t-name">${esc(t.title)}</div><div class="t-artist"><a href="#/artist/${ar.id}">${esc(ar.name)}</a></div></div></div>
        <div class="c-album"><a href="#/album/${al.id}">${esc(al.title)}</a></div>
        <div class="c-add"><button class="pill outline sm" data-add-to="${plId}" data-track-id="${t.id}">Adicionar</button></div>
      </div>`;
    }).join('')}</div>`;
  }

  function recommendations(e) {
    const inPl = new Set(e.tracks);
    let pool = DB.tracks.filter(t => !inPl.has(t.id));
    if (e.tracks.length) {
      const genres = new Set(e.tracks.map(id => DB.track(id).genre));
      const near = pool.filter(t => genres.has(t.genre));
      pool = near.length >= 10 ? near : near.concat(pool.filter(t => !genres.has(t.genre)));
    }
    const picks = shuffleArr(pool, rng(hashStr(e.id + ':' + e.tracks.length))).slice(0, 8).map(t => t.id);
    state.tmp.recs = picks;
    return `
      ${picks.length ? `<section class="recs"><h2>Recomendadas</h2><p class="muted">${e.tracks.length ? 'Com base no que está nesta playlist' : 'Com base no que você ouve'}</p>${addRows(picks, e.id)}</section>` : ''}
      <section class="find">
        <h2>Vamos procurar algo para sua playlist</h2>
        <div class="find-box">${ic('search', 18)}<input id="plFind" data-pl="${e.id}" placeholder="Procurar músicas" autocomplete="off"></div>
        <div id="plFindResults"></div>
      </section>`;
  }

  function renderArtist(id) {
    const e = ent('artist', id);
    if (!e) return renderNotFound();
    const a = e.data, color = headerColor(e);
    const top = e.tracks.slice(0, state.artistExpanded ? 10 : 5);
    const albums = a.albums.map(x => DB.album(x)).sort((x, y) => y.year - x.year).map(x => ent('album', x.id));
    const fans = DB.artists.filter(x => x.id !== id).sort((x, y) => (x.genre === a.genre ? -1 : 0) - (y.genre === a.genre ? -1 : 0) || y.listeners - x.listeners).map(x => ent('artist', x.id));
    const liked = state.liked.filter(x => DB.track(x.id)?.artistId === id);

    setView(`
      <div class="artist-hero" style="--c:${color}">
        <img class="artist-bg" src="${a.image}" alt="">
        <div class="artist-hero-info">
          <span class="verified">${ic('verified', 24)} Artista verificado</span>
          <h1 class="hero-title ${titleSize(a.name)}">${esc(a.name)}</h1>
          <div class="hero-meta"><span>${fmtNum(a.listeners)} ouvintes mensais</span></div>
        </div>
      </div>
      <div class="view-body" style="--c:${color}">
        <div class="action-bar">
          ${playBtn(e.key, 'big')}
          <button class="icon-btn lg shuffle-toggle ${state.shuffle ? 'on' : ''}" data-action="shuffle" title="Ordem aleatória">${ic('shuffle', 30)}</button>
          ${saveBtn(e)}
          <button class="icon-btn lg" data-action="more-entity" data-key="${e.key}" title="Mais opções">${ic('more', 30)}</button>
        </div>
        <div class="artist-grid">
          <section class="popular">
            <h2>Populares</h2>
            ${trackList(top, { ctx: e.key, album: false, plays: true, header: false })}
            <button class="link-btn" data-action="artist-more">${state.artistExpanded ? 'Mostrar menos' : 'Ver mais'}</button>
          </section>
          ${liked.length ? `<section class="artist-liked"><h2>Músicas curtidas</h2><a class="liked-pick" href="#/liked"><div class="lp-cover"><img src="${a.image}" alt=""><span>${ic('heartFill', 14)}</span></div><div><b>Você curtiu ${liked.length} ${liked.length === 1 ? 'música' : 'músicas'}</b><span>De ${esc(a.name)}</span></div></a></section>` : ''}
        </div>
        ${shelf('Discografia', albums)}
        ${shelf('Os fãs também curtem', fans)}
        <section class="about">
          <h2>Sobre</h2>
          <div class="about-card" data-action="about">
            <img src="${a.image}" alt="">
            <div class="about-text"><b>${fmtNum(a.listeners)} ouvintes mensais</b><p>${esc(a.bio)}</p></div>
          </div>
        </section>
      </div>`, { title: a.name, color, playKey: e.key, threshold: 300 });
  }

  function renderGenre(id) {
    const e = ent('genre', id);
    if (!e) return renderNotFound();
    const pls = DB.playlists.filter(p => p.tracks.some(t => DB.track(t).genre === id)).map(p => ent('playlist', p.id));
    const artists = DB.artists.filter(a => a.genre === id).map(a => ent('artist', a.id));
    setView(`
      <div class="hero genre-hero" style="--c:${e.color}">
        <div class="hero-info"><span class="hero-label">Gênero</span><h1 class="hero-title lg">${esc(e.title)}</h1><div class="hero-meta"><span>${e.tracks.length} músicas</span></div></div>
      </div>
      <div class="view-body" style="--c:${e.color}">
        <div class="action-bar">${playBtn(e.key, 'big')}<button class="icon-btn lg shuffle-toggle ${state.shuffle ? 'on' : ''}" data-action="shuffle" title="Ordem aleatória">${ic('shuffle', 30)}</button></div>
        ${trackList(e.tracks, { ctx: e.key })}
        ${shelf('Artistas', artists)}
        ${shelf('Playlists com ' + e.title, pls)}
      </div>`, { title: e.title, color: e.color, playKey: e.key });
  }

  function renderSearch(q) {
    const input = $('#search');
    if (input.value !== q) input.value = q;
    $('#searchBox').classList.toggle('has-text', !!q);

    if (!q.trim()) {
      const tiles = Object.entries(DB.GENRES).map(([id, g]) => {
        const cover = DB.albums.find(a => DB.artist(a.artistId).genre === id)?.cover;
        return `<a class="genre-tile" href="#/genre/${id}" style="background:${g.color}"><span>${g.name}</span>${cover ? `<img src="${cover}" alt="">` : ''}</a>`;
      });
      const extra = [
        ['#/section/made', 'Feito para você', '#1e3264', DB.playlist('mix-1').cover],
        ['#/section/new', 'Lançamentos', '#608108', DB.album('turbo-saudade').cover],
        ['#/section/editorial', 'Em destaque', '#dc148c', DB.playlist('hits').cover],
        ['#/liked', 'Suas curtidas', '#5038a0', null],
      ].map(([href, l, c, img]) => `<a class="genre-tile" href="${href}" style="background:${c}"><span>${l}</span>${img ? `<img src="${img}" alt="">` : ''}</a>`);
      setView(`<div class="page"><h2 class="section-title">Navegar por todas as seções</h2><div class="genre-grid">${extra.concat(tiles).join('')}</div></div>`);
      return;
    }

    const res = DB.search(q);
    const empty = !res.tracks.length && !res.artists.length && !res.albums.length && !res.playlists.length;
    if (empty) {
      setView(`<div class="page empty"><h2>Nenhum resultado encontrado para "${esc(q)}"</h2><p>Verifique a ortografia ou use menos palavras-chave ou palavras-chave diferentes.</p></div>`);
      return;
    }
    state.tmp.search = res.tracks;
    const f = state.searchFilter;
    const chips = [['all', 'Tudo'], ['tracks', 'Músicas'], ['artists', 'Artistas'], ['albums', 'Álbuns'], ['playlists', 'Playlists']]
      .map(([k, l]) => `<button class="chip ${f === k ? 'active' : ''}" data-action="search-filter" data-f="${k}">${l}</button>`).join('');
    let html = `<div class="chips search-chips">${chips}</div>`;

    if (f === 'all') {
      const top = res.top;
      let topHTML = '';
      if (top) {
        if (top.type === 'track') {
          const t = DB.track(top.id), ar = DB.artist(t.artistId);
          topHTML = `<div class="top-result" data-href="#/album/${t.albumId}"><img class="tr-cover" src="${t.cover}" alt=""><div class="tr-title">${esc(t.title)}</div><div class="tr-sub"><span class="tag">Música</span> <a href="#/artist/${ar.id}">${esc(ar.name)}</a></div><button class="play-btn card-play" data-play-track="${t.id}" data-ctx="tmp:search" aria-label="Tocar">${ic('play')}</button></div>`;
        } else {
          const e = ent(top.type, top.id);
          const tag = { artist: 'Artista', album: 'Álbum', playlist: 'Playlist' }[top.type];
          topHTML = `<div class="top-result" data-href="${e.href}"><div class="tr-cover ${e.round ? 'round' : ''}">${coverHTML(e)}</div><div class="tr-title">${esc(e.title)}</div><div class="tr-sub"><span class="tag">${tag}</span> ${top.type === 'album' ? esc(e.artist.name) : ''}</div>${playBtn(e.key, 'card-play')}</div>`;
        }
      }
      html += `<div class="search-top">
        <section><h2>Melhor resultado</h2>${topHTML}</section>
        ${res.tracks.length ? `<section class="search-songs"><h2>Músicas</h2>${trackList(res.tracks.slice(0, 4), { ctx: 'tmp:search', album: false, header: false })}</section>` : ''}
      </div>`;
      html += shelf('Artistas', res.artists.map(id => ent('artist', id)));
      html += shelf('Álbuns', res.albums.map(id => ent('album', id)));
      html += shelf('Playlists', res.playlists.map(id => ent('playlist', id)));
    } else if (f === 'tracks') {
      html += res.tracks.length ? trackList(res.tracks, { ctx: 'tmp:search' }) : '<p class="muted">Nenhuma música encontrada.</p>';
    } else {
      const items = res[f].map(id => ent(f.slice(0, -1), id));
      html += items.length ? `<div class="cards wrap">${items.map(card).join('')}</div>` : '<p class="muted">Nada encontrado.</p>';
    }
    setView(`<div class="page search-page">${html}</div>`);
  }

  function renderQueue() {
    const ctxEnt = entFromKey(state.context);
    const upcoming = state.queue.slice(state.pos + 1);
    let html = '<h1 class="page-title">Fila</h1>';
    if (!state.current) html += '<div class="empty"><h2>Adicione músicas à sua fila</h2><p>Toque algo e as próximas faixas vão aparecer aqui.</p></div>';
    else {
      html += `<h3 class="q-title">Tocando agora</h3>${trackList([state.current], { ctx: '__now', header: false })}`;
      if (state.userQueue.length)
        html += `<div class="q-head"><h3 class="q-title">Próximas na fila</h3><button class="link-btn" data-action="clear-queue">Limpar fila</button></div>${trackList(state.userQueue, { ctx: '__user', header: false, numBase: 1 })}`;
      if (upcoming.length)
        html += `<h3 class="q-title">Próximas de: ${ctxEnt && ctxEnt.type !== 'tmp' ? `<a href="${ctxEnt.href}">${esc(ctxEnt.title)}</a>` : 'Busca'}</h3>${trackList(upcoming, { ctx: '__queue', header: false, idxBase: state.pos + 1, numBase: 1 + state.userQueue.length })}`;
    }
    setView(`<div class="page">${html}</div>`);
  }

  function renderLibraryView() {
    setView(`<div class="page lib-page"><h1 class="page-title">Sua Biblioteca</h1><div class="lib-list big">${libraryItems().map(libItem).join('')}</div></div>`);
  }

  function renderNotFound() {
    setView('<div class="page empty"><h2>Página não encontrada</h2><p>Não conseguimos encontrar o que você procura.</p><a class="pill white" href="#/">Início</a></div>');
  }

  // ---------- biblioteca lateral ----------
  function libraryItems() {
    let items = state.library.map(x => ent(x.type, x.id)).filter(Boolean);
    items.unshift(ent('liked'));
    const f = state.libFilter;
    if (f !== 'all') items = items.filter(e => (f === 'playlist' ? e.type === 'playlist' || e.liked : e.type === f));
    if (state.libQuery) items = items.filter(e => norm(e.title).includes(norm(state.libQuery)));
    return items;
  }

  function libItem(e) {
    const playing = state.context === e.key;
    return `<a class="lib-item ${playing ? 'playing' : ''}" href="${e.href}" data-key="${e.key}" title="${esc(e.title)}">
      <div class="lib-cover ${e.round ? 'round' : ''}">${coverHTML(e)}</div>
      <div class="lib-text"><div class="lib-name">${esc(e.title)}</div><div class="lib-sub">${e.liked ? `<span class="pin">${ic('pin', 12)}</span>` : ''}${esc(e.libSub)}</div></div>
      <span class="lib-eq">${ic('volume', 16)}</span>
    </a>`;
  }

  function renderLibrary() {
    const f = state.libFilter;
    const chips = [['playlist', 'Playlists'], ['artist', 'Artistas'], ['album', 'Álbuns']]
      .filter(([k]) => f === 'all' || f === k)
      .map(([k, l]) => `<button class="chip ${f === k ? 'active' : ''}" data-action="lib-filter" data-f="${k}">${l}</button>`).join('');
    const items = libraryItems();
    $('#library').innerHTML = `
      <div class="lib-head">
        <button class="lib-title" data-action="lib-collapse" title="${state.libCollapsed ? 'Abrir' : 'Recolher'} Sua Biblioteca">${ic('library')}<span>Sua Biblioteca</span></button>
        <button class="icon-btn circle" data-action="new-playlist" title="Criar playlist">${ic('plus', 16)}</button>
      </div>
      <div class="lib-chips">${f !== 'all' ? `<button class="chip x" data-action="lib-filter" data-f="all" aria-label="Limpar filtro">${ic('close', 14)}</button>` : ''}${chips}</div>
      <div class="lib-tools">
        <div class="lib-search ${state.libSearchOpen ? 'open' : ''}">
          <button class="icon-btn" data-action="lib-search" title="Buscar em Sua Biblioteca">${ic('search', 16)}</button>
          <input id="libQuery" placeholder="Buscar em Sua Biblioteca" value="${esc(state.libQuery)}">
        </div>
        <span class="lib-sort">Recentes ${ic('list', 16)}</span>
      </div>
      <div class="lib-list">${items.map(libItem).join('') || '<p class="muted lib-none">Nada encontrado.</p>'}</div>`;
    markActiveLib();
  }

  function markActiveLib() {
    $$('.lib-item').forEach(a => a.classList.toggle('active', a.getAttribute('href') === location.hash));
  }

  // ---------- painel "Tocando agora" ----------
  function renderRight() {
    const panel = $('#rightPanel');
    $('#app').classList.toggle('right-open', state.rightOpen);
    $('#btnRight').classList.toggle('on', state.rightOpen);
    if (!state.rightOpen) return;
    const t = state.current && DB.track(state.current);
    if (!t) {
      panel.innerHTML = `<div class="rp-head"><span></span><button class="icon-btn" data-action="toggle-right" title="Fechar">${ic('close', 16)}</button></div><div class="rp-empty">${ic('note', 48)}<p>Escolha algo para tocar</p></div>`;
      return;
    }
    const ar = DB.artist(t.artistId), al = DB.album(t.albumId), ctxEnt = entFromKey(state.context);
    const nextId = state.userQueue[0] || state.queue[state.pos + 1];
    const nt = nextId && DB.track(nextId);
    const following = inLibrary('artist', ar.id);
    panel.innerHTML = `
      <div class="rp-head"><a class="rp-ctx" href="${ctxEnt && ctxEnt.type !== 'tmp' ? ctxEnt.href : `#/album/${al.id}`}">${esc(ctxEnt && ctxEnt.type !== 'tmp' ? ctxEnt.title : al.title)}</a><button class="icon-btn" data-action="toggle-right" title="Fechar">${ic('close', 16)}</button></div>
      <div class="rp-scroll">
        <img class="rp-cover" src="${t.cover}" alt="">
        <div class="rp-title-row">
          <div class="rp-titles"><a class="rp-title" href="#/album/${al.id}">${esc(t.title)}</a><a class="rp-artist" href="#/artist/${ar.id}">${esc(ar.name)}</a></div>
          ${likeBtn(t.id)}
        </div>
        <div class="rp-card rp-about">
          <a class="rp-about-img" href="#/artist/${ar.id}"><img src="${ar.image}" alt=""><span>Sobre o artista</span></a>
          <div class="rp-about-body">
            <b>${esc(ar.name)}</b>
            <div class="rp-row"><span class="muted">${fmtNum(ar.listeners)} ouvintes mensais</span><button class="pill outline sm follow-btn" data-save="artist:${ar.id}">${following ? 'Seguindo' : 'Seguir'}</button></div>
            <p class="muted">${esc(ar.bio)}</p>
          </div>
        </div>
        <div class="rp-card">
          <div class="rp-card-head"><b>Créditos</b></div>
          <div class="credit"><b>${esc(ar.name)}</b><span class="muted">Artista principal, Produção</span></div>
          <div class="credit"><b>${DB.GENRES[t.genre].name} • ${Synth.bpm(t)} BPM</b><span class="muted">Gênero e andamento</span></div>
          <div class="credit"><b>${esc(al.label)}</b><span class="muted">Fonte</span></div>
        </div>
        <div class="rp-card">
          <div class="rp-card-head"><b>Próxima na fila</b><a href="#/queue">Abrir fila</a></div>
          ${nt ? `<div class="rp-next" data-action="play-next"><img src="${nt.cover}" alt=""><div><b>${esc(nt.title)}</b><span class="muted">${esc(DB.artist(nt.artistId).name)}</span></div></div>` : '<p class="muted">Nada na fila.</p>'}
        </div>
      </div>`;
  }

  // ---------- player ----------
  const audio = new Audio();
  audio.preload = 'auto';
  let loadTok = 0;

  function buildQueue(currentId) {
    if (state.shuffle) {
      state.queue = [currentId, ...shuffleArr(state.original.filter(x => x !== currentId))];
      state.pos = 0;
    } else {
      state.queue = state.original.slice();
      state.pos = Math.max(0, state.queue.indexOf(currentId));
    }
    state.current = currentId;
  }

  function pushRecent(key) {
    if (!key || key.startsWith('tmp:') || key.startsWith('__')) return;
    state.recent = [key, ...state.recent.filter(k => k !== key)].slice(0, 10);
  }

  function playContext(key, idx = 0) {
    const ids = contextTracks(key);
    if (!ids.length) return;
    state.original = ids.slice();
    state.context = key;
    buildQueue(ids[clamp(idx, 0, ids.length - 1)]);
    pushRecent(key);
    load(state.current);
  }

  async function load(id, autoplay = true) {
    const t = DB.track(id);
    if (!t) return;
    const tok = ++loadTok;
    state.current = id;
    state.loading = true;
    audio.pause();
    persist();
    updateAll();
    try {
      const url = await Synth.render(t);
      if (tok !== loadTok) return;
      audio.src = url;
      state.loadedId = id;
      if (autoplay) await audio.play();
    } catch (err) {
      if (tok === loadTok && err.name !== 'AbortError') {
        console.error(err);
        toast('Não foi possível tocar esta faixa');
      }
    } finally {
      if (tok === loadTok) {
        state.loading = false;
        updateAll();
        setTimeout(prefetch, 1500);
      }
    }
  }

  function prefetch() {
    const id = state.userQueue[0] || state.queue[state.pos + 1] || (state.repeat === 1 ? state.queue[0] : null);
    if (id) Synth.render(DB.track(id)).catch(() => {});
  }

  function togglePlay() {
    if (state.loading) return;
    if (!state.current) return playContext('playlist:mix-1', 0);
    if (state.loadedId !== state.current) return load(state.current);
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }

  function next(auto = false) {
    if (!state.current) return;
    if (auto && state.repeat === 2) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
      return;
    }
    if (state.userQueue.length) return load(state.userQueue.shift());
    if (state.pos + 1 < state.queue.length) {
      state.pos++;
      return load(state.queue[state.pos]);
    }
    state.pos = 0;
    load(state.queue[0], state.repeat === 1 || !auto);
  }

  function prev() {
    if (!state.current) return;
    if (audio.currentTime > 3 || state.pos <= 0) {
      audio.currentTime = 0;
      return;
    }
    state.pos--;
    load(state.queue[state.pos]);
  }

  function playFromRow(row) {
    const ctx = row.dataset.ctx, idx = +row.dataset.idx;
    if (ctx === '__now') return togglePlay();
    if (ctx === '__user') {
      const id = state.userQueue[idx];
      state.userQueue.splice(0, idx + 1);
      return load(id);
    }
    if (ctx === '__queue') {
      state.pos = idx;
      return load(state.queue[idx]);
    }
    playContext(ctx, idx);
  }

  function onPlayContextBtn(key) {
    if (state.context === key && state.current) return togglePlay();
    const ids = contextTracks(key);
    if (!ids.length) return;
    playContext(key, state.shuffle ? Math.floor(Math.random() * ids.length) : 0);
  }

  function toggleShuffle() {
    state.shuffle = !state.shuffle;
    if (state.current && state.original.length) buildQueue(state.current);
    persist();
    updateAll();
    toast(state.shuffle ? 'Ordem aleatória ativada' : 'Ordem aleatória desativada');
  }

  function cycleRepeat() {
    state.repeat = (state.repeat + 1) % 3;
    persist();
    updatePlayer();
  }

  function addToQueue(ids) {
    state.userQueue.push(...ids);
    toast(ids.length > 1 ? `${ids.length} músicas adicionadas à fila` : 'Adicionada à fila');
    if (!state.current) next();
    afterQueueChange();
  }

  function afterQueueChange() {
    renderRight();
    if (location.hash === '#/queue') rerender();
  }

  // ---------- sliders ----------
  function slider(el, { onInput, onCommit }) {
    let dragging = false;
    const val = e => {
      const r = el.getBoundingClientRect();
      return clamp((e.clientX - r.left) / r.width, 0, 1);
    };
    el.addEventListener('pointerdown', e => {
      dragging = true;
      el.setPointerCapture(e.pointerId);
      el.classList.add('dragging');
      onInput(val(e));
    });
    el.addEventListener('pointermove', e => dragging && onInput(val(e)));
    const end = e => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove('dragging');
      onCommit(val(e));
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    return { get dragging() { return dragging; } };
  }
  const setSlider = (el, v) => el.style.setProperty('--v', `${clamp(v, 0, 1) * 100}%`);

  const seekEl = $('#seek'), volEl = $('#vol');
  const trackDur = () => audio.duration || (state.current ? DB.track(state.current).duration : 0) || 0;
  const seek = slider(seekEl, {
    onInput: v => {
      setSlider(seekEl, v);
      $('#tCur').textContent = fmtTime(v * trackDur());
    },
    onCommit: v => {
      if (state.loadedId === state.current && audio.duration) audio.currentTime = v * audio.duration;
      else updateProgress();
    },
  });
  slider(volEl, { onInput: v => setVolume(v), onCommit: v => setVolume(v) });

  function setVolume(v) {
    state.volume = v;
    state.muted = v === 0;
    audio.volume = v;
    audio.muted = false;
    updateVolume();
    store.set('volume', v);
  }

  function toggleMute() {
    state.muted = !state.muted;
    audio.muted = state.muted;
    if (!state.muted && state.volume === 0) setVolume(0.5);
    updateVolume();
  }

  function updateVolume() {
    const v = state.muted ? 0 : state.volume;
    setSlider(volEl, v);
    $('#btnMute').innerHTML = ic(v === 0 ? 'mute' : v < 0.5 ? 'volLow' : 'volume', 16);
    $('#btnMute').title = state.muted ? 'Com som' : 'Sem som';
  }

  function updateProgress() {
    if (seek.dragging) return;
    const d = trackDur();
    const cur = state.loadedId === state.current ? audio.currentTime : 0;
    setSlider(seekEl, d ? cur / d : 0);
    $('#tCur').textContent = fmtTime(cur);
    $('#tDur').textContent = fmtTime(d);
  }

  let raf = 0;
  function loop() {
    updateProgress();
    raf = audio.paused ? 0 : requestAnimationFrame(loop);
  }

  function updatePlayer() {
    const t = state.current && DB.track(state.current);
    $('#player').classList.toggle('empty', !t);
    if (t) {
      const ar = DB.artist(t.artistId);
      const cov = $('#npCover');
      if (cov.dataset.src !== t.cover) {
        cov.dataset.src = t.cover;
        cov.innerHTML = `<img src="${t.cover}" alt="">`;
      }
      cov.href = `#/album/${t.albumId}`;
      $('#npTitle').textContent = t.title;
      $('#npTitle').href = `#/album/${t.albumId}`;
      $('#npArtist').innerHTML = `<a href="#/artist/${ar.id}">${esc(ar.name)}</a>`;
      const like = $('#npLike');
      like.dataset.like = t.id;
      setLikeBtn(like, isLiked(t.id));
    }
    const playing = !audio.paused;
    const btn = $('#btnPlay');
    btn.innerHTML = state.loading ? '<span class="spinner"></span>' : ic(playing ? 'pause' : 'play', 16);
    btn.title = playing ? 'Pausar' : 'Tocar';
    const sh = $('#btnShuffle');
    sh.classList.toggle('on', state.shuffle);
    sh.title = state.shuffle ? 'Desativar ordem aleatória' : 'Ativar ordem aleatória';
    $$('.shuffle-toggle').forEach(b => b.classList.toggle('on', state.shuffle));
    const rp = $('#btnRepeat');
    rp.classList.toggle('on', state.repeat > 0);
    rp.innerHTML = ic(state.repeat === 2 ? 'repeatOne' : 'repeat', 16);
    rp.title = ['Ativar repetição', 'Ativar repetição de uma faixa', 'Desativar repetição'][state.repeat];
    $('#btnQueue').classList.toggle('on', location.hash === '#/queue');
    updateProgress();
  }

  function refreshIndicators() {
    const playing = !audio.paused || state.loading;
    $('#app').classList.toggle('is-playing', !audio.paused);
    $$('.row[data-track]').forEach(r => r.classList.toggle('is-current', r.dataset.track === state.current));
    $$('[data-play-context]').forEach(b => {
      const on = playing && b.dataset.playContext === state.context;
      if (b.dataset.on !== String(on)) {
        b.dataset.on = on;
        b.innerHTML = ic(on ? 'pause' : 'play');
        b.setAttribute('aria-label', on ? 'Pausar' : 'Tocar');
      }
    });
    $$('[data-play-track]').forEach(b => {
      const on = playing && b.dataset.playTrack === state.current;
      b.innerHTML = ic(on ? 'pause' : 'play');
    });
    $$('.row[data-track] .row-play').forEach(b => {
      const on = playing && b.closest('.row').dataset.track === state.current;
      b.innerHTML = ic(on ? 'pause' : 'play', 16);
    });
    $$('.lib-item').forEach(a => a.classList.toggle('playing', a.dataset.key === state.context && !!state.current));
  }

  function updateMediaSession() {
    const t = state.current && DB.track(state.current);
    document.title = t && !audio.paused ? `${t.title} • ${DB.artist(t.artistId).name}` : 'Spotify Clone';
    if (!('mediaSession' in navigator) || !t) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: t.title, artist: DB.artist(t.artistId).name, album: DB.album(t.albumId).title,
        artwork: [{ src: t.cover, sizes: '300x300', type: 'image/svg+xml' }],
      });
    } catch { /* metadados não suportados */ }
  }

  let rightKey = '';
  function updateAll() {
    updatePlayer();
    refreshIndicators();
    const key = [state.current, state.rightOpen, state.userQueue.join(), state.pos, state.queue.length].join('|');
    if (key !== rightKey) {
      rightKey = key;
      renderRight();
    }
    updateMediaSession();
  }

  audio.addEventListener('play', () => { updateAll(); if (!raf) loop(); });
  audio.addEventListener('pause', updateAll);
  audio.addEventListener('ended', () => next(true));
  audio.addEventListener('loadedmetadata', updateProgress);
  audio.addEventListener('seeked', updateProgress);

  if ('mediaSession' in navigator) {
    const ms = navigator.mediaSession;
    try {
      ms.setActionHandler('play', togglePlay);
      ms.setActionHandler('pause', togglePlay);
      ms.setActionHandler('nexttrack', () => next());
      ms.setActionHandler('previoustrack', prev);
    } catch { /* ações não suportadas */ }
  }

  // ---------- curtidas, biblioteca e playlists ----------
  function setLikeBtn(b, on) {
    b.classList.toggle('on', on);
    b.innerHTML = ic(on ? 'heartFill' : 'heart', 16);
    b.setAttribute('aria-label', on ? 'Remover de Músicas Curtidas' : 'Salvar em Músicas Curtidas');
  }

  function toggleLike(id) {
    const on = isLiked(id);
    if (on) state.liked = state.liked.filter(x => x.id !== id);
    else state.liked.unshift({ id, at: Date.now() });
    persist();
    toast(on ? 'Removida de Músicas Curtidas' : 'Adicionada a Músicas Curtidas');
    $$('[data-like]').forEach(b => b.dataset.like === id && setLikeBtn(b, !on));
    renderLibrary();
    if (location.hash === '#/liked' || location.hash.startsWith('#/artist/')) rerender();
  }

  function toggleLibrary(type, id) {
    const on = inLibrary(type, id);
    if (on) state.library = state.library.filter(x => !(x.type === type && x.id === id));
    else state.library.unshift({ type, id, at: Date.now() });
    persist();
    if (type === 'artist') toast(on ? 'Você deixou de seguir este artista' : 'Agora você está seguindo este artista');
    else toast(on ? 'Removido da Sua Biblioteca' : 'Salvo na Sua Biblioteca');
    $$('[data-save]').forEach(b => {
      if (b.dataset.save !== `${type}:${id}`) return;
      if (b.classList.contains('follow-btn')) b.textContent = on ? 'Seguir' : 'Seguindo';
      else {
        b.classList.toggle('on', !on);
        b.innerHTML = ic(on ? 'addCircle' : 'check', 32);
        b.title = on ? 'Salvar na Sua Biblioteca' : 'Remover da Sua Biblioteca';
      }
    });
    renderLibrary();
  }

  function createPlaylist(trackId) {
    let n = state.playlists.length + 1;
    while (state.playlists.some(p => p.name === `Minha playlist nº ${n}`)) n++;
    const p = { id: 'u' + Date.now().toString(36), name: `Minha playlist nº ${n}`, desc: '', hue: Math.floor(Math.random() * 360), tracks: [], created: Date.now() };
    if (trackId) p.tracks.push({ id: trackId, at: Date.now() });
    state.playlists.push(p);
    state.library.unshift({ type: 'playlist', id: p.id, at: Date.now() });
    persist();
    renderLibrary();
    if (trackId) toast(`Adicionada a ${p.name}`);
    else location.hash = `#/playlist/${p.id}`;
    return p;
  }

  function addToPlaylist(plId, trackId) {
    const p = userPl(plId);
    if (!p) return;
    if (p.tracks.some(x => x.id === trackId)) return toast('Essa música já está na playlist');
    p.tracks.push({ id: trackId, at: Date.now() });
    persist();
    toast(`Adicionada a ${p.name}`);
    renderLibrary();
    if (location.hash === `#/playlist/${plId}`) rerender();
  }

  function removeFromPlaylist(plId, trackId) {
    const p = userPl(plId);
    if (!p) return;
    p.tracks = p.tracks.filter(x => x.id !== trackId);
    persist();
    toast(`Removida de ${p.name}`);
    renderLibrary();
    if (location.hash === `#/playlist/${plId}`) rerender();
  }

  function editPlaylist(id) {
    const p = userPl(id);
    if (!p) return;
    openModal(`
      <div class="modal-head"><h2>Editar detalhes</h2><button class="icon-btn" data-action="close-modal" aria-label="Fechar">${ic('close', 18)}</button></div>
      <div class="edit-grid">
        <div class="edit-cover">${coverHTML(ent('playlist', id))}</div>
        <div class="edit-fields">
          <input id="edName" maxlength="100" value="${esc(p.name)}" placeholder="Adicione um nome">
          <textarea id="edDesc" maxlength="300" placeholder="Adicione uma descrição opcional">${esc(p.desc || '')}</textarea>
        </div>
      </div>
      <div class="modal-actions"><button class="pill white" data-action="save-edit" data-id="${id}">Salvar</button></div>`);
    setTimeout(() => $('#edName')?.select(), 30);
  }

  function saveEdit(id) {
    const p = userPl(id);
    const name = $('#edName').value.trim();
    if (!name) return toast('O nome da playlist é obrigatório');
    p.name = name;
    p.desc = $('#edDesc').value.trim();
    persist();
    closeModal();
    renderLibrary();
    rerender();
  }

  function confirmDelete(id) {
    const p = userPl(id);
    openModal(`
      <h2>Excluir da Sua Biblioteca?</h2>
      <p class="muted">Isso vai excluir <b>${esc(p.name)}</b> da <b>Sua Biblioteca.</b></p>
      <div class="modal-actions"><button class="link-btn" data-action="close-modal">Cancelar</button><button class="pill green" data-action="delete-playlist" data-id="${id}">Excluir</button></div>`, 'small');
  }

  function deletePlaylist(id) {
    state.playlists = state.playlists.filter(p => p.id !== id);
    state.library = state.library.filter(x => !(x.type === 'playlist' && x.id === id));
    state.recent = state.recent.filter(k => k !== `playlist:${id}`);
    persist();
    closeModal();
    renderLibrary();
    toast('Removida da Sua Biblioteca');
    if (location.hash === `#/playlist/${id}`) location.hash = '#/';
  }

  // ---------- menus, modal e toast ----------
  let menuFns = [];
  function menuHTML(items) {
    return '<ul>' + items.map(it => {
      if (it.sep) return '<li class="sep"></li>';
      const i = it.sub ? '' : menuFns.push(it.fn) - 1;
      return `<li class="${it.sub ? 'has-sub' : ''}"><button data-mi="${i}" class="${it.danger ? 'danger' : ''}">${it.icon ? ic(it.icon, 16) : '<span class="ic-space"></span>'}<span>${esc(it.label)}</span>${it.sub ? ic('chevRight', 14, 'sub-arrow') : ''}</button>${it.sub ? `<div class="submenu">${menuHTML(it.sub)}</div>` : ''}</li>`;
    }).join('') + '</ul>';
  }

  function openMenu(items, x, y) {
    menuFns = [];
    const m = $('#ctxmenu');
    m.innerHTML = menuHTML(items);
    m.hidden = false;
    const r = m.getBoundingClientRect();
    const left = clamp(x, 8, innerWidth - r.width - 8), top = clamp(y, 8, innerHeight - r.height - 8);
    m.style.left = `${left}px`;
    m.style.top = `${top}px`;
    m.classList.toggle('flip', left + r.width + 220 > innerWidth);
  }

  function closeMenu() {
    $('#ctxmenu').hidden = true;
  }

  const copyLink = hash => {
    const url = location.href.split('#')[0] + hash;
    (navigator.clipboard?.writeText(url) || Promise.reject()).then(() => toast('Link copiado para a área de transferência'), () => toast(url));
  };

  function playlistSubmenu(trackIds) {
    return [
      { label: 'Nova playlist', icon: 'plus', fn: () => { const p = createPlaylist(trackIds[0]); trackIds.slice(1).forEach(id => p.tracks.push({ id, at: Date.now() })); persist(); } },
      ...(state.playlists.length ? [{ sep: true }] : []),
      ...state.playlists.map(p => ({ label: p.name, fn: () => trackIds.forEach(id => addToPlaylist(p.id, id)) })),
    ];
  }

  function openTrackMenu(trackId, plId, x, y) {
    const t = DB.track(trackId);
    const liked = isLiked(trackId);
    openMenu([
      { label: 'Adicionar à playlist', icon: 'plus', sub: playlistSubmenu([trackId]) },
      ...(plId && userPl(plId) ? [{ label: 'Remover desta playlist', icon: 'trash', fn: () => removeFromPlaylist(plId, trackId) }] : []),
      { label: liked ? 'Remover de Músicas Curtidas' : 'Salvar em Músicas Curtidas', icon: liked ? 'heartFill' : 'heart', fn: () => toggleLike(trackId) },
      { label: 'Adicionar à fila', icon: 'addQueue', fn: () => addToQueue([trackId]) },
      { sep: true },
      { label: 'Ir para o artista', icon: 'user', fn: () => (location.hash = `#/artist/${t.artistId}`) },
      { label: 'Ir para o álbum', icon: 'album', fn: () => (location.hash = `#/album/${t.albumId}`) },
      { sep: true },
      { label: 'Compartilhar', icon: 'share', sub: [{ label: 'Copiar link da música', fn: () => copyLink(`#/album/${t.albumId}`) }] },
    ], x, y);
  }

  function openEntityMenu(key, x, y) {
    const e = entFromKey(key);
    if (!e) return;
    const items = [];
    if (e.tracks.length) items.push({ label: 'Adicionar à fila', icon: 'addQueue', fn: () => addToQueue(contextTracks(key)) });
    if (e.user) {
      items.push({ label: 'Editar detalhes', icon: 'pencil', fn: () => editPlaylist(e.id) });
      items.push({ label: 'Excluir', icon: 'trash', danger: true, fn: () => confirmDelete(e.id) });
    } else if (e.type === 'artist') {
      items.push({ label: inLibrary('artist', e.id) ? 'Deixar de seguir' : 'Seguir', icon: 'user', fn: () => toggleLibrary('artist', e.id) });
    } else if (e.type === 'album' || e.type === 'playlist') {
      const on = inLibrary(e.type, e.id);
      items.push({ label: on ? 'Remover da Sua Biblioteca' : 'Salvar na Sua Biblioteca', icon: on ? 'check' : 'addCircle', fn: () => toggleLibrary(e.type, e.id) });
      if (e.tracks.length) items.push({ label: 'Adicionar à playlist', icon: 'plus', sub: playlistSubmenu(e.tracks) });
      if (e.type === 'album') items.push({ label: 'Ir para o artista', icon: 'user', fn: () => (location.hash = `#/artist/${e.artist.id}`) });
    }
    if (e.href && !e.liked) items.push({ sep: true }, { label: 'Copiar link', icon: 'share', fn: () => copyLink(e.href) });
    if (items.length) openMenu(items, x, y);
  }

  function openModal(html, size = '') {
    const m = $('#modal');
    m.innerHTML = `<div class="modal-box ${size}">${html}</div>`;
    m.hidden = false;
  }

  function closeModal() {
    $('#modal').hidden = true;
    $('#modal').innerHTML = '';
  }

  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  // ---------- roteamento ----------
  function route(keepScroll = false) {
    const parts = location.hash.replace(/^#\/?/, '').split('/').map(s => {
      try { return decodeURIComponent(s); } catch { return s; }
    });
    const [view, a] = parts;
    closeMenu();
    const prevScroll = $('#mainScroll').scrollTop;
    if (view !== 'artist') state.artistExpanded = keepScroll && state.artistExpanded;
    if (view !== 'search') {
      $('#search').value = '';
      $('#searchBox').classList.remove('has-text');
    }
    switch (view) {
      case '': case 'home': renderHome(); break;
      case 'search': renderSearch(parts.slice(1).join('/')); break;
      case 'album': renderEntity(ent('album', a)); break;
      case 'playlist': renderEntity(ent('playlist', a)); break;
      case 'liked': renderEntity(ent('liked')); break;
      case 'artist': renderArtist(a); break;
      case 'genre': renderGenre(a); break;
      case 'queue': renderQueue(); break;
      case 'section': renderSection(a); break;
      case 'library': renderLibraryView(); break;
      default: renderNotFound();
    }
    $('#mainScroll').scrollTop = keepScroll ? prevScroll : 0;
    const isHome = !view || view === 'home';
    $('#homeBtn').classList.toggle('active', isHome);
    $('#homeBtn').innerHTML = ic(isHome ? 'home' : 'homeOutline');
    $$('.mobile-nav a').forEach(l => l.classList.toggle('active', l.dataset.nav === (isHome ? 'home' : view)));
    markActiveLib();
    updatePlayer();
    refreshIndicators();
    onScroll();
  }

  const rerender = () => route(true);

  function onScroll() {
    const st = $('#mainScroll').scrollTop;
    const head = $('#stickyHead');
    head.style.setProperty('--o', clamp((st - 40) / 160, 0, 1));
    head.classList.toggle('show-title', st > (state.viewMeta.threshold || 280));
  }

  // ---------- eventos ----------
  document.addEventListener('click', e => {
    const t = e.target;
    if (!t.closest('#ctxmenu')) closeMenu();
    if (t.id === 'modal') return closeModal();

    const mi = t.closest('[data-mi]');
    if (mi) {
      if (mi.dataset.mi !== '') {
        const fn = menuFns[+mi.dataset.mi];
        closeMenu();
        fn && fn();
      }
      return;
    }
    const pc = t.closest('[data-play-context]');
    if (pc) {
      e.preventDefault();
      return onPlayContextBtn(pc.dataset.playContext);
    }
    const pt = t.closest('[data-play-track]');
    if (pt) {
      e.preventDefault();
      if (pt.dataset.playTrack === state.current) return togglePlay();
      const ids = contextTracks(pt.dataset.ctx);
      return playContext(pt.dataset.ctx, Math.max(0, ids.indexOf(pt.dataset.playTrack)));
    }
    const like = t.closest('[data-like]');
    if (like) {
      e.preventDefault();
      return like.dataset.like && toggleLike(like.dataset.like);
    }
    const save = t.closest('[data-save]');
    if (save) {
      e.preventDefault();
      const [type, id] = save.dataset.save.split(':');
      return toggleLibrary(type, id);
    }
    const add = t.closest('[data-add-to]');
    if (add) return addToPlaylist(add.dataset.addTo, add.dataset.trackId);
    const rp = t.closest('[data-row-play]');
    if (rp) {
      const row = rp.closest('.row');
      return row.dataset.track === state.current && row.dataset.ctx !== '__user' ? togglePlay() : playFromRow(row);
    }
    const more = t.closest('[data-more]');
    if (more) {
      e.stopPropagation();
      const row = more.closest('.row'), r = more.getBoundingClientRect();
      return openTrackMenu(row.dataset.track, row.dataset.pl, r.left - 180, r.bottom + 4);
    }
    const act = t.closest('[data-action]');
    if (act) return handleAction(act.dataset.action, act, e);

    const row = t.closest('.row');
    if (row && !t.closest('a')) {
      $$('.row.selected').forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
      return;
    }
    const link = t.closest('[data-href]');
    if (link && !t.closest('a')) location.hash = link.dataset.href;
  });

  function handleAction(name, el, e) {
    switch (name) {
      case 'play': return togglePlay();
      case 'next': return next();
      case 'prev': return prev();
      case 'shuffle': return toggleShuffle();
      case 'repeat': return cycleRepeat();
      case 'mute': return toggleMute();
      case 'back': return history.back();
      case 'fwd': return history.forward();
      case 'queue':
        if (location.hash === '#/queue') history.back();
        else location.hash = '#/queue';
        return;
      case 'toggle-right':
        state.rightOpen = !state.rightOpen;
        persist();
        rightKey = '';
        return renderRight();
      case 'play-next': return next();
      case 'new-playlist': return createPlaylist();
      case 'edit-playlist': return editPlaylist(el.dataset.id);
      case 'save-edit': return saveEdit(el.dataset.id);
      case 'delete-playlist': return deletePlaylist(el.dataset.id);
      case 'close-modal': return closeModal();
      case 'more-entity': {
        e.stopPropagation();
        const r = el.getBoundingClientRect();
        return openEntityMenu(el.dataset.key, r.left, r.bottom + 4);
      }
      case 'lib-filter':
        state.libFilter = state.libFilter === el.dataset.f ? 'all' : el.dataset.f;
        return renderLibrary();
      case 'lib-search':
        state.libSearchOpen = !state.libSearchOpen;
        renderLibrary();
        if (state.libSearchOpen) $('#libQuery').focus();
        return;
      case 'lib-collapse':
        state.libCollapsed = !state.libCollapsed;
        $('#app').classList.toggle('lib-collapsed', state.libCollapsed);
        persist();
        return renderLibrary();
      case 'home-filter':
        state.homeFilter = el.dataset.f;
        return rerender();
      case 'search-filter':
        state.searchFilter = el.dataset.f;
        return rerender();
      case 'artist-more':
        state.artistExpanded = !state.artistExpanded;
        return rerender();
      case 'clear-queue':
        state.userQueue = [];
        return afterQueueChange();
      case 'clear-search':
        e.preventDefault();
        $('#search').value = '';
        $('#search').focus();
        return onSearchInput();
      case 'premium': return toast('Você já tem tudo liberado neste clone 😉');
      case 'bell': return toast('Nenhuma novidade por enquanto');
      case 'profile': return toast(`${state.liked.length} curtidas • ${state.playlists.length} playlists criadas`);
      case 'about': return;
    }
  }

  document.addEventListener('dblclick', e => {
    const row = e.target.closest('.row');
    if (row && !e.target.closest('button, a')) playFromRow(row);
  });

  document.addEventListener('contextmenu', e => {
    const row = e.target.closest('.row[data-track]');
    const ek = e.target.closest('.card[data-key], .lib-item[data-key], .quick[data-key]');
    if (row) {
      e.preventDefault();
      openTrackMenu(row.dataset.track, row.dataset.pl, e.clientX, e.clientY);
    } else if (ek) {
      e.preventDefault();
      openEntityMenu(ek.dataset.key, e.clientX, e.clientY);
    }
  });

  // Fundo da home muda de cor ao passar o mouse nos atalhos.
  $('#view').addEventListener('mouseover', e => {
    const q = e.target.closest('.quick');
    const home = $('.home');
    if (q && home) home.style.setProperty('--home-c', q.dataset.color);
  });

  function onSearchInput() {
    const q = $('#search').value;
    $('#searchBox').classList.toggle('has-text', !!q);
    const hash = '#/search' + (q ? '/' + encodeURIComponent(q) : '');
    if (location.hash.startsWith('#/search')) {
      history.replaceState(null, '', hash);
      renderSearch(q);
      refreshIndicators();
    } else {
      state.searchFilter = 'all';
      location.hash = hash;
    }
  }
  $('#search').addEventListener('input', onSearchInput);
  $('#search').addEventListener('focus', () => {
    if (!location.hash.startsWith('#/search')) location.hash = '#/search';
  });

  document.addEventListener('input', e => {
    if (e.target.id === 'libQuery') {
      state.libQuery = e.target.value;
      $('.lib-list').innerHTML = libraryItems().map(libItem).join('') || '<p class="muted lib-none">Nada encontrado.</p>';
      markActiveLib();
      refreshIndicators();
    } else if (e.target.id === 'plFind') {
      const q = e.target.value, out = $('#plFindResults');
      const ids = q.trim() ? DB.search(q).tracks.slice(0, 8) : [];
      state.tmp.recs = ids;
      out.innerHTML = ids.length ? addRows(ids, e.target.dataset.pl) : q.trim() ? '<p class="muted">Nenhuma música encontrada.</p>' : '';
      refreshIndicators();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeMenu();
      if (!$('#modal').hidden) closeModal();
    }
    if (e.target.matches('input, textarea')) {
      if (e.key === 'Escape') e.target.blur();
      if (e.key === 'Enter' && e.target.id === 'edName') saveEdit($('[data-action="save-edit"]').dataset.id);
      return;
    }
    const mod = e.ctrlKey || e.metaKey;
    if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
    else if (mod && e.key === 'ArrowRight') { e.preventDefault(); next(); }
    else if (mod && e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    else if (e.key === 'ArrowRight' && audio.duration) audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
    else if (e.key === 'ArrowLeft' && audio.duration) audio.currentTime = Math.max(0, audio.currentTime - 5);
    else if (mod && e.key === 'ArrowUp') { e.preventDefault(); setVolume(clamp(state.volume + 0.1, 0, 1)); }
    else if (mod && e.key === 'ArrowDown') { e.preventDefault(); setVolume(clamp(state.volume - 0.1, 0, 1)); }
    else if (mod && e.key.toLowerCase() === 'k') { e.preventDefault(); $('#search').focus(); }
    else if (e.key.toLowerCase() === 's' && !mod) toggleShuffle();
    else if (e.key.toLowerCase() === 'r' && !mod) cycleRepeat();
    else if (e.key.toLowerCase() === 'm' && !mod) toggleMute();
  });

  $('#mainScroll').addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('hashchange', () => route());

  // ---------- inicialização ----------
  $$('[data-ic]').forEach(el => (el.outerHTML = ic(el.dataset.ic, el.closest('.ctrl-btns, .extras') ? 16 : 24)));
  $('#app').classList.toggle('lib-collapsed', state.libCollapsed);
  audio.volume = state.volume;

  if (state.current && DB.track(state.current)) {
    const ids = state.context ? contextTracks(state.context) : [];
    if (!ids.includes(state.current)) state.context = null;
    state.original = ids.includes(state.current) ? ids : [state.current];
    buildQueue(state.current);
  } else {
    state.current = null;
    state.context = null;
  }

  renderLibrary();
  updateVolume();
  route();
  updateAll();
})();
