/*
 * 
 * 
 */
/**
 * Cenário "arquivo-ambar" (referência 14, a história do decifrador de códigos): o arquivo em âmbar, tudo num duotom dourado
 * (fotos, papéis e a mesa), com feixes de luz de janela atravessando em diagonal e poeira no ar; a fala em creme claro com a
 * chave em itálico. Cores medidas: #6E5320 no alto, #2E2209 no pé; feixe #FFE7A8; tinta #F3E3B5.
 */
export default {
  id: 'arquivo-ambar',
  nome: 'Arquivo em âmbar com feixes de luz',
  temas: ['codigo', 'segredo', 'espiao', 'guerra mundial', 'arquivo', 'decifrar', 'mensagem', 'governo britanico', 'inteligencia', 'maquina', 'computador', 'genio'],
  ambiente: { fundo: ['#6E5320', '#2E2209'], papel: 'cinza' },
  luz: { tipo: 'janela', cor: '#FFE2A0', forca: 1.1 },
  nevoa: { cor: '#FFE7A8', alfa: 0.14, altura: 0.4 },
  particulas: { poeira: 0.9 },
  props: [{ tipo: 'luz-diagonal', x: 0.2, y: 0, alfa: 0.3 }, { tipo: 'texto-jornal', x: 0.5, y: 0.5, alfa: 0.08 }, { tipo: 'papel-solto', x: 0.9, y: 0.86 }],
  clima: 'solene',
  camera: 'paralaxe',
  foto: { tratamento: 'ambar', borda: 'branca' },
  texto: { tinta: '#F3E3B5', realce: 'italico', corRealce: '#F3E3B5' },
  acabamento: { grao: 0.65, vinheta: 0.4, fibra: 0.25, cromatica: 0, riscos: 0.2, tom: '#C99A3A', tomForca: 0.6 },
};
