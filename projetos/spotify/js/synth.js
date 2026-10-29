/*
 * Motor de música procedural.
 * Cada faixa é "composta" a partir de uma semente (id + título): andamento, tom,
 * escala, progressão de acordes, padrão de bateria e melodia. Depois é renderizada
 * offline com Web Audio e vira um WAV que o <audio> do player toca normalmente.
 */
const Synth = (() => {
  const SR = 22050;
  const TAIL = 2.5;
  const MAX_CACHE = 12;

  const SCALES = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
    dorian: [0, 2, 3, 5, 7, 9, 10],
    lydian: [0, 2, 4, 6, 7, 9, 11],
    mixolydian: [0, 2, 4, 5, 7, 9, 10],
  };

  // Progressões em graus da escala (0 = tônica).
  const STYLES = {
    lofi: {
      bpm: [70, 86], scales: ['dorian', 'minor', 'major'],
      progs: [[1, 4, 0, 0], [0, 5, 3, 4], [5, 3, 0, 4], [3, 2, 1, 0]],
      sevenths: true, swing: 0.55, drums: 'boombap', bass: 'round', pad: 'keys', arp: null,
      lead: 'soft', leadOct: 5, leadRest: 0.35, crackle: true, cutoff: 3800, reverb: 0.25,
    },
    synthwave: {
      bpm: [96, 116], scales: ['minor'],
      progs: [[0, 5, 2, 6], [0, 6, 5, 6], [5, 3, 0, 4], [0, 3, 5, 4]],
      drums: 'synthwave', bass: 'octaves', pad: 'saw', arp: 'square16', arpIntro: true,
      lead: 'saw', leadOct: 5, leadRest: 0.2, cutoff: 9000, reverb: 0.4,
    },
    house: {
      bpm: [120, 126], scales: ['minor', 'dorian'],
      progs: [[0, 5, 3, 4], [0, 6, 5, 4], [0, 3, 0, 4], [3, 4, 0, 0]],
      sevenths: true, drums: 'house', introDrums: 1, bass: 'offbeat', pad: 'stab', arp: 'pluck8',
      lead: null, cutoff: 9000, reverb: 0.22,
    },
    chill: {
      bpm: [84, 100], scales: ['major', 'mixolydian'],
      progs: [[0, 4, 5, 3], [0, 5, 3, 4], [3, 4, 2, 5], [0, 3, 4, 3]],
      sevenths: true, drums: 'chill', bass: 'round', pad: 'soft', arp: 'pluck8', arpIntro: true,
      lead: 'pluck', leadOct: 5, leadRest: 0.3, cutoff: 7000, reverb: 0.32,
    },
    ambient: {
      bpm: [60, 72], scales: ['lydian', 'major'],
      progs: [[0, 4, 5, 3], [0, 3, 0, 4], [5, 3, 0, 0], [0, 1, 3, 0]],
      sevenths: true, drums: null, bass: 'drone', pad: 'air', arp: 'bells', arpIntro: true,
      lead: null, cutoff: 6000, reverb: 0.6,
    },
    trap: {
      bpm: [134, 148], scales: ['minor'],
      progs: [[0, 5, 6, 4], [0, 0, 5, 6], [0, 3, 5, 4], [0, 6, 5, 6]],
      drums: 'trap', bass: '808', pad: 'dark', arp: null,
      lead: 'bell', leadOct: 5, leadRest: 0.3, cutoff: 9000, reverb: 0.3,
    },
    tropical: {
      bpm: [100, 112], scales: ['major'],
      progs: [[0, 4, 5, 3], [3, 4, 0, 5], [5, 3, 0, 4], [0, 5, 3, 4]],
      drums: 'dembow', bass: 'tropical', pad: 'soft', arp: 'marimba', arpIntro: true,
      lead: 'flute', leadOct: 5, leadRest: 0.3, cutoff: 8000, reverb: 0.28,
    },
  };

  const TRAP_KICKS = [[0, 7, 10], [0, 3, 10], [0, 6, 11], [0, 10, 13], [0, 2, 7, 10]];

  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

  function noteOf(X, deg, oct) {
    const n = Math.floor(deg / 7), i = ((deg % 7) + 7) % 7;
    return 12 * (oct + 1) + X.key + X.scale[i] + 12 * n;
  }

  function chord(X, deg, oct, sevenths) {
    const ds = [deg, deg + 2, deg + 4];
    if (sevenths) ds.push(deg + 6);
    return ds.map(d => noteOf(X, d, oct));
  }

  // Puxa notas fora do acorde para a nota do acorde mais próxima (usado nos tempos fortes).
  function snap(d) {
    const m = ((d % 7) + 7) % 7;
    return d + ({ 1: -1, 3: 1, 5: -1, 6: 1 }[m] || 0);
  }

  // ---------- composição ----------

  const plans = new Map();

  function plan(track) {
    if (plans.has(track.id)) return plans.get(track.id);
    const r = rng(hashStr(track.id + '|' + track.title));
    const st = STYLES[track.genre] || STYLES.chill;
    const bpm = Math.round(st.bpm[0] + r() * (st.bpm[1] - st.bpm[0]));
    const k = Math.floor(r() * 12);
    const p = {
      st, bpm,
      key: k > 6 ? k - 12 : k,
      scale: SCALES[pick(r, st.scales)],
      prog: pick(r, st.progs),
      barSec: 240 / bpm,
      seed: hashStr(track.id),
    };
    p.sections = [
      { bars: 4, pad: 1, drums: st.introDrums || 0, arp: st.arpIntro ? 1 : 0 },
      { bars: 8, pad: 1, drums: 2, bass: 1, arp: 1 },
      { bars: 8, pad: 1, drums: 2, bass: 1, arp: 1, lead: 1 },
      { bars: 4, pad: 1, arp: 1 },
      { bars: 8, pad: 1, drums: 2, bass: 1, arp: 1, lead: 1 },
      { bars: 4, pad: 1, drums: 1, bass: 1 },
    ];
    const countBars = () => p.sections.reduce((s, x) => s + x.bars, 0);
    if (countBars() * p.barSec > 105) {
      p.sections[0].bars = 2;
      p.sections[3].bars = 2;
      p.sections[4].bars = 4;
    }
    p.bars = countBars();
    p.music = p.bars * p.barSec;
    p.duration = Math.ceil(p.music + TAIL);
    p.motifA = motif(r, st);
    p.motifB = p.motifA.map(n => (n.step >= 24 ? { ...n, deg: n.deg + pick(r, [-2, -1, 1, 2]) } : n));
    p.trapPats = [pick(r, TRAP_KICKS), pick(r, TRAP_KICKS)];
    plans.set(track.id, p);
    return p;
  }

  // Frase de 2 compassos em semicolcheias; graus relativos à fundamental do acorde.
  function motif(r, st) {
    const out = [];
    let step = 0, deg = pick(r, [0, 2, 4]);
    while (step < 32) {
      const len = pick(r, [2, 2, 2, 4, 4, 1, 3, 6]);
      if (r() < (st.leadRest ?? 0.25)) { step += len; continue; }
      deg = clamp(deg + pick(r, [-2, -1, -1, 0, 1, 1, 2, 3, -3]), -3, 7);
      out.push({ step, len: Math.min(len, 32 - step), deg });
      step += len;
    }
    return out;
  }

  // ---------- vozes ----------

  // Registra até quando o compasso atual tem som, para liberar seus nós depois.
  const until = (X, t) => {
    if (t > X.end) X.end = t;
  };

  const gainNode = (ctx, v) => {
    const g = ctx.createGain();
    g.gain.value = v;
    return g;
  };

  function voice(X, out, opts) {
    const { ctx } = X;
    const {
      freq, t, dur, vel = 0.2, types = ['sawtooth'], detune = 0,
      a = 0.01, d = 0.2, s = 0.6, r = 0.2, cutoff = 0, q = 0.8, fenv = 0, vib = 0,
    } = opts;
    const g = ctx.createGain();
    let dest = g;
    if (cutoff) {
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.Q.value = q;
      const base = Math.min(cutoff, 10000);
      if (fenv) {
        f.frequency.setValueAtTime(Math.min(base + fenv, 10000), t);
        f.frequency.setTargetAtTime(base, t, 0.06);
      } else {
        f.frequency.value = base;
      }
      f.connect(g);
      dest = f;
    }
    const peak = vel / Math.sqrt(types.length);
    const hold = Math.max(dur, a);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.setTargetAtTime(peak * s, t + a, Math.max(d / 3, 0.005));
    g.gain.setTargetAtTime(0, t + hold, Math.max(r / 4, 0.005));
    const end = t + hold + r * 1.2 + 0.02;
    until(X, end);

    let lfoGain = null;
    if (vib) {
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 5.2;
      lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0, t);
      lfoGain.gain.linearRampToValueAtTime(freq * 0.007 * vib, t + 0.3);
      lfo.connect(lfoGain);
      lfo.start(t);
      lfo.stop(end);
    }
    types.forEach((type, i) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      if (types.length > 1 && detune) osc.detune.value = (i / (types.length - 1) - 0.5) * 2 * detune;
      if (lfoGain) lfoGain.connect(osc.frequency);
      osc.connect(dest);
      osc.start(t);
      osc.stop(end);
    });
    g.connect(out);
  }

  // Sino FM: portadora modulada por uma senoidal inarmônica que decai.
  function bell(X, out, freq, t, vel, dur) {
    const { ctx } = X;
    const car = ctx.createOscillator(), mod = ctx.createOscillator();
    const mg = ctx.createGain(), g = ctx.createGain();
    car.frequency.value = freq;
    mod.frequency.value = freq * 3.5;
    mg.gain.setValueAtTime(freq * 2, t);
    mg.gain.exponentialRampToValueAtTime(1, t + dur * 0.6);
    mod.connect(mg).connect(car.frequency);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vel, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0005, t + dur);
    car.connect(g).connect(out);
    car.start(t); mod.start(t);
    car.stop(t + dur + 0.05); mod.stop(t + dur + 0.05);
    until(X, t + dur + 0.05);
  }

  function marimba(X, out, freq, t, vel) {
    for (const [mult, v, d] of [[1, 1, 0.5], [4, 0.3, 0.07]]) {
      if (freq * mult > 9500) continue;
      const o = X.ctx.createOscillator(), g = X.ctx.createGain();
      o.frequency.value = freq * mult;
      g.gain.setValueAtTime(vel * v, t);
      g.gain.exponentialRampToValueAtTime(0.0005, t + d);
      o.connect(g).connect(out);
      o.start(t);
      o.stop(t + d + 0.02);
      until(X, t + d + 0.02);
    }
  }

  function noiseHit(X, out, t, { vel, dur, type, freq, q = 0.7 }) {
    const { ctx } = X;
    const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = X.noise;
    f.type = type;
    f.frequency.value = Math.min(freq, 10000);
    f.Q.value = q;
    g.gain.setValueAtTime(vel, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f).connect(g).connect(out);
    src.start(t, X.r() * 0.7);
    src.stop(t + dur + 0.02);
    until(X, t + dur + 0.02);
  }

  // ---------- bateria ----------

  function kick(X, t, vel, f0, f1, dur) {
    const { ctx } = X, o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f1, t + 0.09);
    g.gain.setValueAtTime(vel, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(X.bus.drums);
    o.start(t);
    o.stop(t + dur + 0.02);
    until(X, t + dur + 0.02);
  }

  function snare(X, t, vel, dur) {
    noiseHit(X, X.bus.drums, t, { vel, dur, type: 'highpass', freq: 1500 });
    const o = X.ctx.createOscillator(), g = X.ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(220, t);
    o.frequency.exponentialRampToValueAtTime(160, t + 0.05);
    g.gain.setValueAtTime(vel * 0.6, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    o.connect(g).connect(X.bus.drums);
    o.start(t);
    o.stop(t + 0.1);
  }

  function clap(X, t, vel) {
    [0, 0.011, 0.023].forEach((d, i) =>
      noiseHit(X, X.bus.drums, t + d, { vel: vel * (i === 2 ? 1 : 0.6), dur: i === 2 ? 0.16 : 0.012, type: 'bandpass', freq: 1300, q: 1.2 }));
  }

  const hat = (X, t, vel, dur) => noiseHit(X, X.bus.drums, t, { vel, dur, type: 'highpass', freq: 7000 });
  const shaker = (X, t, vel) => noiseHit(X, X.bus.drums, t, { vel, dur: 0.05, type: 'bandpass', freq: 6000, q: 0.9 });

  function rim(X, t, vel) {
    const o = X.ctx.createOscillator(), g = X.ctx.createGain();
    o.type = 'triangle';
    o.frequency.value = 1700;
    g.gain.setValueAtTime(vel, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    o.connect(g).connect(X.bus.drums);
    o.start(t);
    o.stop(t + 0.05);
    noiseHit(X, X.bus.drums, t, { vel: vel * 0.5, dur: 0.02, type: 'bandpass', freq: 3000 });
  }

  // Cada padrão devolve os passos do bumbo (o 808 do trap segue o bumbo).
  const DRUMS = {
    boombap(X, tb, lvl, last) {
      const k = [0, 10];
      if (X.r() < 0.45) k.push(7);
      k.forEach(s => kick(X, X.T(tb, s), 0.9, 120, 42, 0.4));
      if (lvl > 1) {
        [4, 12].forEach(s => snare(X, X.T(tb, s), 0.5, 0.2));
        if (last) [14, 15].forEach(s => snare(X, X.T(tb, s), 0.25, 0.12));
      }
      for (let s = 0; s < 16; s += 2) hat(X, X.T(tb, s), s % 4 ? 0.08 : 0.14, 0.04);
      return k;
    },
    synthwave(X, tb, lvl, last) {
      const k = X.r() < 0.5 ? [0, 8] : [0, 8, 10];
      k.forEach(s => kick(X, X.T(tb, s), 1, 150, 45, 0.35));
      if (lvl > 1) {
        [4, 12].forEach(s => snare(X, X.T(tb, s), 0.65, 0.3));
        if (last) [13, 14, 15].forEach((s, i) => snare(X, X.T(tb, s), 0.25 + i * 0.1, 0.15));
      }
      for (let s = 0; s < 16; s += 2) hat(X, X.T(tb, s), 0.09, 0.05);
      return k;
    },
    house(X, tb, lvl) {
      const k = [0, 4, 8, 12];
      k.forEach(s => kick(X, X.T(tb, s), 1, 165, 48, 0.3));
      [2, 6, 10, 14].forEach(s => hat(X, X.T(tb, s), 0.13, 0.18));
      if (lvl > 1) {
        [4, 12].forEach(s => clap(X, X.T(tb, s), 0.5));
        for (let s = 1; s < 16; s += 2) hat(X, X.T(tb, s), 0.05, 0.03);
      }
      return k;
    },
    chill(X, tb, lvl) {
      const k = [0, 9];
      k.forEach(s => kick(X, X.T(tb, s), 0.75, 110, 45, 0.35));
      if (lvl > 1) [4, 12].forEach(s => rim(X, X.T(tb, s), 0.35));
      for (let s = 0; s < 16; s++) shaker(X, X.T(tb, s), s % 2 ? 0.04 : 0.08);
      return k;
    },
    trap(X, tb, lvl, last, bar, p) {
      const k = p.trapPats[bar % 2];
      k.forEach(s => kick(X, X.T(tb, s), 0.9, 190, 55, 0.22));
      if (lvl > 1) {
        snare(X, X.T(tb, 8), 0.7, 0.25);
        clap(X, X.T(tb, 8), 0.35);
      }
      const roll = X.r() < 0.5 ? 4 * Math.floor(X.r() * 4) : -1;
      for (let s = 0; s < 16; s++) {
        if (roll >= 0 && s >= roll && s < roll + 4) {
          const n = s === roll + 3 ? 3 : 2;
          for (let i = 0; i < n; i++) hat(X, X.T(tb, s) + (i * X.six) / n, 0.05 + 0.02 * i, 0.03);
        } else if (s % 2 === 0) {
          hat(X, X.T(tb, s), 0.11, 0.035);
        }
      }
      return k;
    },
    dembow(X, tb, lvl) {
      const k = [0, 4, 8, 12];
      k.forEach(s => kick(X, X.T(tb, s), 0.85, 140, 48, 0.28));
      if (lvl > 1) [3, 6, 11, 14].forEach(s => snare(X, X.T(tb, s), 0.35, 0.1));
      for (let s = 0; s < 16; s += 2) hat(X, X.T(tb, s), 0.07, 0.03);
      for (let s = 1; s < 16; s += 2) shaker(X, X.T(tb, s), 0.05);
      return k;
    },
  };

  // ---------- harmonia ----------

  const BASSES = {
    round(X, tb, deg) {
      const f = mtof(noteOf(X, deg, 2));
      [[0, 6], [7, 2], [10, 5]].forEach(([s, l]) =>
        voice(X, X.bus.bass, { freq: f, t: X.T(tb, s), dur: X.six * l, vel: 0.35, types: ['sine', 'triangle'], a: 0.01, d: 0.3, s: 0.7, r: 0.08, cutoff: 700 }));
    },
    octaves(X, tb, deg) {
      const m = noteOf(X, deg, 2);
      for (let s = 0; s < 16; s += 2)
        voice(X, X.bus.bass, { freq: mtof(m + (s % 4 === 2 ? 12 : 0)), t: X.T(tb, s), dur: X.six * 1.6, vel: 0.25, types: ['sawtooth'], a: 0.005, d: 0.1, s: 0.6, r: 0.05, cutoff: 500, fenv: 900 });
    },
    offbeat(X, tb, deg) {
      const f = mtof(noteOf(X, deg, 2));
      [2, 6, 10, 14].forEach(s =>
        voice(X, X.bus.bass, { freq: f, t: X.T(tb, s), dur: X.six * 1.5, vel: 0.32, types: ['sawtooth', 'sine'], a: 0.005, d: 0.1, s: 0.7, r: 0.04, cutoff: 420, fenv: 700 }));
    },
    drone(X, tb, deg) {
      voice(X, X.bus.bass, { freq: mtof(noteOf(X, deg, 2)), t: tb, dur: X.barSec, vel: 0.22, types: ['sine'], a: X.barSec * 0.3, d: 1, s: 1, r: X.barSec * 0.4 });
    },
    '808'(X, tb, deg) {
      const f = mtof(noteOf(X, deg, 2));
      const ks = X.kicks || [0, 10];
      ks.forEach((s, i) => {
        const t = X.T(tb, s), len = ((ks[i + 1] ?? 16) - s) * X.six;
        const o = X.ctx.createOscillator(), g = X.ctx.createGain();
        o.frequency.setValueAtTime(f * 2, t);
        o.frequency.exponentialRampToValueAtTime(f, t + 0.06);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.55, t + 0.005);
        g.gain.setTargetAtTime(0, t + len * 0.8, 0.05);
        o.connect(g).connect(X.bus.sub);
        o.start(t);
        o.stop(t + len + 0.3);
        until(X, t + len + 0.3);
      });
    },
    tropical(X, tb, deg) {
      const f = mtof(noteOf(X, deg, 2));
      [[0, 3], [3, 3], [6, 2], [8, 3], [11, 3], [14, 2]].forEach(([s, l]) =>
        voice(X, X.bus.bass, { freq: f, t: X.T(tb, s), dur: X.six * l, vel: 0.3, types: ['sine'], a: 0.005, d: 0.2, s: 0.6, r: 0.05 }));
    },
  };

  const PADS = {
    keys(X, tb, deg) {
      const notes = chord(X, deg, 3, true);
      [[0, 0.16, 9], [10, 0.09, 5]].forEach(([s, v, l]) =>
        notes.forEach((m, i) =>
          voice(X, X.bus.pad, { freq: mtof(m), t: X.T(tb, s) + i * 0.012, dur: X.six * l, vel: v, types: ['triangle', 'sine'], a: 0.005, d: 0.8, s: 0.4, r: 0.6, cutoff: 2000 })));
    },
    saw(X, tb, deg) {
      chord(X, deg, 3, false).forEach(m =>
        voice(X, X.bus.pad, { freq: mtof(m), t: tb, dur: X.barSec, vel: 0.1, types: ['sawtooth', 'sawtooth'], detune: 14, a: 0.25, d: 0.5, s: 0.8, r: 0.4, cutoff: 1600 }));
    },
    stab(X, tb, deg) {
      const notes = chord(X, deg, 4, true);
      [3, 6, 10].forEach(s =>
        notes.forEach(m =>
          voice(X, X.bus.pad, { freq: mtof(m), t: X.T(tb, s), dur: X.six * 1.2, vel: 0.08, types: ['sawtooth', 'square'], detune: 8, a: 0.003, d: 0.15, s: 0.3, r: 0.1, cutoff: 1200, fenv: 2500 })));
    },
    soft(X, tb, deg) {
      chord(X, deg, 3, X.st.sevenths).forEach(m =>
        voice(X, X.bus.pad, { freq: mtof(m), t: tb, dur: X.barSec, vel: 0.1, types: ['triangle', 'sine'], a: 0.3, d: 0.6, s: 0.8, r: 0.6, cutoff: 2600 }));
    },
    air(X, tb, deg) {
      chord(X, deg, 3, true).forEach(m =>
        voice(X, X.bus.pad, { freq: mtof(m), t: tb, dur: X.barSec, vel: 0.09, types: ['sawtooth', 'sawtooth', 'triangle'], detune: 10, a: X.barSec * 0.4, d: 1, s: 0.9, r: X.barSec * 0.5, cutoff: 900 }));
    },
    dark(X, tb, deg) {
      chord(X, deg, 3, false).forEach(m =>
        voice(X, X.bus.pad, { freq: mtof(m), t: tb, dur: X.barSec, vel: 0.06, types: ['sawtooth', 'triangle'], detune: 12, a: 0.4, d: 0.5, s: 0.8, r: 0.5, cutoff: 800 }));
    },
  };

  const ARPS = {
    square16(X, tb, deg) {
      const n = chord(X, deg, 4, false);
      n.push(n[0] + 12);
      const pat = [0, 1, 2, 3, 2, 1];
      for (let s = 0; s < 16; s++)
        voice(X, X.bus.arp, { freq: mtof(n[pat[s % 6]]), t: X.T(tb, s), dur: X.six * 0.7, vel: 0.07, types: ['square'], a: 0.003, d: 0.1, s: 0.25, r: 0.05, cutoff: 2600, fenv: 1500 });
    },
    pluck8(X, tb, deg) {
      const n = chord(X, deg, 4, X.st.sevenths);
      for (let s = 0; s < 16; s += 2)
        voice(X, X.bus.arp, { freq: mtof(n[(s / 2) % n.length]), t: X.T(tb, s), dur: X.six, vel: 0.08, types: ['triangle', 'sine'], a: 0.003, d: 0.25, s: 0.05, r: 0.15, cutoff: 3200 });
    },
    bells(X, tb, deg) {
      for (let q = 0; q < 4; q++) {
        if (X.r() < 0.5) {
          const m = noteOf(X, deg + pick(X.r, [0, 2, 4, 7, 9]), 5);
          bell(X, X.bus.arp, mtof(m), X.T(tb, q * 4 + (X.r() < 0.3 ? 2 : 0)), 0.06, 3);
        }
      }
    },
    marimba(X, tb, deg) {
      const n = chord(X, deg, 4, false);
      n.push(n[1] + 12);
      [0, 3, 6, 8, 11, 14].forEach((s, i) => marimba(X, X.bus.arp, mtof(n[i % n.length]), X.T(tb, s), 0.14));
    },
  };

  const LEADS = {
    soft: (X, f, t, dur) => voice(X, X.bus.lead, { freq: f, t, dur, vel: 0.12, types: ['triangle'], a: 0.02, d: 0.3, s: 0.6, r: 0.2, cutoff: 2500 }),
    saw: (X, f, t, dur) => voice(X, X.bus.lead, { freq: f, t, dur, vel: 0.08, types: ['sawtooth', 'sawtooth'], detune: 10, a: 0.02, d: 0.2, s: 0.7, r: 0.15, cutoff: 2800, vib: 1 }),
    pluck: (X, f, t, dur) => voice(X, X.bus.lead, { freq: f, t, dur, vel: 0.13, types: ['triangle', 'sine'], a: 0.003, d: 0.35, s: 0.1, r: 0.2, cutoff: 3500 }),
    bell: (X, f, t, dur) => bell(X, X.bus.lead, f, t, 0.1, Math.max(0.6, dur * 1.5)),
    flute: (X, f, t, dur) => voice(X, X.bus.lead, { freq: f, t, dur, vel: 0.11, types: ['sine', 'triangle'], a: 0.05, d: 0.2, s: 0.8, r: 0.15, vib: 1 }),
  };

  // ---------- renderização ----------

  function noiseBuffer(ctx) {
    const b = ctx.createBuffer(1, SR, SR), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }

  function impulse(ctx, secs, decay, r) {
    const n = Math.floor(SR * secs), b = ctx.createBuffer(1, n, SR), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (r() * 2 - 1) * Math.pow(1 - i / n, decay);
    return b;
  }

  function saturation() {
    const n = 1024, c = new Float32Array(n);
    for (let i = 0; i < n; i++) c[i] = Math.tanh((i / (n - 1) * 2 - 1) * 2.5);
    return c;
  }

  async function build(track) {
    const p = plan(track), st = p.st;
    const ctx = new OfflineAudioContext(1, Math.ceil(p.duration * SR), SR);
    const X = { ctx, st, key: p.key, scale: p.scale, barSec: p.barSec, six: p.barSec / 16, r: rng(p.seed ^ 0x9e3779b9) };
    X.T = (tb, s) => tb + s * X.six + (s % 2 ? (st.swing || 0) * X.six * 0.5 : 0);
    X.noise = noiseBuffer(ctx);

    const master = ctx.createGain();
    const tone = ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = Math.min(st.cutoff || 10000, 10000);
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value = 8;
    comp.ratio.value = 4;
    comp.attack.value = 0.004;
    comp.release.value = 0.18;
    master.connect(tone).connect(comp).connect(ctx.destination);

    const verb = ctx.createConvolver();
    verb.buffer = impulse(ctx, 2.6, 2.8, X.r);
    verb.connect(gainNode(ctx, st.reverb ?? 0.3)).connect(master);
    const delay = ctx.createDelay(2);
    delay.delayTime.value = (60 / p.bpm) * 0.75;
    delay.connect(gainNode(ctx, 0.32)).connect(delay);
    delay.connect(gainNode(ctx, 0.22)).connect(master);

    const main = { fx: master };
    for (const [name, lvl, rv, dl] of [
      ['drums', 0.9, 0.06, 0], ['bass', 0.85, 0, 0], ['pad', 0.7, 0.4, 0], ['arp', 0.55, 0.45, 0.3], ['lead', 0.65, 0.3, 0.35],
    ]) {
      const g = gainNode(ctx, lvl);
      g.connect(master);
      if (rv) g.connect(gainNode(ctx, rv)).connect(verb);
      if (dl) g.connect(gainNode(ctx, dl)).connect(delay);
      main[name] = g;
    }
    main.sub = main.bass;
    if (st.bass === '808') {
      const sh = ctx.createWaveShaper();
      sh.curve = saturation();
      sh.connect(main.bass);
      main.sub = sh;
    }

    // Chiado de vinil para o lo-fi.
    if (st.crackle) {
      const src = ctx.createBufferSource(), f = ctx.createBiquadFilter();
      src.buffer = X.noise;
      src.loop = true;
      f.type = 'bandpass';
      f.frequency.value = 2500;
      f.Q.value = 0.6;
      src.connect(f).connect(gainNode(ctx, 0.012)).connect(master);
      src.start(0);
      src.stop(p.music + 1);
    }

    const start = 0.05;
    const bars = [];
    for (const sec of p.sections) for (let b = 0; b < sec.bars; b++) bars.push({ sec, b, bar: bars.length });

    // Cada compasso toca em barramentos próprios, desligados depois que soam:
    // assim o renderizador só processa as notas vivas, e não o grafo inteiro da música.
    const live = [];
    const schedule = ({ sec, b, bar }) => {
      const tb = start + bar * p.barSec;
      const deg = p.prog[bar % p.prog.length];
      X.bus = {};
      for (const name in main) {
        X.bus[name] = ctx.createGain();
        X.bus[name].connect(main[name]);
      }
      X.end = tb;
      X.kicks = null;
      if (sec.drums && st.drums) X.kicks = DRUMS[st.drums](X, tb, sec.drums, b === sec.bars - 1, bar, p);
      if (sec.bass && st.bass) BASSES[st.bass](X, tb, deg);
      if (sec.pad && st.pad) PADS[st.pad](X, tb, deg);
      if (sec.arp && st.arp) ARPS[st.arp](X, tb, deg);
      if (sec.lead && st.lead) {
        const m = bar % 4 < 2 ? p.motifA : p.motifB, half = bar % 2;
        for (const n of m) {
          if (n.step >> 4 !== half) continue;
          const d = n.step % 4 === 0 ? snap(n.deg) : n.deg;
          LEADS[st.lead](X, mtof(noteOf(X, deg + d, st.leadOct || 5)), X.T(tb, n.step % 16), n.len * X.six * 0.9);
        }
      }
      if (st.crackle)
        for (let t = tb + X.r() * 0.3; t < tb + p.barSec; t += 0.05 + X.r() * 0.5)
          noiseHit(X, X.bus.fx, t, { vel: 0.05 + X.r() * 0.12, dur: 0.004, type: 'highpass', freq: 3000 });
      live.push({ end: X.end + 0.05, nodes: Object.values(X.bus) });
    };
    const cleanup = now => {
      for (let i = live.length - 1; i >= 0; i--) {
        if (live[i].end >= now) continue;
        live[i].nodes.forEach(n => n.disconnect());
        live.splice(i, 1);
      }
    };

    // Cada compasso é agendado logo antes de começar.
    schedule(bars[0]);
    for (let i = 1; i < bars.length; i++) {
      ctx.suspend(start + i * p.barSec - 0.012).then(() => {
        cleanup(ctx.currentTime);
        schedule(bars[i]);
        ctx.resume();
      });
    }

    const outroStart = start + (p.bars - p.sections[p.sections.length - 1].bars) * p.barSec;
    master.gain.setValueAtTime(1, outroStart);
    master.gain.linearRampToValueAtTime(0, Math.min(p.music + 1.5, p.duration - 0.1));

    return ctx.startRendering();
  }

  // PCM 16 bits mono. Normaliza pela loudness (RMS) e segura os picos com saturação suave,
  // para que faixas de gêneros diferentes toquem com volume parecido.
  function toWav(samples) {
    let acc = 0;
    for (let i = 0; i < samples.length; i++) acc += samples[i] * samples[i];
    const rms = Math.sqrt(acc / samples.length);
    const k = rms > 0 ? 0.2 / rms : 1;
    const buf = new ArrayBuffer(44 + samples.length * 2), v = new DataView(buf);
    const str = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    str(0, 'RIFF'); v.setUint32(4, 36 + samples.length * 2, true); str(8, 'WAVE');
    str(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, SR, true); v.setUint32(28, SR * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
    str(36, 'data'); v.setUint32(40, samples.length * 2, true);
    for (let i = 0, o = 44; i < samples.length; i++, o += 2) {
      const s = Math.tanh(samples[i] * k);
      v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return new Blob([buf], { type: 'audio/wav' });
  }

  const cache = new Map();

  function render(track) {
    if (cache.has(track.id)) {
      const job = cache.get(track.id);
      cache.delete(track.id);
      cache.set(track.id, job);
      return job;
    }
    const job = build(track).then(buf => URL.createObjectURL(toWav(buf.getChannelData(0))));
    cache.set(track.id, job);
    job.catch(() => cache.delete(track.id));
    while (cache.size > MAX_CACHE) {
      const [id, old] = cache.entries().next().value;
      cache.delete(id);
      old.then(u => URL.revokeObjectURL(u)).catch(() => {});
    }
    return job;
  }

  return {
    render,
    duration: track => plan(track).duration,
    bpm: track => plan(track).bpm,
  };
})();
