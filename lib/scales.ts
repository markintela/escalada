export const NOTES_S = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const NOTES_F = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
export const ROOT_LABELS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
export const PT: Record<string, string> = { C: 'Dó', D: 'Ré', E: 'Mi', F: 'Fá', G: 'Sol', A: 'Lá', B: 'Si' };
export const DEG: Record<number, string> = { 0: '1', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4', 6: 'b5', 7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7' };
export const CATS = ['Básicas', 'Pentatônicas e Blues', 'Modos', 'Jazz'] as const;

export type Scale = {
  id: string;
  cat: (typeof CATS)[number];
  short: string;
  name: string;
  ints: number[];
  chord: number[];
  blue?: number[];
  deg?: Record<number, string>;
  use: string;
  tip: string;
};

export const SCALES: Scale[] = [
  { id: 'maior', cat: 'Básicas', short: 'Maior', name: 'Escala Maior (Jônio)', ints: [0, 2, 4, 5, 7, 9, 11], chord: [0, 4, 7, 11],
    use: 'A base de toda a harmonia ocidental. Som alegre e resolvido: pop, MPB, sertanejo, bossa, música de igreja. Use sobre acordes maiores e 7M, e para tirar melodias de ouvido.',
    tip: 'Cante as notas (dó, ré, mi…) enquanto toca. A posição 1 começa na tônica da 6ª corda: domine-a antes de passar para as outras.' },
  { id: 'menor', cat: 'Básicas', short: 'Menor natural', name: 'Escala Menor Natural (Eólio)', ints: [0, 2, 3, 5, 7, 8, 10], chord: [0, 3, 7, 10],
    use: 'Som melancólico. Rock, baladas, metal e boa parte do pop em tom menor. É a relativa da maior: Lá menor tem exatamente as mesmas notas de Dó maior.',
    tip: 'Compare com a maior de mesma tônica: só mudam a 3ª, a 6ª e a 7ª. Toque as duas em sequência para ouvir a diferença.' },
  { id: 'harm', cat: 'Básicas', short: 'Menor harmônica', name: 'Menor Harmônica', ints: [0, 2, 3, 5, 7, 8, 11], chord: [0, 3, 7, 11],
    use: 'Menor natural com 7ª maior. O salto de 1½ tom entre b6 e 7 dá o som “árabe” e neoclássico. Gera o acorde V7 do tom menor: flamenco, tango, metal neoclássico.',
    tip: 'Destaque o trecho b6 → 7 → 1: é a assinatura da escala. Use-a sobre o acorde V7 (ex.: E7 indo para Am).' },
  { id: 'mel', cat: 'Básicas', short: 'Menor melódica', name: 'Menor Melódica (Jazz)', ints: [0, 2, 3, 5, 7, 9, 11], chord: [0, 3, 7, 11],
    use: 'Menor com 6ª e 7ª maiores. No jazz é tocada igual subindo e descendo, sobre acordes m6 e m(7M). Seus modos geram a escala alterada e a lídio b7.',
    tip: 'Pense nela como a escala maior com a 3ª abaixada. Isso facilita encontrar o desenho a partir do que você já sabe.' },
  { id: 'pentmen', cat: 'Pentatônicas e Blues', short: 'Pentatônica menor', name: 'Pentatônica Menor', ints: [0, 3, 5, 7, 10], chord: [0, 3, 7, 10],
    use: 'A escala mais usada no rock e no blues. São só 5 notas e nenhum semitom, então quase tudo soa bem. Funciona sobre acordes menores e também sobre o blues em tom maior.',
    tip: 'Comece pela posição 1, o famoso “box”. Depois aprenda as 5 posições e ligue uma à outra: elas se encaixam ao longo do braço.' },
  { id: 'pentmai', cat: 'Pentatônicas e Blues', short: 'Pentatônica maior', name: 'Pentatônica Maior', ints: [0, 2, 4, 7, 9], chord: [0, 4, 7],
    use: 'Som aberto e luminoso: country, pop, rock, MPB. Tem as mesmas notas da pentatônica menor relativa (Dó maior = Lá menor), só muda a nota de repouso.',
    tip: 'Toque a pentatônica menor 3 casas abaixo da tônica: é o mesmo desenho! Treine terminar as frases na tônica maior.' },
  { id: 'blues', cat: 'Pentatônicas e Blues', short: 'Blues', name: 'Escala Blues (menor)', ints: [0, 3, 5, 6, 7, 10], chord: [0, 3, 7, 10], blue: [6], deg: { 6: 'b5' },
    use: 'Pentatônica menor + b5, a “blue note”. Sobre os três acordes do blues (I7, IV7, V7) e no rock. É a cara do blues tradicional.',
    tip: 'Use a b5 (em azul) como passagem entre 4 e 5, ou com bend. Evite parar nela: ela cria tensão e pede resolução.' },
  { id: 'bluesmai', cat: 'Pentatônicas e Blues', short: 'Blues maior', name: 'Escala Blues Maior', ints: [0, 2, 3, 4, 7, 9], chord: [0, 4, 7], blue: [3],
    use: 'Pentatônica maior + b3. O lado “alegre” do blues, country e southern rock. Sobre acordes maiores e dominantes.',
    tip: 'Deslize da b3 (azul) para a 3 com hammer-on ou slide. Misture com a blues menor no mesmo solo para variar a cor.' },
  { id: 'dorico', cat: 'Modos', short: 'Dórico', name: 'Modo Dórico', ints: [0, 2, 3, 5, 7, 9, 10], chord: [0, 3, 7, 10],
    use: 'Menor com 6ª maior: menos triste, mais “groove”. Funk, soul, rock latino e jazz modal. Sobre acordes m7 e no acorde II do II–V–I.',
    tip: 'Toque a pentatônica menor e acrescente a 2 e a 6. A 6ª maior é a nota que dá o caráter dórico: enfatize-a.' },
  { id: 'mixo', cat: 'Modos', short: 'Mixolídio', name: 'Modo Mixolídio', ints: [0, 2, 4, 5, 7, 9, 10], chord: [0, 4, 7, 10],
    use: 'Maior com b7. Rock clássico, blues, baião e forró. Sobre acordes dominantes (7) e no V do II–V–I.',
    tip: 'Mire nas notas do acorde (1, 3, 5, b7) nos tempos fortes. A b7 é o que diferencia da escala maior.' },
  { id: 'lidio', cat: 'Modos', short: 'Lídio', name: 'Modo Lídio', ints: [0, 2, 4, 6, 7, 9, 11], chord: [0, 4, 7, 11], deg: { 6: '#4' },
    use: 'Maior com #4: som flutuante, de trilha sonora. Sobre acordes 7M(#11) e no IV grau da tonalidade.',
    tip: 'Toque sobre um acorde maior parado e enfatize a #4 resolvendo na 5. Repare como o clima muda em relação à escala maior.' },
  { id: 'frigio', cat: 'Modos', short: 'Frígio', name: 'Modo Frígio', ints: [0, 1, 3, 5, 7, 8, 10], chord: [0, 3, 7, 10],
    use: 'Menor com b2: som espanhol e sombrio. Flamenco, metal e música latina. Sobre acordes m7 e riffs pesados em uma corda solta.',
    tip: 'Alterne a tônica com a b2 (meio tom acima) sobre a 6ª corda solta. É o clichê frígio mais reconhecível.' },
  { id: 'bebop', cat: 'Jazz', short: 'Bebop dominante', name: 'Bebop Dominante', ints: [0, 2, 4, 5, 7, 9, 10, 11], chord: [0, 4, 7, 10], blue: [11],
    use: 'Mixolídio com uma 7ª maior de passagem (em azul). Com 8 notas, tocando em colcheias a partir de uma nota do acorde, as notas do acorde caem nos tempos fortes. Sobre acordes 7.',
    tip: 'Desça a escala a partir da tônica em colcheias, com metrônomo. Use a 7ª maior só de passagem entre a 1 e a b7.' },
  { id: 'alterada', cat: 'Jazz', short: 'Alterada', name: 'Alterada (Superlócria)', ints: [0, 1, 3, 4, 6, 8, 10], chord: [0, 4, 10], deg: { 1: 'b9', 3: '#9', 6: 'b5', 8: '#5' },
    use: 'Todas as tensões alteradas (b9, #9, b5, #5) sobre um acorde dominante. Usada no V7 do II–V–I, principalmente indo para um acorde menor. É o 7º modo da menor melódica.',
    tip: 'Atalho: toque a menor melódica meio tom acima da tônica do acorde (para G7alt, Ab menor melódica).' },
  { id: 'dimdom', cat: 'Jazz', short: 'Dim. semitom-tom', name: 'Diminuta Dominante (semitom-tom)', ints: [0, 1, 3, 4, 6, 7, 9, 10], chord: [0, 4, 7, 10], deg: { 1: 'b9', 3: '#9', 6: '#11', 9: '13' },
    use: 'Alterna semitom e tom. Sobre acordes 7(b9) e 13(b9): mantém a 5ª justa e a 13, e adiciona b9, #9 e #11. Muito usada em jazz e fusion.',
    tip: 'O desenho se repete a cada 3 casas. Aprenda um trecho de 3 casas e desloque-o pelo braço.' },
  { id: 'dim', cat: 'Jazz', short: 'Dim. tom-semitom', name: 'Diminuta (tom-semitom)', ints: [0, 2, 3, 5, 6, 8, 9, 11], chord: [0, 3, 6, 9], deg: { 6: 'b5', 8: '#5', 9: 'bb7' },
    use: 'Alterna tom e semitom. Sobre acordes diminutos (°7), muito comuns como acordes de passagem no choro, samba e jazz.',
    tip: 'As notas do acorde °7 estão a 1½ tom de distância entre si. Ouça como cada nota de passagem resolve num tom do acorde.' },
  { id: 'tons', cat: 'Jazz', short: 'Tons inteiros', name: 'Tons Inteiros', ints: [0, 2, 4, 6, 8, 10], chord: [0, 4, 8, 10], deg: { 6: '#4', 8: '#5' },
    use: 'Só tons inteiros, 6 notas: som de sonho e suspensão (impressionismo). Sobre acordes 7(#5) e aumentados.',
    tip: 'O desenho se repete a cada 2 casas. Experimente em um dominante antes de resolver e ouça a tensão.' },
];

export function prefersFlats(root: number, ints: number[]) {
  const label = ROOT_LABELS[root];
  return label.includes('b') || root === 5 || ((root === 0 || root === 2 || root === 7) && (ints.includes(3) || (root === 0 && ints.includes(10))));
}

/** Regiões de 5 casas, uma a partir de cada nota da escala na 6ª corda. */
export function positions(ints: number[], root: number) {
  return ints.map((iv) => {
    const f = (((root + iv - 4) % 12) + 12) % 12;
    return { start: Math.max(0, f - 1), end: f + 3 };
  });
}

export function intervalOf(root: number, midi: number) {
  return ((((midi % 12) - root) % 12) + 12) % 12;
}
