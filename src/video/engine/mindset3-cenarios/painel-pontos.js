/*
 * 
 * 
 */
/**
 * Cenário "painel-pontos" do estilo mindset3 (referência 02 a 3x): um painel de retícula mais acesa atrás do desenho
 * (x 90 a 990, y 140 a 1290 no estúdio) com o fio vertical apagado na borda esquerda e o chão traçado embaixo.
 */
export default {
  id: 'painel-pontos',
  nome: 'Painel de retícula',
  temas: ['wifi', 'internet', 'roteador', 'sinal', 'frequencia', 'frequência', 'radio', 'rádio'],
  ambiente: { fundo: ['#111113'] },
  luz: { tipo: 'painel' },
  nevoa: null,
  particulas: { poeira: 0.2 },
  props: [{ tipo: 'painel', x0: 0.08, y0: 0.07, x1: 0.92, y1: 0.67 }, { tipo: 'fio', x: 0.085 }],
  clima: 'calmo',
  camera: 'deriva',
  acabamento: { pontos: 0.05, grao: 0.06, vinheta: 0.35, brilho: 1 },
};
