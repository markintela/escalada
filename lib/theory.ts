export const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const NAT = [0, 2, 4, 5, 7, 9, 11];
export const MAJOR = [0, 2, 4, 5, 7, 9, 11];

export type Key = { label: string; letter: number; pc: number };
export const KEYS: Key[] = [
  { label: 'C', letter: 0, pc: 0 }, { label: 'Db', letter: 1, pc: 1 }, { label: 'D', letter: 1, pc: 2 },
  { label: 'Eb', letter: 2, pc: 3 }, { label: 'E', letter: 2, pc: 4 }, { label: 'F', letter: 3, pc: 5 },
  { label: 'F#', letter: 3, pc: 6 }, { label: 'G', letter: 4, pc: 7 }, { label: 'Ab', letter: 5, pc: 8 },
  { label: 'A', letter: 5, pc: 9 }, { label: 'Bb', letter: 6, pc: 10 }, { label: 'B', letter: 6, pc: 11 },
];

/** Nome correto da nota a `semi` semitons e `steps` letras acima da tônica. */
export function spell(root: { letter: number; pc: number }, semi: number, steps: number) {
  const letter = (root.letter + steps) % 7;
  const pc = (root.pc + semi) % 12;
  const diff = ((pc - NAT[letter] + 18) % 12) - 6;
  return LETTERS[letter] + (diff > 0 ? '#'.repeat(diff) : 'b'.repeat(-diff));
}

export const INTERVALS = [
  { semi: 1, steps: 1, short: 'b2', name: '2ª menor', semis: '1 semitom',
    text: 'A menor distância possível. Muito tensa e dissonante: o som de suspense de filme. Na melodia, é o “degrau” mais forte de resolução (sensível → tônica).',
    shape: 'Uma casa à frente, na mesma corda. É a nota de passagem cromática mais usada em solos.' },
  { semi: 2, steps: 1, short: '2', name: '2ª maior', semis: '2 semitons (1 tom)',
    text: 'O passo normal da escala. Dá movimento à melodia sem tensão. Em acordes vira a 9ª (add9), um som aberto e moderno.',
    shape: 'Duas casas à frente na mesma corda. É a distância de um bend de um tom.' },
  { semi: 3, steps: 2, short: 'b3', name: '3ª menor', semis: '3 semitons (1½ tom)',
    text: 'Define o acorde menor. Soa melancólico. É a “blue note” mais importante quando tocada sobre acordes maiores.',
    shape: 'Três casas à frente na mesma corda, ou duas casas para trás na corda de baixo.' },
  { semi: 4, steps: 2, short: '3', name: '3ª maior', semis: '4 semitons (2 tons)',
    text: 'Define o acorde maior. Soa alegre e estável. Nos acordes dominantes, a 3ª é a sensível, a nota que mais pede resolução.',
    shape: 'Quatro casas à frente na mesma corda, ou uma casa para trás na corda de baixo.' },
  { semi: 5, steps: 3, short: '4', name: '4ª justa', semis: '5 semitons',
    text: 'Consonância aberta, meio suspensa. É a distância entre quase todas as cordas soltas do violão. Em acordes vira o sus4.',
    shape: 'Mesma casa, na corda de baixo (exceto entre Sol e Si, onde avança uma casa).' },
  { semi: 6, steps: 3, short: '#4/b5', name: 'Trítono', semis: '6 semitons (3 tons)',
    text: 'Divide a oitava ao meio. O intervalo mais instável: está dentro de todo acorde dominante (entre a 3ª e a 7ª) e é ele que pede resolução para a tônica.',
    shape: 'Uma casa à frente, na corda de baixo. Na escala blues é a b5, a blue note.' },
  { semi: 7, steps: 4, short: '5', name: '5ª justa', semis: '7 semitons',
    text: 'O intervalo mais estável depois da oitava. Tônica + 5ª é o power chord do rock (sem 3ª, nem maior nem menor).',
    shape: 'Duas casas à frente, na corda de baixo: o desenho do power chord.' },
  { semi: 8, steps: 5, short: 'b6', name: '6ª menor', semis: '8 semitons',
    text: 'Som dramático e escuro. É a nota característica da escala menor natural e da menor harmônica.',
    shape: 'Três casas à frente, na corda de baixo, ou uma casa à frente duas cordas abaixo (cuidado com a corda Si).' },
  { semi: 9, steps: 5, short: '6', name: '6ª maior', semis: '9 semitons',
    text: 'Doce e nostálgica. Muito usada na bossa nova (acordes 6 e 6/9) e no country. É também a nota que dá o caráter do modo dórico.',
    shape: 'Uma casa para trás, duas cordas abaixo, ou quatro casas à frente na corda de baixo.' },
  { semi: 10, steps: 6, short: 'b7', name: '7ª menor', semis: '10 semitons',
    text: 'Dá o som de acorde dominante (7) e do blues. Somada à 3ª maior, forma o trítono que pede resolução.',
    shape: 'Mesma casa, duas cordas abaixo (na corda Si, uma casa à frente).' },
  { semi: 11, steps: 6, short: '7', name: '7ª maior', semis: '11 semitons',
    text: 'Sonhadora e sofisticada: o acorde 7M da bossa e do jazz. Fica a meio tom da oitava, por isso também é chamada de sensível.',
    shape: 'Uma casa à frente, duas cordas abaixo (na corda Si, duas casas à frente), ou uma casa atrás da oitava.' },
  { semi: 12, steps: 7, short: '8', name: 'Oitava', semis: '12 semitons',
    text: 'A mesma nota, mais aguda. É a base das “ondas de tônicas” do curso: conhecer as oitavas é saber onde está cada nota no braço inteiro.',
    shape: 'Duas casas à frente, duas cordas abaixo (três casas quando passa pela corda Si), ou 12 casas à frente na mesma corda.' },
];

