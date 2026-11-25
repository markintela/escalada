// Símbolo da marca escalada: uma montanha em cinco traços coloridos
// (as cores das listras retrô) subindo pelas seis cordas do violão.
const STRINGS = [40, 65, 90, 115, 140, 165];

const SEGMENTS = [
  { x1: 20, y1: 165, x2: 60, y2: 90, color: '#E8412C' },
  { x1: 60, y1: 90, x2: 90, y2: 140, color: '#F39021' },
  { x1: 90, y1: 140, x2: 130, y2: 40, color: '#EBB000' },
  { x1: 130, y1: 40, x2: 170, y2: 115, color: '#4FA63B' },
  { x1: 170, y1: 115, x2: 220, y2: 165, color: '#1E8FCB' },
];

// O tamanho vem do CSS (.brand-mark), para mudar entre web e celular.
export default function LogoMark({ className = 'brand-mark' }: { className?: string }) {
  const stringWidth = 4;
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
        <line key={y} x1={6} y1={y} x2={234} y2={y} stroke="#B3AA9A" strokeWidth={stringWidth} />
      ))}
      {SEGMENTS.map((s) => (
        <line key={s.color} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={s.color} strokeWidth={18} />
      ))}
    </svg>
  );
}
