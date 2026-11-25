'use client';

import {
  BOARD_W, FRETS, ROW, STR_NAMES, STR_W, TOP, bandPath, keyOf, smoothPath, xOf, yOf,
  type Orient, type Pos,
} from '@/lib/geometry';

export type Dot = {
  s: number;
  f: number;
  label: string;
  aria: string;
  bg: string;
  fg: string;
  border: string;
  dashed?: boolean;
  size?: number;
  opacity?: number;
  onClick?: () => void;
};

export type Band = { ranges: [number, number][]; color: string; label: string; faint?: boolean };
export type Line = { pts: Pos[]; color: string; dashed?: boolean; width?: number };

type Props = {
  dots: Dot[];
  bands?: Band[];
  lines?: Line[];
  orient: Orient;
  window?: { start: number; end: number } | null;
  active?: Set<string>;
};

const H = TOP + 6 * ROW;

export default function Fretboard({ dots, bands = [], lines = [], orient, window: win, active }: Props) {
  const frets = Array.from({ length: FRETS + 1 }, (_, f) => f);
  return (
    <div className="board-scroll">
      <div className="board-inner">
        <div style={{ position: 'relative', width: BOARD_W, height: H }}>
          {win && (
            <div
              style={{
                position: 'absolute',
                left: win.start === 0 ? 34 : 90 + (win.start - 1) * 60,
                width: 90 + win.end * 60 - (win.start === 0 ? 34 : 90 + (win.start - 1) * 60),
                top: TOP,
                height: 6 * ROW,
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 6,
              }}
            />
          )}
          <div style={{ position: 'absolute', left: 86, top: TOP, width: 7, height: 6 * ROW, background: '#E9E2D2', borderRadius: 2 }} />
          {frets.slice(1).map((f) => (
            <div key={f} style={{ position: 'absolute', left: 90 + 60 * f - 1.5, top: TOP, width: 3, height: 6 * ROW, background: '#9A968E' }} />
          ))}
          {[3, 5, 7, 9, 15].map((f) => (
            <div key={f} style={{ position: 'absolute', left: xOf(f) - 7, top: TOP + 3 * ROW - 7, width: 14, height: 14, borderRadius: '50%', background: '#4E3F36' }} />
          ))}
          {[1, 5].map((r) => (
            <div key={r} style={{ position: 'absolute', left: xOf(12) - 7, top: TOP + r * ROW - 7, width: 14, height: 14, borderRadius: '50%', background: '#4E3F36' }} />
          ))}
          {[0, 1, 2, 3, 4, 5].map((s) => {
            const y = yOf(s, orient);
            return (
              <div key={s}>
                <div style={{ position: 'absolute', left: 34, right: 0, top: y - STR_W[s] / 2, height: STR_W[s], background: '#D8CBB4' }} />
                <div className="mono" style={{ position: 'absolute', left: 0, width: 24, top: y - 10, height: 20, lineHeight: '20px', fontSize: 14, fontWeight: 600, color: '#C9BCA6' }}>
                  {STR_NAMES[s]}
                </div>
              </div>
            );
          })}
          <svg width={BOARD_W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }} aria-hidden="true">
            {bands.map((b, i) => {
              const { d, labelX } = bandPath(b.ranges, orient);
              return (
                <g key={i}>
                  <path d={d} fill={b.color} fillOpacity={b.faint ? 0.1 : 0.2} stroke={b.color} strokeOpacity={b.faint ? 0.35 : 0.7} strokeWidth={1.5} />
                  <text x={labelX} y={16} textAnchor="middle" fill={b.color} fontFamily="'IBM Plex Mono', monospace" fontSize={13} fontWeight={600}>
                    {b.label}
                  </text>
                </g>
              );
            })}
            {lines.map((l, i) => (
              <path
                key={i}
                d={smoothPath(l.pts.map(([s, f]) => ({ x: xOf(f), y: yOf(s, orient) })))}
                fill="none"
                stroke={l.color}
                strokeWidth={l.width ?? (l.dashed ? 3 : 4)}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity={0.9}
                strokeDasharray={l.dashed ? '7 7' : undefined}
              />
            ))}
          </svg>
          {dots.map((d) => {
            const size = d.size ?? 32;
            const on = active?.has(keyOf(d.s, d.f));
            return (
              <button
                key={keyOf(d.s, d.f)}
                type="button"
                className={on ? 'dot active' : 'dot'}
                aria-label={d.aria}
                onClick={d.onClick}
                style={{
                  left: xOf(d.f) - size / 2,
                  top: yOf(d.s, orient) - size / 2,
                  width: size,
                  height: size,
                  fontSize: d.label.length > 2 ? 11 : size > 28 ? 13 : 11,
                  background: d.bg,
                  color: d.fg,
                  border: `2px ${d.dashed ? 'dashed' : 'solid'} ${d.border}`,
                  opacity: d.opacity ?? 1,
                }}
              >
                {d.label}
              </button>
            );
          })}
        </div>
        <div style={{ position: 'relative', width: BOARD_W, height: 22, marginTop: 6 }}>
          {frets.map((f) => (
            <div key={f} className="mono" style={{ position: 'absolute', left: xOf(f) - 15, width: 30, textAlign: 'center', fontSize: 13, color: '#C9BCA6' }}>
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Legend({ items }: { items: { color: string; border?: string; text: string; shape?: 'dot' | 'line' | 'band' }[] }) {
  return (
    <div className="legend">
      {items.map((it, i) => (
        <div key={i} className="legend-item">
          <span
            style={
              it.shape === 'line'
                ? { width: 26, height: 4, borderRadius: 2, background: it.color, display: 'inline-block' }
                : it.shape === 'band'
                  ? { width: 26, height: 16, borderRadius: 6, background: it.color, opacity: 0.75, display: 'inline-block' }
                  : { width: 16, height: 16, borderRadius: '50%', background: it.color, border: `2px solid ${it.border ?? it.color}`, display: 'inline-block' }
            }
          />
          {it.text}
        </div>
      ))}
    </div>
  );
}
