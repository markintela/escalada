'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoMark from '@/components/Logo';

const LINKS = [
  { href: '/escalas', label: 'Escalas' },
  { href: '/curso', label: 'Curso de improviso' },
  { href: '/teoria', label: 'Intervalos e funções' },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="topnav" aria-label="Principal">
      <div className="topnav-inner">
        <Link href="/" className="brand">
          <LogoMark />
          escalada
        </Link>
        <div className="navlinks">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="navlink" aria-current={path === l.href ? 'page' : undefined}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
