/*
 * 
 * 
 */
/**
 * Cenário "mural-escuro" (referência 02, meio): mural preto de feltro com fotos P&B de borda branca empilhadas tortas, selos
 * picotados, moedas de cobre, clipe e fita; a fala em branco com a palavra-chave em itálico. Luz de estúdio do alto, sombra
 * longa das fotos no feltro. Cores medidas: #151515 no alto, #0B0B0B no pé; tinta #F1EEE7.
 */
export default {
  id: 'mural-escuro',
  nome: 'Mural escuro com selos e moedas',
  temas: ['cartao', 'credito', 'conta', 'restaurante', 'cliente', 'clube', 'memoria', 'lembranca', 'arquivo', 'colecao', 'pagamento', 'ideia'],
  ambiente: { fundo: ['#151515', '#0B0B0B'], papel: 'escuro' },
  luz: { tipo: 'topo', cor: '#FFF6E6', forca: 1.1 },
  nevoa: null,
  particulas: { poeira: 0.6 },
  props: [{ tipo: 'selo', x: 0.12, y: 0.2 }, { tipo: 'moeda', x: 0.88, y: 0.74 }, { tipo: 'moeda', x: 0.8, y: 0.8 }, { tipo: 'clipe', x: 0.9, y: 0.16 }, { tipo: 'papel-solto', x: 0.06, y: 0.82 }],
  clima: 'vivo',
  camera: 'orbita',
  foto: { tratamento: 'pb', borda: 'branca' },
  texto: { tinta: '#F1EEE7', realce: 'italico', corRealce: '#F1EEE7' },
  acabamento: { grao: 0.6, vinheta: 0.35, fibra: 0.2, cromatica: 0, riscos: 0.2 },
};