export const DEG_STEPS: Record<number, number> = { 0: 0, 3: 2, 4: 2, 6: 4, 7: 4, 8: 4, 9: 6, 10: 6, 11: 6 };
export const DEG_NAMES: Record<number, string> = { 0: '1', 3: 'b3', 4: '3', 6: 'b5', 7: '5', 8: '#5', 9: 'bb7', 10: 'b7', 11: '7' };

export type ChordId = 'M' | 'm' | 'dim' | 'aug' | '7' | '7M' | 'm7' | 'm7b5' | 'dim7';
export const CHORD_TYPES: { id: ChordId; symbol: string; name: string; ints: number[]; text: string }[] = [
  { id: 'M', symbol: '', name: 'Maior', ints: [0, 4, 7], text: '3ª maior + 3ª menor. Estável e alegre: o acorde de repouso da maioria das músicas.' },
  { id: 'm', symbol: 'm', name: 'Menor', ints: [0, 3, 7], text: '3ª menor + 3ª maior. A troca de uma única nota (a 3ª) muda todo o clima para melancólico.' },
  { id: 'dim', symbol: '°', name: 'Diminuto', ints: [0, 3, 6], text: 'Duas 3ªs menores empilhadas. Tenso e instável: funciona como acorde de passagem ou dominante sem tônica.' },
  { id: 'aug', symbol: '(#5)', name: 'Aumentado', ints: [0, 4, 8], text: 'Duas 3ªs maiores empilhadas. Som de suspense, usado para ligar um acorde ao próximo.' },
  { id: '7', symbol: '7', name: 'Dominante', ints: [0, 4, 7, 10], text: 'Tríade maior + b7. Contém o trítono (3 e b7) e é o acorde que pede resolução. Base do blues.' },
  { id: '7M', symbol: '7M', name: 'Maior com 7ª maior', ints: [0, 4, 7, 11], text: 'Tríade maior + 7ª maior. Suave e sofisticado: o som da bossa nova e do jazz.' },
  { id: 'm7', symbol: 'm7', name: 'Menor com 7ª', ints: [0, 3, 7, 10], text: 'Tríade menor + b7. Mais macio que o menor simples; é o IIm7 do II–V–I.' },
  { id: 'm7b5', symbol: 'm7(b5)', name: 'Meio-diminuto', ints: [0, 3, 6, 10], text: 'Diminuto + b7. É o VII grau da escala maior e o II grau do II–V–I em tom menor.' },
  { id: 'dim7', symbol: '°7', name: 'Diminuto com 7ª', ints: [0, 3, 6, 9], text: 'Só 3ªs menores: simétrico, repete a cada 3 casas. Muito usado no choro e no samba como acorde de passagem.' },
];
export const chordInts = (q: ChordId) => CHORD_TYPES.find((t) => t.id === q)?.ints ?? [0, 4, 7];

