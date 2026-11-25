// Símbolo da marca escalada (versão 3D, clara horizontal): seis cordas
// do violão, uma montanha em cinco traços coloridos e notas nos vértices.
const STRINGS = [40, 65, 90, 115, 140, 165];

const SEGMENTS = [
  { x1: 20, y1: 165, x2: 60, y2: 90, color: '#E8412C' },
  { x1: 60, y1: 90, x2: 90, y2: 140, color: '#F39021' },
  { x1: 90, y1: 140, x2: 130, y2: 40, color: '#EBB000' },
  { x1: 130, y1: 40, x2: 170, y2: 115, color: '#4FA63B' },
  { x1: 170, y1: 115, x2: 220, y2: 165, color: '#1E8FCB' },
];

const NOTES = [
  { cx: 60, cy: 90 },
  { cx: 90, cy: 140 },
  { cx: 130, cy: 40 },
  { cx: 170, cy: 115 },
];

// O tamanho vem do CSS (.brand-mark), para mudar entre web e celular.
export default function LogoMark({ className = 'brand-mark' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 190"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {STRINGS.map((y) => (
        <line key={y} x1={10} y1={y} x2={230} y2={y} stroke="#CFC7B8" strokeWidth={3} />
      ))}
      {SEGMENTS.map((s) => (
        <line key={s.color} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={s.color} strokeWidth={12} />
      ))}
      {NOTES.map((n) => (
        <circle key={`${n.cx}-${n.cy}`} cx={n.cx} cy={n.cy} r={9} fill="#1C1B1F" />
      ))}
    </svg>
  );
}
