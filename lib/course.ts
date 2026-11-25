import type { Pos } from './geometry';

export const AMBER = '#FFC857';
export const CYAN = '#5EEAD4';
export const PINK = '#F9A8D4';
export const BLUE_NOTE = '#9CC3F5';
export const GRAY = '#6B625A';

const MINOR_PENT = [0, 3, 5, 7, 10];
const BLUES = [0, 3, 5, 6, 7, 10];

export type BoxKey = 'b4o' | 'b5' | 'b1' | 'b2' | 'b3' | 'b4' | 'maj';
export const BOX: Record<BoxKey, { label: string; color: string; ranges: [number, number][] }> = {
  b4o: { label: '4', color: PINK, ranges: [[0, 3], [0, 3], [0, 2], [0, 2], [1, 3], [0, 3]] },
  b5: { label: '5', color: CYAN, ranges: [[3, 5], [3, 5], [2, 5], [2, 5], [3, 5], [3, 5]] },
  b1: { label: '1', color: AMBER, ranges: [[5, 8], [5, 7], [5, 7], [5, 7], [5, 8], [5, 8]] },
  b2: { label: '2', color: '#93C5FD', ranges: [[8, 10], [7, 10], [7, 10], [7, 9], [8, 10], [8, 10]] },
  b3: { label: '3', color: '#C4B5FD', ranges: [[10, 12], [10, 12], [10, 12], [9, 12], [10, 13], [10, 12]] },
  b4: { label: '4', color: PINK, ranges: [[12, 15], [12, 15], [12, 14], [12, 14], [13, 15], [12, 15]] },
  maj: { label: 'Maior', color: CYAN, ranges: [[2, 5], [2, 4], [2, 4], [2, 4], [2, 5], [2, 5]] },
};
const ALL_BOXES: BoxKey[] = ['b4o', 'b5', 'b1', 'b2', 'b3', 'b4'];

const BOX1_UP: Pos[] = [[0, 5], [0, 8], [1, 5], [1, 7], [2, 5], [2, 7], [3, 5], [3, 7], [4, 5], [4, 8], [5, 5], [5, 8]];
const WAVE: Pos[] = [[0, 5], [1, 7], [2, 7], [3, 7], [4, 8], [5, 8], [5, 10], [4, 10], [3, 9], [2, 10], [1, 10], [0, 10], [0, 12], [1, 12], [2, 12], [3, 12], [4, 13], [5, 12], [5, 15], [4, 15], [3, 14], [2, 14], [1, 15], [0, 15]];
const DIAG: Pos[] = [[0, 3], [0, 5], [1, 5], [1, 7], [2, 7], [2, 10], [3, 9], [3, 12], [4, 13], [4, 15], [5, 15]];
const BLUES_CHART = ['A7', 'D7', 'A7', 'A7', 'D7', 'D7', 'A7', 'A7', 'E7', 'D7', 'A7', 'E7'];

function groupsOf3(list: Pos[]): Pos[] {
  const out: Pos[] = [];
  for (let i = 0; i + 2 < list.length; i++) out.push(list[i], list[i + 1], list[i + 2]);
  return out;
}

export type LegendItem = ['path' | 'band' | 'dot', string, string];
export type Lesson = {
  title: string;
  goal: string;
  explain: string;
  trick: string;
  steps: string[];
  scale?: number[]; // intervalos relativos a Lá
  blue?: number[];
  faded?: boolean;
  bands?: BoxKey[];
  faintBands?: boolean;
  paths?: { pts: Pos[]; color: string; dashed?: boolean }[];
  marks?: { s: number; f: number; label: string; color: string }[];
  seq?: (Pos | Pos[])[];
  chart?: string[];
  legend: LegendItem[];
};
export type Module = { title: string; desc: string; lessons: Lesson[] };

