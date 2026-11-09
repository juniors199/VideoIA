/*
 * 
 * 
 */
/**
 * Cenário "estudio-branco" (referências 01 "feminine", 07 e 13): papel branco de estúdio com vinheta suave e a sombra macia
 * de um objeto só; serve para a frase de virada e para o número grande. Cores medidas: #F8F7F4 no centro, #E6E5E1 nas
 * bordas; tinta #141414; realce em caixa amarela.
 */
import { tonsDaMarca } from '../marca-tons.js';
export default {
  id: 'estudio-branco',
  nome: 'Estúdio branco',
  temas: ['tecnologia', 'joia', 'diamante', 'produto', 'design', 'ciencia', 'matematica', 'codigo', 'numero', 'recorde', 'premio', 'valor'],
  ambiente: { fundo: ['#F8F7F4', '#E6E5E1'], papel: 'branco' },
  luz: { tipo: 'estudio', cor: '#FFFFFF', forca: 1.0 },
  nevoa: null,
  particulas: { poeira: 0.15 },
  props: [],
  clima: 'calmo',
  camera: 'recua',
  foto: { tratamento: 'cor', borda: 'branca' },
  texto: { tinta: '#141414', realce: 'caixa', corRealce: tonsDaMarca().forte },
  acabamento: { grao: 0.3, vinheta: 0.32, fibra: 0.15, cromatica: 0, riscos: 0 },
};
