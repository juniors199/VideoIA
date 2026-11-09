/*
 * 
 * 
 */
/**
 * Cenário "tapete-corte" (referência 03, o roteiro escrito): mesa branca com a base de corte verde quadriculada, fotos de
 * polaroide presas com fita, folhas manuscritas e a luva vermelha ao lado; câmera em mergulho. Cores medidas: mesa #EDEDEB,
 * base #2E5A45 com a grade #6E9A84; tinta #151515; realce em caixa amarela.
 */
import { tonsDaMarca } from '../marca-tons.js';
export default {
  id: 'tapete-corte',
  nome: 'Mesa com base de corte',
  temas: ['escrever', 'roteiro', 'livro', 'filme', 'projeto', 'criar', 'arte', 'artista', 'desenho', 'estudar', 'escola', 'trabalho'],
  ambiente: { fundo: ['#EDEDEB', '#DADAD7'], papel: 'corte' },
  luz: { tipo: 'estudio', cor: '#FFFFFF', forca: 1.0 },
  nevoa: null,
  particulas: { poeira: 0.2 },
  props: [{ tipo: 'grade-corte', x: 0.5, y: 0.38, w: 1180, h: 1150 }, { tipo: 'papel-solto', x: 0.86, y: 0.2 }, { tipo: 'fita', x: 0.2, y: 0.18 }],
  clima: 'vivo',
  camera: 'mergulho',
  foto: { tratamento: 'cor', borda: 'polaroide' },
  texto: { tinta: '#151515', realce: 'caixa', corRealce: tonsDaMarca().forte },
  acabamento: { grao: 0.35, vinheta: 0.25, fibra: 0.2, cromatica: 0, riscos: 0 },
};
