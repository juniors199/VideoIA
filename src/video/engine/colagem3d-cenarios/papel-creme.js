/*
 * 
 * 
 */
/**
 * Cenário "papel-creme" do estilo colagem3d (referências 01 e 02, abertura): papel creme de algodão com fibra e uma gravura
 * de arquitetura apagada ao fundo (a fachada some a ~10% de opacidade), luz morna de janela vinda da esquerda, recortes em
 * cor sem moldura e a palavra-chave numa caixa amarela de marca-texto. É também o MODELO para um cenário novo: copie este
 * arquivo, troque o id e os campos e registre em index.js (ou ponha o objeto no pecas.js do projeto).
 * Cores medidas: papel #EDE6D6 no alto, #E2D8C3 no pé; realce na cor da marca; tinta #1A1714.
 */
import { tonsDaMarca } from '../marca-tons.js';
export default {
  id: 'papel-creme',
  nome: 'Papel creme',
  temas: ['moda', 'roupa', 'elegante', 'seculo', 'historia', 'invencao', 'inventor', 'relogio', 'paris', 'europa', 'antigo', 'epoca', 'tradicao'],
  ambiente: { fundo: ['#EDE6D6', '#E2D8C3'], papel: 'creme' },
  luz: { tipo: 'janela', cor: '#FFF1D8', forca: 1.0 },
  nevoa: { cor: '#FFF7E8', alfa: 0.08, altura: 0.35 },
  particulas: { poeira: 0.35 },
  props: [{ tipo: 'arquitetura', x: 0.5, y: 0.3, alfa: 0.1 }, { tipo: 'mancha', x: 0.86, y: 0.9, r: 110 }],
  clima: 'calmo',
  camera: 'empurra',
  foto: { tratamento: 'cor', borda: 'sem' },
  texto: { tinta: '#1A1714', realce: 'caixa', corRealce: tonsDaMarca().forte },
  acabamento: { grao: 0.45, vinheta: 0.22, fibra: 0.4, cromatica: 0, riscos: 0.15 },
};