export const MODULES: Module[] = [
  { title: 'O braço é feito de ondas', desc: 'O mapa: formas que descem da 6ª corda até a 1ª e se repetem ao longo do braço.', lessons: [
    { title: 'A onda das tônicas', goal: 'encontrar o Lá (a tônica) em qualquer região do braço.',
      explain: 'Toda tônica tem uma “irmã” uma oitava acima: duas cordas para baixo e duas casas para a frente (três quando a forma passa pela corda Si). Ligando essas oitavas aparecem ondas diagonais que descem da 6ª para a 1ª corda e se repetem a cada 12 casas.',
      trick: 'Antes de solar, toque só as tônicas, de cima para baixo. Elas são o seu GPS: qualquer frase pode começar ou terminar nelas.',
      steps: ['Toque cada onda de tônicas devagar, dizendo “Lá” em voz alta.', 'Repita de olhos fechados, só pelo tato.', 'Troque de tom: ache a tônica na 6ª corda (ex.: Dó na casa 8) e a onda inteira se desloca junto.'],
      scale: MINOR_PENT, faded: true,
      paths: [{ pts: [[1, 0], [3, 2], [5, 5]], color: AMBER }, { pts: [[0, 5], [2, 7], [4, 10]], color: AMBER }, { pts: [[1, 12], [3, 14]], color: AMBER }],
      legend: [['path', AMBER, 'Ondas de oitavas (tônica Lá)']] },
    { title: 'As 5 caixas formam uma onda', goal: 'ver a pentatônica como um só desenho contínuo, e não cinco desenhos soltos.',
      explain: 'A pentatônica menor tem 5 desenhos (caixas). Cada caixa começa onde a anterior termina e, depois da 5ª, o ciclo recomeça 12 casas acima. Repare que as bordas de cada faixa ondulam: elas entortam quando chegam à corda Si.',
      trick: 'Você não precisa decorar cinco coisas diferentes: a borda direita de uma caixa é a borda esquerda da próxima. Aprenda as notas compartilhadas e o resto se encaixa.',
      steps: ['Toque a Caixa 1 subindo e descendo.', 'Toque só as notas que a Caixa 1 divide com a Caixa 2.', 'Repita para cada par de caixas vizinhas até atravessar o braço.'],
      scale: MINOR_PENT, bands: ALL_BOXES, seq: BOX1_UP,
      legend: [['band', AMBER, 'Cada faixa colorida é uma caixa (1 a 5)']] },
    { title: 'A curva da corda Si', goal: 'entender por que todo desenho “entorta” entre a 3ª e a 2ª corda.',
      explain: 'Entre quase todas as cordas a distância é de 5 casas (uma 4ª justa). Entre Sol e Si é de apenas 4. Por isso, para manter o mesmo intervalo, a forma precisa avançar uma casa quando atravessa da corda Sol para a corda Si. Essa é a curva da onda.',
      trick: 'Ao copiar uma frase para as cordas finas, empurre tudo uma casa para a direita assim que passar da corda Sol.',
      steps: ['Toque a linha de quartas: Lá, Ré, Sol e Dó, todas na casa 5.', 'Na corda Si avance para a casa 6 (Fá) e continue na 1ª corda (Sib).', 'Agora toque tudo na casa 5 e ouça como as notas marcadas com × soam erradas.'],
      paths: [{ pts: [[0, 5], [1, 5], [2, 5], [3, 5], [4, 6], [5, 6]], color: AMBER }],
      marks: [{ s: 4, f: 5, label: '×', color: GRAY }, { s: 5, f: 5, label: '×', color: GRAY }],
      legend: [['path', AMBER, 'Mesmo intervalo (4ª) em todas as cordas'], ['dot', GRAY, 'Sem a curva: nota errada']] },
  ] },
  { title: 'Caminhos pelo braço', desc: 'Quatro jeitos de se mover: vertical, horizontal, diagonal e em onda.', lessons: [
    { title: 'Vertical: dentro da caixa', goal: 'tocar a Caixa 1 com fluência, cruzando as cordas de cima para baixo.',
      explain: 'É o caminho mais seguro: você fica numa região de 4 casas e atravessa as cordas. Ótimo para frases rápidas, mas usado sozinho deixa o solo “preso” num lugar.',
      trick: 'Um dedo por casa: indicador na casa 5, mínimo na 8. Não mova a mão, só os dedos.',
      steps: ['Suba e desça a Caixa 1 a 60 bpm, uma nota por tempo.', 'Depois duas notas por tempo.', 'Improvise 1 minuto usando só esta caixa.'],
      scale: MINOR_PENT, bands: ['b1'], paths: [{ pts: BOX1_UP, color: AMBER }],
      legend: [['band', AMBER, 'Caixa 1'], ['path', AMBER, 'Ordem das notas']] },
    { title: 'Horizontal: uma corda só', goal: 'ouvir as distâncias da escala e ligar as caixas em linha reta.',
      explain: 'Toque a escala inteira numa única corda, deslizando. Você ouve claramente os tons e tons e meio da pentatônica e atravessa todas as caixas sem trocar de corda.',
      trick: 'Use slides com o mesmo dedo: o som fica vocal, como um cantor deslizando de uma nota para outra.',
      steps: ['Percorra a corda Sol da casa 2 à 14 com slides.', 'Crie uma frase de 3 notas e desloque-a pela corda.', 'Repita tudo na corda Si.'],
      scale: MINOR_PENT, bands: ALL_BOXES, faintBands: true, paths: [{ pts: [[3, 2], [3, 5], [3, 7], [3, 9], [3, 12], [3, 14]], color: AMBER }],
      legend: [['path', AMBER, 'Caminho horizontal na corda Sol']] },
    { title: 'Diagonal: a onda que sobe', goal: 'atravessar o braço inteiro em uma frase, do grave ao agudo.',
      explain: 'Duas notas por corda e, a cada corda, a mão avança para a próxima caixa. Você sai da 6ª corda na casa 3 e chega à 1ª corda na casa 15: uma onda contínua do grave (em cima) ao agudo (embaixo).',
      trick: 'Troque de posição com um slide do indicador. É essa “dobra” que deixa a diagonal fluida.',
      steps: ['Toque a diagonal devagar, só subindo.', 'Desça pelo mesmo caminho.', 'Comece a diagonal em outra nota (ex.: Lá, casa 5) e veja onde termina.'],
      scale: MINOR_PENT, bands: ALL_BOXES, faintBands: true, paths: [{ pts: DIAG, color: AMBER }],
      legend: [['path', AMBER, 'Caminho diagonal'], ['band', AMBER, 'Caixas atravessadas']] },
    { title: 'A onda completa', goal: 'ligar as 5 caixas num movimento de sobe e desce pelas cordas.',
      explain: 'Junte tudo: suba pelas cordas numa caixa, deslize para a próxima, desça pelas cordas, deslize de novo e suba. O desenho no braço vira uma onda que atravessa as caixas de cima para baixo e de baixo para cima.',
      trick: 'Mude de direção sempre numa nota do acorde (Lá, Dó ou Mi): a frase parece planejada mesmo sendo improvisada.',
      steps: ['Aperte “Tocar caminho” e acompanhe a onda com os olhos.', 'Faça só a primeira subida e a primeira descida até ficar automático.', 'Crie a sua onda: mude o lugar onde você desliza.'],
      scale: MINOR_PENT, bands: ALL_BOXES, faintBands: true, paths: [{ pts: WAVE, color: AMBER }],
      legend: [['path', AMBER, 'A onda: sobe, desliza, desce, desliza']] },
  ] },
  { title: 'Truques de improviso', desc: 'Técnicas que transformam escala em música.', lessons: [
    { title: 'Bend na nota certa', goal: 'fazer bends afinados que chegam na próxima nota da escala.',
      explain: 'O bend leva a nota até a próxima nota da escala. Na Caixa 1, o Ré (corda Sol, casa 7) sobe um tom até o Mi, e o Sol (corda Si, casa 8) sobe um tom até o Lá. A linha tracejada mostra onde o bend precisa chegar.',
      trick: 'Toque primeiro a nota-alvo (casa 9 ou 10) para memorizar a altura, depois faça o bend até ela.',
      steps: ['Toque a nota-alvo e, em seguida, o bend: compare as duas.', 'Empurre a corda com três dedos juntos (anelar apoiado pelo médio e indicador).', 'Termine uma frase com o bend da corda Si e deixe soar.'],
      scale: MINOR_PENT, bands: ['b1'], faded: true,
      paths: [{ pts: [[3, 7], [3, 9]], color: AMBER, dashed: true }, { pts: [[4, 8], [4, 10]], color: AMBER, dashed: true }],
      marks: [{ s: 3, f: 9, label: 'E', color: CYAN }, { s: 4, f: 10, label: 'A', color: CYAN }],
      seq: [[3, 7], [3, 9], [4, 8], [4, 10]],
      legend: [['path', AMBER, 'Nota tocada → bend'], ['dot', CYAN, 'Altura que o bend deve atingir']] },
    { title: 'Slides para trocar de caixa', goal: 'sair de uma caixa e entrar na próxima sem “buraco” no som.',
      explain: 'Deslizar de uma nota da escala para a seguinte, na mesma corda, é a forma mais musical de mudar de região. Aqui o slide leva da Caixa 1 para a 2 e da 2 para a 3.',
      trick: 'Faça o slide com o 3º dedo: ele chega na caixa nova já na posição certa para continuar.',
      steps: ['Toque a Caixa 1 e saia dela com slide na corda Sol (5 → 7 → 9).', 'Faça o mesmo na corda Ré (7 → 10 → 12).', 'Improvise usando um slide a cada frase.'],
      scale: MINOR_PENT, bands: ['b1', 'b2', 'b3'], paths: [{ pts: [[3, 5], [3, 7], [3, 9]], color: AMBER }, { pts: [[2, 7], [2, 10], [2, 12]], color: PINK }],
      legend: [['path', AMBER, 'Slide na corda Sol'], ['path', PINK, 'Slide na corda Ré']] },
    { title: 'Hammer-on e pull-off', goal: 'tocar frases ligadas e rápidas sem palhetar cada nota.',
      explain: 'Palhete só a primeira nota e faça as outras com a mão esquerda: martelando (hammer-on) para subir e puxando a corda (pull-off) para descer. Abaixo, uma cascata clássica de pull-offs na Caixa 1.',
      trick: 'Pull-off em cascata: 1ª corda 8→5, 2ª corda 8→5, 3ª corda 7→5. Repita em loop e acelere aos poucos.',
      steps: ['Faça cada pull-off separado, garantindo que a segunda nota soe tão forte quanto a primeira.', 'Encadeie as três cordas sem pausa.', 'Inverta: hammer-ons subindo (5→7, 5→8).'],
      scale: MINOR_PENT, bands: ['b1'], faded: true,
      paths: [{ pts: [[5, 8], [5, 5]], color: AMBER }, { pts: [[4, 8], [4, 5]], color: AMBER }, { pts: [[3, 7], [3, 5]], color: AMBER }],
      legend: [['path', AMBER, 'Pull-off (palhete só a primeira)']] },
    { title: 'Notas de passagem cromáticas', goal: 'usar notas “de fora” sem soar errado.',
      explain: 'A escala blues acrescenta a b5 (Mib), a “blue note”. Ela soa ótima de passagem entre o Ré e o Mi, mas estranha se você parar nela. O mesmo vale para qualquer nota a meio tom de uma nota da escala.',
      trick: 'Nota de fora + movimento = tempero. Nota de fora + parada = erro. Sempre resolva no tempo forte seguinte.',
      steps: ['Toque Ré → Mib → Mi na corda Lá (casas 5, 6, 7) e resolva no Lá.', 'Faça o caminho descendo.', 'Coloque essa passagem no fim de uma frase da Caixa 1.'],
      scale: BLUES, blue: [6], bands: ['b1'], paths: [{ pts: [[1, 5], [1, 6], [1, 7], [2, 7]], color: AMBER }],
      legend: [['dot', BLUE_NOTE, 'Blue note (b5)'], ['path', AMBER, 'Passagem cromática']] },
    { title: 'Sequências de 3 notas', goal: 'soar mais “profissional” com a mesma escala.',
      explain: 'Em vez de subir a escala em linha reta, toque grupos: notas 1-2-3, depois 2-3-4, 3-4-5 e assim por diante. Os números mostram a ordem da escala; o botão “Tocar caminho” toca a sequência completa.',
      trick: 'Depois de dominar os grupos de 3, faça grupos de 4 e também descendo. A mesma ideia funciona em qualquer escala.',
      steps: ['Toque a sequência devagar, contando 1-2-3 em voz alta.', 'Acentue a primeira nota de cada grupo.', 'Use um trecho da sequência como frase dentro de um improviso.'],
      scale: MINOR_PENT, bands: ['b1'], paths: [{ pts: BOX1_UP, color: AMBER }], seq: groupsOf3(BOX1_UP),
      legend: [['path', AMBER, 'Ordem das notas da escala']] },
    { title: 'Motivo, repetição e resposta', goal: 'construir frases que conversam entre si.',
      explain: 'Bons solos repetem ideias. Toque uma frase curta (a pergunta), repita com uma pequena mudança e depois responda terminando na tônica. O ritmo pesa mais que a quantidade de notas.',
      trick: 'Deixe espaço: uma pausa depois da frase é tão importante quanto a própria frase.',
      steps: ['Toque a frase marcada (de 1 a 7) até decorar.', 'Repita mudando só o ritmo.', 'Responda com uma frase que termine no Lá (casa 7 da corda Ré).'],
      scale: MINOR_PENT, bands: ['b1'], faded: true, paths: [{ pts: [[5, 8], [5, 5], [4, 8], [4, 5], [3, 7], [3, 5], [2, 7]], color: AMBER }],
      legend: [['path', AMBER, 'Frase-motivo na Caixa 1']] },
    { title: 'Double stops: duas notas juntas', goal: 'engrossar o som tocando duas cordas de uma vez.',
      explain: 'Tocar duas notas da escala ao mesmo tempo, em cordas vizinhas, dá peso ao solo. É marca registrada do rock e do blues, principalmente nas cordas Sol, Si e Mi.',
      trick: 'Faça uma pestana pequena com um dedo só nas duas cordas finas (casa 8 e casa 5) e balance entre elas.',
      steps: ['Toque cada par marcado com uma palhetada só.', 'Alterne casa 8 e casa 5 nas duas cordas finas com ritmo de shuffle.', 'Termine com o par Ré + Sol (corda Sol 7, corda Si 8).'],
      scale: MINOR_PENT, bands: ['b1'], faded: true,
      paths: [{ pts: [[4, 8], [5, 8]], color: AMBER }, { pts: [[4, 5], [5, 5]], color: PINK }, { pts: [[3, 7], [4, 8]], color: CYAN }],
      seq: [[[4, 8], [5, 8]], [[4, 5], [5, 5]], [[4, 8], [5, 8]], [[4, 5], [5, 5]], [[3, 7], [4, 8]]],
      legend: [['path', AMBER, 'Par 1'], ['path', PINK, 'Par 2'], ['path', CYAN, 'Par 3']] },
  ] },
  { title: 'Improvisando sobre acordes', desc: 'Mire nas notas certas na hora certa.', lessons: [
    { title: 'Notas-alvo no blues em Lá', goal: 'fazer o solo acompanhar a troca de acordes.',
      explain: 'Num blues em Lá os acordes são A7, D7 e E7. A pentatônica menor funciona nos três, mas mirar na 3ª de cada acorde faz o solo “seguir a harmonia”: Dó# no A7, Fá# no D7 e Sol# no E7.',
      trick: 'Chegue na nota-alvo meio tom abaixo (Dó → Dó#). Esse deslize é o som do blues.',
      steps: ['Toque cada par: nota da escala → nota-alvo.', 'Com uma base de blues, toque a nota-alvo exatamente quando o acorde mudar.', 'Improvise livremente e só use a nota-alvo na troca de acorde.'],
      scale: MINOR_PENT, bands: ['b1'], faded: true,
      paths: [{ pts: [[3, 5], [3, 6]], color: AMBER }, { pts: [[4, 8], [4, 7]], color: PINK }, { pts: [[2, 5], [2, 6]], color: CYAN }],
      marks: [{ s: 3, f: 6, label: 'C#', color: AMBER }, { s: 4, f: 7, label: 'F#', color: PINK }, { s: 2, f: 6, label: 'G#', color: CYAN }],
      legend: [['dot', AMBER, 'Dó# → A7'], ['dot', PINK, 'Fá# → D7'], ['dot', CYAN, 'Sol# → E7']] },
    { title: 'A estrutura de 12 compassos', goal: 'saber onde você está no blues enquanto improvisa.',
      explain: 'O blues tem 12 compassos que se repetem: 4 de A7, 2 de D7, 2 de A7, depois E7, D7, A7 e E7 (a “virada”). Use a escala blues da Caixa 1 e mude de ideia a cada 4 compassos.',
      trick: 'Nos compassos 9 a 12 a tensão aumenta: suba de região (vá para a Caixa 2 ou 3) e volte para a Caixa 1 na repetição.',
      steps: ['Conte os 12 compassos em voz alta sobre uma base.', 'Toque uma frase por linha de 4 compassos (pergunta, repetição, resposta).', 'No compasso 12, termine sempre em Mi (5ª do acorde E7).'],
      scale: BLUES, blue: [6], bands: ['b1'], chart: BLUES_CHART,
      seq: [[0, 5], [0, 8], [1, 5], [1, 6], [1, 7], [2, 5], [2, 7], [3, 5], [3, 7], [3, 8], [4, 5], [4, 8], [5, 5], [5, 8]],
      legend: [['band', AMBER, 'Escala blues, Caixa 1'], ['dot', BLUE_NOTE, 'Blue note']] },
    { title: 'Maior + menor: duas ondas', goal: 'misturar as pentatônicas maior e menor no mesmo solo.',
      explain: 'Sobre um blues em tom maior, a pentatônica maior (casas 2 a 5) soa doce e a menor (casas 5 a 8) soa rasgada. São duas ondas vizinhas: o truque é passar de uma para a outra trocando o Dó (b3) pelo Dó# (3).',
      trick: 'O movimento Dó → Dó# → Lá resolve qualquer frase e liga as duas escalas.',
      steps: ['Toque a pentatônica maior e depois a menor, ouvindo a diferença.', 'Faça o caminho marcado: Dó → Dó# → Lá.', 'Comece uma frase na escala maior e termine na menor.'],
      scale: [0, 2, 3, 4, 5, 7, 9, 10], bands: ['maj', 'b1'], paths: [{ pts: [[3, 5], [3, 6], [2, 7]], color: AMBER }],
      legend: [['band', CYAN, 'Pentatônica maior (2–5)'], ['band', AMBER, 'Pentatônica menor (5–8)'], ['path', AMBER, 'Ponte b3 → 3 → 1']] },
  ] },
  { title: 'Prática e desafio', desc: 'Rotina diária e um solo completo usando tudo.', lessons: [
    { title: 'Rotina de 20 minutos', goal: 'praticar todo dia com foco.',
      explain: 'Pouco tempo com foco rende mais que horas sem plano. Divida a prática em quatro blocos de 5 minutos, sempre com metrônomo ou base.',
      trick: 'Grave a si mesmo uma vez por semana. Ouvir o próprio solo mostra o que treinar melhor do que qualquer exercício.',
      steps: ['5 min: ondas de tônicas e a onda completa.', '5 min: uma caixa e sua ligação com a vizinha.', '5 min: um truque da semana (bend, slide, sequência…).', '5 min: improviso livre sobre uma base de blues em Lá.'],
      scale: MINOR_PENT, bands: ALL_BOXES, faintBands: true, paths: [{ pts: WAVE, color: AMBER }],
      legend: [['path', AMBER, 'A onda completa como aquecimento']] },
    { title: 'Desafio: solo de 12 compassos', goal: 'improvisar um blues inteiro usando os caminhos e truques.',
      explain: 'Linha 1 (compassos 1–4): motivo na Caixa 1 com bend. Linha 2 (5–8): repita o motivo e mire no Fá# no D7. Linha 3 (9–12): suba pela diagonal até a Caixa 3 e volte resolvendo na tônica.',
      trick: 'Pense em três frases, não em notas. Se errar, repita o “erro” de propósito: vira intenção.',
      steps: ['Toque o caminho marcado como espinha dorsal do solo.', 'Encaixe um bend, um slide e uma nota-alvo.', 'Grave, ouça e repita mudando só uma coisa por vez.'],
      scale: MINOR_PENT, bands: ['b1', 'b2', 'b3'], faintBands: true,
      paths: [{ pts: [[5, 8], [5, 5], [4, 8], [4, 5], [3, 7]], color: AMBER }, { pts: [[3, 7], [2, 7], [2, 10], [3, 9], [3, 12], [4, 13], [5, 12]], color: PINK }],
      marks: [{ s: 4, f: 7, label: 'F#', color: CYAN }],
      chart: BLUES_CHART,
      legend: [['path', AMBER, 'Motivo (linhas 1 e 2)'], ['path', PINK, 'Subida diagonal (linha 3)'], ['dot', CYAN, 'Alvo no D7']] },
  ] },
];

export const FLAT = MODULES.flatMap((m, mi) => m.lessons.map((lesson, li) => ({ mi, li, lesson })));
