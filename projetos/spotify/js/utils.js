/* Utilidades compartilhadas entre os módulos. */

function hashStr(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Gerador pseudoaleatório determinístico (mulberry32): mesma semente, mesmo resultado.
function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(r, arr) {
  return arr[Math.floor(r() * arr.length)];
}

function shuffleArr(arr, r = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function fmtTime(s) {
  s = Math.max(0, Math.floor(s || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function fmtLong(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h) return `${h} h ${m} min`;
  return `${m} min ${String(Math.floor(s % 60)).padStart(2, '0')} s`;
}

function fmtNum(n) {
  return Math.round(n).toLocaleString('pt-BR');
}

function fmtDate(ts) {
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return 'agora mesmo';
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)} h`;
  if (diff < 86400 * 7) return `há ${Math.floor(diff / 86400)} dias`;
  return new Date(ts).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function norm(s) {
  return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
