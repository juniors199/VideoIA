/*
 * 
 * 
 */
/**
 * Cenário "toalha-xadrez" (referência 02, lanchonetes): toalha de mesa xadrez rosa e branca, fotos coloridas de época que
 * caem uma sobre a outra (pilha torta), câmera em mergulho. Cores medidas: #F2E4E4 (casa clara), #E4C1C4 (casa escura);
 * tinta #1C1414; realce em caixa preta com letra branca (a etiqueta "27 restaurants" da referência).
 */
import { tonsDaMarca } from '../marca-tons.js';
export default {
  id: 'toalha-xadrez',
  nome: 'Toalha xadrez de lanchonete',
  temas: ['lanchonete', 'comida', 'hamburguer', 'cafe', 'almoco', 'jantar', 'cozinha', 'receita', 'bar', 'padaria', 'loja', 'familia'],
  ambiente: { fundo: ['#F2E4E4', '#E4C1C4'], papel: 'xadrez' },
  luz: { tipo: 'estudio', cor: '#FFF8F0', forca: 1.0 },
  nevoa: null,
  particulas: { poeira: 0.2 },
  props: [{ tipo: 'fita', x: 0.86, y: 0.16 }],
  clima: 'vivo',
  camera: 'mergulho',
  foto: { tratamento: 'cor', borda: 'branca' },
  texto: { tinta: '#FFFFFF', realce: 'caixa', corRealce: tonsDaMarca().forte },
  acabamento: { grao: 0.4, vinheta: 0.2, fibra: 0.15, cromatica: 0, riscos: 0 },
};
