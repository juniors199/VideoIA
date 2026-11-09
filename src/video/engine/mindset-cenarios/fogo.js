/*
 * 
 * 
 */
/**
 * Cenário "fogo": o vídeo 15: a cidade à noite com uma faixa de fogo no chão (chamas que tremem e iluminam os bonecos de
 * baixo), fagulhas que sobem. Quando o fogo apaga (na ação), sobra a cidade e a luz fria.
 * Medidas (vídeo 15): chamas #FFD24A a #FF8A1A com brilho, fagulhas #FFC060, céu #121212 a #4A3E28 atrás dos prédios.
 */
export default {
  id: 'fogo',
  nome: 'Fogo na cidade',
  temas: [
    'raiva',
    'briga',
    'conflito',
    'discuss',
    'guerra',
    'fogo',
    'queim',
    'destru',
    'odio',
    'orgulho',
    'relacionamento',
    'casal',
    'juntos',
  ],
  ambiente: {
    fundo: ['#121212', '#2A2418', '#5A4A2A'],
    tipo: 'ceu',
    brilho: { cor: '#FFB040', x: 0, y: 3, raio: 30, forca: 0.25 },
  },
  luz: {
    tipo: 'fogo',
    chave: { cor: '#FFE0B0', intensidade: 1.4, pos: [2, 6, 7] },
    contra: { cor: '#FFB050', intensidade: 2.4, pos: [0, 3, -10] },
    ambiente: { cor: '#5A4A38', intensidade: 0.4 },
    exposicao: 1.05,
  },
  nevoa: { cor: '#1E1A14', alfa: 0.14, altura: 0, densidade: 0.018 },
  particulas: { fogo: 1, fagulhas: 70, apagaNaAcao: true },
  props: [{ tipo: 'skyline', z: -38, altura: [3, 8.5], largura: 60, janelas: 0.07, cor: '#141414' }],
  clima: 'vivo',
  camera: 'orbita',
  chao: { tipo: 'molhado', cor: '#1A1A19', rugosidade: 0.3, reflexo: 0.22 },
};
