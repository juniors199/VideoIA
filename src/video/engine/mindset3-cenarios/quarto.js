/*
 * 
 * 
 */
/**
 * Cenário "quarto" do estilo mindset3 (referências 02 fim, 11, 13, 20 fim): o canto de um quarto à noite em traço apagado,
 * a janela com a lua no alto à direita (longe do protagonista) e o chão.
 */
export default {
  id: 'quarto',
  nome: 'Quarto à noite',
  temas: ['quarto', 'cama', 'travesseiro'],
  ambiente: { fundo: ['#121117', '#111113'] },
  luz: { tipo: 'janela' },
  nevoa: null,
  particulas: { poeira: 0.25 },
  props: [],
  clima: 'calmo',
  camera: 'aproxima',
  acabamento: { pontos: 0.03, grao: 0.06, vinheta: 0.4, brilho: 1 },
};
