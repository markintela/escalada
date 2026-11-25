# Escalas no Violão

App em Next.js (App Router + TypeScript) com três telas interativas:

- **/escalas**: 17 escalas (maior, menores, pentatônicas, blues, modos e jazz) em qualquer tom, com notas ou graus, posições e som.
- **/curso**: curso de improviso “o braço em ondas”, com 5 módulos e 19 aulas, caminhos desenhados no braço e progresso salvo no navegador.
- **/teoria**: intervalos, formação de acordes e funções harmônicas (tônica, subdominante, dominante) com progressões tocáveis.

O som é gerado no navegador com Web Audio e não usa arquivos de áudio.

## Rodar no computador

Pré-requisito: [Node.js](https://nodejs.org) 18.18 ou mais recente.

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Gerar a versão de produção

```bash
npm run build
npm start
```

## Publicar grátis

1. Suba esta pasta para um repositório no GitHub.
2. Em https://vercel.com, clique em “Add New → Project” e importe o repositório.
3. A Vercel detecta o Next.js sozinha. Clique em Deploy.

## Onde mexer

| O que | Arquivo |
|---|---|
| Escalas e textos | `lib/scales.ts` |
| Aulas do curso (textos, caminhos, faixas) | `lib/course.ts` |
| Intervalos, acordes, campo harmônico, progressões | `lib/theory.ts` |
| Desenho do braço | `components/Fretboard.tsx` |
| Som | `lib/audio.ts` |
| Cores e estilos | `app/globals.css` |

Os caminhos do curso são listas de `[corda, casa]`, com corda 0 = Mi grave e 5 = Mi agudo.
