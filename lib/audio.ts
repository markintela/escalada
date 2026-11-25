let ac: AudioContext | null = null;

function ctx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ac) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ac = new AC();
  }
  if (ac.state === 'suspended') void ac.resume();
  return ac;
}

const DURATION = 1.8;

/**
 * Corda de nylon sintetizada por Karplus-Strong (ruído filtrado em loop de realimentação).
 * Dá o ataque percussivo e o decaimento natural (grave sustenta, agudo morre rápido) de um
 * violão dedilhado, em vez de um tom de sintetizador.
 */
function nylonStringBuffer(a: AudioContext, freq: number): AudioBuffer {
  const sr = a.sampleRate;
  const total = Math.floor(sr * DURATION);
  const n = Math.max(2, Math.round(sr / freq));
  const buf = new Float32Array(n);
  let last = 0;
  for (let i = 0; i < n; i++) {
    const white = Math.random() * 2 - 1;
    last = last * 0.4 + white * 0.6; // suaviza o ruído inicial: corda de nylon, não de aço
    buf[i] = last;
  }
  const out = new Float32Array(total);
  const damping = 0.996; // decaimento por reflexão: define o "sustain" da corda
  const stretch = 0.0012; // leve inarmonicidade, dá corpo ao tom
  let idx = 0;
  let prevFiltered = 0;
  for (let i = 0; i < total; i++) {
    const cur = buf[idx];
    const nxt = buf[(idx + 1) % n];
    const filtered = (cur + nxt) * 0.5 * damping;
    out[i] = cur;
    buf[idx] = filtered + (prevFiltered - filtered) * stretch;
    prevFiltered = filtered;
    idx = (idx + 1) % n;
  }
  const fadeIn = Math.min(12, total);
  for (let i = 0; i < fadeIn; i++) out[i] *= i / fadeIn;
  const buffer = a.createBuffer(1, total, sr);
  buffer.getChannelData(0).set(out);
  return buffer;
}

/** Som de corda de violão (nylon, estilo MPB), sintetizado com Web Audio. */
export function pluck(midi: number, delay = 0, vol = 0.28) {
  const a = ctx();
  if (!a) return;
  const t = a.currentTime + 0.01 + delay;
  const f = 440 * Math.pow(2, (midi - 69) / 12);

  const src = a.createBufferSource();
  src.buffer = nylonStringBuffer(a, f);

  const body = a.createBiquadFilter(); // ressonância do tampo do violão (grave quente)
  body.type = 'peaking';
  body.frequency.value = 110;
  body.Q.value = 0.8;
  body.gain.value = 5;

  const tone = a.createBiquadFilter(); // tira o brilho metálico do ataque, como a unha/dedo no nylon
  tone.type = 'lowpass';
  tone.frequency.setValueAtTime(Math.min(f * 9, 8000), t);
  tone.frequency.exponentialRampToValueAtTime(Math.max(f * 2, 400), t + DURATION * 0.85);

  const g = a.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.setValueAtTime(vol, t + DURATION - 0.05);
  g.gain.linearRampToValueAtTime(0.0001, t + DURATION);

  src.connect(body);
  body.connect(tone);
  tone.connect(g);
  g.connect(a.destination);

  src.start(t);
  src.stop(t + DURATION + 0.05);
}

export function strum(notes: number[], delay = 0) {
  notes.forEach((m, i) => pluck(m, delay + i * 0.035, 0.18));
}
