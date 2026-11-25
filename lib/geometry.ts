export const FRETS = 15;
export const ROW = 44;
export const TOP = 26;
export const BOARD_W = 990;
export const OPEN_MIDI = [40, 45, 50, 55, 59, 64]; // s = 0 (Mi grave) … 5 (Mi agudo)
export const STR_NAMES = ['E', 'A', 'D', 'G', 'B', 'e'];
export const STR_W = [4, 3.4, 2.8, 2.2, 1.6, 1.2];

export type Orient = 'player' | 'tab';
export type Pos = [number, number]; // [corda, casa]

export const xOf = (f: number) => (f === 0 ? 62 : 60 + 60 * f);
export const rowOf = (s: number, orient: Orient) => (orient === 'player' ? s : 5 - s);
export const yOf = (s: number, orient: Orient) => TOP + rowOf(s, orient) * ROW + ROW / 2;
export const midiOf = (s: number, f: number) => OPEN_MIDI[s] + f;
export const keyOf = (s: number, f: number) => `${s}-${f}`;

type Pt = { x: number; y: number };

/** Curva suave (Catmull-Rom → Bézier) passando por todos os pontos. */
export function smoothPath(pts: Pt[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

/** Faixa ondulada (uma “caixa” da escala) a partir do intervalo de casas em cada corda. */
export function bandPath(ranges: [number, number][], orient: Orient): { d: string; labelX: number } {
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let s = 0; s < 6; s++) {
    const [a, b] = ranges[s];
    const y = yOf(s, orient);
    left.push({ x: a === 0 ? 38 : 90 + (a - 1) * 60 + 5, y });
    right.push({ x: 90 + b * 60 - 5, y });
  }
  left.sort((p, q) => p.y - q.y);
  right.sort((p, q) => p.y - q.y);
  const topY = TOP + 4;
  const botY = TOP + 6 * ROW - 4;
  const l = [{ x: left[0].x, y: topY }, ...left, { x: left[5].x, y: botY }];
  const r = [{ x: right[5].x, y: botY }, ...right.slice().reverse(), { x: right[0].x, y: topY }];
  const rd = smoothPath(r).replace(/^M [^C]+/, '');
  return { d: `${smoothPath(l)} L ${r[0].x} ${r[0].y} ${rd} Z`, labelX: (left[0].x + right[0].x) / 2 };
}
