(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // localStorage pode falhar (aba anônima, bloqueio), o app funciona sem ele.
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
    },
  };
  const session = {
    get(key) { try { return sessionStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { sessionStorage.setItem(key, value); } catch { /* ignore */ } },
    remove(key) { try { sessionStorage.removeItem(key); } catch { /* ignore */ } },
  };

  // ---------- Ícones ----------
  const F = 'fill="currentColor" stroke="none"';
  const P = {
    play: `<path ${F} d="M6 4.2v15.6a1 1 0 0 0 1.5.86l13.1-7.8a1 1 0 0 0 0-1.72L7.5 3.34A1 1 0 0 0 6 4.2Z"/>`,
    pause: `<rect ${F} x="5" y="4" width="5" height="16" rx="1"/><rect ${F} x="14" y="4" width="5" height="16" rx="1"/>`,
    plus: '<path d="M12 4.5v15M4.5 12h15"/>',
    plusCircle: '<circle cx="12" cy="12" r="10"/><path d="M12 7v10M7 12h10"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    like: '<path class="ico-like" d="M7 10.5V20H4.5a1 1 0 0 1-1-1v-7.5a1 1 0 0 1 1-1H7Zm0 0 3.6-6.4a1.7 1.7 0 0 1 3.1 1.2L13 10h5.6a2 2 0 0 1 2 2.3l-1.1 6A2 2 0 0 1 17.5 20H7"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    caret: `<path ${F} d="M7 10h10l-5 6z"/>`,
    left: '<path d="m15 5-7 7 7 7"/>',
    right: '<path d="m9 5 7 7-7 7"/>',
    info: '<circle cx="12" cy="12" r="9.5"/><path d="M12 11v6M12 7.5v.01"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
    bell: '<path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 1.8h-15L6 16.5Z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    volumeOn: '<path d="M4 9h3.5L13 4.5v15L7.5 15H4V9Z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
    volumeOff: '<path d="M4 9h3.5L13 4.5v15L7.5 15H4V9Z"/><path d="m16.5 9.5 5 5M21.5 9.5l-5 5"/>',
    back: '<path d="M20 12H4m7-7-7 7 7 7"/>',
    rewind: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3L4.5 9"/><path d="M4.5 4.5V9H9"/><text x="12.6" y="15.4" font-size="6.6" font-weight="700" text-anchor="middle" fill="currentColor" stroke="none" font-family="Arial">10</text>',
    forward: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3L19.5 9"/><path d="M19.5 4.5V9H15"/><text x="11.4" y="15.4" font-size="6.6" font-weight="700" text-anchor="middle" fill="currentColor" stroke="none" font-family="Arial">10</text>',
    next: `<path ${F} d="M5 5.2v13.6a.8.8 0 0 0 1.2.7L16 12.7a.8.8 0 0 0 0-1.4L6.2 4.5a.8.8 0 0 0-1.2.7Z"/><path d="M19 5v14"/>`,
    subtitles: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 15h4M13 15h4M7 11h10"/>',
    fullscreen: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    pencil: '<path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
    help: '<circle cx="12" cy="12" r="9.5"/><path d="M9.5 9.3a2.6 2.6 0 0 1 5 .9c0 1.8-2.5 2.2-2.5 4M12 17.3v.01"/>',
    facebook: `<path ${F} d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4A20 20 0 0 0 14.3 4c-2.2 0-3.8 1.4-3.8 3.9v2.6H8v3h2.5V21h3Z"/>`,
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17 7v.01"/>',
    x: `<path ${F} d="M17.2 3.5h3l-6.6 7.5 7.8 9.5h-6.1l-4.8-6-5.4 6h-3l7-8L3.4 3.5h6.2l4.3 5.5 3.3-5.5Zm-1.1 15.3h1.7L8 5.1H6.2l9.9 13.7Z"/>`,
    youtube: `<path d="M21 8.2a3 3 0 0 0-2.1-2.1C17.1 5.6 12 5.6 12 5.6s-5.1 0-6.9.5A3 3 0 0 0 3 8.2 31 31 0 0 0 2.6 12a31 31 0 0 0 .4 3.8 3 3 0 0 0 2.1 2.1c1.8.5 6.9.5 6.9.5s5.1 0 6.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-3.8 31 31 0 0 0-.4-3.8Z"/><path ${F} d="m10.2 15 4.6-3-4.6-3v6Z"/>`,
  };
  const icon = name => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name]}</svg>`;

  // ---------- Dados e utilitários ----------
  const TITLES = window.TITLES;
  const byId = Object.fromEntries(TITLES.map(t => [t.id, t]));
  const KIDS_AGES = ['L', '10', '12'];
  const AGE_TEXT = {
    L: 'Livre para todos os públicos',
    10: 'Não recomendado para menores de 10 anos',
    12: 'Não recomendado para menores de 12 anos',
    14: 'Não recomendado para menores de 14 anos',
    16: 'Não recomendado para menores de 16 anos',
    18: 'Não recomendado para menores de 18 anos',
  };
  const AGE_WARN = { L: '', 10: 'medo', 12: 'violência', 14: 'violência, linguagem imprópria', 16: 'violência, drogas, linguagem imprópria', 18: 'violência extrema, conteúdo sexual' };

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const img = (o, w, h) => `https://picsum.photos/seed/nfx-${encodeURIComponent(o.seed || o.id)}/${w}/${h}`;
  const imgTag = (o, w, h, lazy = true) => `<img src="${img(o, w, h)}" alt=""${lazy ? ' loading="lazy"' : ''} onerror="this.style.display='none'">`;
  const ageBadge = age => `<span class="age age--${age}" title="${AGE_TEXT[age]}">${age}</span>`;
  const filmLength = m => `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}min` : ''}`;
  const lengthLabel = t => t.type === 'serie'
    ? (t.seasons > 1 ? `${t.seasons} temporadas` : `${episodes(t, 1).length} episódios`)
    : filmLength(t.min);

  // Gerador pseudoaleatório com semente: os mesmos episódios aparecem sempre.
  function rng(seed) {
    let h = 1779033703;
    for (const c of String(seed)) h = Math.imul(h ^ c.charCodeAt(0), 3432918353), h = (h << 13) | (h >>> 19);
    return () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  }
  const hue = id => Math.floor(rng(id)() * 360);

  const EP_NAMES = ['O começo do fim', 'Sem volta', 'Linhas cruzadas', 'A verdade', 'Ponto cego', 'Tempestade', 'Fuga',
    'O preço', 'Revelações', 'Laços de sangue', 'Último ato', 'Ruído', 'Maré alta', 'A outra margem', 'Queda livre', 'Silêncio'];
  const EP_DESCS = [
    'Uma descoberta inesperada coloca todos em alerta e força uma decisão que não pode ser desfeita.',
    'Enquanto velhas alianças se desfazem, alguém do grupo começa a esconder o jogo.',
    'Uma visita surpresa reabre feridas antigas, e traz uma pista que muda tudo.',
    'Pressionados pelo tempo, eles arriscam um plano ousado. Nem todos concordam com o preço.',
    'O passado volta a bater à porta, e a confiança entre os personagens é posta à prova.',
    'Uma noite caótica termina com uma revelação que ninguém estava preparado para ouvir.',
    'Sem saída, a equipe precisa contar com a ajuda de quem menos esperava.',
    'Segredos vêm à tona e o conflito chega a um ponto sem retorno.',
  ];
  function episodes(t, season) {
    const r = rng(`${t.id}-s${season}`);
    const n = 6 + Math.floor(r() * 4);
    const names = [...EP_NAMES].sort(() => r() - 0.5);
    return Array.from({ length: n }, (_, i) => ({
      n: i + 1,
      name: season === 1 && i === 0 ? 'Piloto' : names[i],
      min: t.min - 6 + Math.floor(r() * 13),
      desc: EP_DESCS[Math.floor(r() * EP_DESCS.length)],
      seed: `${t.id}-s${season}e${i + 1}`,
    }));
  }

  function similar(t, list) {
    return list
      .filter(o => o !== t)
      .map(o => ({ o, score: o.genres.filter(g => t.genres.includes(g)).length * 10 + (o.type === t.type ? 3 : 0) + o.match / 100 }))
      .filter(x => x.score >= 10)
      .sort((a, b) => b.score - a.score)
      .slice(0, 9)
      .map(x => x.o);
  }

  // ---------- Estado ----------
  const PROFILE_COLORS = ['#0071eb', '#e50914', '#e5b109', '#2fa84f', '#8c43d6', '#e8641b'];
  let profiles = store.get('nfx:profiles', window.PROFILES);
  const state = { profile: null, view: 'home', genre: '', query: '', myList: [], likes: [], progress: {} };
  const pkey = k => `nfx:${state.profile.id}:${k}`;
  const pool = () => (state.profile && state.profile.kids ? TITLES.filter(t => KIDS_AGES.includes(t.age)) : TITLES);
  const saveProfiles = () => store.set('nfx:profiles', profiles);

  const app = $('#app'), header = $('#header'), main = $('#main'), hero = $('#hero'), rowsEl = $('#rows');
  const subhead = $('#subhead'), modal = $('#modal'), modalBox = $('#modalBox');

  // Ícones estáticos do HTML
  $$('[data-icon]').forEach(el => el.insertAdjacentHTML('afterbegin', icon(el.dataset.icon)));

  // ---------- Avatares ----------
  function avatar(p) {
    const fill = p.kids ? `url(#g-${p.id})` : p.color;
    return `<svg class="avatar" viewBox="0 0 100 100" aria-hidden="true">
      ${p.kids ? `<defs><linearGradient id="g-${p.id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff4d6d"/><stop offset=".5" stop-color="#ffb703"/><stop offset="1" stop-color="#3a86ff"/></linearGradient></defs>` : ''}
      <rect width="100" height="100" fill="${fill}"/>
      <rect x="28" y="30" width="8" height="15" rx="2" fill="#fff"/>
      <rect x="64" y="30" width="8" height="15" rx="2" fill="#fff"/>
      <path d="M25 60c13 15 37 15 50 0" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
    </svg>`;
  }

  // =========================================================
  // Tela de perfis
  // =========================================================
  const profilesEl = $('#profiles');

  function renderProfiles() {
    const manage = profilesEl.classList.contains('manage');
    $('#profilesTitle').textContent = manage ? 'Gerenciar perfis:' : 'Quem está assistindo?';
    $('#manageBtn').textContent = manage ? 'Concluído' : 'Gerenciar perfis';
    $('#profilesList').innerHTML = profiles.map(p => `
      <li class="profile" data-id="${p.id}">
        <button class="profile__pick" aria-label="${manage ? 'Editar' : 'Entrar como'} ${esc(p.name)}">
          <span class="profile__avatar">${avatar(p)}<span class="profile__edit">${icon('pencil')}</span></span>
        </button>
        <span class="profile__name">${esc(p.name)}</span>
      </li>`).join('') +
      (profiles.length < 5 ? `
      <li class="profile profile--add" data-add>
        <button class="profile__pick" aria-label="Adicionar perfil"><span class="profile__avatar">${icon('plusCircle')}</span></button>
        <span class="profile__name">Adicionar perfil</span>
      </li>` : '');
  }

  function renameProfile(li, p) {
    const nameEl = $('.profile__name', li);
    const input = document.createElement('input');
    input.className = 'profile__input';
    input.value = p.name;
    input.maxLength = 16;
    nameEl.replaceWith(input);
    input.focus();
    input.select();
    const done = () => {
      p.name = input.value.trim() || p.name;
      saveProfiles();
      renderProfiles();
    };
    input.addEventListener('blur', done, { once: true });
    input.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === 'Escape') input.blur(); });
  }

  $('#profilesList').addEventListener('click', e => {
    const li = e.target.closest('.profile');
    if (!li || e.target.closest('input')) return;
    const manage = profilesEl.classList.contains('manage');
    if (li.hasAttribute('data-add')) {
      const used = profiles.filter(p => !p.kids).length;
      const p = { id: `p${Date.now()}`, name: `Perfil ${profiles.length + 1}`, color: PROFILE_COLORS[used % PROFILE_COLORS.length] };
      const kidsIndex = profiles.findIndex(x => x.kids);
      profiles.splice(kidsIndex < 0 ? profiles.length : kidsIndex, 0, p);
      saveProfiles();
      renderProfiles();
      renameProfile($(`.profile[data-id="${p.id}"]`), p);
      return;
    }
    const p = profiles.find(x => x.id === li.dataset.id);
    if (manage) renameProfile(li, p);
    else selectProfile(p);
  });

  $('#manageBtn').addEventListener('click', () => {
    profilesEl.classList.toggle('manage');
    renderProfiles();
  });

  function selectProfile(p, animate = true) {
    state.profile = p;
    session.set('nfx:current', p.id);
    state.myList = store.get(pkey('list'), p.kids ? ['turma', 'asas'] : ['ecos', 'horizonte', 'golpe', 'lisboa']);
    state.likes = store.get(pkey('likes'), []);
    state.progress = store.get(pkey('progress'),
      Object.fromEntries(TITLES.filter(t => t.progress && (!p.kids || KIDS_AGES.includes(t.age))).map(t => [t.id, t.progress])));
    state.view = 'home';
    state.genre = '';
    heroKey = '';
    clearSearch(false);
    $('#headerAvatar').innerHTML = avatar(p);
    renderProfileMenu();
    renderNotifications();
    app.hidden = false;
    if (!animate) profilesEl.style.transition = 'none';
    profilesEl.classList.add('hide');
    profilesEl.classList.remove('manage');
    if (!animate) requestAnimationFrame(() => { profilesEl.style.transition = ''; });
    window.scrollTo(0, 0);
    render();
  }

  function showProfiles(manage = false) {
    closePlayer();
    closeModal();
    closeDropdowns();
    session.remove('nfx:current');
    profilesEl.classList.toggle('manage', manage);
    renderProfiles();
    profilesEl.classList.remove('hide');
  }

  function renderProfileMenu() {
    $('#profileMenuList').innerHTML = profiles
      .filter(p => p.id !== state.profile.id)
      .map(p => `<li><button data-switch="${p.id}"><span class="mini-avatar">${avatar(p)}</span>${esc(p.name)}</button></li>`)
      .join('');
  }

  function renderNotifications() {
    const items = pool().filter(t => t.isNew || t.newEp).slice(0, 5);
    const when = ['hoje', 'ontem', 'há 2 dias', 'há 3 dias', 'há 1 semana'];
    $('#notifList').innerHTML = items.map((t, i) => `
      <li><button data-action="info" data-id="${t.id}">
        ${imgTag(t, 224, 126)}
        <span><b>${t.newEp ? 'Novos episódios' : 'Chegou à Netflix'}</b>${t.title}<small>${when[i]}</small></span>
      </button></li>`).join('');
    $('#bellCount').textContent = items.length || '';
  }

  // =========================================================
  // Renderização das páginas
  // =========================================================
  let rowData = [];
  let heroKey = '';
  let heroTimer = 0;

  function render() {
    closePreview(true);
    rowData = [];
    const v = state.view;
    const all = pool();
    $$('[data-view]').forEach(a => a.classList.toggle('active', a.dataset.view === v && !state.query));
    subhead.hidden = !!state.query || !(v === 'serie' || v === 'filme');

    let html = '';
    let showHero = false;

    if (state.query) {
      html = searchHTML(state.query, all);
    } else if (v === 'home') {
      showHero = true;
      renderHero(all, v);
      html = homeRows(all);
    } else if (v === 'serie' || v === 'filme') {
      const items = all.filter(t => t.type === v);
      $('#subheadTitle').textContent = v === 'serie' ? 'Séries' : 'Filmes';
      fillGenreSelect(items);
      if (state.genre) {
        html = gridHTML(state.genre, items.filter(t => t.genres.includes(state.genre)));
      } else {
        showHero = true;
        renderHero(items, v);
        html = typeRows(items, v);
      }
    } else if (v === 'new') {
      html = `<h1 class="page-title">Bombando</h1>${newRows(all)}`;
    } else if (v === 'mylist') {
      const items = state.myList.map(id => byId[id]).filter(t => t && all.includes(t));
      html = gridHTML('Minha lista', items, `<div class="empty"><p>Você ainda não adicionou nenhum título à sua lista.</p><p>Passe o mouse sobre um título e clique em <b>+</b> para salvá-lo aqui.</p></div>`);
    }

    hero.hidden = !showHero;
    main.classList.toggle('no-hero', !showHero);
    main.classList.toggle('has-subhead', !subhead.hidden);
    rowsEl.innerHTML = html;
    initSliders(rowsEl);
  }

  function renderHero(items, view) {
    const key = `${state.profile.id}:${view}`;
    if (key === heroKey && hero.innerHTML) return;
    heroKey = key;
    const featured = items.filter(t => t.featured);
    const list = featured.length ? featured : items;
    const t = list[Math.floor(Math.random() * list.length)];
    if (!t) { hero.innerHTML = ''; return; }
    const kind = t.type === 'serie' ? 'séries' : 'filmes';
    hero.classList.remove('hero--compact');
    hero.innerHTML = `
      <div class="hero__bg" style="background-image:url(${img(t, 1600, 900)})"></div>
      <div class="hero__shade"></div>
      <div class="hero__content">
        ${t.original ? `<div class="hero__kicker"><span class="n">N</span>${t.type === 'serie' ? 'SÉRIE' : 'FILME'}</div>` : ''}
        <h1 class="hero__title">${t.title}</h1>
        ${t.top ? `<p class="hero__rank"><span class="card__top">TOP<b>10</b></span>Top ${t.top} em ${kind} hoje</p>` : ''}
        <p class="hero__desc">${t.desc}</p>
        <div class="hero__buttons">
          <button class="btn btn--play" data-action="play" data-id="${t.id}">${icon('play')}Assistir</button>
          <button class="btn btn--info" data-action="info" data-id="${t.id}">${icon('info')}Mais informações</button>
        </div>
      </div>
      <div class="hero__side">
        <button class="mute" data-action="mute" aria-label="Ativar som">${icon('volumeOff')}</button>
        <span class="rating-tag">${ageBadge(t.age)}</span>
      </div>`;
    clearTimeout(heroTimer);
    heroTimer = setTimeout(() => hero.classList.add('hero--compact'), 8000);
  }

  const byTop = list => list.filter(t => t.top).sort((a, b) => a.top - b.top).slice(0, 10);
  const byTrend = list => [...list].sort((a, b) => (b.trending | 0) - (a.trending | 0) || b.year - a.year || b.match - a.match);
  const hasGenre = (...g) => t => g.some(x => t.genres.includes(x));

  function homeRows(all) {
    const S = all.filter(t => t.type === 'serie');
    const Fm = all.filter(t => t.type === 'filme');
    const cont = Object.keys(state.progress).map(id => byId[id]).filter(t => t && all.includes(t));
    const mine = state.myList.map(id => byId[id]).filter(t => t && all.includes(t));
    return [
      row(`Continuar assistindo como ${esc(state.profile.name)}`, cont, 'progress'),
      row('Em alta', byTrend(all).slice(0, 12)),
      row('Top 10 séries no Brasil hoje', byTop(S), 'top'),
      row('Minha lista', mine),
      row('Produções originais', all.filter(t => t.original)),
      row('Filmes de ação e aventura', Fm.filter(hasGenre('Ação', 'Aventura'))),
      row('Top 10 filmes no Brasil hoje', byTop(Fm), 'top'),
      cont[0] ? row(`Porque você assistiu ${cont[0].title}`, similar(cont[0], all)) : '',
      row('Ficção científica e fantasia', all.filter(hasGenre('Ficção científica', 'Fantasia'))),
      row('Suspense e terror', all.filter(hasGenre('Suspense', 'Terror'))),
      row('Comédias para dar risada', all.filter(hasGenre('Comédia'))),
      row('Crimes e mistérios', all.filter(hasGenre('Policial', 'Mistério'))),
      row('Documentários e reality shows', all.filter(hasGenre('Documentário', 'Reality'))),
      row('Para assistir em família', all.filter(t => KIDS_AGES.includes(t.age))),
      row('Lançamentos', all.filter(t => t.isNew)),
    ].join('');
  }

  function typeRows(items, v) {
    const label = v === 'serie' ? 'séries' : 'filmes';
    const Label = label[0].toUpperCase() + label.slice(1);
    const genres = [...new Set(items.flatMap(t => t.genres))];
    return [
      row(`Top 10 ${label} no Brasil hoje`, byTop(items), 'top'),
      row(`${Label} em alta`, byTrend(items)),
      row(`${Label} originais`, items.filter(t => t.original)),
      ...genres.map(g => {
        const list = items.filter(t => t.genres.includes(g));
        return list.length >= 2 ? row(g, list) : '';
      }),
    ].join('');
  }

  function newRows(all) {
    return [
      row('Novidades na Netflix', all.filter(t => t.isNew || t.newEp)),
      row('Top 10 séries no Brasil hoje', byTop(all.filter(t => t.type === 'serie')), 'top'),
      row('Top 10 filmes no Brasil hoje', byTop(all.filter(t => t.type === 'filme')), 'top'),
      row('Lançados em 2026', all.filter(t => t.year === 2026)),
      row('Chegaram em 2025', all.filter(t => t.year === 2025)),
    ].join('');
  }

  function fillGenreSelect(items) {
    const genres = [...new Set(items.flatMap(t => t.genres))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
    const sel = $('#genreSelect');
    sel.innerHTML = `<option value="">Gêneros</option>${genres.map(g => `<option>${g}</option>`).join('')}`;
    sel.value = state.genre;
  }

  const gridHTML = (title, items, empty = '', back = false) => `
    <section class="grid-page">
      ${back ? `<button class="back-link" data-back>${icon('left')}Voltar</button>` : ''}
      <h1 class="page-title">${title}</h1>
      ${items.length ? `<div class="grid">${items.map(t => card(t)).join('')}</div>` : empty}
    </section>`;

  function searchHTML(q, all) {
    const n = norm(q);
    const items = all.filter(t => norm([t.title, ...t.genres, ...t.cast, ...t.mood, t.creator, t.type === 'serie' ? 'série séries' : 'filme filmes'].join(' ')).includes(n));
    if (!items.length) {
      return `<section class="grid-page"><div class="empty">
        <p>Sua busca por "${esc(q)}" não encontrou resultados.</p>
        <p>Sugestões:</p>
        <ul><li>Tente palavras diferentes</li><li>Procure por um título de filme ou série</li><li>Busque por gênero, como comédia, romance, suspense ou drama</li></ul>
      </div></section>`;
    }
    const related = [...new Set(items.flatMap(t => t.genres))].slice(0, 6);
    return `<section class="grid-page">
      <p class="search-related">Explore títulos relacionados a: ${related.map(g => `<button data-search="${g}">${g}</button>`).join('<span>|</span>')}</p>
      <div class="grid">${items.map(t => card(t)).join('')}</div>
    </section>`;
  }

  // ---------- Linhas e cards ----------
  function row(title, items, kind = '') {
    if (!items.length) return '';
    const i = rowData.push({ title, items }) - 1;
    const cards = items.map((t, n) => (kind === 'top' ? topCard(t, n + 1) : card(t, kind === 'progress'))).join('');
    return `<section class="row" data-row="${i}">
      <h2 class="row__title"><button class="row__link" data-explore="${i}">${title}<span class="row__explore">Ver tudo${icon('right')}</span></button></h2>
      <div class="slider">
        <button class="slider__btn slider__btn--prev is-hidden" aria-label="Anterior">${icon('left')}</button>
        <div class="track">${cards}</div>
        <button class="slider__btn slider__btn--next" aria-label="Próximo">${icon('right')}</button>
        <ul class="slider__pages" aria-hidden="true"></ul>
      </div>
    </section>`;
  }

  function card(t, withProgress = false) {
    const prog = withProgress ? state.progress[t.id] : 0;
    const badge = prog ? '' : t.newEp ? 'Novos episódios' : t.isNew ? 'Novidade' : '';
    const cls = `card${badge ? ' card--badged' : ''}${prog ? ' card--progress' : ''}`;
    return `<article class="${cls}" data-id="${t.id}" style="--h:${hue(t.id)}" tabindex="0" role="button" aria-label="${t.title}">
      ${imgTag(t, 480, 270)}
      ${t.original ? '<span class="card__n">N</span>' : ''}
      ${t.top ? '<span class="card__top">TOP<b>10</b></span>' : ''}
      <h3 class="card__title">${t.title}</h3>
      ${badge ? `<span class="card__badge">${badge}</span>` : ''}
      ${prog ? `<span class="card__progress"><span style="width:${prog}%"></span></span>` : ''}
    </article>`;
  }

  function topCard(t, rank) {
    return `<article class="card card--top" data-id="${t.id}" style="--h:${hue(t.id)}" tabindex="0" role="button" aria-label="${rank}º lugar: ${t.title}">
      <svg class="top__num" viewBox="0 0 80 100" aria-hidden="true">
        <text x="${rank === 10 ? 44 : 46}" y="97" text-anchor="middle"${rank === 10 ? ' textLength="84" lengthAdjust="spacingAndGlyphs"' : ''}>${rank}</text>
      </svg>
      <div class="top__poster">
        ${imgTag(t, 300, 450)}
        ${t.original ? '<span class="card__n">N</span>' : ''}
        <h3 class="card__title">${t.title}</h3>
      </div>
    </article>`;
  }

  // ---------- Carrosséis ----------
  function initSliders(root) {
    $$('.slider', root).forEach(sl => {
      const track = $('.track', sl);
      const prev = $('.slider__btn--prev', sl);
      const next = $('.slider__btn--next', sl);
      const pages = $('.slider__pages', sl);
      const step = () => {
        const cs = getComputedStyle(track);
        return track.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) + (parseFloat(cs.columnGap) || 0);
      };
      const update = () => {
        const max = track.scrollWidth - track.clientWidth;
        const s = step();
        prev.classList.toggle('is-hidden', track.scrollLeft < 5);
        next.classList.toggle('is-hidden', track.scrollLeft > max - 5);
        const n = max > 5 ? Math.ceil(max / s - 0.05) + 1 : 1;
        const cur = track.scrollLeft > max - 5 ? n - 1 : Math.round(track.scrollLeft / s);
        pages.innerHTML = n > 1 ? Array.from({ length: n }, (_, i) => `<li${i === cur ? ' class="on"' : ''}></li>`).join('') : '';
      };
      prev.addEventListener('click', () => { closePreview(); track.scrollBy({ left: -step(), behavior: 'smooth' }); });
      next.addEventListener('click', () => { closePreview(); track.scrollBy({ left: step(), behavior: 'smooth' }); });
      let raf = 0;
      track.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
      sl._update = update;
      update();
    });
  }

  let resizeT = 0;
  window.addEventListener('resize', () => {
    closePreview(true);
    clearTimeout(resizeT);
    resizeT = setTimeout(() => $$('.slider').forEach(s => s._update && s._update()), 150);
  });

  // =========================================================
  // Pré-visualização ao passar o mouse
  // =========================================================
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  let hoverTimer = 0, hoverCard = null, previewEl = null;

  document.addEventListener('mouseover', e => {
    if (!canHover.matches) return;
    if (e.target.closest('.preview')) return;
    const c = e.target.closest('.track .card, .grid .card');
    if (c === hoverCard) return;
    clearTimeout(hoverTimer);
    hoverCard = c;
    if (c) hoverTimer = setTimeout(() => showPreview(c), 480);
  });

  const listBtn = (t, cls = 'circle') => {
    const on = state.myList.includes(t.id);
    const label = on ? 'Remover da Minha lista' : 'Adicionar à Minha lista';
    return `<button class="${cls}${on ? ' on' : ''}" data-action="list" data-id="${t.id}" title="${label}" aria-label="${label}">${icon(on ? 'check' : 'plus')}</button>`;
  };
  const likeBtn = (t, cls = 'circle') => {
    const on = state.likes.includes(t.id);
    const label = on ? 'Classificado: gostei' : 'Gostei';
    return `<button class="${cls}${on ? ' on' : ''}" data-action="like" data-id="${t.id}" title="${label}" aria-label="${label}" aria-pressed="${on}">${icon('like')}</button>`;
  };

  function previewHTML(t) {
    const prog = state.progress[t.id];
    const remaining = Math.max(1, Math.round(t.min * (1 - (prog || 0) / 100)));
    return `
      <div class="preview__media" data-action="info" data-id="${t.id}" style="--h:${hue(t.id)}">
        ${imgTag(t, 480, 270, false)}
        ${t.original ? '<span class="card__n">N</span>' : ''}
        <h3 class="card__title">${t.title}</h3>
      </div>
      <div class="preview__body">
        <div class="preview__actions">
          <button class="circle circle--white" data-action="play" data-id="${t.id}" title="${prog ? 'Continuar' : 'Assistir'}" aria-label="${prog ? 'Continuar' : 'Assistir'}">${icon('play')}</button>
          ${listBtn(t)}
          ${likeBtn(t)}
          <button class="circle circle--right" data-action="info" data-id="${t.id}" title="Episódios e informações" aria-label="Mais informações">${icon('chevronDown')}</button>
        </div>
        <div class="meta"><span class="match">${t.match}% relevante</span>${ageBadge(t.age)}<span>${lengthLabel(t)}</span><span class="hd">HD</span></div>
        ${prog ? `<div class="preview__prog"><span class="bar"><span style="width:${prog}%"></span></span><small>${remaining} min restantes</small></div>` : ''}
        <ul class="tags">${[...t.mood.slice(0, 2), t.genres[0]].map(g => `<li>${g}</li>`).join('')}</ul>
      </div>`;
  }

  function showPreview(c) {
    if (!document.body.contains(c) || modal.classList.contains('open')) return;
    closePreview(true);
    const t = byId[c.dataset.id];
    const r = c.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const w = Math.min(Math.max(r.width * 1.5, 300), 440);
    const mediaH = (w * 9) / 16;
    const left = Math.min(Math.max(r.left + r.width / 2 - w / 2, 12), vw - w - 12);
    const top = r.top + window.scrollY + r.height / 2 - mediaH / 2 - 8;
    const el = document.createElement('div');
    el.className = 'preview';
    el.style.cssText = `left:${left}px;top:${top}px;width:${w}px;--from:${(r.width / w).toFixed(3)};transform-origin:${r.left + r.width / 2 - left}px ${mediaH / 2}px`;
    el.innerHTML = previewHTML(t);
    el.addEventListener('mouseleave', () => { hoverCard = null; closePreview(); });
    document.body.appendChild(el);
    previewEl = el;
  }

  function closePreview(immediate = false) {
    clearTimeout(hoverTimer);
    const el = previewEl;
    if (!el) return;
    previewEl = null;
    if (immediate) { el.remove(); return; }
    el.classList.add('out');
    setTimeout(() => el.remove(), 200);
  }

  // =========================================================
  // Modal de detalhes
  // =========================================================
  function episodesHTML(t, season) {
    const seasons = Array.from({ length: t.seasons }, (_, i) => i + 1);
    return `<section class="modal__section episodes" data-id="${t.id}">
      <div class="episodes__head">
        <h3>Episódios</h3>
        ${t.seasons > 1
          ? `<select class="season-select" aria-label="Temporada">${seasons.map(s => `<option value="${s}"${s === season ? ' selected' : ''}>Temporada ${s}</option>`).join('')}</select>`
          : '<span class="season-label">Temporada 1</span>'}
      </div>
      <ol class="episodes__list">
        ${episodes(t, season).map(ep => `
          <li class="episode" data-action="play" data-id="${t.id}" data-ep="${season}:${ep.n}" tabindex="0">
            <span class="episode__n">${ep.n}</span>
            <div class="episode__thumb">${imgTag(ep, 300, 169)}<span class="episode__play">${icon('play')}</span></div>
            <div class="episode__info">
              <div class="episode__top"><h4>${ep.name}</h4><span>${ep.min}min</span></div>
              <p>${ep.desc}</p>
            </div>
          </li>`).join('')}
      </ol>
    </section>`;
  }

  const simCard = t => `
    <article class="sim" data-id="${t.id}" tabindex="0">
      <div class="sim__img" style="--h:${hue(t.id)}">
        ${imgTag(t, 480, 270)}
        <span class="sim__len">${lengthLabel(t)}</span>
        <h4 class="card__title">${t.title}</h4>
        <span class="sim__play">${icon('play')}</span>
      </div>
      <div class="sim__body">
        <div class="sim__head">
          <div><span class="match">${t.match}% relevante</span><div class="sim__meta">${ageBadge(t.age)}<span>${t.year}</span></div></div>
          ${listBtn(t)}
        </div>
        <p>${t.desc}</p>
      </div>
    </article>`;

  function openModal(t) {
    if (!t) return;
    closePreview(true);
    closeDropdowns();
    const prog = state.progress[t.id];
    const kind = t.type === 'serie' ? 'séries' : 'filmes';
    const sims = similar(t, pool());
    modalBox.innerHTML = `
      <button class="modal__close" data-close aria-label="Fechar">${icon('close')}</button>
      <div class="modal__hero" style="--h:${hue(t.id)}">
        ${imgTag(t, 1200, 675, false)}
        <div class="modal__hero-content">
          ${t.original ? `<div class="hero__kicker"><span class="n">N</span>${t.type === 'serie' ? 'SÉRIE' : 'FILME'}</div>` : ''}
          <h2 class="modal__title">${t.title}</h2>
          <div class="modal__actions">
            <button class="btn btn--play" data-action="play" data-id="${t.id}">${icon('play')}${prog ? 'Continuar' : 'Assistir'}</button>
            ${listBtn(t, 'circle circle--lg')}
            ${likeBtn(t, 'circle circle--lg')}
          </div>
        </div>
      </div>
      <div class="modal__body">
        <div class="modal__grid">
          <div>
            <div class="meta"><span class="match">${t.match}% relevante</span><span>${t.year}</span>${ageBadge(t.age)}<span>${lengthLabel(t)}</span><span class="hd">HD</span><span class="hd">AD</span></div>
            ${t.top ? `<p class="modal__rank"><span class="card__top">TOP<b>10</b></span>Top ${t.top} em ${kind} hoje</p>` : ''}
            <p class="modal__desc">${t.desc}</p>
          </div>
          <div class="modal__side">
            <p><span>Elenco:</span> ${t.cast.slice(0, 3).join(', ')}${t.cast.length > 3 ? ', <i>mais</i>' : ''}</p>
            <p><span>Gêneros:</span> ${t.genres.join(', ')}</p>
            <p><span>Este título é:</span> ${t.mood.join(', ')}</p>
          </div>
        </div>
        ${t.type === 'serie' ? episodesHTML(t, 1) : ''}
        ${sims.length ? `<section class="modal__section"><h3>Títulos semelhantes</h3><div class="similar">${sims.map(simCard).join('')}</div></section>` : ''}
        <section class="modal__section about">
          <h3>Sobre <b>${t.title}</b></h3>
          <p><span>${t.type === 'serie' ? 'Criação:' : 'Direção:'}</span> ${t.creator}</p>
          <p><span>Elenco:</span> ${t.cast.join(', ')}</p>
          <p><span>Gêneros:</span> ${t.genres.join(', ')}</p>
          <p><span>Este título é:</span> ${t.mood.join(', ')}</p>
          <p><span>Classificação etária:</span> ${ageBadge(t.age)} ${AGE_WARN[t.age] ? `${AGE_WARN[t.age]} · ` : ''}${AGE_TEXT[t.age]}</p>
        </section>
      </div>`;
    modal.classList.add('open');
    modal.scrollTop = 0;
    document.body.classList.add('no-scroll');
    $('.modal__close', modalBox).focus({ preventScroll: true });
  }

  function closeModal() {
    if (!modal.classList.contains('open')) return;
    modal.classList.remove('open');
    if (!pl.t) document.body.classList.remove('no-scroll');
  }

  modal.addEventListener('click', e => {
    if (e.target === modal || e.target.closest('[data-close]')) closeModal();
  });

  document.addEventListener('change', e => {
    if (e.target.matches('.season-select')) {
      const section = e.target.closest('.episodes');
      section.outerHTML = episodesHTML(byId[section.dataset.id], Number(e.target.value));
    } else if (e.target.id === 'genreSelect') {
      state.genre = e.target.value;
      window.scrollTo(0, 0);
      render();
    }
  });

  // =========================================================
  // Minha lista e avaliações
  // =========================================================
  function toggleList(t) {
    const on = !state.myList.includes(t.id);
    state.myList = on ? [t.id, ...state.myList] : state.myList.filter(id => id !== t.id);
    store.set(pkey('list'), state.myList);
    $$(`[data-action="list"][data-id="${t.id}"]`).forEach(b => {
      b.classList.remove('on');
      b.outerHTML = listBtn(t, b.className);
    });
    toast(on ? `“${t.title}” foi adicionado à Minha lista` : `“${t.title}” foi removido da Minha lista`);
    if (state.view === 'mylist' && !state.query) render();
  }

  function toggleLike(t) {
    const on = !state.likes.includes(t.id);
    state.likes = on ? [...state.likes, t.id] : state.likes.filter(id => id !== t.id);
    store.set(pkey('likes'), state.likes);
    $$(`[data-action="like"][data-id="${t.id}"]`).forEach(b => {
      b.classList.remove('on');
      b.outerHTML = likeBtn(t, b.className);
    });
    if (on) toast('Obrigado! Vamos recomendar mais títulos assim.');
  }

  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove('show'), 2400);
  }

  // =========================================================
  // Player (simulado)
  // =========================================================
  const pl = { el: $('#player'), t: null, season: 0, ep: 0, cur: 0, dur: 1, playing: false, muted: false, timer: 0, idle: 0, pauseT: 0, readyT: 0 };
  const fmt = s => {
    s = Math.max(0, Math.round(s));
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = String(s % 60).padStart(2, '0');
    return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
  };

  function nextEpisode() {
    if (!pl.t || pl.t.type !== 'serie') return null;
    const total = episodes(pl.t, pl.season).length;
    if (pl.ep < total) return `${pl.season}:${pl.ep + 1}`;
    if (pl.season < pl.t.seasons) return `${pl.season + 1}:1`;
    return null;
  }

  function openPlayer(t, epStr) {
    if (!t) return;
    closePreview(true);
    closeModal();
    closeDropdowns();
    clearInterval(pl.timer);
    clearTimeout(pl.readyT);
    let ep = null;
    pl.season = 0;
    pl.ep = 0;
    if (t.type === 'serie') {
      [pl.season, pl.ep] = (epStr || '1:1').split(':').map(Number);
      ep = episodes(t, pl.season)[pl.ep - 1];
    }
    pl.t = t;
    pl.dur = (ep ? ep.min : t.min) * 60;
    pl.cur = !epStr && state.progress[t.id] ? (pl.dur * state.progress[t.id]) / 100 : 0;
    const sub = ep ? `T${pl.season}:E${pl.ep} “${ep.name}”` : '';
    $('#playerVideo').style.backgroundImage = `url(${img(ep || t, 1600, 900)})`;
    $('#playerTitle').innerHTML = `<b>${t.title}</b>${sub ? `<span>${sub}</span>` : ''}`;
    $('#playerPausedTitle').textContent = t.title;
    $('#playerPausedSub').textContent = sub || `${t.year} · ${lengthLabel(t)}`;
    $('#playerPausedDesc').textContent = ep ? ep.desc : t.desc;
    $('#playerNext').hidden = !nextEpisode();
    pl.el.classList.remove('ready', 'show-pause', 'idle');
    pl.el.classList.add('open', 'paused');
    pl.el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    $('#playerToggle').innerHTML = icon('play');
    updatePlayer();
    pl.el.focus({ preventScroll: true });
    pl.readyT = setTimeout(() => { pl.el.classList.add('ready'); setPlaying(true); }, 1200);
  }

  function setPlaying(on) {
    pl.playing = on;
    pl.el.classList.toggle('paused', !on);
    pl.el.classList.remove('show-pause');
    $('#playerToggle').innerHTML = icon(on ? 'pause' : 'play');
    clearInterval(pl.timer);
    clearTimeout(pl.pauseT);
    if (on) {
      pl.timer = setInterval(() => {
        pl.cur = Math.min(pl.cur + 1, pl.dur);
        updatePlayer();
        if (pl.cur >= pl.dur) ended();
      }, 1000);
    } else {
      pl.pauseT = setTimeout(() => pl.el.classList.add('show-pause'), 4000);
    }
    wake();
  }

  function ended() {
    const next = nextEpisode();
    if (next) openPlayer(pl.t, next);
    else closePlayer();
  }

  function updatePlayer() {
    const pct = (pl.cur / pl.dur) * 100;
    $('#playerFill').style.width = `${pct}%`;
    $('#playerKnob').style.left = `${pct}%`;
    $('#playerTime').textContent = fmt(pl.dur - pl.cur);
  }

  function skip(sec) {
    pl.cur = Math.min(Math.max(pl.cur + sec, 0), pl.dur);
    updatePlayer();
  }

  function wake() {
    pl.el.classList.remove('idle');
    clearTimeout(pl.idle);
    if (pl.playing) pl.idle = setTimeout(() => pl.el.classList.add('idle'), 3000);
  }

  function closePlayer() {
    if (!pl.t) return;
    clearInterval(pl.timer);
    clearTimeout(pl.idle);
    clearTimeout(pl.pauseT);
    clearTimeout(pl.readyT);
    const pct = Math.round((pl.cur / pl.dur) * 100);
    if (pct >= 95) delete state.progress[pl.t.id];
    else if (pl.cur > 0) {
      delete state.progress[pl.t.id];
      state.progress = { [pl.t.id]: Math.max(pct, 1), ...state.progress };
    }
    store.set(pkey('progress'), state.progress);
    pl.t = null;
    pl.playing = false;
    pl.el.classList.remove('open');
    pl.el.setAttribute('aria-hidden', 'true');
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    if (!modal.classList.contains('open')) document.body.classList.remove('no-scroll');
    if (state.view === 'home' && !state.query) render();
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else if (pl.el.requestFullscreen) pl.el.requestFullscreen().catch(() => {});
  }

  function toggleMute() {
    pl.muted = !pl.muted;
    $('#playerMute').innerHTML = icon(pl.muted ? 'volumeOff' : 'volumeOn');
  }

  pl.el.addEventListener('mousemove', wake);
  pl.el.addEventListener('click', e => {
    const b = e.target.closest('[data-player]');
    if (!b) {
      if (!e.target.closest('.player__top, .player__bottom')) setPlaying(!pl.playing);
      return;
    }
    switch (b.dataset.player) {
      case 'close': closePlayer(); break;
      case 'toggle': setPlaying(!pl.playing); break;
      case 'back10': skip(-10); break;
      case 'fwd10': skip(10); break;
      case 'mute': toggleMute(); break;
      case 'next': { const n = nextEpisode(); if (n) openPlayer(pl.t, n); break; }
      case 'subs': toast('Áudio: Português (original) · Legendas: desativadas'); break;
      case 'fs': toggleFullscreen(); break;
    }
  });

  const bar = $('#playerBar');
  const seek = e => {
    const r = bar.getBoundingClientRect();
    pl.cur = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1) * pl.dur;
    updatePlayer();
  };
  bar.addEventListener('pointerdown', e => {
    bar.setPointerCapture(e.pointerId);
    seek(e);
    bar.onpointermove = seek;
  });
  bar.addEventListener('pointerup', () => { bar.onpointermove = null; });

  // =========================================================
  // Busca
  // =========================================================
  const search = $('#search'), searchInput = $('#searchInput'), searchClear = $('#searchClear');
  let searchT = 0;

  $('#searchToggle').addEventListener('click', () => {
    search.classList.add('open');
    searchInput.focus();
  });
  searchInput.addEventListener('blur', () => {
    if (!searchInput.value) search.classList.remove('open');
  });
  searchInput.addEventListener('input', () => {
    clearTimeout(searchT);
    searchClear.hidden = !searchInput.value;
    searchT = setTimeout(() => {
      state.query = searchInput.value.trim();
      window.scrollTo(0, 0);
      render();
    }, 250);
  });
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') { clearSearch(); searchInput.blur(); }
  });
  searchClear.addEventListener('mousedown', e => e.preventDefault());
  searchClear.addEventListener('click', () => { clearSearch(); searchInput.focus(); });

  function clearSearch(rerender = true) {
    clearTimeout(searchT);
    const had = state.query;
    searchInput.value = '';
    searchClear.hidden = true;
    state.query = '';
    if (rerender && had) render();
  }

  function runSearch(q) {
    search.classList.add('open');
    searchInput.value = q;
    searchClear.hidden = false;
    state.query = q;
    window.scrollTo(0, 0);
    render();
  }

  // =========================================================
  // Navegação, menus e eventos globais
  // =========================================================
  function closeDropdowns() {
    $$('.dropdown.open').forEach(d => d.classList.remove('open'));
  }

  function go(view) {
    state.view = view;
    state.genre = '';
    clearSearch(false);
    search.classList.remove('open');
    closeDropdowns();
    window.scrollTo(0, 0);
    render();
  }

  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 0), { passive: true });

  document.addEventListener('click', e => {
    const target = e.target;

    const toggle = target.closest('[data-dropdown-toggle]');
    if (toggle && !canHover.matches) {
      const dd = toggle.closest('.dropdown');
      const wasOpen = dd.classList.contains('open');
      closeDropdowns();
      dd.classList.toggle('open', !wasOpen);
      return;
    }
    if (!target.closest('.dropdown')) closeDropdowns();

    const action = target.closest('[data-action]');
    if (action) {
      e.preventDefault();
      const t = byId[action.dataset.id];
      switch (action.dataset.action) {
        case 'play': openPlayer(t, action.dataset.ep); break;
        case 'info': openModal(t); break;
        case 'list': toggleList(t); break;
        case 'like': toggleLike(t); break;
        case 'mute': {
          const muted = action.getAttribute('aria-label') === 'Ativar som';
          action.innerHTML = icon(muted ? 'volumeOn' : 'volumeOff');
          action.setAttribute('aria-label', muted ? 'Desativar som' : 'Ativar som');
          break;
        }
      }
      return;
    }

    const c = target.closest('.card, .sim');
    if (c) { openModal(byId[c.dataset.id]); return; }

    const viewLink = target.closest('[data-view]');
    if (viewLink) { e.preventDefault(); go(viewLink.dataset.view); return; }

    const explore = target.closest('[data-explore]');
    if (explore) {
      const r = rowData[explore.dataset.explore];
      closePreview(true);
      hero.hidden = true;
      subhead.hidden = true;
      main.classList.add('no-hero');
      main.classList.remove('has-subhead');
      rowsEl.innerHTML = gridHTML(r.title, r.items, '', true);
      window.scrollTo(0, 0);
      return;
    }

    if (target.closest('[data-back]')) { render(); window.scrollTo(0, 0); return; }

    const sq = target.closest('[data-search]');
    if (sq) { runSearch(sq.dataset.search); return; }

    const sw = target.closest('[data-switch]');
    if (sw) { selectProfile(profiles.find(p => p.id === sw.dataset.switch)); return; }

    if (target.closest('[data-manage]')) { showProfiles(true); return; }
    if (target.closest('[data-signout]')) { showProfiles(false); return; }

    const tst = target.closest('[data-toast]');
    if (tst) { toast(tst.dataset.toast); return; }

    if (target.closest('[data-kids]')) {
      e.preventDefault();
      const kids = profiles.find(p => p.kids);
      if (kids && kids !== state.profile) selectProfile(kids);
      return;
    }

    if (target.closest('.footer a, .profiles__logo')) e.preventDefault();
  });

  document.addEventListener('keydown', e => {
    if (pl.t) {
      const k = e.key.toLowerCase();
      if (e.key === 'Escape' && !document.fullscreenElement) closePlayer();
      else if (k === ' ' || k === 'k') { e.preventDefault(); setPlaying(!pl.playing); }
      else if (e.key === 'ArrowRight') skip(10);
      else if (e.key === 'ArrowLeft') skip(-10);
      else if (k === 'f') toggleFullscreen();
      else if (k === 'm') toggleMute();
      wake();
      return;
    }
    if (e.key === 'Escape') {
      if (modal.classList.contains('open')) closeModal();
      closeDropdowns();
      return;
    }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.card, .sim, .episode')) {
      e.preventDefault();
      e.target.click();
    }
  });

  $('.notif').addEventListener('mouseenter', () => { $('#bellCount').textContent = ''; });

  $('#serviceCode').addEventListener('click', e => {
    const n = Math.floor(100000 + Math.random() * 900000);
    e.currentTarget.textContent = `${String(n).slice(0, 3)}-${String(n).slice(3)}`;
  });

  // ---------- Início ----------
  const saved = profiles.find(p => p.id === session.get('nfx:current'));
  if (saved) selectProfile(saved, false);
  else renderProfiles();
})();
