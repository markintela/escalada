'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoMark from '@/components/Logo';

const LINKS = [
  { href: '/escalas', label: 'Escalas', color: '#E8412C' },
  { href: '/curso', label: 'Curso de improviso', color: '#EBB000' },
  { href: '/teoria', label: 'Intervalos e funções', color: '#1E8FCB' },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="topnav" aria-label="Principal">
      <div className="topnav-inner">
        <Link href="/" className="brand">
          <LogoMark />
          <span className="brand-text">
            <span className="brand-name">escalada</span>
            <span className="brand-tagline">escalas de violão</span>
          </span>
        </Link>
        <div className="navlinks">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="navlink"
              aria-current={path === l.href ? 'page' : undefined}
              style={{ '--dot': l.color } as React.CSSProperties}
            >
              <span className="navlink-dot" aria-hidden="true" />
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
