/*
 * 
 * 
 */
/**
 * Cenário "cidade": a cidade ao entardecer dos vídeos 09 (fim), 13 e 15: silhueta de prédios contra uma névoa dourada
 * (contraluz), janelas acesas em pontos, chão molhado que espelha a cidade e os bonecos. Câmera baixa, quase frontal.
 * Medidas (vídeo 13, 720 px): céu #2A2A2A no alto a #B89A55 na névoa atrás dos prédios; prédios #141414 a #1E1E1E; chão
 * #1C1B19 com reflexo forte (a névoa dourada aparece no chão); janelas acesas #E8C46A de 1 a 2 px.
 */
export default {
  id: 'cidade',
  nome: 'Cidade ao entardecer',
  temas: [
    'dinheiro',
    'trabalh',
    'carreira',
    'empresa',
    'emprego',
    'salario',
    'negocio',
    'cidade',
    'sucesso',
    'rico',
    'riqueza',
    'ganhar',
    'mercado',
    'construi',
  ],
  ambiente: {
    fundo: ['#242322', '#3A3326', '#8A7248'],
    tipo: 'ceu',
    brilho: { cor: '#FFC86A', x: 0, y: 3, raio: 34, forca: 0.25 },
  },
  luz: {
    tipo: 'contraluz',
    chave: { cor: '#FFE2B0', intensidade: 2, pos: [2, 6, 7] },
    contra: { cor: '#FFC060', intensidade: 3.2, pos: [0, 3, -9] },
    ambiente: { cor: '#6E6250', intensidade: 0.5 },
    exposicao: 1.05,
  },
  nevoa: { cor: '#3A3428', alfa: 0.14, altura: 0, densidade: 0.018 },
  particulas: { poeira: 80 },
  props: [
    { tipo: 'skyline', z: -38, altura: [3, 8], largura: 60, janelas: 0.07, cor: '#151515' },
    { tipo: 'skyline', z: -55, altura: [5, 13], largura: 90, janelas: 0.05, cor: '#22201C' },
  ],
  clima: 'vivo',
  camera: 'travelling',
  chao: { tipo: 'molhado', cor: '#1E1D1B', rugosidade: 0.25, reflexo: 0.26 },
};
