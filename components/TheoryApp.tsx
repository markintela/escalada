'use client';

import { useState } from 'react';
import Fretboard, { Legend, type Dot, type Line } from './Fretboard';
import { pluck, strum } from '@/lib/audio';
import { FRETS, OPEN_MIDI, STR_NAMES, keyOf, midiOf, type Orient, type Pos } from '@/lib/geometry';
import {
  CHORD_TYPES, DEG_NAMES, DEG_STEPS, FIELD, FUNC, INTERVALS, KEYS, MAJOR, PROGS, SUFFIX,
  chordInts, spell, voicing, type ChordId,
} from '@/lib/theory';
import { useSequencer } from '@/lib/useSequencer';

type Tab = 'intervalos' | 'acordes' | 'funcoes';
const TABS: { id: Tab; label: string }[] = [
  { id: 'intervalos', label: 'Intervalos' },
  { id: 'acordes', label: 'Formação de acordes' },
  { id: 'funcoes', label: 'Funções: tônica, subdominante, dominante' },
];

function toneLook(i: number) {
  if (i === 0) return { bg: 'var(--accent)', fg: '#fff', border: 'var(--accent)' };
  if (i === 3 || i === 4) return { bg: '#FFC857', fg: '#1B1D1F', border: '#FFC857' };
  if (i >= 9) return { bg: '#9CC3F5', fg: '#10243F', border: '#9CC3F5' };
  return { bg: '#2A1F1A', fg: '#F4EEE3', border: '#F4EEE3' };
}

