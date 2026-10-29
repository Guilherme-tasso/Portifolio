/* Catálogo: artistas, álbuns, faixas e playlists editoriais (todos fictícios). */
const DB = (() => {
  const GENRES = {
    lofi: { name: 'Lo-fi', color: '#8d67ab' },
    synthwave: { name: 'Synthwave', color: '#e8115b' },
    house: { name: 'House', color: '#1e3264' },
    chill: { name: 'Chill', color: '#477d95' },
    ambient: { name: 'Ambient', color: '#503750' },
    trap: { name: 'Trap', color: '#ba5d07' },
    tropical: { name: 'Tropical', color: '#148a08' },
  };

  // Estilo de capa preferido por gênero (índices de Art.cover).
  const GENRE_ART = { synthwave: [0, 4], lofi: [3, 1], ambient: [1, 3], house: [2, 4], chill: [3, 1], trap: [4, 2], tropical: [2, 3] };

  const ARTISTS = [
    { id: 'neon-lagoa', name: 'Neon Lagoa', genre: 'synthwave', bio: 'Duo de Niterói que transforma lembranças de fitas VHS e fliperamas em hinos de sintetizador para dirigir à noite.' },
    { id: 'mare-baixa', name: 'Maré Baixa', genre: 'lofi', bio: 'Produtor caiçara que grava batidas lentas num gravador de rolo herdado do avô. Trilha oficial de quem estuda de madrugada.' },
    { id: 'luz-de-vidro', name: 'Luz de Vidro', genre: 'ambient', bio: 'Projeto de paisagens sonoras criado numa casa de vidro na Serra da Mantiqueira. Música para respirar devagar.' },
    { id: 'os-satelites', name: 'Os Satélites', genre: 'house', bio: 'Coletivo paulistano nascido em festas de garagem. Quatro por quatro, grave no peito e pista cheia até o sol nascer.' },
    { id: 'clara-vento', name: 'Clara Vento', genre: 'chill', bio: 'Compositora florianopolitana que mistura violão, sintetizadores suaves e o som do mar.' },
    { id: 'pixel-tropical', name: 'Pixel Tropical', genre: 'tropical', bio: 'Videogame antigo encontra praia: marimbas digitais, dembow e muito sol em 8 bits.' },
    { id: 'noite-ambar', name: 'Noite Âmbar', genre: 'trap', bio: 'Beatmaker de Belo Horizonte com 808s pesados, sinos sombrios e hi-hats acelerados.' },
    { id: 'cafe-sintetico', name: 'Café Sintético', genre: 'lofi', bio: 'Batidas tortas e acordes de jazz feitos entre um expresso e outro, num café no centro de Curitiba.' },
  ];

  const ALBUMS = [
    { id: 'avenida-1987', artist: 'neon-lagoa', title: 'Avenida 1987', type: 'Álbum', year: 2023, label: 'Fita Cromada Discos',
      songs: ['Avenida 1987', 'Cromo e Chuva', 'Placas de Neon', 'Retrovisor', 'Última Saída', 'Horizonte VHS'] },
    { id: 'turbo-saudade', artist: 'neon-lagoa', title: 'Turbo Saudade', type: 'EP', year: 2025, label: 'Fita Cromada Discos',
      songs: ['Turbo Saudade', 'Fita Magnética', 'Arcade Noturno', 'Pôr do Sol Digital'] },
    { id: 'janela-aberta', artist: 'mare-baixa', title: 'Janela Aberta', type: 'Álbum', year: 2022, label: 'Rolo Velho',
      songs: ['Café às 7', 'Chuva no Telhado', 'Caderno Velho', 'Gato na Janela', 'Domingo Lento', 'Rua Silenciosa'] },
    { id: 'fones-e-fumaca', artist: 'mare-baixa', title: 'Fones e Fumaça', type: 'EP', year: 2024, label: 'Rolo Velho',
      songs: ['Fones e Fumaça', 'Tarde Cinza', 'Bonde 12', 'Pó de Giz'] },
    { id: 'geleira', artist: 'luz-de-vidro', title: 'Geleira', type: 'Álbum', year: 2021, label: 'Silêncio Branco',
      songs: ['Geleira', 'Respiração', 'Neblina Alta', 'Cristal', 'Silêncio Branco'] },
    { id: 'orbita-lenta', artist: 'luz-de-vidro', title: 'Órbita Lenta', type: 'EP', year: 2024, label: 'Silêncio Branco',
      songs: ['Órbita Lenta', 'Poeira Estelar', 'Eclipse Suave'] },
    { id: 'pista-infinita', artist: 'os-satelites', title: 'Pista Infinita', type: 'Álbum', year: 2024, label: 'Garagem 44',
      songs: ['Pista Infinita', 'Batida Central', 'Luz Estroboscópica', '4 da Manhã', 'Calor Humano', 'Grave no Peito'] },
    { id: 'sinal-verde', artist: 'os-satelites', title: 'Sinal Verde', type: 'Single', year: 2025, label: 'Garagem 44',
      songs: ['Sinal Verde'] },
    { id: 'maresia', artist: 'clara-vento', title: 'Maresia', type: 'Álbum', year: 2023, label: 'Ilha Records',
      songs: ['Maresia', 'Areia Morna', 'Brisa de Março', 'Varanda', 'Fim de Tarde'] },
    { id: 'folhas', artist: 'clara-vento', title: 'Folhas', type: 'EP', year: 2025, label: 'Ilha Records',
      songs: ['Folhas', 'Bicicleta', 'Sol de Inverno'] },
    { id: 'ilha-8-bit', artist: 'pixel-tropical', title: 'Ilha 8-bit', type: 'Álbum', year: 2024, label: 'Cartucho',
      songs: ['Ilha 8-bit', 'Coqueiro Binário', 'Mergulho', 'Verão Pixelado', 'Abacaxi Lunar'] },
    { id: 'calor', artist: 'pixel-tropical', title: 'Calor', type: 'Single', year: 2025, label: 'Cartucho',
      songs: ['Calor'] },
    { id: 'concreto', artist: 'noite-ambar', title: 'Concreto', type: 'Álbum', year: 2024, label: 'Âmbar Music',
      songs: ['Concreto', 'Farol Baixo', 'Madrugada', 'Sem Freio', 'Visão Noturna', 'Corrente'] },
    { id: 'eco', artist: 'noite-ambar', title: 'Eco', type: 'Single', year: 2025, label: 'Âmbar Music',
      songs: ['Eco'] },
    { id: 'expresso-duplo', artist: 'cafe-sintetico', title: 'Expresso Duplo', type: 'Álbum', year: 2023, label: 'Balcão Discos',
      songs: ['Expresso Duplo', 'Leite Vaporizado', 'Biscoito', 'Xícara Lascada', 'Balcão', 'Recibo'] },
  ];

  const artists = new Map(), albums = new Map(), tracks = new Map();

  ARTISTS.forEach(a => {
    const img = Art.artist('artist:' + a.id);
    artists.set(a.id, { ...a, image: img.src, hue: img.hue, albums: [], listeners: 0 });
  });

  ALBUMS.forEach((al, ai) => {
    const ar = artists.get(al.artist);
    const cov = Art.cover('album:' + al.id, GENRE_ART[ar.genre][ai % 2]);
    const album = { ...al, artistId: al.artist, cover: cov.src, hue: cov.hue, tracks: [] };
    al.songs.forEach((title, i) => {
      const id = `${al.id}-${i + 1}`;
      const r = rng(hashStr(id));
      const t = { id, title, n: i + 1, artistId: al.artist, albumId: al.id, genre: ar.genre, cover: cov.src };
      t.duration = Synth.duration(t);
      t.plays = Math.floor(Math.pow(r(), 2.2) * 90e6 + 40e3 * (1 + r()));
      tracks.set(id, t);
      album.tracks.push(id);
      ar.listeners += t.plays / 9;
    });
    album.plays = album.tracks.reduce((s, id) => s + tracks.get(id).plays, 0);
    albums.set(al.id, album);
    ar.albums.push(al.id);
  });

  const all = [...tracks.values()];
  const ofGenres = gs => all.filter(t => gs.includes(t.genre)).map(t => t.id);
  const mix = (key, ids, n) => shuffleArr(ids, rng(hashStr(key))).slice(0, n);
  const artistsOf = ids => {
    const names = [...new Set(ids.map(id => artists.get(tracks.get(id).artistId).name))];
    return names.slice(0, 3).join(', ') + (names.length > 3 ? ' e mais' : '');
  };

  const PLAYLISTS = [
    { id: 'mix-1', title: 'Mix do Dia 1', group: 'made', kind: 'mix', hue: 28, tracks: mix('mix-1', ofGenres(['lofi', 'chill']), 18) },
    { id: 'mix-2', title: 'Mix do Dia 2', group: 'made', kind: 'mix', hue: 330, tracks: mix('mix-2', ofGenres(['synthwave', 'trap']), 18) },
    { id: 'mix-3', title: 'Mix do Dia 3', group: 'made', kind: 'mix', hue: 200, tracks: mix('mix-3', ofGenres(['house', 'tropical']), 18) },
    { id: 'mix-4', title: 'Mix do Dia 4', group: 'made', kind: 'mix', hue: 140, tracks: mix('mix-4', ofGenres(['ambient', 'chill']), 15) },
    { id: 'descobertas', title: 'Descobertas da Semana', group: 'made', kind: 'editorial', hue: 160,
      desc: 'Sua mixtape semanal com música fresquinha. Aproveite as novidades e os cortes mais profundos escolhidos só para você.', tracks: mix('desc', all.map(t => t.id), 20) },
    { id: 'radar', title: 'Radar de Novidades', group: 'made', kind: 'editorial', hue: 45,
      desc: 'Os lançamentos mais recentes dos artistas que você segue.', tracks: all.filter(t => albums.get(t.albumId).year >= 2025).map(t => t.id) },
    { id: 'lofi-beats', title: 'Lo-fi Beats', group: 'editorial', hue: 270, desc: 'Batidas para relaxar, estudar ou só ficar de boa.', tracks: mix('lofi', ofGenres(['lofi']), 20) },
    { id: 'noites-neon', title: 'Noites de Neon', group: 'editorial', hue: 310, desc: 'Sintetizadores, cromo e asfalto molhado.', tracks: mix('neon', ofGenres(['synthwave', 'trap']), 20) },
    { id: 'foco', title: 'Foco Profundo', group: 'editorial', hue: 190, desc: 'Mantenha a calma e concentre-se com este som ambiente.', tracks: mix('foco', ofGenres(['ambient', 'lofi']), 18) },
    { id: 'energia', title: 'Energia Total', group: 'editorial', hue: 10, desc: 'Batidas aceleradas para o treino render mais.', tracks: mix('energia', ofGenres(['house', 'tropical', 'trap']), 22) },
    { id: 'verao', title: 'Verão Eterno', group: 'editorial', hue: 50, desc: 'Sol, areia e água de coco o ano inteiro.', tracks: mix('verao', ofGenres(['tropical', 'chill', 'house']), 20) },
    { id: 'hits', title: 'Hits do Momento', group: 'editorial', hue: 350, desc: 'As faixas mais tocadas agora.',
      tracks: all.slice().sort((a, b) => b.plays - a.plays).slice(0, 20).map(t => t.id) },
    { id: 'chuva-cafe', title: 'Chuva e Café', group: 'editorial', hue: 25, desc: 'Para dias cinzas, com cobertor e café quente.', tracks: mix('chuva', ofGenres(['lofi', 'ambient', 'chill']), 18) },
    { id: 'pista-quente', title: 'Pista Quente', group: 'editorial', hue: 230, desc: 'House para a pista nunca esfriar.', tracks: mix('pista', ofGenres(['house']), 12) },
  ];

  const playlists = new Map();
  PLAYLISTS.forEach(p => {
    const cov = Art.playlist(p.id, p.title, { kind: p.kind, hue: p.hue });
    const r = rng(hashStr('likes:' + p.id));
    playlists.set(p.id, {
      ...p,
      desc: p.desc || artistsOf(p.tracks),
      cover: cov.src,
      likes: Math.floor(Math.pow(r(), 1.5) * 4e6 + 2e4),
    });
  });

  function topTracks(artistId, n = 10) {
    return all.filter(t => t.artistId === artistId).sort((a, b) => b.plays - a.plays).slice(0, n).map(t => t.id);
  }

  function search(q) {
    const nq = norm(q.trim());
    if (!nq) return null;
    const score = s => {
      const n = norm(s);
      if (n === nq) return 5;
      if (n.startsWith(nq)) return 4;
      if (n.split(/\s+/).some(w => w.startsWith(nq))) return 3;
      if (n.includes(nq)) return 2;
      return 0;
    };
    const rank = (items, fn, pop) => items
      .map(x => ({ x, s: fn(x) }))
      .filter(o => o.s > 0)
      .sort((a, b) => b.s - a.s || pop(b.x) - pop(a.x));

    const tr = rank(all, t => Math.max(score(t.title), score(artists.get(t.artistId).name) * 0.7, score(albums.get(t.albumId).title) * 0.6, score(GENRES[t.genre].name) * 0.5), t => t.plays);
    const ar = rank([...artists.values()], a => Math.max(score(a.name), score(GENRES[a.genre].name) * 0.5), a => a.listeners);
    const al = rank([...albums.values()], a => Math.max(score(a.title), score(artists.get(a.artistId).name) * 0.7), a => a.plays);
    const pl = rank([...playlists.values()], p => Math.max(score(p.title), score(p.desc) * 0.4), p => p.likes);

    const candidates = [
      tr[0] && { type: 'track', id: tr[0].x.id, s: tr[0].s },
      ar[0] && { type: 'artist', id: ar[0].x.id, s: ar[0].s + 0.2 },
      al[0] && { type: 'album', id: al[0].x.id, s: al[0].s + 0.1 },
      pl[0] && { type: 'playlist', id: pl[0].x.id, s: pl[0].s },
    ].filter(Boolean).sort((a, b) => b.s - a.s);

    return {
      top: candidates[0] || null,
      tracks: tr.map(o => o.x.id),
      artists: ar.map(o => o.x.id),
      albums: al.map(o => o.x.id),
      playlists: pl.map(o => o.x.id),
    };
  }

  return {
    GENRES,
    tracks: all,
    artists: [...artists.values()],
    albums: [...albums.values()],
    playlists: [...playlists.values()],
    track: id => tracks.get(id),
    album: id => albums.get(id),
    artist: id => artists.get(id),
    playlist: id => playlists.get(id),
    genreTracks: g => all.filter(t => t.genre === g).sort((a, b) => b.plays - a.plays).map(t => t.id),
    topTracks,
    search,
  };
})();
