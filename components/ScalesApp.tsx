'use client';

import { useState } from 'react';
import Fretboard, { Legend, type Dot } from './Fretboard';
import { FRETS, OPEN_MIDI, STR_NAMES, keyOf, midiOf, type Orient } from '@/lib/geometry';
import { CATS, DEG, NOTES_F, NOTES_S, PT, ROOT_LABELS, SCALES, intervalOf, positions, prefersFlats } from '@/lib/scales';
import { useSequencer, type Step } from '@/lib/useSequencer';

const TEMPOS = [{ v: 80, label: 'Lento' }, { v: 120, label: 'Médio' }, { v: 200, label: 'Rápido' }];

export default function ScalesApp() {
  const [root, setRoot] = useState(9);
  const [scaleId, setScaleId] = useState('pentmen');
  const [view, setView] = useState<'notas' | 'graus'>('notas');
  const [pos, setPos] = useState(0);
  const [tempo, setTempo] = useState(120);
  const [orient, setOrient] = useState<Orient>('tab');
  const seq = useSequencer();

  const sc = SCALES.find((s) => s.id === scaleId) ?? SCALES[0];
  const rootLabel = ROOT_LABELS[root];
  const names = prefersFlats(root, sc.ints) ? NOTES_F : NOTES_S;
  const nameOf = (pc: number) => (pc === root ? rootLabel : names[pc]);
  const degOf = (iv: number) => sc.deg?.[iv] ?? DEG[iv];
  const wins = positions(sc.ints, root);
  const p = pos > wins.length ? 0 : pos;
  const win = p ? wins[p - 1] : null;

  const reset = () => seq.stop();

  const dots: Dot[] = [];
  for (let s = 0; s < 6; s++) {
    for (let f = 0; f <= FRETS; f++) {
      const midi = midiOf(s, f);
      const iv = intervalOf(root, midi);
      if (!sc.ints.includes(iv)) continue;
      const inWin = !win || (f >= win.start && f <= win.end);
      let bg = '#2A1F1A', fg = '#F4EEE3', border = '#F4EEE3';
      if (iv === 0) { bg = 'var(--accent)'; fg = '#fff'; border = 'var(--accent)'; }
      else if (sc.blue?.includes(iv)) { bg = '#9CC3F5'; fg = '#10243F'; border = '#9CC3F5'; }
      else if (sc.chord.includes(iv)) { bg = '#F4EEE3'; fg = '#1B1D1F'; border = '#F4EEE3'; }
      dots.push({
        s, f, size: 34, bg, fg, border,
        opacity: inWin ? 1 : 0.18,
        label: view === 'graus' ? degOf(iv) : nameOf(midi % 12),
        aria: `${nameOf(midi % 12)}, grau ${degOf(iv)}, corda ${STR_NAMES[s]}, casa ${f}`,
        onClick: () => seq.flash(keyOf(s, f), midi),
      });
    }
  }

  const playScale = () => {
    if (seq.playing) return seq.stop();
    let notes: { midi: number; keys: string[] }[] = [];
    if (win) {
      const seen = new Set<number>();
      for (let s = 0; s < 6; s++) {
        for (let f = win.start; f <= win.end; f++) {
          const midi = midiOf(s, f);
          if (sc.ints.includes(intervalOf(root, midi)) && !seen.has(midi)) {
            seen.add(midi);
            notes.push({ midi, keys: [keyOf(s, f)] });
          }
        }
      }
      notes.sort((a, b) => a.midi - b.midi);
    } else {
      const base = 40 + ((((root - 4) % 12) + 12) % 12);
      const all = (m: number) => {
        const keys: string[] = [];
        for (let s = 0; s < 6; s++) { const f = m - OPEN_MIDI[s]; if (f >= 0 && f <= FRETS) keys.push(keyOf(s, f)); }
        return keys;
      };
      notes = [...sc.ints, 12].map((iv) => ({ midi: base + iv, keys: all(base + iv) }));
    }
    const full = [...notes, ...notes.slice(0, -1).reverse()];
    const steps: Step[] = full.map((n) => ({ keys: n.keys, midis: [n.midi] }));
    seq.play(steps, 60000 / tempo);
  };

  const steps = [...sc.ints, 12].slice(1).map((v, i) => {
    const d = v - sc.ints[i];
    return d === 1 ? 'S' : d === 2 ? 'T' : d === 3 ? '1½T' : `${d}S`;
  });
  const acc = rootLabel.length > 1 ? (rootLabel[1] === '#' ? ' sustenido' : ' bemol') : '';

  return (
    <main className="container">
      <header className="between" style={{ alignItems: 'flex-end' }}>
        <div className="stack" style={{ gap: 6 }}>
          <div className="kicker">Treino de escalas · afinação padrão E A D G B E</div>
          <h1 className="display">Escalas no Violão</h1>
        </div>
        <p className="lead" style={{ maxWidth: 460 }}>
          Escolha a tônica e a escala, veja as notas no braço e toque em qualquer bolinha para ouvir. Use as posições para estudar uma região de cada vez.
        </p>
      </header>

      <section className="panel" style={{ gap: 22 }}>
        <div className="stack">
          <div className="label">1 · Tônica</div>
          <div className="row">
            {ROOT_LABELS.map((l, pc) => (
              <button key={l} type="button" className="chip root" aria-pressed={pc === root} onClick={() => { reset(); setRoot(pc); }}>{l}</button>
            ))}
          </div>
        </div>
        <div className="stack">
          <div className="label">2 · Escala</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
            {CATS.map((c) => (
              <div key={c} className="stack" style={{ flex: '1 1 260px', gap: 8 }}>
                <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 600, fontSize: 17 }}>{c}</div>
                <div className="row">
                  {SCALES.filter((s) => s.cat === c).map((s) => (
                    <button key={s.id} type="button" className="chip" aria-pressed={s.id === sc.id} onClick={() => { reset(); setScaleId(s.id); if (pos > s.ints.length) setPos(0); }}>
                      {s.short}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px 32px', alignItems: 'flex-end' }}>
          <div className="stack">
            <div className="label">3 · Mostrar</div>
            <div className="row">
              <button type="button" className="chip" aria-pressed={view === 'notas'} onClick={() => setView('notas')}>Notas</button>
              <button type="button" className="chip" aria-pressed={view === 'graus'} onClick={() => setView('graus')}>Graus</button>
            </div>
          </div>
          <div className="stack">
            <div className="label">4 · Região do braço</div>
            <div className="row">
              <button type="button" className="chip" aria-pressed={p === 0} onClick={() => { reset(); setPos(0); }}>Braço todo</button>
              {wins.map((_, i) => (
                <button key={i} type="button" className="chip" aria-pressed={p === i + 1} onClick={() => { reset(); setPos(i + 1); }}>Pos. {i + 1}</button>
              ))}
            </div>
          </div>
          <div className="stack">
            <div className="label">5 · Ouvir</div>
            <div className="row">
              <button type="button" className="chip primary" onClick={playScale}>{seq.playing ? '■ Parar' : '▶ Tocar escala'}</button>
              {TEMPOS.map((t) => (
                <button key={t.v} type="button" className="chip" aria-pressed={tempo === t.v} onClick={() => setTempo(t.v)}>{t.label}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="stack" style={{ gap: 14 }}>
        <div className="between">
          <h2 className="display">{rootLabel} {sc.name}</h2>
          <div className="row">
            <span style={{ fontSize: 15, color: 'var(--muted)', marginRight: 8 }}>
              {PT[rootLabel[0]]}{acc} · {sc.ints.length} notas · {win ? `casas ${win.start} a ${win.end}` : `casas 0 a ${FRETS}`}
            </span>
            <button type="button" className="chip" aria-pressed={orient === 'tab'} onClick={() => setOrient('tab')}>Tablatura</button>
            <button type="button" className="chip" aria-pressed={orient === 'player'} onClick={() => setOrient('player')}>Visão do violonista</button>
          </div>
        </div>
        <Fretboard dots={dots} orient={orient} window={win} active={seq.active} />
        <Legend
          items={[
            { color: 'var(--accent)', text: 'Tônica (1)' },
            { color: '#F4EEE3', border: '#2A1F1A', text: 'Notas do acorde' },
            { color: '#2A1F1A', border: '#F4EEE3', text: 'Outras notas da escala' },
            ...(sc.blue ? [{ color: '#9CC3F5', border: '#2A1F1A', text: 'Blue note / nota de passagem' }] : []),
          ]}
        />
      </section>

      <section className="grid-auto">
        <div className="panel">
          <div className="label">Notas da escala</div>
          <div className="row" style={{ gap: 8 }}>
            {sc.ints.map((iv) => {
              const pc = (root + iv) % 12;
              const style =
                iv === 0 ? { background: 'var(--accent)', color: '#fff' }
                  : sc.blue?.includes(iv) ? { background: '#9CC3F5', color: '#10243F' }
                    : sc.chord.includes(iv) ? { background: '#2A1F1A', color: '#F4EEE3' }
                      : { background: '#fff', color: '#1B1D1F', border: '2px solid #2A1F1A' };
              return (
                <div key={iv} className="stack" style={{ alignItems: 'center', gap: 4 }}>
                  <div className="note-chip" style={style}>{nameOf(pc)}</div>
                  <div className="mono" style={{ fontSize: 13, color: 'var(--muted)' }}>{degOf(iv)}</div>
                </div>
              );
            })}
          </div>
          <div className="stack" style={{ gap: 4 }}>
            <div style={{ fontSize: 13, color: 'var(--soft)' }}>Fórmula (T = tom, S = semitom)</div>
            <div className="mono" style={{ fontSize: 16, fontWeight: 600 }}>{steps.join(' – ')}</div>
          </div>
        </div>
        <div className="panel">
          <div className="label">Onde usar</div>
          <p>{sc.use}</p>
        </div>
        <div className="panel">
          <div className="label">Como estudar</div>
          <p>{sc.tip}</p>
          <p className="small">Rotina sugerida: suba e desça a posição com metrônomo lento, depois conecte com a posição vizinha. Só aumente a velocidade quando sair limpo três vezes seguidas.</p>
        </div>
      </section>
    </main>
  );
}
