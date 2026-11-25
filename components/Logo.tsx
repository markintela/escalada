// Símbolo da marca escalada: uma montanha em cinco traços coloridos
// (as cores das listras retrô), como uma linha subindo pelas cordas.
const SEGMENTS = [
  { x1: 20, y1: 165, x2: 60, y2: 90, color: '#E8412C' },
  { x1: 60, y1: 90, x2: 90, y2: 140, color: '#F39021' },
  { x1: 90, y1: 140, x2: 130, y2: 40, color: '#EBB000' },
  { x1: 130, y1: 40, x2: 170, y2: 115, color: '#4FA63B' },
  { x1: 170, y1: 115, x2: 220, y2: 165, color: '#1E8FCB' },
];

export default function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={Math.round((size * 190) / 240)}
      viewBox="0 0 240 190"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {SEGMENTS.map((s) => (
        <line key={s.color} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={s.color} strokeWidth={16} />
      ))}
    </svg>
  );
}
