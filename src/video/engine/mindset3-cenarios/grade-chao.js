/*
 * 
 * 
 */
/**
 * Cenário "grade-chao" do estilo mindset3 (referência 01): um chão de quadradinhos em perspectiva que some no escuro, para
 * números, pessoas e proporções (a grade da população); câmera em 3D que inclina.
 */
export default {
  id: 'grade-chao',
  nome: 'Chão de grade em perspectiva',
  temas: ['chao', 'chão', 'piso', 'tabuleiro'],
  ambiente: { fundo: ['#111113'] },
  luz: { tipo: 'nenhuma' },
  nevoa: { cor: '#111113', alfa: 0.5, altura: 0.4 },
  particulas: { poeira: 0.1 },
  props: [{ tipo: 'grade-chao', y: 0.6, n: 14 }],
  clima: 'vivo',
  camera: 'inclina',
  acabamento: { pontos: 0.02, grao: 0.05, vinheta: 0.55, brilho: 1 },
};
