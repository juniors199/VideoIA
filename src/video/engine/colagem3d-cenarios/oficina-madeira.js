/*
 * 
 * 
 */
/**
 * Cenário "oficina-madeira" (referência 11, o inventor na plataforma): parede de tábuas claras e mesa de madeira em luz
 * morna de janela, onde o personagem 3D posado fica de pé ou sentado; poeira na luz e o feixe diagonal. Cores medidas:
 * #9A7652 no alto, #4C3522 no pé; realce na cor da marca (a referência usa turquesa; a casa usa a cor da página).
 */
import { tonsDaMarca } from '../marca-tons.js';
export default {
  id: 'oficina-madeira',
  nome: 'Oficina de madeira com personagem',
  temas: ['oficina', 'inventor', 'invencao', 'patente', 'fabrica', 'maquina', 'elevador', 'carpinteiro', 'construcao', 'engenhoca'],
  ambiente: { fundo: ['#9A7652', '#4C3522'], papel: 'madeira' },
  luz: { tipo: 'janela', cor: '#FFE7C4', forca: 1.15 },
  nevoa: { cor: '#FFE9CC', alfa: 0.12, altura: 0.35 },
  particulas: { poeira: 0.8 },
  props: [{ tipo: 'luz-diagonal', x: 0.15, y: 0, alfa: 0.22 }, { tipo: 'regua', x: 0.12, y: 0.9 }],
  clima: 'vivo',
  camera: 'orbita',
  foto: { tratamento: 'sepia', borda: 'branca' },
  texto: { tinta: '#FFFFFF', realce: 'caixa', corRealce: tonsDaMarca().forte },
  acabamento: { grao: 0.5, vinheta: 0.35, fibra: 0.15, cromatica: 0, riscos: 0.1 },
};
