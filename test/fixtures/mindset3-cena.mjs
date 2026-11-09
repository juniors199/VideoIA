/** Cena e fala de teste do estilo mindset3 (usadas por estilo-mindset3.test.mjs e estilo-mindset3-quadros.test.mjs). */
export const falar = (txt, passo = 0.38) => { let t = 0.2; const palavras = txt.split(/\s+/).map((w) => { const o = { w, t, f: t + 0.3 }; t += passo + (/[.,]$/.test(w) ? 0.22 : 0); return o; }); return { palavras, duracao: t + 0.8 }; };
export const falado = falar('Seu cérebro decide antes de você perceber. Em 2008, um estudo mediu sete segundos de vantagem. O celular acende a mente enquanto o livro desacelera. Quase metade dorme mal, são 45% numa pesquisa. Mas a última palavra ainda pode ser sua. Segue a página e comenta ILUSTRANDO.');
export const M = (o) => ({ tipo: 'mindset3', ...o });
export const CENA_M3 = { tema: 'MINDSET 3', estilo: 'mindset3', beats: [
  { id: 'a', palavras: [0, 6], cenario: 'breu', camera: { mov: 'aproxima' }, elementos: [M({ forma: 'figura', figura: 'perfil', chave: 'cérebro', rotulos: ['MENTE'] })] },
  { id: 'b', palavras: [7, 14], cenario: 'breu', camera: { mov: 'recua' }, elementos: [M({ forma: 'numero', texto: '7', rotulo: 'SEGUNDOS', chave: 'sete', transicao: 'morfa' })] },
  { id: 'c', palavras: [15, 23], cenario: 'breu', camera: { mov: 'orbita' }, elementos: [M({ forma: 'dupla', figuras: ['celular', 'livro'], rotulos: ['ACENDE', 'DESACELERA'], transicao: 'desliza' })] },
  { id: 'd', palavras: [24, 31], cenario: 'breu', camera: { mov: 'inclina' }, elementos: [M({ forma: 'diagrama', diagrama: 'grade', grupos: [{ n: 45, tom: 'quente' }], rotulos: ['45%'], transicao: 'recua' })] },
  { id: 'e', palavras: [32, 39], cenario: 'breu', camera: { mov: 'panoramica' }, elementos: [M({ forma: 'cartao', titulo: 'DECISÃO', itens: ['SINAL 1', 'SINAL 2', 'ESCOLHA'], carimbo: 'SUA', transicao: 'apaga' })] },
  { id: 'f', palavras: [40, 45], cenario: 'breu', camera: { mov: 'deriva' }, elementos: [M({ forma: 'cta', figura: 'perfil', chave: 'ILUSTRANDO' })] } ] };

