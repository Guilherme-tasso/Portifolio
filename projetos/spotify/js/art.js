/* Capas geradas: cada álbum, artista e playlist ganha uma arte SVG determinística. */
const Art = (() => {
  const cache = new Map();
  const uri = svg => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  const hsl = (h, s, l, a = 1) => `hsla(${Math.round(((h % 360) + 360) % 360)},${s}%,${l}%,${a})`;
  const wrap = (defs, body) => uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><defs>${defs}</defs>${body}</svg>`);
  const VIGNETTE = '<radialGradient id="vg" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient>';
  const LOGO = '<g transform="translate(14 14)"><circle cx="11" cy="11" r="11" fill="#1ed760"/><path d="M5.5 8.4c3.7-1.1 7.9-.8 11 1M6 11.5c3-.8 6.4-.5 9 .9M6.6 14.4c2.4-.6 4.9-.4 7 .7" stroke="#000" stroke-width="1.6" stroke-linecap="round" fill="none"/></g>';

  function shapes(r, h, h2, v) {
    let defs = `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${hsl(h, 70, 52)}"/><stop offset="1" stop-color="${hsl(h2, 65, 18)}"/></linearGradient>`;
    let body = '<rect width="300" height="300" fill="url(#g)"/>';

    if (v === 0) {
      // pôr do sol retrô
      const sky = hsl(h2, 60, 12), cy = 150 + r() * 20, rad = 70 + r() * 25, neon = hsl(h + 160, 100, 62);
      defs += `<linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hsl(h + 50, 100, 68)}"/><stop offset="1" stop-color="${hsl(h - 20, 90, 55)}"/></linearGradient>`;
      body = `<rect width="300" height="300" fill="${sky}"/>`;
      for (let i = 0; i < 26; i++) body += `<circle cx="${r() * 300}" cy="${r() * 170}" r="${0.5 + r() * 1.3}" fill="#fff" opacity="${0.3 + r() * 0.6}"/>`;
      body += `<circle cx="150" cy="${cy}" r="${rad + 30}" fill="${hsl(h, 90, 55, 0.18)}"/><circle cx="150" cy="${cy}" r="${rad}" fill="url(#sun)"/>`;
      for (let i = 0; i < 6; i++) body += `<rect x="0" y="${cy + 6 + i * 11}" width="300" height="${2 + i * 1.5}" fill="${sky}"/>`;
      body += `<rect y="205" width="300" height="95" fill="${hsl(h2, 70, 7)}"/><g stroke="${neon}" stroke-width="1.4" opacity=".85">`;
      for (let x = -300; x <= 600; x += 60) body += `<line x1="150" y1="205" x2="${x}" y2="300"/>`;
      for (let i = 0; i <= 6; i++) { const y = 205 + 95 * (i / 6) ** 2; body += `<line x1="0" y1="${y}" x2="300" y2="${y}"/>`; }
      body += '</g>';
    } else if (v === 1) {
      // manchas desfocadas
      defs += '<filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="24"/></filter>';
      body += '<g filter="url(#b)">';
      for (let i = 0; i < 5; i++) body += `<circle cx="${r() * 300}" cy="${r() * 300}" r="${50 + r() * 90}" fill="${hsl(h + r() * 140 - 70, 80, 50 + r() * 20)}" opacity=".85"/>`;
      body += `</g><circle cx="${90 + r() * 120}" cy="${90 + r() * 120}" r="${30 + r() * 40}" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="2"/>`;
    } else if (v === 2) {
      // grade geométrica
      const pal = [hsl(h, 75, 55), hsl(h + 40, 80, 65), hsl(h2, 60, 22), hsl(h + 180, 55, 85)];
      for (let y = 0; y < 300; y += 100) {
        for (let x = 0; x < 300; x += 100) {
          const bg = pick(r, pal), fg = pick(r, pal.filter(c => c !== bg)), rot = pick(r, [0, 90, 180, 270]);
          const tr = `transform="rotate(${rot} ${x + 50} ${y + 50})"`;
          body += `<rect x="${x}" y="${y}" width="100" height="100" fill="${bg}"/>`;
          const kind = Math.floor(r() * 5);
          if (kind === 0) body += `<path d="M${x} ${y}L${x + 100} ${y}A100 100 0 0 1 ${x} ${y + 100}Z" fill="${fg}" ${tr}/>`;
          else if (kind === 1) body += `<circle cx="${x + 50}" cy="${y + 50}" r="34" fill="${fg}"/>`;
          else if (kind === 2) body += `<path d="M${x} ${y + 50}A50 50 0 0 1 ${x + 100} ${y + 50}Z" fill="${fg}" ${tr}/>`;
          else if (kind === 3) body += `<path d="M${x} ${y + 100}L${x + 50} ${y}L${x + 100} ${y + 100}Z" fill="${fg}" ${tr}/>`;
        }
      }
    } else if (v === 3) {
      // ondas
      body += `<circle cx="${80 + r() * 140}" cy="${60 + r() * 40}" r="${26 + r() * 20}" fill="${hsl(h + 40, 90, 80)}" opacity=".9"/>`;
      for (let i = 0; i < 6; i++) {
        const y0 = 110 + i * 32, amp = 20 + r() * 35;
        body += `<path d="M0 ${y0}C75 ${y0 - amp} 150 ${y0 + amp} 300 ${y0 - amp * 0.5}L300 300L0 300Z" fill="${hsl(h + i * 14, 60, 62 - i * 8)}" opacity=".92"/>`;
      }
    } else {
      // composição bauhaus
      const c1 = hsl(h, 80, 58), c2 = hsl(h + 150, 70, 60), c3 = hsl(h + 40, 85, 75);
      body = `<rect width="300" height="300" fill="${hsl(h2, 35, 11)}"/>`;
      body += `<circle cx="${80 + r() * 140}" cy="${80 + r() * 140}" r="${80 + r() * 40}" fill="${c1}"/>`;
      body += `<rect x="-50" y="${120 + r() * 60}" width="400" height="${26 + r() * 20}" fill="${c2}" transform="rotate(${-35 + r() * 20} 150 150)"/>`;
      body += `<path d="M${r() * 100} 300L${150 + r() * 100} ${150 + r() * 60}L300 300Z" fill="${c3}" opacity=".9"/>`;
      body += `<g stroke="#fff" stroke-width="1.5" opacity=".5">${[0, 1, 2, 3].map(i => `<line x1="${30 + i * 12}" y1="30" x2="${30 + i * 12}" y2="110"/>`).join('')}</g>`;
    }
    return { defs: defs + VIGNETTE, body: body + '<rect width="300" height="300" fill="url(#vg)"/>' };
  }

  function cover(key, variant) {
    const ck = key + '#' + variant;
    if (cache.has(ck)) return cache.get(ck);
    const r = rng(hashStr(key));
    const h = r() * 360, h2 = h + 30 + r() * 120;
    const { defs, body } = shapes(r, h, h2, variant ?? Math.floor(r() * 5));
    const res = { src: wrap(defs, body), hue: h };
    cache.set(ck, res);
    return res;
  }

  function artist(key) {
    if (cache.has(key)) return cache.get(key);
    const r = rng(hashStr(key));
    const h = r() * 360, dx = r() * 30 - 15;
    const defs = `<radialGradient id="bg" cx=".3" cy=".25" r="1"><stop offset="0" stop-color="${hsl(h, 65, 60)}"/><stop offset="1" stop-color="${hsl(h + 60, 60, 14)}"/></radialGradient>
      <linearGradient id="p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hsl(h + 20, 30, 24)}"/><stop offset="1" stop-color="${hsl(h + 20, 30, 7)}"/></linearGradient>
      <filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="20"/></filter>`;
    let body = '<rect width="300" height="300" fill="url(#bg)"/>';
    body += `<circle cx="${200 + r() * 60}" cy="${60 + r() * 50}" r="70" fill="${hsl(h + 40, 90, 70)}" opacity=".55" filter="url(#b)"/>`;
    body += `<path d="M${45 + dx} 300C${50 + dx} 212 ${108 + dx} 188 ${150 + dx} 188C${192 + dx} 188 ${250 + dx} 212 ${255 + dx} 300Z" fill="url(#p)"/>`;
    body += `<rect x="${132 + dx}" y="150" width="36" height="50" rx="14" fill="url(#p)"/>`;
    body += `<circle cx="${150 + dx}" cy="118" r="50" fill="url(#p)"/>`;
    if (r() < 0.6) body += `<path d="M${98 + dx} 122C${92 + dx} 50 ${208 + dx} 50 ${202 + dx} 122C${196 + dx} 88 ${104 + dx} 88 ${98 + dx} 122Z" fill="${hsl(h + 20, 25, 6)}"/>`;
    body += `<path d="M${112 + dx} 82A50 50 0 0 1 ${196 + dx} 100" stroke="${hsl(h, 90, 78)}" stroke-width="3" fill="none" opacity=".55"/>`;
    const res = { src: wrap(defs, body), hue: h };
    cache.set(key, res);
    return res;
  }

  function splitTitle(title) {
    if (title.length <= 12 || !title.includes(' ')) return [title];
    const mid = title.length / 2;
    let best = -1;
    for (let i = 0; i < title.length; i++) if (title[i] === ' ' && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
    return [title.slice(0, best), title.slice(best + 1)];
  }

  function playlist(key, title, { kind = 'editorial', hue } = {}) {
    const ck = 'pl:' + key;
    if (cache.has(ck)) return cache.get(ck);
    const r = rng(hashStr(key));
    const h = hue ?? r() * 360, h2 = h + 30 + r() * 100;
    let { defs, body } = shapes(r, h, h2, kind === 'mix' ? 1 : Math.floor(r() * 5));
    const lines = splitTitle(title);
    const size = lines.length > 1 ? 34 : Math.min(46, 270 / (title.length * 0.56));
    const text = (y, color) => `<text x="22" y="${y}" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="${size}" fill="${color}" letter-spacing="-1">${lines.map((l, i) => `<tspan x="22" dy="${i ? size * 1.02 : 0}">${esc(l)}</tspan>`).join('')}</text>`;
    if (kind === 'mix') {
      body += `<rect y="212" width="300" height="88" fill="${hsl(h, 70, 42)}"/>`;
      body += text(lines.length > 1 ? 246 : 270, '#fff');
    } else {
      defs += '<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".7"/></linearGradient>';
      body += '<rect width="300" height="300" fill="url(#fade)"/>';
      body += text(lines.length > 1 ? 236 : 272, '#fff');
    }
    const res = { src: wrap(defs, body + LOGO), hue: h };
    cache.set(ck, res);
    return res;
  }

  return { cover, artist, playlist };
})();