export type FuncId = 'T' | 'S' | 'D';
export const FUNC: Record<FuncId, { name: string; color: string; tint: string; border: string; feel: string; text: string; degrees: string }> = {
  T: { name: 'Tônica', color: '#0F766E', tint: '#D5F0EC', border: '#8FD3C8', feel: 'Repouso, “casa”',
    text: 'A sensação de chegada. Músicas costumam começar e terminar aqui. O VIm e o IIIm são substitutos porque dividem duas notas com o I.', degrees: 'I · VIm · IIIm' },
  S: { name: 'Subdominante', color: '#B45309', tint: '#FBEBD3', border: '#EBC48E', feel: 'Afastamento, movimento',
    text: 'Sai da casa sem urgência e prepara a dominante. Contém o 4º grau da escala. O IIm substitui o IV (duas notas em comum).', degrees: 'IV · IIm' },
  D: { name: 'Dominante', color: '#B91C1C', tint: '#FBDADA', border: '#EDA3A3', feel: 'Tensão que pede resolução',
    text: 'Contém o trítono entre o 4º e o 7º graus da escala, que resolve na tônica. O VII° substitui o V7 (três notas em comum).', degrees: 'V7 · VII°' },
};

export const FIELD: { roman: string; tri: ChordId; tet: ChordId; f: FuncId }[] = [
  { roman: 'I', tri: 'M', tet: '7M', f: 'T' },
  { roman: 'II', tri: 'm', tet: 'm7', f: 'S' },
  { roman: 'III', tri: 'm', tet: 'm7', f: 'T' },
  { roman: 'IV', tri: 'M', tet: '7M', f: 'S' },
  { roman: 'V', tri: 'M', tet: '7', f: 'D' },
  { roman: 'VI', tri: 'm', tet: 'm7', f: 'T' },
  { roman: 'VII', tri: 'dim', tet: 'm7b5', f: 'D' },
];
export const SUFFIX: Record<ChordId, string> = { M: '', m: 'm', dim: '°', aug: '(#5)', '7': '7', '7M': '7M', m7: 'm7', m7b5: 'm7(b5)', dim7: '°7' };

export const PROGS = [
  { name: 'I – IV – V – I', degs: [0, 3, 4, 0], text: 'A cadência clássica: casa → afastamento → tensão → casa. T → S → D → T é o “esqueleto” de milhares de músicas.' },
  { name: 'II – V – I', degs: [1, 4, 0], text: 'O motor do jazz e da bossa nova. O IIm prepara (S), o V7 cria tensão (D) e o I resolve (T).' },
  { name: 'I – V – VI – IV', degs: [0, 4, 5, 3], text: 'A progressão do pop. A dominante não resolve na tônica, mas na relativa menor (VIm): uma “resolução de engano”.' },
  { name: 'I – VI – IV – V', degs: [0, 5, 3, 4], text: 'Progressão dos anos 50. Termina na dominante, criando vontade de voltar ao começo.' },
  { name: 'I – IV – I', degs: [0, 3, 0], text: 'Cadência plagal (o “amém” das igrejas): resolve da subdominante direto para a tônica, sem a tensão da dominante.' },
  { name: 'VI – II – V – I', degs: [5, 1, 4, 0], text: 'Ciclo de quintas: cada acorde cai uma 5ª para o próximo. Muito comum em samba, choro e standards de jazz.' },
];

/** Voicing simples: baixo + notas do acorde numa região média. */
export function voicing(rootPc: number, ints: number[]) {
  const bass = rootPc >= 4 ? 36 + rootPc : 48 + rootPc;
  const notes = [bass, ...ints.map((i) => 52 + ((((rootPc + i) % 12) - 4 + 12) % 12))];
  return notes.sort((a, b) => a - b);
}