export default function TheoryApp() {
  const [tab, setTab] = useState<Tab>('intervalos');
  const [root, setRoot] = useState(0);
  const [ivIdx, setIvIdx] = useState(5);
  const [chord, setChord] = useState<ChordId>('7');
  const [sel, setSel] = useState(4);
  const [size, setSize] = useState<'tri' | 'tet'>('tet');
  const [prog, setProg] = useState(0);
  const [activeChord, setActiveChord] = useState(-1);
  const [orient, setOrient] = useState<Orient>('player');
  const seq = useSequencer();

  const key = KEYS[root];
  const rootMidi = 48 + key.pc;

  const stopAll = () => { seq.stop(); setActiveChord(-1); };

  const deg = (d: number) => {
    const q = size === 'tri' ? FIELD[d].tri : FIELD[d].tet;
    const name = spell(key, MAJOR[d], d);
    const rk = { letter: (key.letter + d) % 7, pc: (key.pc + MAJOR[d]) % 12, label: name };
    return { rk, q, symbol: name + SUFFIX[q], roman: FIELD[d].roman + SUFFIX[q], f: FIELD[d].f };
  };

  // ---- Braço ----
  const dots: Dot[] = [];
  const lines: Line[] = [];
  let legendItems: { color: string; border?: string; text: string }[] = [];
  let boardTitle = '';
  let boardHint = '';

  const chordMap = (rk: { letter: number; pc: number }, ints: number[]) => {
    const tonePc = new Map<number, number>();
    ints.forEach((i) => tonePc.set((rk.pc + i) % 12, i));
    for (let s = 0; s < 6; s++) {
      for (let f = 0; f <= FRETS; f++) {
        const midi = midiOf(s, f);
        const i = tonePc.get(midi % 12);
        if (i === undefined) continue;
        const nm = spell(rk, i, DEG_STEPS[i]);
        dots.push({ s, f, size: 32, ...toneLook(i), label: DEG_NAMES[i], aria: `${nm} (${DEG_NAMES[i]}), corda ${STR_NAMES[s]}, casa ${f}`, onClick: () => seq.flash(keyOf(s, f), midi) });
      }
    }
    legendItems = [
      { color: 'var(--accent)', text: 'Tônica do acorde (1)' },
      { color: '#FFC857', text: '3ª (define maior/menor)' },
      { color: '#2A1F1A', border: '#F4EEE3', text: '5ª' },
      { color: '#9CC3F5', text: '7ª' },
    ];
  };

  const iv = INTERVALS[ivIdx];
  const ct = CHORD_TYPES.find((c) => c.id === chord) ?? CHORD_TYPES[0];
  const selD = deg(sel);

  if (tab === 'intervalos') {
    const target = spell(key, iv.semi, iv.steps);
    const fA = (key.pc - 9 + 12) % 12;
    const fE = (key.pc - 4 + 12) % 12;
    const rs = fA >= 1 && fA <= 9 ? 1 : 0;
    const rf = rs === 1 ? fA : fE;
    const tMidi = OPEN_MIDI[rs] + rf + iv.semi;
    for (let s = 0; s < 6; s++) {
      for (let f = Math.max(0, rf - 4); f <= Math.min(FRETS, rf + iv.semi); f++) {
        if (midiOf(s, f) === tMidi && (f <= rf + 5 || s === rs)) {
          dots.push({ s, f, size: 34, bg: '#FFC857', fg: '#1B1D1F', border: '#1B1D1F', label: iv.short, aria: `${target}, corda ${STR_NAMES[s]}, casa ${f}`, onClick: () => seq.flash(keyOf(s, f), tMidi) });
          lines.push({ pts: [[rs, rf], [s, f]] as Pos[], color: '#FFC857', dashed: true });
        }
      }
    }
    dots.push({ s: rs, f: rf, size: 36, bg: 'var(--accent)', fg: '#fff', border: 'var(--accent)', label: key.label, aria: `${key.label} (nota de partida), corda ${STR_NAMES[rs]}, casa ${rf}`, onClick: () => seq.flash(keyOf(rs, rf), midiOf(rs, rf)) });
    boardTitle = `Onde está a ${iv.name} a partir de ${key.label}`;
    boardHint = 'Cada linha tracejada é um caminho possível até a mesma nota (mesma altura).';
    legendItems = [
      { color: 'var(--accent)', text: `Nota de partida (${key.label})` },
      { color: '#FFC857', border: '#1B1D1F', text: `${iv.name} (${target})` },
    ];
  } else if (tab === 'acordes') {
    chordMap(key, ct.ints);
    boardTitle = `Mapa do arpejo de ${key.label}${ct.symbol}`;
    boardHint = 'Todas as notas do acorde no braço. Toque nelas para ouvir.';
  } else {
    chordMap(selD.rk, chordInts(selD.q));
    boardTitle = `Notas de ${selD.symbol} (${selD.roman}, ${FUNC[selD.f].name.toLowerCase()}) no braço`;
    boardHint = 'Escolha um grau ou toque uma progressão: o braço acompanha o acorde atual.';
  }

  const playProgression = () => {
    if (seq.playing) return stopAll();
    const p = PROGS[prog];
    seq.play(
      p.degs.map((d, i) => {
        const x = deg(d);
        return { keys: [], midis: voicing(x.rk.pc, chordInts(x.q)), chord: true, onStep: () => { setActiveChord(i); setSel(d); } };
      }),
      1300,
    );
  };

  const v = spell(key, 7, 4);
  const lead = spell(key, 11, 6);
  const fourth = spell(key, 5, 3);
  const third = spell(key, 4, 2);

  return (
    <main className="container">
      <header className="stack" style={{ gap: 6, maxWidth: 820 }}>
        <div className="kicker">Teoria aplicada ao braço</div>
        <h1 className="display">Intervalos, acordes e funções</h1>
        <p className="lead">
          Intervalos são a distância entre duas notas. Empilhando intervalos você forma acordes, e cada acorde tem uma função dentro do tom:
          repouso (tônica), afastamento (subdominante) ou tensão (dominante).
        </p>
      </header>

      <div role="tablist" aria-label="Seções" className="row" style={{ borderBottom: '1px solid var(--line)', paddingBottom: 12 }}>
        {TABS.map((t, i) => (
          <button key={t.id} type="button" role="tab" className="chip" style={{ fontWeight: 600 }} aria-selected={tab === t.id} onClick={() => { stopAll(); setTab(t.id); }}>
            <span className="mono" style={{ fontSize: 12, opacity: 0.7 }}>0{i + 1}</span>{t.label}
          </button>
        ))}
      </div>

      <div className="stack">
        <div className="label">{tab === 'funcoes' ? 'Tom (maior)' : 'Nota de partida'}</div>
        <div className="row">
          {KEYS.map((k, i) => (
            <button key={k.label} type="button" className="chip root" aria-pressed={i === root} onClick={() => { stopAll(); setRoot(i); }}>{k.label}</button>
          ))}
        </div>
      </div>

      {tab === 'intervalos' && (
        <section className="stack" style={{ gap: 16 }}>
          <div className="select-grid">
            {INTERVALS.map((x, i) => (
              <button key={x.semi} type="button" className="select-card" aria-pressed={i === ivIdx} onClick={() => { setIvIdx(i); pluck(rootMidi); pluck(rootMidi + x.semi, 0.45); }}>
                <span className="mono" style={{ fontSize: 20, fontWeight: 600 }}>{x.short}</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{x.name}</span>
                <span style={{ fontSize: 12, opacity: 0.8 }}>{x.semis}</span>
              </button>
            ))}
          </div>
          <div className="grid-auto">
            <div className="panel">
              <div className="row" style={{ alignItems: 'baseline', gap: '6px 14px' }}>
                <h2 className="display" style={{ fontSize: 30 }}>{iv.name}</h2>
                <span className="mono" style={{ fontSize: 15, color: 'var(--muted)' }}>{iv.semis}</span>
              </div>
              <div className="row" style={{ gap: 10, fontSize: 18, fontWeight: 600 }}>
                <span style={{ padding: '6px 14px', borderRadius: 20, background: 'var(--accent)', color: '#fff' }}>{key.label}</span>
                <span style={{ color: 'var(--soft)' }}>→</span>
                <span style={{ padding: '6px 14px', borderRadius: 20, background: '#FFC857' }}>{spell(key, iv.semi, iv.steps)}</span>
              </div>
              <p>{iv.text}</p>
              <div className="row">
                <button type="button" className="chip primary" onClick={() => { pluck(rootMidi); pluck(rootMidi + iv.semi, 0.5); }}>Ouvir separado</button>
                <button type="button" className="chip" onClick={() => { pluck(rootMidi, 0, 0.2); pluck(rootMidi + iv.semi, 0, 0.2); }}>Ouvir junto</button>
              </div>
            </div>
            <div className="panel dark">
              <div className="label">No braço</div>
              <p>{iv.shape}</p>
              <p className="small">Regra geral: na mesma corda, cada casa é 1 semitom. Na corda de baixo (mais fina), a mesma casa soa 5 semitons acima, ou 4 quando você passa da corda Sol para a corda Si.</p>
            </div>
          </div>
        </section>
      )}

      {tab === 'acordes' && (
        <section className="stack" style={{ gap: 16 }}>
          <div className="select-grid">
            {CHORD_TYPES.map((c) => (
              <button key={c.id} type="button" className="select-card" aria-pressed={c.id === chord} onClick={() => { setChord(c.id); strum(voicing(key.pc, c.ints)); }}>
                <span className="mono" style={{ fontSize: 20, fontWeight: 600 }}>{key.label}{c.symbol}</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</span>
                <span style={{ fontSize: 12, opacity: 0.8 }}>{c.ints.map((i) => DEG_NAMES[i]).join(' – ')}</span>
              </button>
            ))}
          </div>
          <div className="grid-auto">
            <div className="panel" style={{ gap: 14 }}>
              <h2 className="display" style={{ fontSize: 30 }}>{key.label}{ct.symbol} · {ct.name}</h2>
              <div className="row" style={{ gap: 10 }}>
                {ct.ints.map((i) => {
                  const look = toneLook(i);
                  return (
                    <div key={i} className="stack" style={{ alignItems: 'center', gap: 4, minWidth: 48 }}>
                      <div className="note-chip" style={{ background: look.bg, color: look.fg, minWidth: 48, height: 48 }}>{spell(key, i, DEG_STEPS[i])}</div>
                      <div className="mono" style={{ fontSize: 13, color: 'var(--muted)' }}>{DEG_NAMES[i]}</div>
                    </div>
                  );
                })}
              </div>
              <p>{ct.text}</p>
              <div className="row">
                <button type="button" className="chip primary" onClick={() => strum(voicing(key.pc, ct.ints))}>Ouvir acorde</button>
                <button type="button" className="chip" onClick={() => [...ct.ints, 12].forEach((i, n) => pluck(rootMidi + i, n * 0.32))}>Ouvir arpejo</button>
              </div>
            </div>
            <div className="panel dark">
              <div className="label">Acorde = intervalos empilhados</div>
              <p>A tríade é a tônica + uma 3ª + uma 5ª. A 3ª decide se o acorde é maior (3) ou menor (b3). A 7ª acrescenta cor: b7 deixa o acorde dominante, 7 deixa sonhador (7M).</p>
              <p className="small">O braço abaixo mostra todas as notas do acorde (um mapa de arpejo). Improvisar mirando essas notas é o jeito mais direto de “tocar os acordes” no solo.</p>
            </div>
          </div>
        </section>
      )}

      {tab === 'funcoes' && (
        <section className="stack" style={{ gap: 16 }}>
          <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {(['T', 'S', 'D'] as const).map((k) => {
              const F = FUNC[k];
              return (
                <div key={k} style={{ background: F.tint, border: `1px solid ${F.border}`, borderRadius: 16, padding: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="row" style={{ gap: 10 }}>
                    <span className="mono" style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: F.color, color: '#fff', fontWeight: 600, fontSize: 18 }}>{k}</span>
                    <h3 className="display">{F.name}</h3>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{F.feel}</div>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55 }}>{F.text}</p>
                  <div className="mono" style={{ fontSize: 14, fontWeight: 600 }}>{F.degrees}</div>
                </div>
              );
            })}
          </div>

          <div className="between" style={{ alignItems: 'center' }}>
            <h2 className="display" style={{ fontSize: 28 }}>Campo harmônico de {key.label} maior</h2>
            <div className="row">
              <button type="button" className="chip" aria-pressed={size === 'tri'} onClick={() => setSize('tri')}>Tríades</button>
              <button type="button" className="chip" aria-pressed={size === 'tet'} onClick={() => setSize('tet')}>Tétrades (com 7ª)</button>
            </div>
          </div>
          <div className="select-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
            {FIELD.map((_, d) => {
              const x = deg(d);
              const F = FUNC[x.f];
              return (
                <button
                  key={d}
                  type="button"
                  className="select-card"
                  aria-pressed={d === sel}
                  onClick={() => { setSel(d); strum(voicing(x.rk.pc, chordInts(x.q))); }}
                  style={{ minHeight: 108, background: F.tint, color: 'var(--ink)', border: d === sel ? '3px solid var(--ink)' : `1px solid ${F.border}` }}
                >
                  <span className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{x.roman}</span>
                  <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 26, fontWeight: 800 }}>{x.symbol}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: F.color, color: '#fff' }}>{F.name}</span>
                </button>
              );
            })}
          </div>

          <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <div className="panel">
              <div className="label">Progressões para ouvir</div>
              <div className="row">
                {PROGS.map((p, i) => (
                  <button key={p.name} type="button" className="chip mono" style={{ fontSize: 14 }} aria-pressed={i === prog} onClick={() => { stopAll(); setProg(i); }}>{p.name}</button>
                ))}
              </div>
              <div className="row" style={{ alignItems: 'stretch' }}>
                {PROGS[prog].degs.map((d, i) => {
                  const x = deg(d);
                  const F = FUNC[x.f];
                  const on = activeChord === i;
                  return (
                    <div
                      key={i}
                      style={{
                        flex: '1 1 90px', minHeight: 76, borderRadius: 12, padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                        transition: 'transform 0.15s', transform: on ? 'translateY(-3px)' : 'none',
                        background: on ? F.color : F.tint, color: on ? '#fff' : 'var(--ink)', border: `2px solid ${on ? F.color : F.border}`,
                      }}
                    >
                      <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 800 }}>{x.symbol}</span>
                      <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>{x.roman} · {x.f}</span>
                    </div>
                  );
                })}
              </div>
              <p className="small">{PROGS[prog].text}</p>
              <div><button type="button" className="chip primary" onClick={playProgression}>{seq.playing ? '■ Parar' : '▶ Tocar progressão'}</button></div>
            </div>
            <div className="panel dark">
              <div className="label">Por que a dominante pede resolução?</div>
              <p>O acorde {v}7 tem um trítono entre a sua 3ª e a sua 7ª. Esse intervalo é instável e cada nota “escorrega” meio tom para uma nota de {key.label}:</p>
              <div className="stack mono" style={{ gap: 8, fontSize: 17, fontWeight: 600 }}>
                <div>{lead} (3ª do {v}7) → sobe → {key.label} (tônica)</div>
                <div>{fourth} (7ª do {v}7) → desce → {third} (3ª de {key.label})</div>
              </div>
              <p className="small">Dica de improviso: sobre o {v}7, mire na 3ª dele ({lead}) e resolva subindo meio tom para a tônica quando o acorde mudar para {key.label}.</p>
            </div>
          </div>
        </section>
      )}

      <section className="stack">
        <div className="between">
          <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 600, fontSize: 20 }}>{boardTitle}</div>
          <div className="row">
            <span style={{ fontSize: 14, color: 'var(--muted)', marginRight: 8 }}>{boardHint}</span>
            <button type="button" className="chip" aria-pressed={orient === 'player'} onClick={() => setOrient('player')}>Visão do guitarrista</button>
            <button type="button" className="chip" aria-pressed={orient === 'tab'} onClick={() => setOrient('tab')}>Tablatura</button>
          </div>
        </div>
        <Fretboard dots={dots} lines={lines} orient={orient} active={seq.active} />
        <Legend items={legendItems} />
      </section>
    </main>
  );
}
