/*
 * 
 * 
 */
/**
 * Cenário "papel-cinza" (referência 05): papel cinza frio com uma coluna clássica apagada ao fundo e um feixe de luz diagonal
 * de janela; fotos P&B com borda branca e etiqueta amarela com o nome embaixo; a fala numa caixa escura translúcida com a
 * letra branca itálica. Cores medidas: #C9C9C7 no alto, #B3B3B1 no pé; etiqueta #F2E14C; caixa #3A3A3A a 78%.
 */
export default {
  id: 'papel-cinza',
  nome: 'Papel cinza com feixe de luz',
  temas: ['banco', 'dinheiro', 'economia', 'governo', 'reuniao', 'politica', 'lei', 'poder', 'crise', 'segredo', 'acordo', 'sistema'],
  ambiente: { fundo: ['#C9C9C7', '#B3B3B1'], papel: 'cinza' },
  luz: { tipo: 'janela', cor: '#F4F4F0', forca: 0.95 },
  nevoa: null,
  particulas: { poeira: 0.5 },
  props: [{ tipo: 'coluna', x: 0.5, y: 0.55, alfa: 0.09 }, { tipo: 'luz-diagonal', x: 0.25, y: 0, alfa: 0.18 }],
  clima: 'solene',
  camera: 'paralaxe',
  foto: { tratamento: 'pb', borda: 'branca' },
  texto: { tinta: '#F4F2EE', realce: 'caixa-escura', corRealce: '#3A3A3A' },
  acabamento: { grao: 0.55, vinheta: 0.3, fibra: 0.3, cromatica: 0, riscos: 0.1 },
};
