/*
 * 
 * 
 */
/**
 * Cenário "portal" do estilo mindset3 (referência 15): duas colunas com hachura vertical e a viga em cima, os degraus em
 * retícula no tom frio embaixo e estrelas atrás; o protagonista fica entre as colunas.
 */
export default {
  id: 'portal',
  nome: 'Portal de colunas',
  temas: ['portal', 'passagem', 'templo'],
  ambiente: { fundo: ['#101014', '#111113'] },
  luz: { tipo: 'portal' },
  nevoa: null,
  particulas: { estrelas: 60, poeira: 0.1 },
  props: [{ tipo: 'colunas', x0: 0.12, x1: 0.88, y0: 0.18, y1: 0.66 }, { tipo: 'degraus', y: 0.66 }, { tipo: 'estrelas', n: 60 }],
  clima: 'solene',
  camera: 'aproxima',
  acabamento: { pontos: 0.025, grao: 0.05, vinheta: 0.4, brilho: 1 },
};
