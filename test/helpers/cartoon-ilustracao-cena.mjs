/*
 * 
 * 
 */
/**
 * Cenas de teste da família cartoon de ilustração (prickles e little-light): a fala sintética e o cena.json de cada estilo,
 * usados pelos testes `test/estilo-cartoon-ilustracao*.test.mjs`.
 */
export function falar(txt, { passo = 0.42, ponto = 0.3 } = {}) {
  let t = 0.2;
  const palavras = txt.split(/\s+/).map((w) => { const o = { w, t, f: t + 0.3 }; t += passo + (/[.!?]$/.test(w) ? ponto : 0); return o; });
  return { palavras, duracao: t + 0.8 };
}

export const FALA_PR = falar('Na floresta de outono vivia um ourico. Ele adorava abraços. Mas quando tentou, AI! Então se enrolou nas folhas. Os amigos vieram juntos. Um ouriço tem 5000 espinhos. Segue a página e comenta ILUSTRANDO.');
export const CENA_PR = { tema: 'OURIÇO', estilo: 'prickles', beats: [
  { id: 'a', palavras: [0, 6], cenario: 'clareira-dourada', camera: { mov: 'push' }, elementos: [{ tipo: 'prickles', forma: 'cena', personagens: ['ourico'], chave: 'ourico.' }] },
  { id: 'b', palavras: [7, 9], cenario: 'toca-raiz', camera: { mov: 'deriva' }, elementos: [{ tipo: 'prickles', forma: 'cena', personagens: ['ourico', 'coelho'], chave: 'abraços.', transicao: 'folhas' }] },
  { id: 'c', palavras: [10, 13], cenario: 'toca-raiz', camera: { mov: 'tremor' }, elementos: [{ tipo: 'prickles', forma: 'susto', personagens: ['ourico', 'coelho'], chave: 'AI!' }] },
  { id: 'd', palavras: [14, 18], cenario: 'clareira-dourada', camera: { mov: 'push' }, elementos: [{ tipo: 'prickles', forma: 'bola', personagens: ['ourico'], chave: 'enrolou' }] },
  { id: 'e', palavras: [19, 22], cenario: 'entardecer', camera: { mov: 'paralaxe' }, elementos: [{ tipo: 'prickles', forma: 'abraco', chave: 'juntos.' }] },
  { id: 'f', palavras: [23, 27], cenario: 'trilha-folhas', camera: { mov: 'deriva' }, elementos: [{ tipo: 'prickles', forma: 'numero', texto: '5.000', chave: '5000' }] },
  { id: 'g', palavras: [28, 33], cenario: 'clareira-dourada', camera: { mov: 'recua' }, elementos: [{ tipo: 'prickles', forma: 'cta' }] } ] };

export const FALA_LL = falar('No fundo do mar a luz não chega. Uma baleia pequena tinha medo do escuro. Então lá embaixo algo piscou. E uma a uma as luzes acenderam. Três em cada 4 animais brilham. Segue a página e comenta ILUSTRANDO.');
export const CENA_LL = { tema: 'LUZES', estilo: 'little-light', beats: [
  { id: 'a', palavras: [0, 7], cenario: 'superficie-lua', camera: { mov: 'desce' }, elementos: [{ tipo: 'little-light', forma: 'cena', chave: 'chega.' }] },
  { id: 'b', palavras: [8, 14], cenario: 'mar-noturno', camera: { mov: 'deriva' }, elementos: [{ tipo: 'little-light', forma: 'cena', personagens: [{ id: 'baleia', expressao: 'medo' }], chave: 'medo' }] },
  { id: 'c', palavras: [15, 19], cenario: 'abismo', camera: { mov: 'push' }, elementos: [{ tipo: 'little-light', forma: 'pisca', chave: 'piscou.', transicao: 'escuro' }] },
  { id: 'd', palavras: [20, 26], cenario: 'jardim-coral', camera: { mov: 'push' }, elementos: [{ tipo: 'little-light', forma: 'acende', chave: 'acenderam.', transicao: 'bolhas' }] },
  { id: 'e', palavras: [27, 32], cenario: 'jardim-coral', camera: { mov: 'deriva' }, elementos: [{ tipo: 'little-light', forma: 'numero', texto: '3/4', chave: '4' }] },
  { id: 'f', palavras: [33, 38], cenario: 'jardim-coral', camera: { mov: 'recua' }, elementos: [{ tipo: 'little-light', forma: 'cta' }] } ] };
