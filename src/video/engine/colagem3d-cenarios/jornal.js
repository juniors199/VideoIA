/*
 * 
 * 
 */
/**
 * Cenário "jornal" (referências 04 e 07): parede de papel-jornal claro com colunas de texto ilegível e um cabeçalho gigante
 * apagado, fotos em retícula de impressão com a borda rasgada e a palavra-chave numa faixa azul (04). Nenhum nome de jornal:
 * as letras do cabeçalho são formas cegas. Cores medidas: #EEEDEA no alto, #D9D8D3 no pé; realce na cor da marca; tinta #151515.
 */
import { tonsDaMarca } from '../marca-tons.js';
export default {
  id: 'jornal',
  nome: 'Parede de jornal',
  temas: ['jornal', 'noticia', 'manchete', 'imprensa', 'mercado', 'bolsa', 'investidor', 'empresa', 'bilionario', 'negocio', 'escandalo', 'carreira'],
  ambiente: { fundo: ['#EEEDEA', '#D9D8D3'], papel: 'jornal' },
  luz: { tipo: 'estudio', cor: '#FFFFFF', forca: 1.0 },
  nevoa: { cor: '#FFFFFF', alfa: 0.1, altura: 0.25 },
  particulas: { poeira: 0.25 },
  props: [{ tipo: 'manchete', x: 0.5, y: 0.82, alfa: 0.12 }, { tipo: 'texto-jornal', x: 0.5, y: 0.5, alfa: 0.16 }],
  clima: 'vivo',
  camera: 'empurra',
  foto: { tratamento: 'reticula', borda: 'rasgada' },
  texto: { tinta: '#FFFFFF', realce: 'caixa', corRealce: tonsDaMarca().forte },
  acabamento: { grao: 0.4, vinheta: 0.18, fibra: 0.25, cromatica: 0, riscos: 0 },
};
