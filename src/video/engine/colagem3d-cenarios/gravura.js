/*
 * 
 * 
 */
/**
 * Cenário "gravura" (referência 09): mundo de gravura em P&B de alto contraste sobre papel cinza-claro, com aberração
 * cromática de 2 px nas bordas, grão forte e o realce em amarelo-limão: a caixa da fala e o halo cheio sobre o detalhe
 * (a referência pinta o objeto de amarelo; aqui o halo de marca-texto cobre a área do foco). Cores medidas: #E4E4E2 no alto,
 * #CDCDCA no pé; realce na cor da marca; tinta #151515.
 */
import { tonsDaMarca } from '../marca-tons.js';
export default {
  id: 'gravura',
  nome: 'Gravura com realce amarelo',
  temas: ['hospital', 'doenca', 'loucura', 'prisao', 'policia', 'crime', 'londres', 'vitoriano', 'seculo xix', 'epidemia', 'cidade', 'rua'],
  ambiente: { fundo: ['#E4E4E2', '#CDCDCA'], papel: 'gravura' },
  luz: { tipo: 'lateral', cor: '#FFFFFF', forca: 0.95 },
  nevoa: { cor: '#FFFFFF', alfa: 0.12, altura: 0.3 },
  particulas: { poeira: 0.4 },
  props: [{ tipo: 'texto-jornal', x: 0.5, y: 0.5, alfa: 0.07 }],
  clima: 'solene',
  camera: 'empurra',
  foto: { tratamento: 'gravura', borda: 'sem' },
  texto: { tinta: '#151515', realce: 'caixa', corRealce: tonsDaMarca().forte },
  acabamento: { grao: 0.8, vinheta: 0.3, fibra: 0.3, cromatica: 1, riscos: 0.3 },
};
