/*
 * 
 * 
 */
/**
 * Cenário "escritorio": a sala de estudo e trabalho do vídeo 16: parede escura, duas mesas com tampo grosso e pés, papéis
 * empilhados, janela que alterna noite e dia, nuvem cinza que chove sobre quem adia. Câmera frontal estável.
 * Medidas (vídeo 16): parede #2C2C2C, mesas #3C3C3C a #4A4A4A com borda clara, janela de noite #151820, de dia #E9C77A;
 * papéis #EDEDE8.
 */
export default {
  id: 'escritorio',
  nome: 'Escritório e estudo',
  temas: [
    'prazo',
    'estud',
    'prova',
    'tarefa',
    'procrastin',
    'adiar',
    'adia',
    'deixar pra depois',
    'escola',
    'faculdade',
    'projeto',
    'reuniao',
    'chefe',
    'produtiv',
  ],
  ambiente: {
    fundo: ['#303030', '#272727', '#1C1C1C'],
    tipo: 'parede',
    brilho: { cor: '#FFFFFF', x: 0, y: 3.5, raio: 6, forca: 0.06 },
  },
  luz: {
    tipo: 'estudio',
    chave: { cor: '#FFF2DC', intensidade: 2, pos: [1, 6, 6] },
    contra: { cor: '#FFE0A0', intensidade: 1.4, pos: [2, 3, -4] },
    ambiente: { cor: '#80807F', intensidade: 0.5 },
    exposicao: 1,
  },
  nevoa: { cor: '#1C1C1C', alfa: 0.08, altura: 0, densidade: 0.01 },
  particulas: { poeira: 30 },
  props: [
    { tipo: 'mesa', x: -1.2, z: -0.6 },
    { tipo: 'mesa', x: 1.2, z: -0.6 },
    { tipo: 'janela', x: 1.6, y: 2.8, z: -3.9, largura: 1.3, altura: 1.4, ceu: 'noite', viraNaAcao: 'dia' },
    { tipo: 'nuvem', x: -1.2, y: 2.9, z: -0.6, chove: true },
  ],
  clima: 'calmo',
  camera: 'fixa',
  enquadra: { altura: 3, dist: 15 },
  chao: { tipo: 'liso', cor: '#242424', rugosidade: 0.5, reflexo: 0.2 },
};
