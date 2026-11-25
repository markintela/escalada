'use client';

import { useEffect, useState } from 'react';
import Fretboard, { Legend, type Band, type Dot, type Line } from './Fretboard';
import { BLUE_NOTE, BOX, FLAT, MODULES, type Lesson } from '@/lib/course';
import { FRETS, STR_NAMES, keyOf, midiOf, type Orient, type Pos } from '@/lib/geometry';
import { useSequencer, type Step } from '@/lib/useSequencer';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
const A = 9;
const STORE_KEY = 'curso-improviso-progresso-v1';
const TEMPOS = [{ v: 90, label: 'Lento' }, { v: 140, label: 'Médio' }, { v: 220, label: 'Rápido' }];

function sequenceOf(lesson: Lesson): Pos[][] {
  const raw: (Pos | Pos[])[] = lesson.seq ?? (lesson.paths ?? []).flatMap((p) => p.pts);
  return raw.map((e) => (Array.isArray(e[0]) ? (e as Pos[]) : [e as Pos]));
}

export default function CourseApp() {
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [labelMode, setLabelMode] = useState<'ordem' | 'notas'>('ordem');
  const [orient, setOrient] = useState<Orient>('player');
  const [tempo, setTempo] = useState(140);
  const [loaded, setLoaded] = useState(false);
  const seq = useSequencer();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as { idx?: number; done?: Record<number, boolean> };
        if (typeof data.idx === 'number' && data.idx >= 0 && data.idx < FLAT.length) setIdx(data.idx);
        if (data.done) setDone(data.done);
      }
    } catch {
      /* armazenamento indisponível: segue sem salvar */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ idx, done }));
    } catch {
      /* ignora */
    }
  }, [idx, done, loaded]);

  const cur = FLAT[idx];
  const lesson = cur.lesson;
  const mod = MODULES[cur.mi];
  const go = (i: number) => {
    seq.stop();
    setIdx(Math.max(0, Math.min(FLAT.length - 1, i)));
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Faixas, caminhos e bolinhas
  const bandKeys = lesson.bands ?? [];
  const bands: Band[] = bandKeys.map((k) => ({ ...BOX[k], faint: lesson.faintBands }));
  const lines: Line[] = (lesson.paths ?? []).map((p) => ({ pts: p.pts, color: p.color, dashed: p.dashed }));
  const inBand = (s: number, f: number) =>
    !bandKeys.length || bandKeys.some((k) => { const r = BOX[k].ranges[s]; return f >= r[0] && f <= r[1]; });

  const order = new Map<string, { n: number; color: string }>();
  let counter = 0;
  (lesson.paths ?? []).forEach((p) =>
    p.pts.forEach(([s, f], i) => {
      if (p.dashed && i > 0) return;
      const k = keyOf(s, f);
      if (!order.has(k)) order.set(k, { n: ++counter, color: p.color });
    }),
  );

  const dotMap = new Map<string, Dot>();
  const put = (d: Dot) => dotMap.set(keyOf(d.s, d.f), d);
  for (let s = 0; s < 6; s++) {
    for (let f = 0; f <= FRETS; f++) {
      const midi = midiOf(s, f);
      const name = NOTES[midi % 12];
      const k = keyOf(s, f);
      const click = () => seq.flash(k, midi);
      if (lesson.scale) {
        const iv = (((midi % 12) - A) % 12 + 12) % 12;
        if (lesson.scale.includes(iv)) {
          const focus = inBand(s, f) && !lesson.faded;
          let bg = '#2A1F1A', fg = '#F4EEE3', border = '#F4EEE3';
          if (iv === 0) { bg = 'var(--accent)'; fg = '#fff'; border = 'var(--accent)'; }
          else if (lesson.blue?.includes(iv)) { bg = BLUE_NOTE; fg = '#10243F'; border = BLUE_NOTE; }
          put({ s, f, size: focus ? 30 : 24, bg, fg, border, opacity: focus ? 1 : 0.32, label: focus ? name : '', aria: `${name}, corda ${STR_NAMES[s]}, casa ${f}`, onClick: click });
        }
      }
      const o = order.get(k);
      if (o) {
        put({ s, f, size: 32, bg: o.color, fg: '#1B1D1F', border: '#1B1D1F', label: labelMode === 'ordem' ? String(o.n) : name, aria: `Passo ${o.n}: ${name}, corda ${STR_NAMES[s]}, casa ${f}`, onClick: click });
      }
    }
  }
  (lesson.marks ?? []).forEach((m) => {
    const midi = midiOf(m.s, m.f);
    const name = NOTES[midi % 12];
    const light = m.color !== '#6B625A';
    put({ s: m.s, f: m.f, size: 32, bg: m.color, fg: light ? '#1B1D1F' : '#fff', border: light ? '#1B1D1F' : '#F4EEE3', dashed: true, label: m.label, aria: `${name}, corda ${STR_NAMES[m.s]}, casa ${m.f}`, onClick: () => seq.flash(keyOf(m.s, m.f), midi) });
  });

  const playPath = () => {
    if (seq.playing) return seq.stop();
    const steps: Step[] = sequenceOf(lesson).map((notes) => ({
      keys: notes.map(([s, f]) => keyOf(s, f)),
      midis: notes.map(([s, f]) => midiOf(s, f)),
    }));
    seq.play(steps, 60000 / tempo);
  };

  const doneCount = Object.values(done).filter(Boolean).length;
  const isDone = !!done[idx];

  return (
    <main className="container">
      <header className="between" style={{ alignItems: 'flex-end' }}>
        <div className="stack" style={{ gap: 6, maxWidth: 760 }}>
          <div className="kicker">Curso · {MODULES.length} módulos · {FLAT.length} aulas · tom de Lá menor</div>
          <h1 className="display">Improviso na guitarra: o braço em ondas</h1>
          <p className="lead">
            As escalas não são caixas isoladas: são ondas que descem da 6ª corda (em cima) até a 1ª (embaixo) e se repetem ao longo do braço.
            Aprenda a enxergar essas ondas, percorrer caminhos entre elas e usar truques que transformam escala em música.
          </p>
        </div>
        <div className="stack" style={{ minWidth: 240, gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--muted)' }}>
            <span>Seu progresso</span>
            <strong style={{ color: 'var(--ink)' }}>{doneCount} de {FLAT.length}</strong>
          </div>
          <div className="progress"><div style={{ width: `${Math.round((doneCount / FLAT.length) * 100)}%` }} /></div>
        </div>
      </header>

      <div className="course-layout">
        <nav aria-label="Estrutura do curso" className="panel course-nav" style={{ gap: 18, padding: 18 }}>
          {MODULES.map((m, mi) => (
            <div key={mi} className="stack" style={{ gap: 6 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                <span className="mono" style={{ fontSize: 13, fontWeight: 600, color: '#9A3412' }}>{String(mi + 1).padStart(2, '0')}</span>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 17, lineHeight: 1.25 }}>{m.title}</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.45, color: 'var(--soft)', paddingLeft: 28 }}>{m.desc}</div>
              <div className="stack" style={{ gap: 2, paddingLeft: 18 }}>
                {m.lessons.map((l, li) => {
                  const gi = FLAT.findIndex((x) => x.mi === mi && x.li === li);
                  return (
                    <button key={li} type="button" className="lesson-btn" aria-current={gi === idx ? 'page' : undefined} onClick={() => go(gi)}>
                      <span className={done[gi] ? 'check done' : 'check'} aria-label={done[gi] ? 'concluída' : undefined}>
                        {done[gi] && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="4 12 10 18 20 6" />
                          </svg>
                        )}
                      </span>
                      <span>{mi + 1}.{li + 1}&nbsp;&nbsp;{l.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="course-main">
          <div className="stack" style={{ gap: 6 }}>
            <div className="mono" style={{ fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9A3412' }}>
              Módulo {cur.mi + 1} · {mod.title} · Aula {cur.mi + 1}.{cur.li + 1}
            </div>
            <h2 className="display">{lesson.title}</h2>
            <div style={{ fontSize: 16, color: 'var(--muted)' }}><strong style={{ color: 'var(--ink)' }}>Objetivo:</strong> {lesson.goal}</div>
          </div>

          <Fretboard dots={[...dotMap.values()]} bands={bands} lines={lines} orient={orient} active={seq.active} />

          <div className="between" style={{ alignItems: 'center' }}>
            <div className="row">
              <button type="button" className="chip primary" onClick={playPath}>{seq.playing ? '■ Parar' : '▶ Tocar caminho'}</button>
              {TEMPOS.map((t) => (
                <button key={t.v} type="button" className="chip" aria-pressed={tempo === t.v} onClick={() => setTempo(t.v)}>{t.label}</button>
              ))}
            </div>
            <div className="row">
              <button type="button" className="chip" aria-pressed={labelMode === 'ordem'} onClick={() => setLabelMode('ordem')}>Ordem</button>
              <button type="button" className="chip" aria-pressed={labelMode === 'notas'} onClick={() => setLabelMode('notas')}>Notas</button>
              <span style={{ width: 8 }} />
              <button type="button" className="chip" aria-pressed={orient === 'player'} onClick={() => setOrient('player')}>Visão do guitarrista</button>
              <button type="button" className="chip" aria-pressed={orient === 'tab'} onClick={() => setOrient('tab')}>Visão de tablatura</button>
            </div>
          </div>

          <Legend
            items={[
              ...(lesson.scale ? [{ color: 'var(--accent)', text: 'Tônica (Lá)' }] : []),
              ...lesson.legend.map(([shape, color, text]) => ({ shape: shape === 'path' ? ('line' as const) : shape === 'band' ? ('band' as const) : ('dot' as const), color, border: '#2A1F1A', text })),
            ]}
          />

          {lesson.chart && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(54px, 1fr))', gap: 6, overflowX: 'auto' }}>
              {lesson.chart.map((c, i) => (
                <div
                  key={i}
                  className="mono"
                  style={{
                    minHeight: 56, borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, fontWeight: 600, fontSize: 15,
                    background: c === 'A7' ? '#fff' : c === 'D7' ? '#FCE7F3' : '#CCFBF1',
                    border: `1px solid ${c === 'A7' ? '#DEDAD2' : c === 'D7' ? '#F3C3DD' : '#99E6D6'}`,
                  }}
                >
                  <span style={{ fontSize: 11, color: 'var(--soft)' }}>{i + 1}</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          )}

          <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            <div className="panel"><div className="label">Entenda</div><p>{lesson.explain}</p></div>
            <div className="panel dark"><div className="label">Truque</div><p>{lesson.trick}</p></div>
            <div className="panel">
              <div className="label">Exercício</div>
              <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 15, lineHeight: 1.5 }}>
                {lesson.steps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </div>
          </div>

          <div className="between" style={{ alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: 18 }}>
            <button type="button" className="chip" disabled={idx === 0} onClick={() => go(idx - 1)}>← Aula anterior</button>
            <button type="button" className={isDone ? 'chip success' : 'chip'} aria-pressed={isDone} onClick={() => setDone({ ...done, [idx]: !isDone })}>
              {isDone ? '✓ Aula concluída' : 'Marcar como concluída'}
            </button>
            <button type="button" className="chip dark" disabled={idx === FLAT.length - 1} onClick={() => go(idx + 1)}>Próxima aula →</button>
          </div>
        </div>
      </div>
    </main>
  );
}
