import Link from 'next/link';

const CARDS = [
  {
    href: '/escalas',
    kicker: '17 escalas',
    title: 'Escalas no braço',
    text: 'Maior, menores, pentatônicas, blues, modos e escalas de jazz em qualquer tom, com notas ou graus, posições e som.',
  },
  {
    href: '/curso',
    kicker: '5 módulos · 19 aulas',
    title: 'Curso de improviso',
    text: 'O braço em ondas: caminhos vertical, horizontal, diagonal e em onda, truques de improviso e notas-alvo no blues.',
  },
  {
    href: '/teoria',
    kicker: 'Teoria aplicada',
    title: 'Intervalos e funções',
    text: 'Os 12 intervalos, como os acordes se formam e as funções tônica, subdominante e dominante no campo harmônico.',
  },
];

export default function Home() {
  return (
    <main className="container">
      <header className="stack" style={{ maxWidth: 780 }}>
        <div className="kicker">Violão e guitarra · afinação padrão</div>
        <h1 className="display">Aprenda escalas, improviso e harmonia vendo o braço</h1>
        <p className="lead">Tudo é interativo: toque nas notas para ouvir, escolha o tom e acompanhe os caminhos no braço.</p>
      </header>
      <div className="home-cards">
        {CARDS.map((c) => (
          <Link key={c.href} href={c.href} className="home-card">
            <span className="kicker">{c.kicker}</span>
            <h2 className="display" style={{ fontSize: 30 }}>{c.title}</h2>
            <p className="lead">{c.text}</p>
            <span className="go">Abrir →</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
