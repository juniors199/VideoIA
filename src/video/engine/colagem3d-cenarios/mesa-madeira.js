/*
 * 
 * 
 */
/**
 * Cenário "mesa-madeira" (referência 12, cara ou coroa): tampo de madeira escura envernizada visto de cima, luz de luminária
 * no alto, objetos 3D de verdade (moeda dourada) com sombra de contato e foto sépia em moldura de polaroide. Câmera em
 * mergulho (começa inclinada e assenta de frente). Cores medidas: #6B4128 no alto, #3E2616 no pé; tinta #F4ECDF.
 */
export default {
  id: 'mesa-madeira',
  nome: 'Mesa de madeira',
  temas: ['moeda', 'aposta', 'sorte', 'jogo', 'mesa', 'escritorio', 'carta', 'documento', 'mapa', 'plano', 'investigacao', 'medico'],
  ambiente: { fundo: ['#6B4128', '#3E2616'], papel: 'madeira' },
  luz: { tipo: 'topo', cor: '#FFE9C8', forca: 1.15 },
  nevoa: null,
  particulas: { poeira: 0.45 },
  props: [{ tipo: 'papel-solto', x: 0.9, y: 0.12 }, { tipo: 'regua', x: 0.1, y: 0.86 }],
  clima: 'solene',
  camera: 'mergulho',
  foto: { tratamento: 'sepia', borda: 'polaroide' },
  texto: { tinta: '#F4ECDF', realce: 'italico', corRealce: '#F4ECDF' },
  acabamento: { grao: 0.5, vinheta: 0.38, fibra: 0.1, cromatica: 0, riscos: 0.1 },
};
