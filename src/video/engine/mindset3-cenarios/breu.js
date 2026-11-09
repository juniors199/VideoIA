/*
 * 
 * 
 */
/**
 * Cenário "breu" do estilo mindset3 (referências 04, 05, 07, 12, 14, 16): o preto azulado liso #111113 com a retícula fina de
 * 9 px quase invisível e vinheta sutil. É o padrão e o MODELO para um cenário novo: copie, troque o id e os campos e registre
 * em index.js (ou ponha o objeto no pecas.js do projeto: `export const cenariosEstilo = { mindset3: { 'meu-id': {...} } }`).
 */
export default {
  id: 'breu',
  nome: 'Breu com retícula',
  temas: [],
  ambiente: { fundo: ['#111113'] },
  luz: { tipo: 'nenhuma' },
  nevoa: null,
  particulas: { poeira: 0.15 },
  props: [],
  clima: 'calmo',
  camera: 'aproxima',
  acabamento: { pontos: 0.035, grao: 0.05, vinheta: 0.25, brilho: 1 },
};
